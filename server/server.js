const dns = require('dns');
try {
    dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
    // Fallback to default system DNS if setServers is restricted
}

const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');

const app = express();

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(fileUpload({
    useTempFiles: true
}));

const PORT = process.env.PORT || 5000;

// Health check endpoint
app.get('/', (req, res) => {
    const isDbConnected = mongoose.connection.readyState === 1;
    res.json({
        msg: "MERN Stack E-Commerce API is running smoothly!",
        database: isDbConnected ? "Connected" : "Disconnected (Action required: configure MONGODB_URL in server/.env)",
        status: "active",
        timestamp: new Date()
    });
});

// Database connectivity guard: prevents 10-second buffering timeout when DB is offline
app.use((req, res, next) => {
    if (mongoose.connection.readyState !== 1 && req.path !== '/') {
        return res.status(503).json({
            msg: "Database not connected! Please check your MongoDB Atlas connection string in 'server/.env' as MONGODB_URL."
        });
    }
    next();
});

// API Routes
app.use('/user', require('./routes/userRouter'));
app.use('/api', require('./routes/categoryRouter'));
app.use('/api', require('./routes/upload'));
app.use('/api', require('./routes/productRouter'));
app.use('/api', require('./routes/paymentRouter'));

// Format and clean MongoDB connection string
const rawURI = process.env.MONGODB_URL || 'mongodb://127.0.0.1:27017/ecommerce';
const URI = rawURI.replace(/:\s*<([^>]+)>\s*@/, (match, p1) => ':' + encodeURIComponent(p1) + '@');

mongoose.connect(URI, {
    serverSelectionTimeoutMS: 5000 // Fast fail in 5s if server unreachable
})
.then(() => {
    console.log("✅ Successfully connected to MongoDB Database.");
})
.catch((err) => {
    console.error("⚠️ MongoDB connection error:", err.message);
    console.info("💡 Action required: Check your MongoDB Atlas credentials or network access (0.0.0.0/0).");
});

app.listen(PORT, () => {
    console.log(`🚀 Server is listening on http://localhost:${PORT}`);
});

