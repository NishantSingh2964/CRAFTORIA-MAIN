const Wishlist = require('../models/Wishlist');
const User = require('../models/User');

// @desc    Get user wishlist
// @route   GET /api/wishlist
// @access  Private
exports.getWishlist = async (req, res) => {
    try {
        const user = await User.findOne({ clerkId: req.auth.userId });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const wishlist = await Wishlist.find({ user: user._id }).populate('product');

        res.status(200).json({
            success: true,
            count: wishlist.length,
            data: wishlist
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Toggle product in wishlist
// @route   POST /api/wishlist/toggle
// @access  Private
exports.toggleWishlist = async (req, res) => {
    try {
        const { productId, productModel } = req.body;

        if (!productId || !productModel) {
            return res.status(400).json({ success: false, message: 'Please provide productId and productModel' });
        }

        const user = await User.findOne({ clerkId: req.auth.userId });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const existingItem = await Wishlist.findOne({
            user: user._id,
            product: productId
        });

        if (existingItem) {
            await existingItem.deleteOne();
            return res.status(200).json({
                success: true,
                message: 'Removed from wishlist',
                isAdded: false
            });
        } else {
            await Wishlist.create({
                user: user._id,
                product: productId,
                productModel
            });
            return res.status(201).json({
                success: true,
                message: 'Added to wishlist',
                isAdded: true
            });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Check if product is in wishlist
// @route   GET /api/wishlist/check/:productId
// @access  Private
exports.checkWishlist = async (req, res) => {
    try {
        const user = await User.findOne({ clerkId: req.auth.userId });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const isInWishlist = await Wishlist.exists({
            user: user._id,
            product: req.params.productId
        });

        res.status(200).json({
            success: true,
            isInWishlist: !!isInWishlist
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
