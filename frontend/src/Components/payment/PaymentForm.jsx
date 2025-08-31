import React, { useState } from 'react';
import { paymentService } from '../../services/paymentService';
import './PaymentForm.css';

const PaymentForm = ({ appointment, onPaymentSuccess, onPaymentCancel }) => {
  const [paymentMethod, setPaymentMethod] = useState('VNPAY');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePayment = async () => {
    if (!appointment) {
      setError('Không có thông tin lịch hẹn');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      if (paymentMethod === 'VNPAY') {
        // Sử dụng API mới của backend
        const appointmentId = appointment.appointmentId || appointment.id;
        const returnUrl = `${window.location.origin}/payment-success`;
        const cancelUrl = `${window.location.origin}/payment-cancel`;
        
        const response = await fetch(`http://localhost:8080/api/payments/vnpay/appointment/${appointmentId}?returnUrl=${encodeURIComponent(returnUrl)}&cancelUrl=${encodeURIComponent(cancelUrl)}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Không thể tạo thanh toán VNPay');
        }

        const paymentResponse = await response.json();
        
        if (paymentResponse.status === 'SUCCESS' && paymentResponse.paymentUrl) {
          // Redirect to VNPay payment page
          window.location.href = paymentResponse.paymentUrl;
        } else {
          setError(paymentResponse.message || 'Không thể tạo thanh toán VNPay');
        }
      } else if (paymentMethod === 'CASH') {
        // Handle cash payment using new API
        const appointmentId = appointment.appointmentId || appointment.id;
        const response = await fetch(`http://localhost:8080/api/payments/appointment/${appointmentId}/create?method=CASH`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Không thể tạo thanh toán tiền mặt');
        }

        const payment = await response.json();
        onPaymentSuccess(payment);
      } else if (paymentMethod === 'BANK_TRANSFER') {
        // Handle bank transfer using new API
        const appointmentId = appointment.appointmentId || appointment.id;
        const response = await fetch(`http://localhost:8080/api/payments/appointment/${appointmentId}/create?method=BANK_TRANSFER`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Không thể tạo thanh toán chuyển khoản');
        }

        const payment = await response.json();
        onPaymentSuccess(payment);
      }
    } catch (error) {
      console.error('Payment error:', error);
      setError('Có lỗi xảy ra khi xử lý thanh toán. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount || 500000);
  };

  return (
    <div className="payment-form">
      <div className="payment-header">
        <div className="header-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="5" width="20" height="14" rx="2" ry="2" stroke="#3b82f6" strokeWidth="2" fill="#dbeafe"/>
            <line x1="2" y1="10" x2="22" y2="10" stroke="#3b82f6" strokeWidth="2"/>
          </svg>
        </div>
        <h3>Chọn phương thức thanh toán</h3>
        <p>Vui lòng chọn phương thức thanh toán phù hợp với bạn</p>
      </div>

      <div className="appointment-summary">
        <div className="summary-header">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 12L11 14L15 10" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#10b981" strokeWidth="2" fill="#ecfdf5"/>
          </svg>
          <h4>Thông tin lịch hẹn</h4>
        </div>
        <div className="summary-content">
          <div className="summary-item">
            <div className="item-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 12H15M9 16H15M17 21H7C5.89543 21 5 20.1046 5 19V5C5 3.89543 5.89543 3 7 3H12.5858C12.851 3 13.1054 3.10536 13.2929 3.29289L19.7071 9.70711C19.8946 9.89464 20 10.149 20 10.4142V19C20 20.1046 19.1046 21 18 21H17Z" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="label">Mã lịch hẹn:</span>
            <span className="value">#{appointment?.id || appointment?.appointmentId || 'N/A'}</span>
          </div>
          <div className="summary-item">
            <div className="item-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="#6b7280" strokeWidth="2"/>
                <path d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z" stroke="#6b7280" strokeWidth="2"/>
              </svg>
            </div>
            <span className="label">Bác sĩ:</span>
            <span className="value">{appointment?.doctor?.name || appointment?.doctorName || 'N/A'}</span>
          </div>
          <div className="summary-item">
            <div className="item-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 14C19 16.7614 16.7614 19 14 19H10C7.23858 19 5 16.7614 5 14V10C5 7.23858 7.23858 5 10 5H14C16.7614 5 19 7.23858 19 10V14Z" stroke="#6b7280" strokeWidth="2"/>
                <path d="M12 9L15 12L12 15" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 12H15" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="label">Chuyên khoa:</span>
            <span className="value">{appointment?.doctor?.specialty || appointment?.specialty || 'N/A'}</span>
          </div>
          <div className="summary-item">
            <div className="item-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="#6b7280" strokeWidth="2"/>
                <line x1="16" y1="2" x2="16" y2="6" stroke="#6b7280" strokeWidth="2" strokeLinecap="round"/>
                <line x1="8" y1="2" x2="8" y2="6" stroke="#6b7280" strokeWidth="2" strokeLinecap="round"/>
                <line x1="3" y1="10" x2="21" y2="10" stroke="#6b7280" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="label">Ngày khám:</span>
            <span className="value">
              {appointment?.date ? 
                new Date(appointment.date).toLocaleDateString('vi-VN') : 
                appointment?.doctorSlot?.startTime ? 
                  new Date(appointment.doctorSlot.startTime).toLocaleDateString('vi-VN') : 
                  'N/A'
              }
            </span>
          </div>
          <div className="summary-item">
            <div className="item-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="#6b7280" strokeWidth="2"/>
                <polyline points="12,6 12,12 16,14" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="label">Giờ khám:</span>
            <span className="value">{appointment?.time || 'N/A'}</span>
          </div>
          <div className="summary-item">
            <div className="item-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="label">Hình thức:</span>
            <span className="value">
              online
            </span>
          </div>
          <div className="summary-item total">
            <div className="item-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 1V23" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6313 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3687 16.9749 13.0251C17.6313 13.6815 18 14.5717 18 15.5C18 16.4283 17.6313 17.3185 16.9749 17.9749C16.3185 18.6313 15.4283 19 14.5 19H6" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="label">Tổng tiền:</span>
            <span className="value">{formatCurrency(200000)}</span>
          </div>
        </div>
      </div>

      <div className="payment-methods">
        <div className="methods-header">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 17L12 22L22 17" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 12L12 17L22 12" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <h4>Phương thức thanh toán</h4>
        </div>
        
        <div className="method-option">
          <input
            type="radio"
            id="vnpay"
            name="paymentMethod"
            value="VNPAY"
            checked={paymentMethod === 'VNPAY'}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          <label htmlFor="vnpay">
            <div className="method-info">
              <div className="method-name">VNPay</div>
              <div className="method-description">Thanh toán trực tuyến an toàn qua VNPay</div>
            </div>
            <div className="method-icon">
              
            {/* <div style={{ backgroundColor: 'white', width: '24px', height: '24px', display: 'inline-block' }}> */}
              <img src="https://cdn.brandfetch.io/idV02t6WJs/theme/dark/logo.svg?c=1bxid64Mup7aczewSAYMX&t=1750645747861" width="24" height="24" alt="Logo" />
            {/* </div> */}

            </div>
          </label>
        </div>

        {/* <div className="method-option">
          <input
            type="radio"
            id="cash"
            name="paymentMethod"
            value="CASH"
            checked={paymentMethod === 'CASH'}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          <label htmlFor="cash">
            <div className="method-info">
              <div className="method-name">Tiền mặt</div>
              <div className="method-description">Thanh toán tại phòng khám khi đến hẹn</div>
            </div>
            <div className="method-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17 9V7A1 1 0 0 0 16 6H3A1 1 0 0 0 2 7V17A1 1 0 0 0 3 18H16A1 1 0 0 0 17 17V15" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M22 12H18M18 12L20 10M18 12L20 14" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M7 10H13" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M7 14H11" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </label>
        </div>

        <div className="method-option">
          <input
            type="radio"
            id="bank"
            name="paymentMethod"
            value="BANK_TRANSFER"
            checked={paymentMethod === 'BANK_TRANSFER'}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          <label htmlFor="bank">
            <div className="method-info">
              <div className="method-name">Chuyển khoản</div>
              <div className="method-description">Chuyển khoản ngân hàng trước ngày khám</div>
            </div>
            <div className="method-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 10H21L19 12H5L3 10Z" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 14H21L19 16H5L3 14Z" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M7 6H17" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M7 18H17" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 6V18" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </label>
        </div> */}
      </div>

      {error && (
        <div className="error-message">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="#ef4444" strokeWidth="2" fill="#fef2f2"/>
            <path d="M15 9L9 15M9 9L15 15" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {error}
        </div>
      )}

      <div className="payment-actions">
        <button
          type="button"
          className="btn-cancel"
          onClick={onPaymentCancel}
          disabled={isLoading}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Hủy
        </button>
        <button
          type="button"
          className={`btn-pay ${isLoading ? 'loading' : ''}`}
          onClick={handlePayment}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <div className="spinner"></div>
              Đang xử lý...
            </>
          ) : (
            <>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Thanh toán ngay
            </>
          )}
        </button>
      </div>

      {paymentMethod === 'VNPAY' && (
        <div className="vnpay-info">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#3b82f6" strokeWidth="2" fill="#dbeafe"/>
            <path d="M12 16V12" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 8H12.01" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <p>Bạn sẽ được chuyển hướng đến trang thanh toán VNPay để hoàn tất giao dịch một cách an toàn.</p>
        </div>
      )}
    </div>
  );
};

export default PaymentForm;
