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
        <h3>Chọn phương thức thanh toán</h3>
        <p>Vui lòng chọn phương thức thanh toán phù hợp với bạn</p>
      </div>

      <div className="appointment-summary">
        <h4>Thông tin lịch hẹn</h4>
        <div className="summary-item">
          <span className="label">Mã lịch hẹn:</span>
          <span className="value">#{appointment?.id || appointment?.appointmentId || 'N/A'}</span>
        </div>
        <div className="summary-item">
          <span className="label">Bác sĩ:</span>
          <span className="value">{appointment?.doctor?.name || appointment?.doctorName || 'N/A'}</span>
        </div>
        <div className="summary-item">
          <span className="label">Chuyên khoa:</span>
          <span className="value">{appointment?.doctor?.specialty || appointment?.specialty || 'N/A'}</span>
        </div>
        <div className="summary-item">
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
          <span className="label">Giờ khám:</span>
          <span className="value">{appointment?.startTime || 'N/A'}</span>
        </div>
        <div className="summary-item">
          <span className="label">Hình thức:</span>
          <span className="value">
            {appointment?.consultationType === 'online' ? 'Khám online' : 
             appointment?.consultationType === 'inperson' ? 'Khám trực tiếp' : 'N/A'}
          </span>
        </div>
        <div className="summary-item total">
          <span className="label">Tổng tiền:</span>
          <span className="value">{formatCurrency(appointment?.amount)}</span>
        </div>
      </div>

      <div className="payment-methods">
        <h4>Phương thức thanh toán</h4>
        
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
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </label>
        </div>

        <div className="method-option">
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
                <path d="M17 9V7A1 1 0 0 0 16 6H3A1 1 0 0 0 2 7V17A1 1 0 0 0 3 18H16A1 1 0 0 0 17 17V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M22 12H18M18 12L20 10M18 12L20 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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
                <path d="M3 10H21L19 12H5L3 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 14H21L19 16H5L3 14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M7 6H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M7 18H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </label>
        </div>
      </div>

      {error && (
        <div className="error-message">
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
          Hủy
        </button>
        <button
          type="button"
          className={`btn-pay ${isLoading ? 'loading' : ''}`}
          onClick={handlePayment}
          disabled={isLoading}
        >
          {isLoading ? 'Đang xử lý...' : 'Thanh toán ngay'}
        </button>
      </div>

      {paymentMethod === 'VNPAY' && (
        <div className="vnpay-info">
          <p>Bạn sẽ được chuyển hướng đến trang thanh toán VNPay để hoàn tất giao dịch một cách an toàn.</p>
        </div>
      )}
    </div>
  );
};

export default PaymentForm;
