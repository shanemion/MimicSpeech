import React from 'react';
import { Link } from 'react-router-dom';

export const Title = () => {
    return (
        <div>
            <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                <h1>MimicSpeech</h1>
            </Link>
        </div>
    )
}
