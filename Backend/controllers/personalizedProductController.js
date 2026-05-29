const PersonalizedProduct = require('../models/PersonalizedProduct');

exports.getPersonalizedProducts = async (req, res, next) => {
    try {
        const { category, occasion, sort } = req.query;
        let query = { isAvailable: true };

        if (category) query.category = category;
        if (occasion) query.occasions = occasion;

        let productsQuery = PersonalizedProduct.find(query).populate('occasions', 'name filter');

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

exports.getPersonalizedProduct = async (req, res, next) => {
    try {
        const product = await PersonalizedProduct.findById(req.params.id).populate('occasions', 'name filter');

        if (!product) {
            return res.status(404).json({ success: false, message: 'Personalized product not found' });
        }

        res.status(200).json({
            success: true,
            data: product
        });
    } catch (error) {
        next(error);
    }
};

exports.createPersonalizedProduct = async (req, res, next) => {
    try {
        const productData = {
            ...req.body,
            image: req.file ? req.file.path : req.body.image
        };

        if (!productData.image) {
            return res.status(400).json({ success: false, message: 'Please upload an image' });
        }

        // Parse occasions
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

        // Parse customizationSteps if provided as string
        if (productData.customizationSteps && typeof productData.customizationSteps === 'string') {
            try {
                productData.customizationSteps = JSON.parse(productData.customizationSteps);
            } catch (e) {
                // Keep as is or handle error
            }
        }

        const product = await PersonalizedProduct.create(productData);

        res.status(201).json({
            success: true,
            data: product
        });
    } catch (error) {
        next(error);
    }
};

exports.updatePersonalizedProduct = async (req, res, next) => {
    try {
        let product = await PersonalizedProduct.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ success: false, message: 'Personalized product not found' });
        }

        const updateData = { ...req.body };
        if (req.file) {
            updateData.image = req.file.path;
        }

        if (updateData.occasions) {
            try {
                if (typeof updateData.occasions === 'string') {
                    updateData.occasions = JSON.parse(updateData.occasions.replace(/'/g, '"'));
                }
            } catch (e) {
                const matches = String(updateData.occasions).match(/[0-9a-fA-F]{24}/g);
                updateData.occasions = matches ? matches : [];
            }
        }

        if (updateData.customizationSteps && typeof updateData.customizationSteps === 'string') {
            try {
                updateData.customizationSteps = JSON.parse(updateData.customizationSteps);
            } catch (e) {
                // Keep as is
            }
        }

        product = await PersonalizedProduct.findByIdAndUpdate(req.params.id, updateData, {
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

exports.deletePersonalizedProduct = async (req, res, next) => {
    try {
        const product = await PersonalizedProduct.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ success: false, message: 'Personalized product not found' });
        }

        await product.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Personalized product removed'
        });
    } catch (error) {
        next(error);
    }
};
