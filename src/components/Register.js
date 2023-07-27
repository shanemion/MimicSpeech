import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../services/firebase/FirebaseAuth';

const Register = () => {
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        const { email, password } = event.target.elements;
        try {
            await register(email.value, password.value);
            navigate('/');
        } catch (error) {
            alert(error);
        }
    };

    return (
        <div>
            <h1>Register</h1>
            <form onSubmit={handleSubmit}>
                <label>Email
                    <input name="email" type="email" placeholder="Email" required />
                </label>
                <label>Password
                    <input name="password" type="password" placeholder="Password" required />
                </label>
                <button type="submit">Register</button>
            </form>
        </div>
    );
}

export default Register;