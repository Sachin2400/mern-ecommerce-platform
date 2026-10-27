import { useEffect, useState } from 'react';
import axios from 'axios';

const UserAPI = (token) => {
    const [isLogged, setIsLogged] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [cart, setCart] = useState([]);
    const [history, setHistory] = useState([]);

    useEffect(() => {
        if (token) {
            const getUser = async () => {
                try {
                    const res = await axios.get('/user/infor', {
                        headers: { Authorization: token }
                    });

                    setIsLogged(true);
                    res.data.role === 1 ? setIsAdmin(true) : setIsAdmin(false);
                    setCart(res.data.cart || []);
                } catch (err) {
                    console.error("User infor error:", err.response?.data?.msg || err.message);
                }
            };

            getUser();
        }
    }, [token]);

    const addCart = async (product) => {
        if (!isLogged) return alert("Please log in first to continue shopping.");

        const check = cart.every(item => item._id !== product._id);

        if (check) {
            const newCart = [...cart, { ...product, quantity: 1 }];
            setCart(newCart);

            await axios.patch('/user/addcart', { cart: newCart }, {
                headers: { Authorization: token }
            });
            alert("Product added to cart!");
        } else {
            alert("This product is already in your cart.");
        }
    };

    return {
        isLogged: [isLogged, setIsLogged],
        isAdmin: [isAdmin, setIsAdmin],
        cart: [cart, setCart],
        addCart: addCart,
        history: [history, setHistory]
    };
};

export default UserAPI;
