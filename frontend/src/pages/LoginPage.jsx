import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import getDefaultRoute from "../Components/common/getDefaultRoute"
import "../styles/LoginPage.css";

export const LoginPage = () => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    
    const handleLogin = async (event) => {
        event.preventDefault();
        try {
            const userRole = await login(username, password);
            const from = getDefaultRoute(userRole.toLowerCase()); //location.state?.from?.pathname || 
            navigate(from, { replace: true });
        } catch (error) {
            console.error('Login failed:', error);
            setError('Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
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
                <button type="submit" className="login-button">Đăng nhập</button>
                <p className="register-link">
                Chưa có tài khoản? <a href="/register">Đăng ký ngay</a>
                </p>
            </form>
        </div>
    );
}