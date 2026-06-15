const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'items.productModel'
    },
    productModel: {
        type: String,
        required: true,
        enum: ['Product', 'PersonalizedProduct']
    },
    quantity: {
        type: Number,
        required: true,
        default: 1,
        min: 1
    },
    // Overrides for bundled items (like hampers)
    name: String,
    price: Number,
    // Useful for personalized items if they have extra metadata
    metadata: {
        type: Map,
        of: mongoose.Schema.Types.Mixed
    }
});

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true // One cart per user
    },
    items: [cartItemSchema]
}, {
    timestamps: true
});

module.exports = mongoose.model('Cart', cartSchema);
