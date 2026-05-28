const mongoose = require('mongoose');

const occasionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add an occasion name'],
        unique: true,
        trim: true
    },
    filter: {
        type: String,
        required: [true, 'Please add a filter name'],
        unique: true,
        trim: true
    },
    image: {
        type: String,
        required: [true, 'Please add an image URL']
    },
    desc: {
        type: String,
        required: [true, 'Please add a description']
    },
    tag: {
        type: String,
        required: [true, 'Please add a tag']
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Occasion', occasionSchema);
