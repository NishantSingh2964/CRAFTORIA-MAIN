const Order = require('../models/Order');
const Product = require('../models/Product');
const Expense = require('../models/Expense');
const User = require('../models/User');

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
exports.getDashboardStats = async (req, res, next) => {
    try {
        // 1. Total Income (Sum of Paid orders)
        const totalIncomeArr = await Order.aggregate([
            { $match: { paymentStatus: 'Paid' } },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ]);
        const totalIncome = totalIncomeArr.length > 0 ? totalIncomeArr[0].total : 0;

        // 2. Total Expenses (Overhead expenses + Product cost prices)
        // Overhead Expenses
        const overheadExpensesArr = await Expense.aggregate([
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);
        const overheadExpenses = overheadExpensesArr.length > 0 ? overheadExpensesArr[0].total : 0;

        // Product Cost Prices of Sold Items
        const orders = await Order.find({ paymentStatus: 'Paid' }).populate('items.productId');
        let totalProductCosts = 0;
        orders.forEach(order => {
            order.items.forEach(item => {
                if (item.productId && item.productId.costPrice) {
                    totalProductCosts += item.productId.costPrice * item.quantity;
                }
            });
        });

        const totalExpenses = overheadExpenses + totalProductCosts;

        // 3. User & Product Counts
        const totalUsers = await User.countDocuments();
        const totalProducts = await Product.countDocuments();

        // 4. Order Summary (Mapping to expected frontend structure)
        const orderSummaryRaw = await Order.aggregate([
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);
        const orderSummary = orderSummaryRaw.reduce((acc, curr) => {
            acc[curr._id] = curr.count;
            return acc;
        }, {});

        // 5. Category-wise Revenue
        const categoryRevenue = await Order.aggregate([
            { $match: { paymentStatus: 'Paid' } },
            { $unwind: '$items' },
            {
                $lookup: {
                    from: 'products',
                    localField: 'items.productId',
                    foreignField: '_id',
                    as: 'product'
                }
            },
            { $unwind: '$product' },
            {
                $group: {
                    _id: '$product.category',
                    totalRevenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
                }
            },
            { $sort: { totalRevenue: -1 } }
        ]);

        // 6. Revenue for the last 7 days
        const last7Days = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            date.setHours(0, 0, 0, 0);
            last7Days.push(date);
        }

        const last7DaysData = await Promise.all(last7Days.map(async (day) => {
            const nextDay = new Date(day);
            nextDay.setDate(day.getDate() + 1);

            const rev = await Order.aggregate([
                {
                    $match: {
                        paymentStatus: 'Paid',
                        createdAt: { $gte: day, $lt: nextDay }
                    }
                },
                { $group: { _id: null, total: { $sum: '$totalAmount' } } }
            ]);

            const ordersCount = await Order.countDocuments({ createdAt: { $gte: day, $lt: nextDay } });
            const usersCount = await User.countDocuments({ createdAt: { $gte: day, $lt: nextDay } });
            const productsCount = await Product.countDocuments({ createdAt: { $gte: day, $lt: nextDay } });

            return {
                date: day.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
                revenue: rev.length > 0 ? rev[0].total : 0,
                orders: ordersCount,
                users: usersCount,
                products: productsCount
            };
        }));

        // 7. Recent Orders
        const recentOrders = await Order.find().sort('-createdAt').limit(5);

        // 8. Low Stock (Top 5 lowest)
        const lowStockProducts = await Product.find().sort({ stock: 1 }).limit(5).select('name stock category image');

        res.status(200).json({
            success: true,
            data: {
                totalIncome,
                totalExpenses,
                profit: totalIncome - totalExpenses,
                totalUsers,
                totalProducts,
                orderSummary,
                categoryRevenue,
                weeklyStats: last7DaysData,
                lowStockProducts,
                recentOrders
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Manage user roles
// @route   PATCH /api/admin/users/:id/role
// @access  Private/SuperAdmin
exports.updateUserRole = async (req, res, next) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, { role: req.body.role }, {
            new: true,
            runValidators: true
        });

        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        res.status(200).json({ success: true, data: user });
    } catch (error) {
        next(error);
    }
};
