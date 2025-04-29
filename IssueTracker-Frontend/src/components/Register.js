import React, { useState } from 'react';
import { register } from '../auth/authService';
import './Register.css';

function Register({ onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = e => {
        e.preventDefault();

        if (!username || !password) {
            setError('Missing Information.');
            return;
        }

        register(username, password);
        setMessage('Registration successful! Now you can log in.');
        onLogin({ username, password }); 
    };

    return (
        <div className="login-container">
            <h2>Register</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {message && <p style={{ color: 'green' }}>{message}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
                <button type="submit">Register</button>
            </form>
        </div>
    );
}

export default Register;
