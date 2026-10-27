const Users = require('../models/userModel');
const Payments = require('../models/paymentModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const userCtrl = {
    register: async (req, res) => {
        try {
            const { name, email, password } = req.body;

            if (!name || !email || !password) {
                return res.status(400).json({ msg: "Please fill in all fields." });
            }

            const user = await Users.findOne({ email });
            if (user) return res.status(400).json({ msg: "Email already registered." });

            if (password.length < 6) {
                return res.status(400).json({ msg: "Password must be at least 6 characters long." });
            }

            const passwordHash = await bcrypt.hash(password, 10);

            const newUser = new Users({
                name,
                email,
                password: passwordHash
            });

            await newUser.save();

            const accesstoken = createAccessToken({ id: newUser._id });
            const refreshtoken = createRefreshToken({ id: newUser._id });

            res.cookie('refreshtoken', refreshtoken, {
                httpOnly: true,
                path: '/user/refresh_token',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            });

            res.json({ accesstoken });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },

    refreshtoken: async (req, res) => {
        try {
            const rf_token = req.cookies.refreshtoken;

            if (!rf_token) return res.status(400).json({ msg: "Please login or register." });

            jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
                if (err) return res.status(400).json({ msg: "Please login or register." });

                const accesstoken = createAccessToken({ id: user.id });
                res.json({ accesstoken });
            });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },

    login: async (req, res) => {
        try {
            const { email, password } = req.body;

            const user = await Users.findOne({ email });
            if (!user) return res.status(400).json({ msg: "User does not exist." });

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return res.status(400).json({ msg: "Incorrect password." });

            const accesstoken = createAccessToken({ id: user._id });
            const refreshtoken = createRefreshToken({ id: user._id });

            res.cookie('refreshtoken', refreshtoken, {
                httpOnly: true,
                path: '/user/refresh_token',
                maxAge: 7 * 24 * 60 * 60 * 1000
            });

            res.json({ accesstoken });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },

    logout: async (req, res) => {
        try {
            res.clearCookie('refreshtoken', { path: '/user/refresh_token' });
            return res.json({ msg: "Logged out successfully." });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },

    getUser: async (req, res) => {
        try {
            const user = await Users.findById(req.user.id).select('-password');
            if (!user) return res.status(400).json({ msg: "User not found." });
            res.json(user);
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },

    addCart: async (req, res) => {
        try {
            const user = await Users.findById(req.user.id);
            if (!user) return res.status(400).json({ msg: "User does not exist." });

            await Users.findOneAndUpdate({ _id: req.user.id }, {
                cart: req.body.cart
            });

            return res.json({ msg: "Cart updated successfully." });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },

    history: async (req, res) => {
        try {
            const history = await Payments.find({ user_id: req.user.id });
            res.json(history);
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    }
};

const createAccessToken = (payload) => {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' });
};

const createRefreshToken = (payload) => {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
};

module.exports = userCtrl;
