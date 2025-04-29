import React, { useState } from 'react';
import { register } from '../auth/authService';
import './Register.css';

function Register({ onLogin }) {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = e => {
        e.preventDefault();
    
        if (!username || !password || !email) {
            setMessage('All fields are required.');
            return;
        }
    
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setMessage('Please enter a valid email address.');
            return;
        }
    
        const success = register(username, password, email);
        if (success) {
            onLogin({ username }); // auto-login after register
        } else {
            setMessage('Username or email already exists.');
        }
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
  required
/>
<input
  type="email"
  placeholder="Email"
  value={email}
  onChange={e => setEmail(e.target.value)}
  required
/>
<input
  type="password"
  placeholder="Password"
  value={password}
  onChange={e => setPassword(e.target.value)}
  required
/>

                <button type="submit">Register</button>
            </form>
        </div>
    );
}

export default Register;
