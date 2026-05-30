const express = require('express');
const { 
    getProducts, 
    getProduct, 
    createProduct, 
    updateProduct, 
    deleteProduct 
} = require('../controllers/productController');
const { upload } = require('../config/cloudinary');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/:id', getProduct);

// Admin routes
router.post('/admin', protect, admin, upload.array('images', 4), createProduct);
router.patch('/admin/:id', protect, admin, upload.any(), updateProduct);
router.delete('/admin/:id', protect, admin, deleteProduct);

module.exports = router;
