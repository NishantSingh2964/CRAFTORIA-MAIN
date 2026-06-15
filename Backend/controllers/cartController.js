const Cart = require('../models/Cart');
const User = require('../models/User');

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
exports.getCart = async (req, res, next) => {
    try {
        const user = req.user;
        if (!user) return res.status(401).json({ success: false, message: 'Unauthorized' });

        let cart = await Cart.findOne({ user: user._id });

        if (cart) {
            // Sanity check: Remove any items with invalid productModel or missing product
            const originalCount = cart.items.length;
            cart.items = cart.items.filter(item => 
                item.product && 
                ['Product', 'PersonalizedProduct'].includes(item.productModel)
            );
            
            if (cart.items.length !== originalCount) {
                await cart.save();
            }

            await cart.populate({
                path: 'items.product',
                select: 'name image price currentPrice originalPrice sku tag'
            });
        }

        if (!cart) {
            cart = await Cart.create({ user: user._id, items: [] });
        }

        // Map items to include overrides
        const finalItems = (cart.items || []).map(item => {
            const productData = item.product ? (item.product.toObject ? item.product.toObject() : item.product) : {};
            return {
                ...productData,
                _id: item.product?._id || item.product,
                name: item.name || productData.name,
                currentPrice: item.price || productData.currentPrice || productData.price,
                quantity: item.quantity,
                productModel: item.productModel,
                metadata: item.metadata
            };
        });

        res.status(200).json({
            success: true,
            data: finalItems
        });
    } catch (error) {
        console.error('Error fetching cart:', error);
        next(error);
    }
};

// @desc    Add item to cart
// @route   POST /api/cart/add
// @access  Private
exports.addToCart = async (req, res, next) => {
    try {
        console.log(`[CART] Add to cart request for user ${req.user?._id}:`, req.body);
        const user = req.user;
        if (!user) return res.status(401).json({ success: false, message: 'Unauthorized' });

        const { productId, productModel, quantity = 1, name, price } = req.body;
        const metadata = req.body.metadata || {}; // Ensure it's never null

        // Validate ObjectId to prevent 500 error from Mongoose
        const mongoose = require('mongoose');
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ success: false, message: 'Invalid Product ID' });
        }

        let cart = await Cart.findOne({ user: user._id });

        if (!cart) {
            cart = new Cart({ user: user._id, items: [] });
        }

        // *** CRITICAL: Purge any invalid items BEFORE saving to avoid Mongoose ValidatorError ***
        cart.items = cart.items.filter(item =>
            item.product &&
            ['Product', 'PersonalizedProduct'].includes(item.productModel)
        );

        const existingItemIndex = cart.items.findIndex(item => {
            if (!item.product) return false;
            const isSameProduct = item.product.toString() === productId && item.productModel === productModel;
            
            // Handle Mongoose Map conversion for comparison
            const itemMetadata = item.metadata instanceof Map ? Object.fromEntries(item.metadata) : (item.metadata || {});
            const isSameMetadata = JSON.stringify(itemMetadata) === JSON.stringify(metadata);
            
            return isSameProduct && isSameMetadata;
        });

        if (existingItemIndex > -1) {
            cart.items[existingItemIndex].quantity += quantity;
        } else {
            cart.items.push({
                product: productId,
                productModel,
                quantity,
                metadata,
                name,
                price
            });
        }

        await cart.save();

        await cart.populate({
            path: 'items.product',
            select: 'name image price currentPrice originalPrice sku tag'
        });

        // Map items to include overrides
        const finalItems = cart.items.map(item => {
            const productData = item.product ? (item.product.toObject ? item.product.toObject() : item.product) : {};
            return {
                ...productData,
                _id: item.product?._id || item.product, // Keep the product ID
                name: item.name || productData.name,
                currentPrice: item.price || productData.currentPrice || productData.price,
                quantity: item.quantity,
                productModel: item.productModel,
                metadata: item.metadata
            };
        });

        res.status(200).json({
            success: true,
            data: finalItems
        });
    } catch (error) {
        console.error('Error adding to cart:', error);
        next(error);
    }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/update
// @access  Private
exports.updateQuantity = async (req, res, next) => {
    try {
        const user = req.user;
        if (!user) return res.status(401).json({ success: false, message: 'Unauthorized' });

        const { productId, quantity } = req.body;

        const cart = await Cart.findOne({ user: user._id });
        if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });

        const itemIndex = cart.items.findIndex(item => item.product && item.product.toString() === productId);
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
        next(error);
    }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/remove/:productId
// @access  Private
exports.removeFromCart = async (req, res, next) => {
    try {
        const user = req.user;
        if (!user) return res.status(401).json({ success: false, message: 'Unauthorized' });

        const { productId } = req.params;

        const cart = await Cart.findOne({ user: user._id });
        if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });

        cart.items = cart.items.filter(item => item.product && item.product.toString() !== productId);
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
        next(error);
    }
};

// @desc    Clear entire cart
// @route   DELETE /api/cart/clear
// @access  Private
exports.clearCart = async (req, res, next) => {
    try {
        const user = req.user;
        if (!user) return res.status(401).json({ success: false, message: 'Unauthorized' });

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
        next(error);
    }
};
