const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// --- One-time SuperAdmin Promotion ---
const User = require('./models/User');
setTimeout(async () => {
    try {
        const email = 'nishantraj7859@gmail.com';
        const user = await User.findOne({ email });
        if (user && user.role !== 'SuperAdmin') {
            user.role = 'SuperAdmin';
            await user.save();
            console.log(`\n[BOOTSTRAP] >>> ${email} HAS BEEN PROMOTED TO SUPERADMIN <<<\n`);
        }
    } catch (err) {
        console.error('SuperAdmin seed error:', err.message);
    }
}, 3000);
// ------------------------------------

// Webhook Route (Must be before express.json() for Stripe signature verification)
const { handleStripeWebhook } = require('./controllers/webhookController');
app.post('/api/webhook', express.raw({ type: 'application/json' }), (req, res, next) => {
    req.rawBody = req.body;
    next();
}, handleStripeWebhook);

// Middleware
// Build a dynamic allowlist: main URL + any Vercel preview branch URL + localhost
const allowedOrigins = [
    process.env.FRONTEND_URL,                 // e.g. https://craaftoria.vercel.app
    process.env.FRONTEND_URL_PREVIEW,         // optional: secondary fixed preview URL
    /^https:\/\/craaftoria.*\.vercel\.app$/,  // all Vercel branch previews for this project
    /^http:\/\/localhost(:\d+)?$/,            // local development
].filter(Boolean); // remove undefined entries

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, curl, Postman, server-to-server)
        if (!origin) return callback(null, true);
        const allowed = allowedOrigins.some(o =>
            o instanceof RegExp ? o.test(origin) : o === origin
        );
        if (allowed) {
            callback(null, true);
        } else {
            console.warn(`[CORS] Blocked origin: ${origin}`);
            callback(new Error(`CORS policy: origin '${origin}' is not allowed`));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());
app.use(helmet());
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Basic Route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to CRAFTORIO API' });
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/occasions', require('./routes/occasionRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/personalized-products', require('./routes/personalizedProductRoutes'));
app.use('/api/chatbot', require('./routes/chatbotRoutes'));
app.use('/api/expenses', require('./routes/expenseRoutes'));
app.use('/api/wishlist', require('./routes/wishlistRoutes'));
app.use('/api/cart', require('./routes/cartRoutes'));

// Catch-all 404 handler
app.use((req, res, next) => {
    console.warn(`[404] Route Not Found: ${req.method} ${req.originalUrl}`);
    res.status(404).json({ success: false, message: `Route ${req.method} ${req.originalUrl} not found` });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(`[500] Error on ${req.method} ${req.originalUrl}:`, err);
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});

module.exports = app;
