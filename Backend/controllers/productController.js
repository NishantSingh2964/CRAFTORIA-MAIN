const Product = require('../models/Product');
const Review = require('../models/Review');

exports.getProducts = async (req, res, next) => {
    try {
        const { category, occasion, minPrice, maxPrice, sort } = req.query;
        let query = { isAvailable: true };

        // Filtering
        if (category) query.category = category;
        if (occasion) {
            const mongoose = require('mongoose');
            if (mongoose.Types.ObjectId.isValid(occasion)) {
                query.occasions = new mongoose.Types.ObjectId(occasion);
            }
        }

        if (minPrice || maxPrice) {
            query.currentPrice = {};
            if (minPrice) query.currentPrice.$gte = Number(minPrice);
            if (maxPrice) query.currentPrice.$lte = Number(maxPrice);
        }

        // Use aggregation to count reviews for each product
        const products = await Product.aggregate([
            { $match: query },
            {
                $lookup: {
                    from: 'reviews', // The name of the reviews collection
                    localField: '_id',
                    foreignField: 'product',
                    as: 'all_reviews'
                }
            },
            {
                $addFields: {
                    reviewCount: { $size: '$all_reviews' }
                }
            },
            {
                $project: {
                    all_reviews: 0 // We don't need the actual review objects here, just the count
                }
            },
            {
                $sort: sort ? { [sort.startsWith('-') ? sort.slice(1) : sort]: sort.startsWith('-') ? -1 : 1 } : { createdAt: -1 }
            }
        ]);

        res.status(200).json({
            success: true,
            count: products.length,
            data: products
        });
    } catch (error) {
        next(error);
    }
};

exports.getProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id).populate('occasions', 'name filter');

        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        res.status(200).json({
            success: true,
            data: product
        });
    } catch (error) {
        next(error);
    }
};

exports.createProduct = async (req, res, next) => {
    try {
        const productData = {
            ...req.body,
            image: req.file ? req.file.path : req.body.image
        };

        if (!productData.image) {
            return res.status(400).json({ success: false, message: 'Please upload an image' });
        }

        // Robust parsing for occasions (handles JSON, single-quotes, or literal strings)
        if (productData.occasions) {
            try {
                if (typeof productData.occasions === 'string') {
                    productData.occasions = JSON.parse(productData.occasions.replace(/'/g, '"'));
                }
            } catch (e) {
                const matches = String(productData.occasions).match(/[0-9a-fA-F]{24}/g);
                productData.occasions = matches ? matches : [];
            }
        }

        const product = await Product.create(productData);

        res.status(201).json({
            success: true,
            data: product
        });
    } catch (error) {
        next(error);
    }
};

exports.updateProduct = async (req, res, next) => {
    try {
        let product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        const updateData = { ...req.body };
        if (req.file) {
            updateData.image = req.file.path;
        }

        // Robust parsing for occasions (handles JSON, single-quotes, or literal strings)
        if (updateData.occasions) {
            console.log('--- Postman Occasions String (Update):', updateData.occasions);
            try {
                if (typeof updateData.occasions === 'string') {
                    updateData.occasions = JSON.parse(updateData.occasions.replace(/'/g, '"'));
                }
            } catch (e) {
                const matches = String(updateData.occasions).match(/[0-9a-fA-F]{24}/g);
                updateData.occasions = matches ? matches : [];
            }
            console.log('--- Parsed Result (Update):', updateData.occasions);
        }

        product = await Product.findByIdAndUpdate(req.params.id, updateData, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: product
        });
    } catch (error) {
        next(error);
    }
};

exports.deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        await product.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Product removed'
        });
    } catch (error) {
        next(error);
    }
};
