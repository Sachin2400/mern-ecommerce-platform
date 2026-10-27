import React, { useContext, useState } from 'react';
import { MdOutlineMenu, MdClose, MdOutlineAddShoppingCart } from "react-icons/md";
import { Link } from 'react-router-dom';
import { GlobalState } from '../../GlobalState';
import axios from 'axios';

const Header = () => {
    const state = useContext(GlobalState);
    const [isLogged, setIsLogged] = state.userAPI.isLogged;
    const [isAdmin, setIsAdmin] = state.userAPI.isAdmin;
    const [cart] = state.userAPI.cart;
    const [menu, setMenu] = useState(false);

    const logoutUser = async () => {
        try {
            await axios.get('/user/logout');
            localStorage.clear();
            setIsAdmin(false);
            setIsLogged(false);
            window.location.href = "/";
        } catch (err) {
            console.error("Logout error:", err);
        }
    };

    const adminRouter = () => {
        return (
            <>
                <li><Link to='/create_product' onClick={() => setMenu(false)}>Create Product</Link></li>
                <li><Link to='/category' onClick={() => setMenu(false)}>Categories</Link></li>
            </>
        );
    };

    const loggedRouter = () => {
        return (
            <>
                <li><Link to='/history' onClick={() => setMenu(false)}>History</Link></li>
                <li><Link to='/' onClick={() => { logoutUser(); setMenu(false); }}>Logout</Link></li>
            </>
        );
    };

    const styleMenu = {
        left: menu ? 0 : "-100%"
    };

    return (
        <header>
            <div className='menu' onClick={() => setMenu(!menu)}>
                <MdOutlineMenu size={30} />
            </div>

            <div className='logo'>
                <h1>
                    <Link to="/">{isAdmin ? 'Admin Portal' : 'NovaMart Shop'}</Link>
                </h1>
            </div>

            <ul style={styleMenu}>
                <li><Link to="/" onClick={() => setMenu(false)}>{isAdmin ? 'Products' : 'Shop'}</Link></li>

                {isAdmin && adminRouter()}

                {
                    isLogged ? loggedRouter() : <li><Link to="/login" onClick={() => setMenu(false)}>Login / Register</Link></li>
                }

                <li onClick={() => setMenu(false)}>
                    <MdClose size={30} className='menu' />
                </li>
            </ul>

            {
                isAdmin ? '' : (
                    <div className='cart-icon'>
                        <span>{cart.length}</span>
                        <Link to='/cart'><MdOutlineAddShoppingCart size={30} /></Link>
                    </div>
                )
            }
        </header>
    );
};

export default Header;
