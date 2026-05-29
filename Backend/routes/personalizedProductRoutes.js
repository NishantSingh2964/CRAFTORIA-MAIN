const express = require('express');
const router = express.Router();
const {
    getPersonalizedProducts,
    getPersonalizedProduct,
    createPersonalizedProduct,
    updatePersonalizedProduct,
    deletePersonalizedProduct
} = require('../controllers/personalizedProductController');
const { protect, admin } = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary');

router.route('/')
    .get(getPersonalizedProducts)
    .post(protect, admin, upload.single('image'), createPersonalizedProduct);

router.route('/:id')
    .get(getPersonalizedProduct)
    .put(protect, admin, upload.single('image'), updatePersonalizedProduct)
    .delete(protect, admin, deletePersonalizedProduct);

module.exports = router;
