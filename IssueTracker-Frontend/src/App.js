import React, { useState } from 'react';
import './App.css';
import Login from './components/Login';
import Register from './components/Register';
import TicketDetails from './components/TicketDetails';

function App() {
    const [user, setUser] = useState(null);
    const [view, setView] = useState('login'); // or 'register'

    const handleLogout = () => {
        setUser(null); 
        setView('login'); 
    };

    return (
        <div className="App">
            {!user ? (
                <>
                    {view === 'login' ? (
                        <>
                            <Login onLogin={setUser} />
                            <p>Don't have an account? <button className="small-button" onClick={() => setView('register')}>Register</button></p>
                        </>
                    ) : (
                        <>
                            <Register onLogin={setUser} />
                            <p>Already have an account? <button className="small-button" onClick={() => setView('login')}>Login</button></p>
                        </>
                    )}
                </>
            ) : (
                <>
                    <p>Welcome, {user.username}!</p>
                    <TicketDetails />
                    <button className="logout-button" onClick={handleLogout}>Logout</button>
                </>
            )}
        </div>
    );
}

export default App;
