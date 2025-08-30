import React, { createContext, useEffect, useState, useContext } from "react";
import { authService } from "../services/authService";
export const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(() => {

        return localStorage.getItem('token');
    });
    
    useEffect(() => {
        const validateToken = async () => {
            const storedToken = localStorage.getItem('token');
            if (storedToken) {
                try {
                    const data = await authService.validate(storedToken);
                    
                    const finalToken = data.token || storedToken;
                    
                    setUser(data.userData);
                    setToken(finalToken);
                    

                    if (data.token && data.token !== storedToken) {
                        localStorage.setItem('token', data.token);
                    }
                } catch (error) {
                    console.error("Lỗi xác thực token:", error);

                    setToken(storedToken);
                    setLoading(false);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };

        validateToken();
    }, []);

    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
    };

    const login = async (username, password) => {
        try {
            const data = await authService.login(username, password);
            
            const { token, user } = data;

            localStorage.setItem('token', token);
            setUser(user);
            setToken(token);
            localStorage.setItem('role', user.role);
            return user.role;
        } catch (error) {
            throw new Error('Login failed');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3498db]"></div>
            </div>
        );
    }

    return (
        <AuthContext.Provider value={{ user, setUser, login, logout, loading, token }}>
            {children}
        </AuthContext.Provider>
    );
};