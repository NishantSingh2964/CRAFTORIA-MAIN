const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a product name'],
        trim: true
    },
    category: {
        type: String,
        required: [true, 'Please add a category']
    },
    occasions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Occasion'
    }],
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
    originalPrice: {
        type: Number,
        required: [true, 'Please add an original price']
    },
    currentPrice: {
        type: Number,
        required: [true, 'Please add a current price']
    },
    costPrice: {
        type: Number,
        required: [true, 'Please add a cost price']
    },
    image: {
        type: String,
        required: [true, 'Please add an image URL']
    },
    rating: {
        type: Number,
        default: 0
    },
    badge: {
        type: String,
        trim: true
    },
    testimonials: [{
        user: String,
        comment: String
    }],
    stock: {
        type: Number,
        required: [true, 'Please add stock quantity'],
        default: 0
    },
    isAvailable: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Product', productSchema);
