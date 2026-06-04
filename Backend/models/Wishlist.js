const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'productModel'
    },
    productModel: {
        type: String,
        required: true,
        enum: ['Product', 'PersonalizedProduct']
    }
}, {
    timestamps: true
});

// Compound index to ensure a user can't add the same product twice
wishlistSchema.index({ user: 1, product: 1 }, { unique: true });

module.exports = mongoose.model('Wishlist', wishlistSchema);
