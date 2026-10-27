import React, { useContext, useState } from 'react';
import axios from 'axios';
import { GlobalState } from '../../../GlobalState';
import ProductList from '../utils/ProductLists/ProductList';
import Filters from './Filters';
import LoadMore from './LoadMore';

const Product = () => {
    const state = useContext(GlobalState);
    const [products, setProducts] = state.productsAPI.products;
    const [isAdmin] = state.userAPI.isAdmin;
    const [token] = state.token;
    const [callback, setCallback] = state.productsAPI.callback;
    const [loading, setLoading] = useState(false);
    const [isCheck, setIsCheck] = useState(false);

    const handleCheck = (id) => {
        products.forEach(product => {
            if (product._id === id) product.checked = !product.checked;
        });
        setProducts([...products]);
    };

    const deleteProduct = async (id, public_id) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;

        try {
            setLoading(true);
            if (public_id) {
                await axios.post('/api/destroy', { public_id }, {
                    headers: { Authorization: token }
                });
            }

            await axios.delete(`/api/products/${id}`, {
                headers: { Authorization: token }
            });

            setCallback(!callback);
            setLoading(false);
            alert("Product deleted successfully.");
        } catch (err) {
            setLoading(false);
            alert(err.response?.data?.msg || err.message);
        }
    };

    const checkAll = () => {
        products.forEach(product => {
            product.checked = !isCheck;
        });
        setProducts([...products]);
        setIsCheck(!isCheck);
    };

    const deleteAll = () => {
        products.forEach(product => {
            if (product.checked) deleteProduct(product._id, product.images?.public_id);
        });
    };

    return (
        <>
            <Filters />

            {
                isAdmin && (
                    <div className="delete-all" style={{ textAlign: "right", margin: "10px 0" }}>
                        <span style={{ textTransform: "uppercase", letterSpacing: "1.3px", marginRight: "5px" }}>Select all</span>
                        <input type="checkbox" checked={isCheck} onChange={checkAll} style={{ marginRight: "15px" }} />
                        <button
                            onClick={deleteAll}
                            style={{
                                border: "1px solid crimson",
                                padding: "6px 15px",
                                color: "crimson",
                                textTransform: "uppercase",
                                borderRadius: "3px"
                            }}
                        >
                            Delete Selected
                        </button>
                    </div>
                )
            }

            {loading && <h3 style={{ textAlign: "center", margin: "20px 0" }}>Processing...</h3>}

            <div className='products'>
                {
                    products.length === 0 ? (
                        <h2 style={{ gridColumn: "1 / -1", textAlign: "center", margin: "40px 0", color: "#666" }}>
                            No products found matching your criteria.
                        </h2>
                    ) : (
                        products.map(product => {
                            return (
                                <ProductList
                                    key={product._id}
                                    product={product}
                                    isAdmin={isAdmin}
                                    deleteProduct={deleteProduct}
                                    handleCheck={handleCheck}
                                />
                            );
                        })
                    )
                }
            </div>

            <LoadMore />
        </>
    );
};

export default Product;
