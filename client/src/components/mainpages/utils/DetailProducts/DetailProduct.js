import React, { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { GlobalState } from '../../../../GlobalState';
import ProductList from '../ProductLists/ProductList';

const DetailProduct = () => {
    const params = useParams();
    const state = useContext(GlobalState);
    const [products] = state.productsAPI.products;
    const addCart = state.userAPI.addCart;
    const [detailProduct, setDetailProduct] = useState(null);

    useEffect(() => {
        if (params.id) {
            const foundProduct = products.find(product => product._id === params.id);
            if (foundProduct) {
                setDetailProduct(foundProduct);
            }
        }
    }, [params.id, products]);

    if (!detailProduct) return <h2 style={{ textAlign: "center", margin: "50px 0" }}>Loading Product Details...</h2>;

    const imageUrl = detailProduct.images?.url || (typeof detailProduct.images === 'string' ? detailProduct.images : 'https://via.placeholder.com/400x400?text=No+Image');

    return (
        <>
            <div className='detail'>
                <img src={imageUrl} alt={detailProduct.title} />
                <div className='box-detail'>
                    <div className='row'>
                        <h2>{detailProduct.title}</h2>
                        <h6>ID: {detailProduct.product_id}</h6>
                    </div>
                    <span>${detailProduct.price}</span>
                    <p><strong>Description:</strong> {detailProduct.description}</p>
                    <p><strong>Details:</strong> {detailProduct.content}</p>
                    <p><strong>Sold:</strong> {detailProduct.sold || 0} units</p>
                    <Link to='#!' className='cart' onClick={() => addCart(detailProduct)}>
                        Add to Cart
                    </Link>
                </div>
            </div>

            <div style={{ marginTop: "40px" }}>
                <h2 style={{ textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "20px" }}>Related Products</h2>
                <div className="products">
                    {
                        products
                            .filter(product => product.category === detailProduct.category && product._id !== detailProduct._id)
                            .slice(0, 4)
                            .map(product => (
                                <ProductList key={product._id} product={product} />
                            ))
                    }
                </div>
            </div>
        </>
    );
};

export default DetailProduct;
