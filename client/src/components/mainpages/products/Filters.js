import React, { useContext } from 'react';
import { GlobalState } from '../../../GlobalState';

const Filters = () => {
    const state = useContext(GlobalState);
    const [categories] = state.categoriesAPI.categories;
    const [category, setCategory] = state.productsAPI.category;
    const [sort, setSort] = state.productsAPI.sort;
    const [search, setSearch] = state.productsAPI.search;

    const handleCategory = e => {
        setCategory(e.target.value);
        setSearch('');
    };

    return (
        <div className="filter_menu">
            <div className="row">
                <span>Filters: </span>
                <select name="category" value={category} onChange={handleCategory}>
                    <option value="">All Products</option>
                    {
                        categories.map(cat => (
                            <option value={`category=${cat._id}`} key={cat._id}>
                                {cat.name}
                            </option>
                        ))
                    }
                </select>
            </div>

            <input
                type="text"
                value={search}
                placeholder="Search products by title..."
                onChange={e => setSearch(e.target.value.toLowerCase())}
            />

            <div className="row sort">
                <span>Sort By: </span>
                <select value={sort} onChange={e => setSort(e.target.value)}>
                    <option value="">Newest</option>
                    <option value="sort=oldest">Oldest</option>
                    <option value="sort=-sold">Best Sales</option>
                    <option value="sort=-price">Price: High-Low</option>
                    <option value="sort=price">Price: Low-High</option>
                </select>
            </div>
        </div>
    );
};

export default Filters;

