import { useState, useEffect } from 'react';
import axios from 'axios';

const CategoriesAPI = () => {
    const [categories, setCategories] = useState([]);
    const [callback, setCallback] = useState(false);

    useEffect(() => {
        const getCategories = async () => {
            try {
                const res = await axios.get('/api/category');
                setCategories(res.data);
            } catch (err) {
                console.error("Error fetching categories:", err.response?.data?.msg || err.message);
            }
        };

        getCategories();
    }, [callback]);

    return {
        categories: [categories, setCategories],
        callback: [callback, setCallback]
    };
};

export default CategoriesAPI;

