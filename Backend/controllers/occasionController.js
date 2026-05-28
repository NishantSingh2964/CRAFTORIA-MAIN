const Occasion = require('../models/Occasion');

exports.getOccasions = async (req, res, next) => {
    try {
        const occasions = await Occasion.find({ isActive: true });
        res.status(200).json({
            success: true,
            count: occasions.length,
            data: occasions
        });
    } catch (error) {
        next(error);
    }
};

exports.createOccasion = async (req, res, next) => {
    try {
        const occasionData = {
            ...req.body,
            image: req.file ? req.file.path : req.body.image
        };

        if (!occasionData.image) {
            return res.status(400).json({ success: false, message: 'Please upload an image' });
        }

        const occasion = await Occasion.create(occasionData);
        res.status(201).json({
            success: true,
            data: occasion
        });
    } catch (error) {
        next(error);
    }
};

exports.updateOccasion = async (req, res, next) => {
    try {
        let occasion = await Occasion.findById(req.params.id);
        if (!occasion) {
            return res.status(404).json({ success: false, message: 'Occasion not found' });
        }

        const updateData = { ...req.body };
        if (req.file) {
            updateData.image = req.file.path;
        }

        occasion = await Occasion.findByIdAndUpdate(req.params.id, updateData, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: occasion
        });
    } catch (error) {
        next(error);
    }
};

exports.deleteOccasion = async (req, res, next) => {
    try {
        const occasion = await Occasion.findById(req.params.id);
        if (!occasion) {
            return res.status(404).json({ success: false, message: 'Occasion not found' });
        }

        await Occasion.findByIdAndDelete(req.params.id);
        res.status(200).json({
            success: true,
            message: 'Occasion removed successfully'
        });
    } catch (error) {
        next(error);
    }
};
