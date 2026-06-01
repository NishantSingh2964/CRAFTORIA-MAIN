const Expense = require('../models/Expense');

// @desc    Get all expenses
// @route   GET /api/expenses
// @access  Private/Admin
exports.getExpenses = async (req, res, next) => {
    try {
        const expenses = await Expense.find().sort('-date');
        res.status(200).json({
            success: true,
            count: expenses.length,
            data: expenses
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create new expense
// @route   POST /api/expenses
// @access  Private/Admin
exports.createExpense = async (req, res, next) => {
    try {
        console.log('Logging Expense Body:', req.body);
        const expense = await Expense.create(req.body);
        res.status(201).json({
            success: true,
            data: expense
        });
    } catch (error) {
        console.error('Error creating expense:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Internal Server Error'
        });
    }
};

// @desc    Get expense stats
// @route   GET /api/expenses/stats
// @access  Private/Admin
exports.getExpenseStats = async (req, res, next) => {
    try {
        const Order = require('../models/Order');

        // 1. Total Revenue (Sum of Paid orders)
        const totalIncomeArr = await Order.aggregate([
            { $match: { paymentStatus: 'Paid' } },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ]);
        const totalRevenue = totalIncomeArr.length > 0 ? totalIncomeArr[0].total : 0;

        // 2. Operational Expenses
        const stats = await Expense.aggregate([
            {
                $group: {
                    _id: '$category',
                    totalAmount: { $sum: '$amount' }
                }
            }
        ]);
        const totalOverall = stats.reduce((acc, curr) => acc + curr.totalAmount, 0);

        // 3. Product COGS (Cost of sold items)
        const orders = await Order.find({ paymentStatus: 'Paid' }).populate('items.productId');
        let totalCogs = 0;
        orders.forEach(order => {
            order.items.forEach(item => {
                if (item.productId && item.productId.costPrice) {
                    totalCogs += item.productId.costPrice * item.quantity;
                }
            });
        });

        res.status(200).json({
            success: true,
            totalOverall,
            totalRevenue,
            totalCogs,
            byCategory: stats
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete expense
// @route   DELETE /api/expenses/:id
// @access  Private/Admin
exports.deleteExpense = async (req, res, next) => {
    try {
        const expense = await Expense.findByIdAndDelete(req.params.id);
        if (!expense) return res.status(404).json({ success: false, message: 'Expense not found' });
        
        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        next(error);
    }
};
