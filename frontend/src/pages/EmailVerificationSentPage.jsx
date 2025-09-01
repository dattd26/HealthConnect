import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import LoadingSpinner from '../Components/common/LoadingSpinner';
import Toast from '../Components/common/Toast';

const EmailVerificationSentPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [showToast, setShowToast] = useState(false);
    
    // Lấy email từ state navigation hoặc query params
    const email = location.state?.email || new URLSearchParams(location.search).get('email');

    const resendVerification = async () => {
        if (!email) {
            setMessage('Không tìm thấy email để gửi lại');
            setShowToast(true);
            return;
        }
        
        setIsLoading(true);
        try {
            const response = await authService.resendVerification(email);
            if (response.ok) {
                setMessage('Email xác thực đã được gửi lại. Vui lòng kiểm tra hộp thư của bạn.');
                setShowToast(true);
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

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-blue-100">
                        <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                        Kiểm tra email của bạn
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Chúng tôi đã gửi link xác thực đến email của bạn
                    </p>
                </div>

                <div className="bg-white py-8 px-6 shadow rounded-lg">
                    <div className="text-center">
                        <p className="text-gray-600 mb-4">
                            Vui lòng kiểm tra hộp thư của bạn và nhấp vào link xác thực để hoàn tất quá trình đăng ký.
                        </p>
                        
                        {email && (
                            <p className="text-sm text-gray-500 mb-6">
                                Email: <span className="font-medium text-gray-700">{email}</span>
                            </p>
                        )}
                        
                        <div className="space-y-3">
                            <button
                                onClick={resendVerification}
                                disabled={isLoading}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                            >
                                {isLoading ? <LoadingSpinner /> : 'Gửi lại email xác thực'}
                            </button>
                            
                            <button
                                onClick={() => navigate('/login')}
                                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Quay lại đăng nhập
                            </button>
                        </div>
                    </div>
                </div>

                <div className="text-center">
                    <p className="text-xs text-gray-500">
                        Không nhận được email? Kiểm tra thư mục spam hoặc liên hệ hỗ trợ
                    </p>
                </div>
            </div>

            {showToast && (
                <Toast
                    message={message}
                    type="info"
                    onClose={() => setShowToast(false)}
                />
            )}
        </div>
    );
};

export default EmailVerificationSentPage;
