const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

let transporter;

const getTransporter = () => {
    if (transporter) return transporter;
    
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.error('CRITICAL: SMTP credentials missing in environment variables.');
    }

    transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp-relay.brevo.com',
        port: process.env.SMTP_PORT || 587,
        secure: false,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
        connectionTimeout: 10000, // 10 seconds
        greetingTimeout: 10000,   // 10 seconds
    });
    return transporter;
};

/**
 * Sends an order confirmation email to the user
 */
exports.sendOrderConfirmationEmail = async (order) => {
    if (!order.customerEmail || order.customerEmail === 'Unknown') {
        console.warn(`⚠️ Skipping confirmation email: Customer email is ${order.customerEmail}`);
        return;
    }

    const itemsHtml = order.items.map(item => `
        <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₹${item.price}</td>
        </tr>
    `).join('');

    const mailOptions = {
        from: `"CRAFTORIO" <${process.env.SENDER_EMAIL}>`,
        to: order.customerEmail,
        subject: `Order Confirmed - ${order.orderNumber}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px;">
                <h2 style="color: #760000; text-align: center;">Order Confirmed!</h2>
                <p>Hi ${order.deliveryInfo?.fullName || 'Customer'},</p>
                <p>Thank you for shopping with CRAFTORIO. Your order <strong>${order.orderNumber}</strong> has been successfully placed.</p>
                
                <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                    <thead>
                        <tr style="background-color: #f9f9f9;">
                            <th style="padding: 10px; text-align: left;">Item</th>
                            <th style="padding: 10px; text-align: center;">Qty</th>
                            <th style="padding: 10px; text-align: right;">Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${itemsHtml}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colspan="2" style="padding: 10px; text-align: right; font-weight: bold;">Total Paid:</td>
                            <td style="padding: 10px; text-align: right; font-weight: bold;">₹${order.totalAmount}</td>
                        </tr>
                    </tfoot>
                </table>

                <div style="background-color: #fff9f8; padding: 15px; border-radius: 8px; margin-top: 20px;">
                    <p style="margin: 0; color: #760000; font-weight: bold;">Delivery Address:</p>
                    <p style="margin: 5px 0 0 0;">${order.deliveryInfo?.address}, ${order.deliveryInfo?.city}, ${order.deliveryInfo?.state} - ${order.deliveryInfo?.pincode}</p>
                </div>

                <p style="margin-top: 30px; font-size: 12px; color: #888; text-align: center;">
                    If you have any questions, reply to this email or contact us on WhatsApp.
                </p>
            </div>
        `,
    };

    return getTransporter().sendMail(mailOptions);
};

/**
 * Sends a new order notification to the admin
 */
