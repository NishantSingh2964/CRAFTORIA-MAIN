const express = require('express');
const router = express.Router();
const { getWishlist, toggleWishlist, checkWishlist } = require('../controllers/wishlistController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // All wishlist routes are protected

router.route('/')
    .get(getWishlist);

router.post('/toggle', toggleWishlist);

router.get('/check/:productId', checkWishlist);

module.exports = router;
