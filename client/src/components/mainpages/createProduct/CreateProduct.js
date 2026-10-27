import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { GlobalState } from '../../../GlobalState';
import { useNavigate, useParams } from 'react-router-dom';

const initialState = {
    product_id: '',
    title: '',
    price: 0,
    description: 'High-quality item crafted with premium materials for lasting value.',
    content: 'Full warranty included. Free shipping and customer satisfaction guaranteed.',
    category: '',
    _id: ''
};

const CreateProduct = () => {
    const state = useContext(GlobalState);
    const [product, setProduct] = useState(initialState);
    const [categories] = state.categoriesAPI.categories;
    const [images, setImages] = useState(false);
    const [loading, setLoading] = useState(false);
    const [imageUrlInput, setImageUrlInput] = useState('');

    const [isAdmin] = state.userAPI.isAdmin;
    const [token] = state.token;

    const navigate = useNavigate();
    const param = useParams();

    const [products] = state.productsAPI.products;
    const [onEdit, setOnEdit] = useState(false);
    const [callback, setCallback] = state.productsAPI.callback;

    useEffect(() => {
        if (param.id) {
            setOnEdit(true);
            products.forEach(p => {
                if (p._id === param.id) {
                    setProduct(p);
                    setImages(p.images);
                }
            });
        } else {
            setOnEdit(false);
            setProduct(initialState);
            setImages(false);
        }
    }, [param.id, products]);

    const handleUpload = async (e) => {
        e.preventDefault();
        try {
            if (!isAdmin) return alert("You are not an admin.");
            const file = e.target.files[0];

            if (!file) return alert("File does not exist.");

            if (file.size > 1024 * 1024 * 5) return alert("Size too large! (Max 5MB)");

            if (file.type !== 'image/jpeg' && file.type !== 'image/png' && file.type !== 'image/webp') {
                return alert("File format is incorrect.");
            }

            let formData = new FormData();
            formData.append('file', file);

            setLoading(true);
            const res = await axios.post('/api/upload', formData, {
                headers: {
                    'content-type': 'multipart/form-data',
                    Authorization: token
                }
            });
            setLoading(false);
            setImages(res.data);
        } catch (err) {
            setLoading(false);
            alert(err.response?.data?.msg || err.message);
        }
    };

    const handleManualImageUrl = () => {
        if (!imageUrlInput.trim()) return alert("Please enter an image URL.");
        setImages({
            public_id: `manual_${Date.now()}`,
            url: imageUrlInput.trim()
        });
        setImageUrlInput('');
    };

    const handleDestroy = async () => {
        try {
            if (!isAdmin) return alert("You are not an admin.");
            setLoading(true);
            if (images.public_id && !images.public_id.startsWith('manual_')) {
                await axios.post('/api/destroy', { public_id: images.public_id }, {
                    headers: { Authorization: token }
                });
            }
            setLoading(false);
            setImages(false);
        } catch (err) {
            setLoading(false);
            alert(err.response?.data?.msg || err.message);
        }
    };

    const handleChangeInput = e => {
        const { name, value } = e.target;
        setProduct({ ...product, [name]: value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            if (!isAdmin) return alert("You are not an admin.");
            if (!images) return alert("Please upload an image or provide an image URL.");

            if (onEdit) {
                await axios.put(`/api/products/${product._id}`, { ...product, images }, {
                    headers: { Authorization: token }
                });
                alert("Product updated successfully!");
            } else {
                await axios.post('/api/products', { ...product, images }, {
                    headers: { Authorization: token }
                });
                alert("Product created successfully!");
            }

            setCallback(!callback);
            navigate('/');
        } catch (err) {
            alert(err.response?.data?.msg || err.message);
        }
    };

    const styleUpload = {
        display: images ? "block" : "none"
    };

    return (
        <div className="create_product" style={{ maxWidth: "900px", margin: "40px auto", padding: "0 20px" }}>
            <h2 style={{ textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "30px" }}>
                {onEdit ? "Edit Product" : "Create New Product"}
            </h2>

            <div style={{ display: "flex", gap: "30px", flexWrap: "wrap" }}>
                <div style={{ flex: 1, minWidth: "280px" }}>
                    <div className="upload" style={{ border: "2px dashed #ccc", padding: "20px", textAlign: "center", position: "relative" }}>
                        <input type="file" name="file" id="file_up" onChange={handleUpload} style={{ marginBottom: "15px" }} />
                        {
                            loading ? <h4>Uploading Image...</h4>
                                : <div id="file_img" style={styleUpload}>
                                    <img
                                        src={images ? images.url : ''}
                                        alt=""
                                        style={{ width: "100%", maxHeight: "300px", objectFit: "contain" }}
                                    />
                                    <span
                                        onClick={handleDestroy}
                                        style={{
                                            position: "absolute",
                                            top: "10px",
                                            right: "15px",
                                            fontSize: "2rem",
                                            color: "crimson",
                                            cursor: "pointer",
                                            fontWeight: "bold"
                                        }}
                                    >
                                        &times;
                                    </span>
                                </div>
                        }
                    </div>

                    <div style={{ marginTop: "15px" }}>
                        <p style={{ fontSize: "0.9rem", color: "#666", marginBottom: "5px" }}>Or enter an Image URL directly:</p>
                        <div style={{ display: "flex", gap: "5px" }}>
                            <input
                                type="text"
                                placeholder="https://example.com/image.jpg"
                                value={imageUrlInput}
                                onChange={e => setImageUrlInput(e.target.value)}
                                style={{ flex: 1, padding: "8px", border: "1px solid #ccc", borderRadius: "3px" }}
                            />
                            <button
                                type="button"
                                onClick={handleManualImageUrl}
                                style={{ background: "#555", color: "white", padding: "8px 12px", borderRadius: "3px" }}
                            >
                                Set
                            </button>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} style={{ flex: 1.5, minWidth: "300px" }}>
                    <div style={formGroupStyle}>
                        <label htmlFor="product_id">Product ID</label>
                        <input
                            type="text"
                            name="product_id"
                            id="product_id"
                            required
                            value={product.product_id}
                            onChange={handleChangeInput}
                            disabled={onEdit}
                            style={inputStyle}
                            placeholder="e.g. PRD-001"
                        />
                    </div>

                    <div style={formGroupStyle}>
                        <label htmlFor="title">Title</label>
                        <input
                            type="text"
                            name="title"
                            id="title"
                            required
                            value={product.title}
                            onChange={handleChangeInput}
                            style={inputStyle}
                            placeholder="Product Title"
                        />
                    </div>

                    <div style={formGroupStyle}>
                        <label htmlFor="price">Price ($)</label>
                        <input
                            type="number"
                            name="price"
                            id="price"
                            required
                            value={product.price}
                            onChange={handleChangeInput}
                            style={inputStyle}
                        />
                    </div>

                    <div style={formGroupStyle}>
                        <label htmlFor="description">Description</label>
                        <textarea
                            name="description"
                            id="description"
                            required
                            value={product.description}
                            rows="4"
                            onChange={handleChangeInput}
                            style={inputStyle}
                        />
                    </div>

                    <div style={formGroupStyle}>
                        <label htmlFor="content">Content Details</label>
                        <textarea
                            name="content"
                            id="content"
                            required
                            value={product.content}
                            rows="5"
                            onChange={handleChangeInput}
                            style={inputStyle}
                        />
                    </div>

                    <div style={formGroupStyle}>
                        <label htmlFor="categories">Category</label>
                        <select
                            name="category"
                            value={product.category}
                            onChange={handleChangeInput}
                            required
                            style={inputStyle}
                        >
                            <option value="">Please select a category</option>
                            {
                                categories.map(cat => (
                                    <option value={cat._id} key={cat._id}>
                                        {cat.name}
                                    </option>
                                ))
                            }
                        </select>
                    </div>

                    <button
                        type="submit"
                        style={{
                            width: "100%",
                            background: "#333",
                            color: "white",
                            padding: "12px",
                            textTransform: "uppercase",
                            letterSpacing: "2px",
                            marginTop: "15px",
                            borderRadius: "4px",
                            cursor: "pointer"
                        }}
                    >
                        {onEdit ? "Update Product" : "Create Product"}
                    </button>
                </form>
            </div>
        </div>
    );
};

const formGroupStyle = {
    marginBottom: "15px"
};

const inputStyle = {
    width: "100%",
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    outline: "none",
    boxSizing: "border-box",
    marginTop: "5px"
};

export default CreateProduct;

