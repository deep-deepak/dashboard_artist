// AuthContext.js
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userData = localStorage.getItem('userData');
        if (userData) setUser(JSON.parse(userData));
    }, []);

    const login = (email, password) => {
        if (email === 'admin@example.com' && password === 'admin123') {
            const userData = { email, role: 'admin', isLoggedIn: true };
            localStorage.setItem('userData', JSON.stringify(userData));
            setUser(userData);
            return true;
        }
        return false;
    };

    const logout = () => {
        localStorage.removeItem('userData');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);