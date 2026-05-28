const Product = require('../models/Product');

exports.getProducts = async (req, res, next) => {
    try {
        const { category, occasion, minPrice, maxPrice, sort } = req.query;
        let query = { isAvailable: true };

        // Filtering
        if (category) query.category = category;
        if (occasion) query.occasions = occasion; // occasion ID
        if (minPrice || maxPrice) {
            query.currentPrice = {};
            if (minPrice) query.currentPrice.$gte = Number(minPrice);
            if (maxPrice) query.currentPrice.$lte = Number(maxPrice);
        }

        let productsQuery = Product.find(query).populate('occasions', 'name filter');

        // Sorting
        if (sort) {
            const sortBy = sort.split(',').join(' ');
            productsQuery = productsQuery.sort(sortBy);
        } else {
            productsQuery = productsQuery.sort('-createdAt');
        }

        const products = await productsQuery;

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
