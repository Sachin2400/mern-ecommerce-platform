import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
import ProductAPI from "./api/ProductAPI";
import UserAPI from "./api/UserAPI";
import CategoriesAPI from "./api/CategoriesAPI";

export const GlobalState = createContext();

export const DataProvider = ({ children }) => {
    const [token, setToken] = useState(false);

    const refreshToken = async () => {
        try {
            const res = await axios.get('/user/refresh_token');
            setToken(res.data.accesstoken);

            setTimeout(() => {
                refreshToken();
            }, 10 * 60 * 1000); // 10 minutes
        } catch (err) {
            // First time or expired cookie
            localStorage.removeItem('firstLogin');
        }
    };

    useEffect(() => {
        const firstLogin = localStorage.getItem('firstLogin');
        if (firstLogin) refreshToken();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const state = {
        token: [token, setToken],
        productsAPI: ProductAPI(),
        userAPI: UserAPI(token),
        categoriesAPI: CategoriesAPI()
    };

    return (
        <GlobalState.Provider value={state}>
            {children}
        </GlobalState.Provider>
    );
};
