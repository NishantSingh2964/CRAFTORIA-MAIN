const Cart = require('../models/Cart');
const User = require('../models/User');

// Helper: resolve MongoDB user from Clerk token
const getUser = async (req, res) => {
    const user = await User.findOne({ clerkId: req.auth.userId });
    if (!user) {
        res.status(404).json({ success: false, message: 'User not found' });
        return null;
    }
    return user;
};

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
exports.getCart = async (req, res) => {
    try {
        const user = await getUser(req, res);
        if (!user) return;

        let cart = await Cart.findOne({ user: user._id })
            .populate({
                path: 'items.product',
                select: 'name image price currentPrice originalPrice sku tag'
            });

        if (!cart) {
            cart = await Cart.create({ user: user._id, items: [] });
        }

        res.status(200).json({
            success: true,
            data: cart.items
        });
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Add item to cart
// @route   POST /api/cart/add
// @access  Private
exports.addToCart = async (req, res) => {
    try {
        const user = await getUser(req, res);
        if (!user) return;

        const { productId, productModel, quantity = 1, metadata = {} } = req.body;

        let cart = await Cart.findOne({ user: user._id });

        if (!cart) {
            cart = new Cart({ user: user._id, items: [] });
        }

        const existingItemIndex = cart.items.findIndex(
            item => item.product.toString() === productId && item.productModel === productModel
        );

        if (existingItemIndex > -1) {
            cart.items[existingItemIndex].quantity += quantity;
        } else {
            cart.items.push({
                product: productId,
                productModel,
                quantity,
                metadata
            });
        }

        await cart.save();
        await cart.populate({
            path: 'items.product',
            select: 'name image price currentPrice originalPrice sku tag'
        });

        res.status(200).json({
            success: true,
            data: cart.items
        });
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/update
// @access  Private
exports.updateQuantity = async (req, res) => {
    try {
        const user = await getUser(req, res);
        if (!user) return;

        const { productId, quantity } = req.body;

        const cart = await Cart.findOne({ user: user._id });
        if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });

        const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
        if (itemIndex > -1) {
            cart.items[itemIndex].quantity = Math.max(1, quantity);
            await cart.save();
            await cart.populate({
                path: 'items.product',
                select: 'name image price currentPrice originalPrice sku tag'
            });
            return res.status(200).json({ success: true, data: cart.items });
        }

        res.status(404).json({ success: false, message: 'Item not found in cart' });
    } catch (error) {
        console.error('Error updating quantity:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/remove/:productId
// @access  Private
exports.removeFromCart = async (req, res) => {
    try {
        const user = await getUser(req, res);
        if (!user) return;

        const { productId } = req.params;

        const cart = await Cart.findOne({ user: user._id });
        if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });

        cart.items = cart.items.filter(item => item.product.toString() !== productId);
        await cart.save();
        await cart.populate({
            path: 'items.product',
            select: 'name image price currentPrice originalPrice sku tag'
        });

        res.status(200).json({
            success: true,
            data: cart.items
        });
    } catch (error) {
        console.error('Error removing from cart:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Clear entire cart
// @route   DELETE /api/cart/clear
// @access  Private
exports.clearCart = async (req, res) => {
    try {
        const user = await getUser(req, res);
        if (!user) return;

        const cart = await Cart.findOne({ user: user._id });
        if (cart) {
            cart.items = [];
            await cart.save();
        }

        res.status(200).json({
            success: true,
            message: 'Cart cleared'
        });
    } catch (error) {
        console.error('Error clearing cart:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
