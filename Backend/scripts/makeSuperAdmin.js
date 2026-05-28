const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

const makeSuperAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const email = 'nishantraj7859@gmail.com';
        const user = await User.findOne({ email });

        if (!user) {
            console.log(`User not found with email: ${email}. Please ensure the user has logged in at least once.`);
            process.exit(1);
        }

        user.role = 'SuperAdmin';
        await user.save();

        console.log(`Success! ${email} is now a SuperAdmin.`);
        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
};

makeSuperAdmin();
