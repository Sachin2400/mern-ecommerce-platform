import React from 'react';
import BtnRender from './BtnRender';

const ProductList = ({ product, isAdmin, deleteProduct, handleCheck }) => {
    const imageUrl = product.images?.url || (typeof product.images === 'string' ? product.images : 'https://via.placeholder.com/300x300?text=No+Image');

    return (
        <div className='product_card'>
            {
                isAdmin && (
                    <input
                        type='checkbox'
                        checked={product.checked || false}
                        onChange={() => handleCheck && handleCheck(product._id)}
                    />
                )
            }
            <img src={imageUrl} alt={product.title || 'Product'} />

            <div className='product_box'>
                <h2 title={product.title}>{product.title}</h2>
                <span>${product.price}</span>
                <p>{product.description}</p>
            </div>

            <BtnRender product={product} deleteProduct={deleteProduct} />
        </div>
    );
};

export default ProductList;
