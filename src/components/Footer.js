import React from 'react';
import { Link } from 'react-router-dom';
import "../styles.css"

export const Footer = () => {
    return (
        <div className="footer"> 
            <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                <h1>This is a footer.</h1>
            </Link>
        </div>
    )
}
