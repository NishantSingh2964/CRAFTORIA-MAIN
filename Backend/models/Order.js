const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    orderNumber: {
        type: String,
        required: true,
        unique: true
    },
    userId: {
        type: String, // Clerk User ID
        required: true
    },
    customerEmail: {
        type: String,
        required: true
    },
    items: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        name: {
            type: String,
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        price: {
            type: Number,
            required: true
        },
        image: {
            type: String
        },
        customization: {
            text: String,
            photo: String
        }
    }],
    totalAmount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['Processing', 'Shipped', 'Delivered', 'Completed', 'Cancelled'],
        default: 'Processing'
    },
    deliveryInfo: {
        fullName: { type: String, required: true },
        address: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        pincode: { type: String, required: true },
        phone: { type: String, required: true }
    },
    paymentStatus: {
        type: String,
        enum: ['Paid', 'Unpaid', 'Payment Pending', 'Refunded'],
        default: 'Unpaid'
    },
    stripeSessionId: {
        type: String
    },
    invoiceUrl: {
        type: String
    },
    receiptUrl: {
        type: String
    },
    expiresAt: {
        type: Date,
        index: { expires: 0 } // TTL index: deletes doc when expiresAt <= current time
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);
