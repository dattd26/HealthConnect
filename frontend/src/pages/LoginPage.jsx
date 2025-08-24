import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import getDefaultRoute from "../Components/common/getDefaultRoute";
import { Heart, Lock, User, Eye, EyeOff } from "lucide-react";

export const LoginPage = () => {
    const { login, user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [showRedirectMessage, setShowRedirectMessage] = useState(false);
    // const location = useLocation();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLogging, setIsLogging] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
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
            <div className="min-h-screen flex items-center justify-center" style={{background: 'linear-gradient(135deg, var(--primary-50) 0%, var(--secondary-50) 100%)'}}>
                <div className="card p-6 text-center max-w-md w-full mx-4 fade-in">
                    <div className="mb-4">
                        <Heart className="w-16 h-16 mx-auto text-success-500 mb-4" />
                        <h2 className="text-2xl font-bold text-primary mb-2">Đăng nhập thành công!</h2>
                        <p className="text-secondary mb-4">Hệ thống sẽ tự động chuyển hướng sau 3 giây...</p>
                    </div>
                    <button 
                        onClick={() => navigate(getDefaultRoute(user.role))}
                        className="button button-primary w-full"
                    >
                        Chuyển hướng ngay
                    </button>
                </div>
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
        <div className="min-h-screen flex items-center justify-center p-4" style={{background: 'linear-gradient(135deg, var(--primary-50) 0%, var(--secondary-50) 100%)'}}>
            <div className="card max-w-md w-full p-8 fade-in">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                        <Heart className="w-8 h-8 text-primary-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-primary mb-2">HealthConnect</h1>
                    <p className="text-secondary">Đăng nhập vào tài khoản của bạn</p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="error-message mb-4 p-3 bg-error-50 border border-error-200 rounded-lg">
                        {error}
                    </div>
                )}

                {/* Login Form */}
                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="form-group">
                        <label className="form-label">
                            <User className="w-4 h-4 inline mr-2" />
                            Tên đăng nhập
                        </label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="input"
                            placeholder="Nhập tên đăng nhập"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">
                            <Lock className="w-4 h-4 inline mr-2" />
                            Mật khẩu
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input pr-10"
                                placeholder="Nhập mật khẩu"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        className="button button-primary w-full py-3"
                        disabled={isLogging}
                    >
                        {isLogging ? (
                            <div className="flex items-center justify-center">
                                <div className="loading-spinner w-4 h-4 mr-2"></div>
                                Đang đăng nhập...
                            </div>
                        ) : (
                            "Đăng nhập"
                        )}
                    </button>

                    <div className="text-center pt-4 border-t border-gray-200">
                        <p className="text-secondary">
                            Chưa có tài khoản? {' '}
                            <a 
                                href="/register" 
                                className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
                            >
                                Đăng ký ngay
                            </a>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}