exports.sendAdminOrderNotification = async (order) => {
    const mailOptions = {
        from: `"CRAFTORIO System" <${process.env.SENDER_EMAIL}>`,
        to: 'nishantraj7859@gmail.com',
        subject: `New Order Received - ${order.orderNumber}`,
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #760000;">
                <h2 style="color: #760000;">🚀 New Sale Alert!</h2>
                <p>A new order has been placed on CRAFTORIA.</p>
                
                <div style="margin: 20px 0; border: 1px solid #eee; padding: 15px;">
                    <p><strong>Order Number:</strong> ${order.orderNumber}</p>
                    <p><strong>Customer:</strong> ${order.deliveryInfo?.fullName} (${order.customerEmail})</p>
                    <p><strong>Total Amount:</strong> ₹${order.totalAmount}</p>
                    <p><strong>Quantity:</strong> ${order.items.reduce((sum, item) => sum + item.quantity, 0)} items</p>
                </div>

                <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/admin/orders" 
                   style="display: inline-block; padding: 12px 25px; background-color: #760000; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">
                   View Order in Dashboard
                </a>
            </div>
        `,
    };

    return getTransporter().sendMail(mailOptions);
};

/**
 * Sends a payment-failed / abandoned-checkout email to the user
 * @param {Object} order - the Order document
 * @param {string} retryUrl - full URL that takes the user back to Stripe checkout
 */
exports.sendPaymentFailedEmail = async (order, retryUrl) => {
    if (!order.customerEmail || order.customerEmail === 'Unknown') {
        console.warn(`⚠️ Skipping payment-failed email: no customer email on order ${order.orderNumber}`);
        return;
    }

    const mailOptions = {
        from: `"CRAFTORIO" <${process.env.SENDER_EMAIL}>`,
        to: order.customerEmail,
        subject: `Complete Your Payment — Order ${order.orderNumber}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 0; border-radius: 8px; overflow: hidden;">
                <div style="background-color: #760000; padding: 24px; text-align: center;">
                    <h1 style="color: #fff; margin: 0; font-size: 22px;">Payment Incomplete</h1>
                </div>
                <div style="padding: 28px 24px;">
                    <p style="margin: 0 0 12px;">Hi ${order.deliveryInfo?.fullName || 'there'},</p>
                    <p style="margin: 0 0 20px; color: #555;">It looks like your payment for order <strong>${order.orderNumber}</strong> wasn't completed. Don't worry — your order is saved and ready whenever you are.</p>

                    <div style="background-color: #fff9f8; border: 1px solid #fcd5d5; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
                        <p style="margin: 0 0 6px; font-size: 13px; color: #760000; font-weight: bold;">ORDER SUMMARY</p>
                        <p style="margin: 0; font-size: 13px; color: #555;">Order: <strong>${order.orderNumber}</strong></p>
                        <p style="margin: 4px 0 0; font-size: 13px; color: #555;">Total: <strong>₹${order.totalAmount}</strong></p>
                    </div>

                    <div style="text-align: center; margin: 28px 0;">
                        <a href="${retryUrl}"
                           style="display: inline-block; padding: 14px 36px; background-color: #760000; color: #fff; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 15px; letter-spacing: 0.5px;">
                            Complete Your Payment
                        </a>
                    </div>

                    <p style="font-size: 12px; color: #aaa; margin-top: 32px; text-align: center;">
                        If you didn't place this order, please ignore this email.
                    </p>
                </div>
            </div>
        `,
    };

    return getTransporter().sendMail(mailOptions);
};

/**
 * Sends an order cancellation email to the user
 */
exports.sendOrderCancellationEmail = async (order, cancellationFee = 0) => {
    if (!order.customerEmail || order.customerEmail === 'Unknown') return;

    const refundAmount = Math.max(0, order.totalAmount - cancellationFee);

    const mailOptions = {
        from: `"CRAFTORIO" <${process.env.SENDER_EMAIL}>`,
        to: order.customerEmail,
        subject: `Order Cancelled - ${order.orderNumber}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px; border-radius: 8px;">
                <div style="text-align: center; margin-bottom: 20px;">
                    <h2 style="color: #760000; margin: 0;">Order Cancelled</h2>
                    <p style="color: #666; margin-top: 5px;">Order #${order.orderNumber}</p>
                </div>

                <p>Hi ${order.deliveryInfo?.fullName || 'Customer'},</p>
                <p>Your order has been successfully cancelled as per your request.</p>

                <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h4 style="margin: 0 0 10px 0; color: #333;">Refund Summary</h4>
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 5px 0; color: #666;">Original Amount:</td>
                            <td style="padding: 5px 0; text-align: right; font-weight: bold;">₹${order.totalAmount}</td>
                        </tr>
                        <tr>
                            <td style="padding: 5px 0; color: #666;">Cancellation Fee:</td>
                            <td style="padding: 5px 0; text-align: right; color: #760000;">-₹${cancellationFee}</td>
                        </tr>
                        <tr style="border-top: 1px solid #ddd;">
                            <td style="padding: 10px 0 0 0; font-weight: bold; color: #333;">Estimated Refund:</td>
                            <td style="padding: 10px 0 0 0; text-align: right; font-weight: bold; color: #22c55e; font-size: 18px;">₹${refundAmount}</td>
                        </tr>
                    </table>
                </div>

                <p style="font-size: 13px; color: #666;">
                    * The refund will be credited back to your original payment method within 5-7 business days.
                </p>

                <div style="margin-top: 30px; text-align: center; border-t: 1px solid #eee; padding-top: 20px;">
                    <p style="font-size: 12px; color: #888;">
                        Thank you for using CRAFTORIO. We hope to see you again soon!
                    </p>
                </div>
            </div>
        `,
    };

    return getTransporter().sendMail(mailOptions);
};

/**
 * Sends an email to the user when they request a cancellation
 */
exports.sendCancellationRequestedEmail = async (order) => {
    if (!order.customerEmail || order.customerEmail === 'Unknown') return;

    const mailOptions = {
        from: `"CRAFTORIO" <${process.env.SENDER_EMAIL}>`,
        to: order.customerEmail,
        subject: `Cancellation Requested - Order ${order.orderNumber}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px; border-radius: 8px;">
                <h2 style="color: #760000; text-align: center;">Cancellation Requested</h2>
                <p>Hi ${order.deliveryInfo?.fullName || 'Customer'},</p>
                <p>We have received your request to cancel order <strong>${order.orderNumber}</strong>.</p>
                <p>Our team is currently reviewing your request. You will receive another email once the cancellation is approved and the refund is initiated.</p>
                <div style="background-color: #fff9f8; padding: 15px; border-radius: 8px; margin-top: 20px; border: 1px solid #eadbd6;">
                    <p style="margin: 0; color: #760000; font-weight: bold;">What's next?</p>
                    <p style="margin: 5px 0 0 0; font-size: 14px;">1. Admin reviews the request.<br>2. If approved, refund is processed minus a nominal fee.<br>3. You receive a confirmation email.</p>
                </div>
                <p style="margin-top: 30px; font-size: 12px; color: #888; text-align: center;">
                    If you change your mind, you can withdraw your request from the "My Orders" page.
                </p>
            </div>
        `,
    };

    return getTransporter().sendMail(mailOptions);
};

/**
 * Sends an email to the user when they withdraw a cancellation request
 */
exports.sendCancellationWithdrawnEmail = async (order) => {
    if (!order.customerEmail || order.customerEmail === 'Unknown') return;

    const mailOptions = {
        from: `"CRAFTORIO" <${process.env.SENDER_EMAIL}>`,
        to: order.customerEmail,
        subject: `Cancellation Request Withdrawn - Order ${order.orderNumber}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px; border-radius: 8px;">
                <h2 style="color: #22c55e; text-align: center;">Request Withdrawn</h2>
                <p>Hi ${order.deliveryInfo?.fullName || 'Customer'},</p>
                <p>Your cancellation request for order <strong>${order.orderNumber}</strong> has been successfully withdrawn.</p>
                <p>Your order is back in <strong>Processing</strong> status and will be prepared for shipment soon.</p>
                <p style="margin-top: 30px; font-size: 12px; color: #888; text-align: center;">
                    Thank you for choosing CRAFTORIO!
                </p>
            </div>
        `,
    };

    return getTransporter().sendMail(mailOptions);
};
