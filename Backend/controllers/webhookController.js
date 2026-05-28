const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/Order');
const Product = require('../models/Product');
const Notification = require('../models/Notification');

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
            // Find existing order
            const order = await Order.findOne({ orderNumber: metadata.orderNumber });
            if (!order) {
                console.error(`Order ${metadata.orderNumber} not found in database.`);
                return res.json({ received: true });
            }

            // Get invoice and receipt URLs
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

            // Update order status
            order.paymentStatus = 'Paid';
            order.invoiceUrl = invoiceUrl;
            order.receiptUrl = receiptUrl;
            await order.save();

            // 2. Decrement Inventory
            for (const item of order.items) {
                await Product.findByIdAndUpdate(item.productId, {
                    $inc: { stock: -item.quantity }
                });
            }
            
            console.log(`Order ${metadata.orderNumber} updated to Paid and inventory adjusted.`);

            // Trigger Notification
            await Notification.create({
                message: `New Order Received: ${metadata.orderNumber}`,
                type: 'Order',
                link: '/admin/orders'
            });

            // Send Emails
            const { sendOrderConfirmationEmail, sendAdminOrderNotification } = require('../utils/emailService');
            
            // We run these in background (no await) or with try/catch to not block the webhook
            sendOrderConfirmationEmail(order).catch(err => console.error('Error sending customer email:', err));
            sendAdminOrderNotification(order).catch(err => console.error('Error sending admin email:', err));

        } catch (error) {
            console.error('Error processing order from webhook:', error);
        }
    }

    res.json({ received: true });
};
