import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Create a cancellation token
        const cancelToken = axios.CancelToken.source();

        const validateToken = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    // Using axios instead of fetch for consistency and to utilize cancelToken
                    const response = await axios.post(
                        "http://localhost:8080/api/auth/validate",
                        { token },
                        {
                            headers: { "Content-Type": "application/json" },
                            cancelToken: cancelToken.token
                        }
                    );
                    
                    setUser(response.data.user);
                } catch (error) {
                    if (!axios.isCancel(error)) {
                        console.error("Lỗi xác thực token:", error);
                        logout();
                    }
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };

        validateToken();

        // Cleanup function
        return () => {
            cancelToken.cancel("Component unmounted");
        };
    }, []);

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };

    const login = async (username, password) => {
        try {
            const response = await axios.post('http://localhost:8080/api/auth/login', {
                username,
                password
            });
            
            const { token, user } = response.data;

            localStorage.setItem('token', token);
            setUser(user);

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