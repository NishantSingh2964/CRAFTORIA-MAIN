const express = require('express');
const { createReview, getProductReviews, deleteReview } = require('../controllers/reviewController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, createReview);
router.get('/product/:productId', getProductReviews);
router.delete('/:id', protect, admin, deleteReview);

module.exports = router;
