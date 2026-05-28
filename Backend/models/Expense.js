const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title']
    },
    amount: {
        type: Number,
        required: [true, 'Please add an amount']
    },
    date: {
        type: Date,
        default: Date.now
    },
    category: {
        type: String,
        enum: ['Shipping', 'Marketing', 'Inventory', 'Others'],
        default: 'Others'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Expense', expenseSchema);
