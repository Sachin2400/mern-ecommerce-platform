const Payments = require('../models/paymentModel');
const Users = require('../models/userModel');
const Products = require('../models/productModel');

const paymentCtrl = {
    getPayments: async (req, res) => {
        try {
            const payments = await Payments.find();
            res.json(payments);
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },

    createPayment: async (req, res) => {
        try {
            const user = await Users.findById(req.user.id).select('name email');
            if (!user) return res.status(400).json({ msg: "User does not exist." });

            const { cart, paymentID, address } = req.body;
            const { _id, name, email } = user;

            const newPayment = new Payments({
                user_id: _id,
                name,
                email,
                cart,
                paymentID: paymentID || `PAY-${Date.now()}`,
                address: address || { address_line: "Standard Delivery Address", city: "Local", country: "IN" },
                status: true
            });

            // Update sold count for products
            cart.filter(item => {
                return sold(item._id, item.quantity, item.sold);
            });

            await newPayment.save();

            // Clear user cart
            await Users.findOneAndUpdate({ _id: req.user.id }, { cart: [] });

            res.json({ msg: "Payment Success! Order has been placed." });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    }
};

const sold = async (id, quantity, oldSold) => {
    await Products.findOneAndUpdate({ _id: id }, {
        sold: (oldSold || 0) + quantity
    });
};

module.exports = paymentCtrl;

