import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div style={{ textAlign: "center", padding: "100px 20px" }}>
            <h1 style={{ fontSize: "6rem", fontWeight: "900", color: "#333", margin: "0" }}>404</h1>
            <h2 style={{ fontSize: "2rem", color: "#666", marginBottom: "20px" }}>Page Not Found</h2>
            <p style={{ color: "#888", marginBottom: "30px", maxWidth: "500px", margin: "0 auto 30px" }}>
                Sorry, the page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
            </p>
            <Link
                to="/"
                style={{
                    background: "#333",
                    color: "white",
                    padding: "12px 30px",
                    borderRadius: "4px",
                    textTransform: "uppercase",
                    letterSpacing: "1.5px",
                    textDecoration: "none"
                }}
            >
                Back to Homepage
            </Link>
        </div>
    );
};

export default NotFound;

