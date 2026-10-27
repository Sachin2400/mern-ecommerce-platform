import React, { useContext, useState, useEffect } from 'react';
import { GlobalState } from '../../../GlobalState';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Cart = () => {
    const state = useContext(GlobalState);
    const [cart, setCart] = state.userAPI.cart;
    const [token] = state.token;
    const [total, setTotal] = useState(0);
    const [address, setAddress] = useState({
        recipient_name: 'Customer',
        line1: '123 Main Street',
        city: 'New Delhi',
        state: 'Delhi',
        postal_code: '110001',
        country_code: 'IN'
    });
    const navigate = useNavigate();

    useEffect(() => {
        const getTotal = () => {
            const res = cart.reduce((prev, item) => {
                return prev + (item.price * (item.quantity || 1));
            }, 0);
            setTotal(res);
        };
        getTotal();
    }, [cart]);

    const updateCartOnServer = async (cartData) => {
        if (token) {
            await axios.patch('/user/addcart', { cart: cartData }, {
                headers: { Authorization: token }
            });
        }
    };

    const increment = (id) => {
        cart.forEach(item => {
            if (item._id === id) {
                item.quantity = (item.quantity || 1) + 1;
            }
        });
        setCart([...cart]);
        updateCartOnServer([...cart]);
    };

    const decrement = (id) => {
        cart.forEach(item => {
            if (item._id === id) {
                item.quantity = (item.quantity || 1) === 1 ? 1 : item.quantity - 1;
            }
        });
        setCart([...cart]);
        updateCartOnServer([...cart]);
    };

    const removeProduct = (id) => {
        if (window.confirm("Do you want to remove this item from your cart?")) {
            const updated = cart.filter(item => item._id !== id);
            setCart(updated);
            updateCartOnServer(updated);
        }
    };

    const handleCheckout = async (e) => {
        e.preventDefault();
        if (!token) return alert("Please log in to complete checkout.");
        if (cart.length === 0) return alert("Your cart is empty.");

        try {
            await axios.post('/api/payment', {
                cart,
                paymentID: `PAY-${Date.now()}`,
                address
            }, {
                headers: { Authorization: token }
            });

            setCart([]);
            updateCartOnServer([]);
            alert("Order placed successfully! Thank you for your purchase.");
            navigate('/history');
        } catch (err) {
            alert(err.response?.data?.msg || err.message);
        }
    };

    if (cart.length === 0) {
        return (
            <div style={{ textAlign: "center", padding: "80px 20px" }}>
                <h2 style={{ fontSize: "2.5rem", color: "#444", marginBottom: "15px" }}>Your Cart is Empty</h2>
                <p style={{ color: "#777", marginBottom: "25px" }}>Explore our catalog and find the best items today.</p>
                <Link
                    to="/"
                    style={{
                        background: "#333",
                        color: "white",
                        padding: "10px 30px",
                        textTransform: "uppercase",
                        letterSpacing: "2px",
                        display: "inline-block"
                    }}
                >
                    Continue Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="cart_page" style={{ padding: "30px 10px" }}>
            <h2 style={{ textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "30px" }}>Shopping Cart</h2>

            <div className="cart_container">
                <div className="cart_items">
                    {
                        cart.map(product => {
                            const imageUrl = product.images?.url || (typeof product.images === 'string' ? product.images : 'https://via.placeholder.com/150');
                            const qty = product.quantity || 1;

                            return (
                                <div className="cart_card" key={product._id}>
                                    <img src={imageUrl} alt={product.title} />

                                    <div className="cart_info">
                                        <h3>{product.title}</h3>
                                        <p className="cart_code">Product Code: {product.product_id}</p>
                                        <h4 className="cart_price">${product.price}</h4>

                                        <div className="amount">
                                            <button onClick={() => decrement(product._id)}>-</button>
                                            <span>{qty}</span>
                                            <button onClick={() => increment(product._id)}>+</button>
                                        </div>

                                        <p className="item_subtotal">
                                            Subtotal: <strong>${(product.price * qty).toFixed(2)}</strong>
                                        </p>
                                    </div>

                                    <div className="delete" onClick={() => removeProduct(product._id)}>
                                        &times;
                                    </div>
                                </div>
                            );
                        })
                    }
                </div>

                <div className="cart_summary">
                    <h3>Order Summary</h3>
                    <div className="summary_row">
                        <span>Items Count:</span>
                        <span>{cart.reduce((sum, item) => sum + (item.quantity || 1), 0)} items</span>
                    </div>
                    <div className="summary_row">
                        <span>Delivery:</span>
                        <span style={{ color: "green" }}>FREE</span>
                    </div>
                    <div className="summary_row total_row">
                        <span>Total:</span>
                        <span>${total.toFixed(2)}</span>
                    </div>

                    <form onSubmit={handleCheckout} style={{ marginTop: "20px" }}>
                        <h4 style={{ marginBottom: "10px" }}>Shipping Details</h4>
                        <input
                            type="text"
                            placeholder="Recipient Name"
                            value={address.recipient_name}
                            onChange={e => setAddress({ ...address, recipient_name: e.target.value })}
                            required
                            style={inputStyle}
                        />
                        <input
                            type="text"
                            placeholder="Street Address"
                            value={address.line1}
                            onChange={e => setAddress({ ...address, line1: e.target.value })}
                            required
                            style={inputStyle}
                        />
                        <div style={{ display: "flex", gap: "10px" }}>
                            <input
                                type="text"
                                placeholder="City"
                                value={address.city}
                                onChange={e => setAddress({ ...address, city: e.target.value })}
                                required
                                style={inputStyle}
                            />
                            <input
                                type="text"
                                placeholder="Postal Code"
                                value={address.postal_code}
                                onChange={e => setAddress({ ...address, postal_code: e.target.value })}
                                required
                                style={inputStyle}
                            />
                        </div>

                        <button
                            type="submit"
                            style={{
                                width: "100%",
                                background: "#28a745",
                                color: "white",
                                padding: "12px",
                                marginTop: "15px",
                                textTransform: "uppercase",
                                letterSpacing: "1.5px",
                                fontWeight: "bold",
                                borderRadius: "4px",
                                cursor: "pointer"
                            }}
                        >
                            Proceed to Checkout (${total.toFixed(2)})
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

const inputStyle = {
    width: "100%",
    padding: "8px 12px",
    margin: "5px 0",
    border: "1px solid #ddd",
    borderRadius: "4px",
    outline: "none",
    boxSizing: "border-box"
};

export default Cart;
