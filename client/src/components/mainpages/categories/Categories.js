import React, { useState, useContext } from 'react';
import { GlobalState } from '../../../GlobalState';
import axios from 'axios';

const Categories = () => {
    const state = useContext(GlobalState);
    const [categories] = state.categoriesAPI.categories;
    const [category, setCategory] = useState('');
    const [token] = state.token;
    const [callback, setCallback] = state.categoriesAPI.callback;
    const [onEdit, setOnEdit] = useState(false);
    const [id, setID] = useState('');

    const createCategory = async (e) => {
        e.preventDefault();
        try {
            if (onEdit) {
                const res = await axios.put(`/api/category/${id}`, { name: category }, {
                    headers: { Authorization: token }
                });
                alert(res.data.msg);
            } else {
                const res = await axios.post('/api/category', { name: category }, {
                    headers: { Authorization: token }
                });
                alert(res.data.msg);
            }

            setOnEdit(false);
            setCategory('');
            setCallback(!callback);
        } catch (err) {
            alert(err.response?.data?.msg || err.message);
        }
    };

    const editCategory = (id, name) => {
        setID(id);
        setCategory(name);
        setOnEdit(true);
    };

    const deleteCategory = async (id) => {
        if (!window.confirm("Are you sure you want to delete this category?")) return;
        try {
            const res = await axios.delete(`/api/category/${id}`, {
                headers: { Authorization: token }
            });
            alert(res.data.msg);
            setCallback(!callback);
        } catch (err) {
            alert(err.response?.data?.msg || err.message);
        }
    };

    return (
        <div className="categories" style={{ maxWidth: "700px", margin: "40px auto", padding: "0 15px" }}>
            <h2 style={{ textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "20px" }}>Category Management</h2>

            <form onSubmit={createCategory} style={{ display: "flex", gap: "10px", marginBottom: "30px" }}>
                <input
                    type="text"
                    name="category"
                    value={category}
                    required
                    placeholder="Enter category name..."
                    onChange={e => setCategory(e.target.value)}
                    style={{
                        flex: 1,
                        padding: "10px 15px",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        outline: "none",
                        fontSize: "1rem"
                    }}
                />
                <button
                    type="submit"
                    style={{
                        background: "#333",
                        color: "white",
                        padding: "10px 25px",
                        borderRadius: "4px",
                        textTransform: "uppercase",
                        letterSpacing: "1px",
                        cursor: "pointer"
                    }}
                >
                    {onEdit ? "Update" : "Create"}
                </button>
                {
                    onEdit && (
                        <button
                            type="button"
                            onClick={() => { setOnEdit(false); setCategory(''); }}
                            style={{
                                background: "#888",
                                color: "white",
                                padding: "10px 20px",
                                borderRadius: "4px",
                                textTransform: "uppercase",
                                cursor: "pointer"
                            }}
                        >
                            Cancel
                        </button>
                    )
                }
            </form>

            <div className="col">
                {
                    categories.map(cat => (
                        <div
                            key={cat._id}
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                padding: "12px 15px",
                                border: "1px solid #eee",
                                marginBottom: "10px",
                                borderRadius: "4px",
                                background: "#fff",
                                boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
                            }}
                        >
                            <p style={{ fontSize: "1.1rem", textTransform: "capitalize", fontWeight: "500" }}>{cat.name}</p>
                            <div>
                                <button
                                    onClick={() => editCategory(cat._id, cat.name)}
                                    style={{
                                        background: "#007bff",
                                        color: "white",
                                        padding: "6px 14px",
                                        borderRadius: "3px",
                                        marginRight: "8px",
                                        cursor: "pointer"
                                    }}
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => deleteCategory(cat._id)}
                                    style={{
                                        background: "crimson",
                                        color: "white",
                                        padding: "6px 14px",
                                        borderRadius: "3px",
                                        cursor: "pointer"
                                    }}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    );
};

export default Categories;

