import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import getDefaultRoute from "../Components/common/getDefaultRoute"
import "../styles/LoginPage.css";

export const LoginPage = () => {
    const { login, user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [showRedirectMessage, setShowRedirectMessage] = useState(false);
    // const location = useLocation();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLogging, setIsLogging] = useState(false);
    useEffect(() => {
        if (user) {
            setShowRedirectMessage(true);
            const timer = setTimeout(() => {
                navigate(getDefaultRoute(user.role));
            }, 3000);

            // Cleanup timer nếu component unmount
            return () => clearTimeout(timer);
        }
    }, [user, navigate]);
    if (showRedirectMessage) {
        return (
            <div>
                <h2>Bạn đã đăng nhập!</h2>
                <p>Hệ thống sẽ tự động chuyển hướng sau 3 giây...</p>
                {/* Hoặc thêm nút "Chuyển hướng ngay" nếu muốn */}
                <button onClick={() => navigate(getDefaultRoute(user.role))}>
                    Chuyển hướng ngay
                </button>
            </div>
        );
    }
    const handleLogin = async (event) => {
        event.preventDefault();
        try {
            setIsLogging(true); 
            const userRole = await login(username, password);
            const from = getDefaultRoute(userRole.toLowerCase()); //location.state?.from?.pathname || 
            navigate(from, { replace: true });
        } catch (error) {
            console.error('Login failed:', error);
            setError('Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
        }
        finally {
            setIsLogging(false);
        }
    }

    return (
        <div className="login-container">
            <form onSubmit={handleLogin} className="login-form">
                <h2>Đăng nhập HealthConnect</h2>
                {error && <div className="error-message">{error}</div>}
                <div className="form-group">
                <label>Tên đăng nhập</label>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                </div>
                <div className="form-group">
                <label>Mật khẩu</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                </div>
                <button type="submit" className="login-button" disabled={isLogging}>
                    {isLogging ? "Đang đăng nhập..." : "Đăng nhập"}
                </button>
                <p className="register-link">
                Chưa có tài khoản? <a href="/register">Đăng ký ngay</a>
                </p>
            </form>
        </div>
    );
}