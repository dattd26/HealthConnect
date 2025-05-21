import React, { createContext, useEffect, useState } from "react";
import { authService } from "../services/authService";
export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const validateToken = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const data = await authService.validate(token);
                    
                    setUser(data.userData);
                } catch (error) {
                    console.error("Lỗi xác thực token:", error);
                    logout();
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
        setUser(null);
    };

    const login = async (username, password) => {
        try {
            const data = await authService.login(username, password);
            
            const { token, user } = data;

            localStorage.setItem('token', token);
            setUser(user);
            console.log(user.role);
            console.log(localStorage.getItem('token'));
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
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};