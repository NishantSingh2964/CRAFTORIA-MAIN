const Review = require('../models/Review');
const Product = require('../models/Product');
const PersonalizedProduct = require('../models/PersonalizedProduct');

// @desc    Create a new review
// @route   POST /api/reviews
// @access  Private
exports.createReview = async (req, res, next) => {
    try {
        const { productId, rating, comment, userName, userImage } = req.body;
        if (!req.user || !req.user.id) {
            return res.status(401).json({ success: false, message: 'Please login to post a review' });
        }
        const userId = req.user.id;

        // Check if product exists in any of the two collections
        let product = await Product.findById(productId);
        if (!product) {
            product = await PersonalizedProduct.findById(productId);
        }

        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        const review = await Review.create({
            product: productId,
            userId,
            userName,
            userImage,
            rating: Number(rating),
            comment
        });

        res.status(201).json({
            success: true,
            data: review
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get reviews for a product
// @route   GET /api/reviews/product/:productId
// @access  Public
exports.getProductReviews = async (req, res, next) => {
    try {
        const reviews = await Review.find({ product: req.params.productId }).sort('-createdAt');

        res.status(200).json({
            success: true,
            count: reviews.length,
            data: reviews
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private/Admin
exports.deleteReview = async (req, res, next) => {
    try {
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({ success: false, message: 'Review not found' });
        }

        await review.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Review deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};
