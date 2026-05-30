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

        // Use aggregation to count reviews and populate occasions
        const products = await Product.aggregate([
            { $match: query },
            {
                $lookup: {
                    from: 'reviews',
                    let: { productId: '$_id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ['$product', '$$productId'] }
                            }
                        }
                    ],
                    as: 'all_reviews'
                }
            },
            {
                $lookup: {
                    from: 'occasions',
                    localField: 'occasions',
                    foreignField: '_id',
                    as: 'occasions_details'
                }
            },
            {
                $addFields: {
                    reviewCount: { $size: '$all_reviews' },
                    averageRating: { 
                        $round: [
                            { 
                                $cond: {
                                    if: { $gt: [{ $size: '$all_reviews' }, 0] },
                                    then: { $avg: '$all_reviews.rating' },
                                    else: 0
                                }
                            }, 
                            1
                        ]
                    },
                    // Map back to the expected array format for the frontend
                    occasions: '$occasions_details'
                }
            },
            {
                $project: {
                    all_reviews: 0,
                    occasions_details: 0
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
        let images = [];
        if (req.files && req.files.length > 0) {
            images = req.files.map(file => file.path);
        } else if (req.body.images) {
            try {
                images = typeof req.body.images === 'string' ? JSON.parse(req.body.images) : req.body.images;
            } catch (e) {
                images = [req.body.images];
            }
        }

        const productData = {
            ...req.body,
            images,
            image: images.length > 0 ? images[0] : (req.body.image || (images[0] || ''))
        };

        if (!productData.image && images.length === 0) {
            return res.status(400).json({ success: false, message: 'Please upload at least one image' });
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
        
        // Reconstruct images array from images_meta (slot layout) + slot-indexed file uploads
        if (req.body.images_meta) {
            let meta = [];
            try {
                meta = JSON.parse(req.body.images_meta);
            } catch (e) {
                meta = [];
            }

            // Build a map of slot index -> uploaded file path from slot-indexed fields (image_0, image_1 …)
            const slotFileMap = {};
            if (req.files) {
                req.files.forEach(file => {
                    // multer stores fieldname as 'image_0', 'image_1', etc.
                    const match = file.fieldname.match(/^image_(\d+)$/);
                    if (match) {
                        slotFileMap[parseInt(match[1])] = file.path;
                    }
                });
            }

            // Rebuild the final images array by walking through images_meta
            const finalImages = [];
            meta.forEach(entry => {
                const slotMatch = entry.match(/^NEW_FILE_(\d+)$/);
                if (slotMatch) {
                    const slotIdx = parseInt(slotMatch[1]);
                    if (slotFileMap[slotIdx]) {
                        finalImages.push(slotFileMap[slotIdx]);
                    }
                } else if (entry.startsWith('http')) {
                    // Keep existing Cloudinary URL as-is
                    finalImages.push(entry);
                }
            });

            if (finalImages.length > 0) {
                updateData.images = finalImages;
                updateData.image  = finalImages[0]; // Slot 0 is always the main image
            }
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
