const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/Order');
const Product = require('../models/Product');
const Notification = require('../models/Notification');
const Cart = require('../models/Cart');
const User = require('../models/User');

// @desc    Handle Stripe Webhook
// @route   POST /api/webhook
// @access  Public
exports.handleStripeWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        // Stripe needs the raw body to verify the webhook
        event = stripe.webhooks.constructEvent(req.rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        console.error(`Webhook Error: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const metadata = session.metadata;

        try {
            const order = await Order.findOne({ orderNumber: metadata.orderNumber });
            if (!order) {
                console.error(`Order ${metadata.orderNumber} not found in database.`);
                return res.json({ received: true });
            }

            let invoiceUrl = null;
            let receiptUrl = null;

            if (session.invoice) {
                const invoice = await stripe.invoices.retrieve(session.invoice);
                invoiceUrl = invoice.hosted_invoice_url;
            }

            if (session.payment_intent) {
                const paymentIntent = await stripe.paymentIntents.retrieve(session.payment_intent, {
                    expand: ['latest_charge']
                });
                receiptUrl = paymentIntent.latest_charge?.receipt_url;
            }

            order.paymentStatus = 'Paid';
            order.paymentIntentId = session.payment_intent;
            order.invoiceUrl = invoiceUrl;
            order.receiptUrl = receiptUrl;
            order.expiresAt = undefined; // STOP THE AUTO-DELETE TIMER
            await order.save();

            console.log(`✅ Order ${metadata.orderNumber} status updated to PAID.`);

            for (const item of order.items) {
                await Product.findByIdAndUpdate(item.productId, {
                    $inc: { stock: -item.quantity }
                });
            }
            
            console.log(`📦 Inventory adjusted for order ${metadata.orderNumber}.`);

            // ✅ Clear user's cart after successful payment
            try {
                const user = await User.findOne({ clerkId: metadata.userId });
                if (user) {
                    await Cart.findOneAndUpdate(
                        { user: user._id },
                        { $set: { items: [] } }
                    );
                    console.log(`🛒 Cart cleared for user ${metadata.userId}.`);
                }
            } catch (cartErr) {
                console.error('Failed to clear cart after payment:', cartErr.message);
            }

            await Notification.create({
                message: `New Order Received: ${metadata.orderNumber}`,
                type: 'Order',
                link: '/admin/orders'
            });

            console.log(`📧 Initiating emails for ${order.customerEmail}...`);
            const { sendOrderConfirmationEmail, sendAdminOrderNotification } = require('../utils/emailService');
            
            sendOrderConfirmationEmail(order)
                .then(() => console.log('✅ Customer confirmation email sent successfully'))
                .catch(err => console.error('❌ Error sending customer email:', err.message));

            sendAdminOrderNotification(order)
                .then(() => console.log('✅ Admin notification email sent successfully'))
                .catch(err => console.error('❌ Error sending admin email:', err.message));

        } catch (error) {
            console.error('Error processing order from webhook:', error);
        }
    }

    // Handle session expiry (user closed Stripe tab without paying)
    if (event.type === 'checkout.session.expired') {
        const session = event.data.object;
        const metadata = session.metadata;
        if (!metadata?.orderNumber) return res.json({ received: true });

        try {
            const order = await Order.findOne({ orderNumber: metadata.orderNumber });
            if (!order || order.paymentStatus === 'Paid') return res.json({ received: true });

            order.paymentStatus = 'Payment Pending';
            await order.save();

            const retryUrl = `${process.env.FRONTEND_URL}/my-orders?retry=${order._id}`;
            const { sendPaymentFailedEmail } = require('../utils/emailService');
            sendPaymentFailedEmail(order, retryUrl)
                .then(() => console.log(`📧 Expiry email sent for ${order.orderNumber}`))
                .catch(err => console.error('❌ Expiry email failed:', err.message));

            console.log(`⏰ Session expired for order ${order.orderNumber} — marked Payment Pending.`);
        } catch (error) {
            console.error('Error handling expired session:', error);
        }
    }

    res.json({ received: true });
};

