import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { GlobalState } from '../../../GlobalState';

const OrderDetails = () => {
    const state = useContext(GlobalState);
    const [history] = state.userAPI.history;
    const [orderDetails, setOrderDetails] = useState([]);
    const params = useParams();

    useEffect(() => {
        if (params.id) {
            history.forEach(item => {
                if (item._id === params.id) setOrderDetails(item);
            });
        }
    }, [params.id, history]);

    if (!orderDetails || Object.keys(orderDetails).length === 0) {
        return <h2 style={{ textAlign: "center", margin: "50px 0" }}>Loading Order Details...</h2>;
    }

    const totalAmount = orderDetails.cart ? orderDetails.cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0) : 0;

    return (
        <div className="history-page" style={{ padding: "30px 10px", maxWidth: "1000px", margin: "0 auto" }}>
            <Link to="/history" style={{ display: "inline-block", marginBottom: "20px", color: "#007bff" }}>
                &larr; Back to Order History
            </Link>

            <h2 style={{ textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "15px" }}>Order Information</h2>

            <div style={{ background: "#f8f9fa", padding: "20px", borderRadius: "6px", marginBottom: "30px", border: "1px solid #dee2e6" }}>
                <p><strong>Order ID:</strong> {orderDetails.paymentID}</p>
                <p><strong>Customer Name:</strong> {orderDetails.name}</p>
                <p><strong>Customer Email:</strong> {orderDetails.email}</p>
                <p><strong>Order Date:</strong> {new Date(orderDetails.createdAt).toLocaleString()}</p>
                <p><strong>Shipping Address:</strong> {orderDetails.address?.line1 || orderDetails.address?.address_line}, {orderDetails.address?.city}, {orderDetails.address?.postal_code || orderDetails.address?.country}</p>
            </div>

            <h3 style={{ textTransform: "uppercase", letterSpacing: "1px", marginBottom: "15px" }}>Items in this Order</h3>

            <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "center", border: "1px solid #ddd" }}>
                    <thead>
                        <tr style={{ background: "#f8f9fa", borderBottom: "2px solid #dee2e6" }}>
                            <th style={thStyle}>Product</th>
                            <th style={thStyle}>Title</th>
                            <th style={thStyle}>Quantity</th>
                            <th style={thStyle}>Unit Price</th>
                            <th style={thStyle}>Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            orderDetails.cart && orderDetails.cart.map(item => {
                                const imageUrl = item.images?.url || (typeof item.images === 'string' ? item.images : 'https://via.placeholder.com/80');
                                const qty = item.quantity || 1;

                                return (
                                    <tr key={item._id} style={{ borderBottom: "1px solid #dee2e6" }}>
                                        <td style={tdStyle}>
                                            <img src={imageUrl} alt={item.title} style={{ width: "70px", height: "70px", objectFit: "cover", borderRadius: "4px" }} />
                                        </td>
                                        <td style={tdStyle}><strong>{item.title}</strong></td>
                                        <td style={tdStyle}>{qty}</td>
                                        <td style={tdStyle}>${item.price}</td>
                                        <td style={tdStyle}>${(item.price * qty).toFixed(2)}</td>
                                    </tr>
                                );
                            })
                        }
                    </tbody>
                </table>
            </div>

            <div style={{ textAlign: "right", marginTop: "20px", fontSize: "1.3rem", fontWeight: "bold" }}>
                Total Paid: <span style={{ color: "crimson" }}>${totalAmount.toFixed(2)}</span>
            </div>
        </div>
    );
};

const thStyle = {
    padding: "12px",
    textTransform: "uppercase",
    fontSize: "0.9rem",
    letterSpacing: "1px"
};

const tdStyle = {
    padding: "12px",
    fontSize: "0.95rem"
};

export default OrderDetails;

