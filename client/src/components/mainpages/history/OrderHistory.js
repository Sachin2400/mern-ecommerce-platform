import React, { useContext, useEffect } from 'react';
import { GlobalState } from '../../../GlobalState';
import { Link } from 'react-router-dom';
import axios from 'axios';

const OrderHistory = () => {
    const state = useContext(GlobalState);
    const [history, setHistory] = state.userAPI.history;
    const [isAdmin] = state.userAPI.isAdmin;
    const [token] = state.token;

    useEffect(() => {
        if (token) {
            const getHistory = async () => {
                try {
                    if (isAdmin) {
                        const res = await axios.get('/api/payment', {
                            headers: { Authorization: token }
                        });
                        setHistory(res.data);
                    } else {
                        const res = await axios.get('/user/history', {
                            headers: { Authorization: token }
                        });
                        setHistory(res.data);
                    }
                } catch (err) {
                    console.error("Order history fetch error:", err.response?.data?.msg || err.message);
                }
            };
            getHistory();
        }
    }, [token, isAdmin, setHistory]);

    return (
        <div className="history-page" style={{ padding: "30px 10px" }}>
            <h2 style={{ textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "15px" }}>Order History</h2>
            <h4 style={{ color: "#666", marginBottom: "25px" }}>You have {history.length} completed orders</h4>

            <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "center", border: "1px solid #ddd" }}>
                    <thead>
                        <tr style={{ background: "#f8f9fa", borderBottom: "2px solid #dee2e6" }}>
                            <th style={thStyle}>Payment ID</th>
                            <th style={thStyle}>Date of Purchase</th>
                            <th style={thStyle}>Customer</th>
                            <th style={thStyle}>Items</th>
                            <th style={thStyle}>Status</th>
                            <th style={thStyle}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            history.map(items => (
                                <tr key={items._id} style={{ borderBottom: "1px solid #dee2e6" }}>
                                    <td style={tdStyle}>{items.paymentID}</td>
                                    <td style={tdStyle}>{new Date(items.createdAt).toLocaleDateString()}</td>
                                    <td style={tdStyle}>{items.name || items.email}</td>
                                    <td style={tdStyle}>{items.cart ? items.cart.length : 0} item(s)</td>
                                    <td style={tdStyle}>
                                        <span style={{ background: "#e8f5e9", color: "#2e7d32", padding: "4px 8px", borderRadius: "3px", fontWeight: "bold" }}>
                                            Completed
                                        </span>
                                    </td>
                                    <td style={tdStyle}>
                                        <Link
                                            to={`/history/${items._id}`}
                                            style={{
                                                background: "#333",
                                                color: "white",
                                                padding: "6px 14px",
                                                borderRadius: "4px",
                                                textTransform: "uppercase",
                                                fontSize: "0.85rem"
                                            }}
                                        >
                                            View
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
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

export default OrderHistory;

