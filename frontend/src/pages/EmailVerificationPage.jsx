import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import LoadingSpinner from '../Components/common/LoadingSpinner';
import Toast from '../Components/common/Toast';
import './EmailVerificationPage.css';

const EmailVerificationPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [verificationStatus, setVerificationStatus] = useState(null);
    const [message, setMessage] = useState('');
    const [showToast, setShowToast] = useState(false);

    const token = searchParams.get('token');

    useEffect(() => {
        if (token) {
            verifyEmail();
        } else {
            setVerificationStatus('error');
            setMessage('Token xác thực không hợp lệ');
        }
    }, [token]);

    const verifyEmail = async () => {
        setIsLoading(true);
        try {
            const response = await authService.verifyEmail(token);
            if (response.ok) {
                setVerificationStatus('success');
                setMessage('Xác thực email thành công! Bạn có thể đăng nhập ngay bây giờ.');
                setShowToast(true);
                // Chuyển hướng đến trang đăng nhập sau 3 giây
                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            } else {
                const errorData = await response.json();
                setVerificationStatus('error');
                setMessage(errorData.message || 'Xác thực email thất bại');
            }
        } catch (error) {
            console.error('Verification error:', error);
            setVerificationStatus('error');
            setMessage('Có lỗi xảy ra trong quá trình xác thực');
        } finally {
            setIsLoading(false);
        }
    };

    const [email, setEmail] = useState('');
    const [showResendForm, setShowResendForm] = useState(false);

    const resendVerification = async () => {
        if (!email) {
            setMessage('Vui lòng nhập email của bạn');
            setShowToast(true);
            return;
        }
        
        setIsLoading(true);
        try {
            // Gọi API gửi lại email xác thực
            const response = await authService.resendVerification(email);
            if (response.ok) {
                setMessage('Email xác thực đã được gửi lại. Vui lòng kiểm tra hộp thư của bạn.');
                setShowToast(true);
                setShowResendForm(false);
            } else {
                const errorData = await response.json();
                setMessage(errorData.message || 'Không thể gửi lại email xác thực');
                setShowToast(true);
            }
        } catch (error) {
            console.error('Resend error:', error);
            setMessage('Có lỗi xảy ra khi gửi lại email xác thực');
            setShowToast(true);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <LoadingSpinner />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-blue-100">
                        {verificationStatus === 'success' ? (
                            <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                        ) : verificationStatus === 'error' ? (
                            <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        )}
                    </div>
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                        {verificationStatus === 'success' ? 'Xác thực thành công!' : 
                         verificationStatus === 'error' ? 'Xác thực thất bại' : 'Xác thực email'}
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        {verificationStatus === 'success' ? 'Tài khoản của bạn đã được xác thực thành công' :
                         verificationStatus === 'error' ? 'Không thể xác thực tài khoản' : 'Đang xác thực tài khoản...'}
                    </p>
                </div>

                <div className="bg-white py-8 px-6 shadow rounded-lg">
                    {verificationStatus === 'success' ? (
                        <div className="text-center">
                            <p className="text-green-600 font-medium mb-4">
                                {message}
                            </p>
                            <p className="text-gray-500 text-sm mb-6">
                                Bạn sẽ được chuyển hướng đến trang đăng nhập trong vài giây...
                            </p>
                            <button
                                onClick={() => navigate('/login')}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Đăng nhập ngay
                            </button>
                        </div>
                    ) : verificationStatus === 'error' ? (
                        <div className="text-center">
                            <p className="text-red-600 font-medium mb-4">
                                {message}
                            </p>
                            <div className="space-y-3">
                                {!showResendForm ? (
                                    <button
                                        onClick={() => setShowResendForm(true)}
                                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >
                                        Gửi lại email xác thực
                                    </button>
                                ) : (
                                    <div className="space-y-3">
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="Nhập email của bạn"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                        <button
                                            onClick={resendVerification}
                                            disabled={isLoading}
                                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                                        >
                                            {isLoading ? 'Đang gửi...' : 'Gửi email xác thực'}
                                        </button>
                                        <button
                                            onClick={() => setShowResendForm(false)}
                                            className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                        >
                                            Hủy
                                        </button>
                                    </div>
                                )}
                                <button
                                    onClick={() => navigate('/login')}
                                    className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Quay lại đăng nhập
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center">
                            <p className="text-gray-600 mb-4">
                                Vui lòng chờ trong khi chúng tôi xác thực tài khoản của bạn...
                            </p>
                        </div>
                    )}
                </div>

                <div className="text-center">
                    <p className="text-xs text-gray-500">
                        Nếu bạn gặp vấn đề, vui lòng liên hệ hỗ trợ
                    </p>
                </div>
            </div>

            {showToast && (
                <Toast
                    message={message}
                    type={verificationStatus === 'success' ? 'success' : 'error'}
                    onClose={() => setShowToast(false)}
                />
            )}
        </div>
    );
};

export default EmailVerificationPage;
