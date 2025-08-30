import React, { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { paymentService } from '../services/paymentService';
import { appointmentService } from '../services/appointmentService';
import './PaymentSuccessPage.css';

/* ====== Minimal SVG icons (no deps) ====== */
const IconCheckRing = (props) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
    <path d="M9 12l2 2 4-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.8"/>
  </svg>
);
const IconLayers = (props) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
    <path d="M12 3L3 8l9 5 9-5-9-5zM3 16l9 5 9-5M3 12l9 5 9-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IconHome = (props) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
    <path d="M3 10.5L12 3l9 7.5V20a1.5 1.5 0 0 1-1.5 1.5H4.5A1.5 1.5 0 0 1 3 20v-9.5z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 21v-6h6v6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IconCalendar = (props) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
    <rect x="3" y="5" width="18" height="16" rx="2" fill="none" stroke="currentColor" strokeWidth="1.6"/>
    <path d="M16 3v4M8 3v4M3 9h18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
  </svg>
);
const IconPhone = (props) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
    <path d="M22 16.92v2a2 2 0 0 1-2.18 2A19.8 19.8 0 0 1 3.08 4.18 2 2 0 0 1 5.06 2h2a2 2 0 0 1 2 1.72c.12.89.33 1.76.62 2.6a2 2 0 0 1-.45 2.11L7.1 9.91a16 16 0 0 0 6 6l1.48-1.13a2 2 0 0 1 2.11-.45c.84.29 1.71.5 2.6.62A2 2 0 0 1 22 16.92z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IconMail = (props) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
    <rect x="3" y="5" width="18" height="14" rx="2" fill="none" stroke="currentColor" strokeWidth="1.6"/>
    <path d="M3 7l9 6 9-6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const Bullet = (props) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
    <circle cx="12" cy="12" r="6" fill="currentColor" opacity=".18" />
    <path d="M9.5 12.5l2 2 3.5-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
/* ============================================ */

const PaymentSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [updateCompleted, setUpdateCompleted] = useState(false);
  const navigate = useNavigate();

  const vnpSecureHash = searchParams.get('vnp_SecureHash');
  const orderId = searchParams.get('orderId');
  const vnpResponseCode = searchParams.get('vnp_ResponseCode');
  const vnpTransactionStatus = searchParams.get('vnp_TransactionStatus');

  useEffect(() => {
    if (vnpResponseCode && vnpTransactionStatus) {
      checkVNPayResponse();
    } else if (orderId) {
      fetchPaymentDetails();
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId, vnpResponseCode, vnpTransactionStatus]);

  const checkVNPayResponse = () => {
    if (vnpResponseCode === '00' && vnpTransactionStatus === '00') {
      if (orderId) {
        fetchPaymentDetails();
      } else {
        setLoading(false);
      }
    } else {
      const cancelParams = new URLSearchParams();
      if (orderId) cancelParams.set('orderId', orderId);
      cancelParams.set('status', 'failed');
      cancelParams.set('code', vnpResponseCode || '99');
      cancelParams.set('reason', getVNPayErrorMessage(vnpResponseCode || '99'));
      navigate(`/payment-cancel?${cancelParams.toString()}`);
    }
  };

  const getVNPayErrorMessage = (code) => {
    const map = {
      '00': 'Giao dịch thành công',
      '24': 'Khách hàng hủy giao dịch',
      '51': 'Tài khoản không đủ số dư',
      '65': 'Tài khoản vượt quá hạn mức',
      '75': 'Ngân hàng đang bảo trì',
      '79': 'Khách hàng yêu cầu hoàn tiền',
      '99': 'Lỗi không xác định'
    };
    return map[code] || 'Giao dịch thất bại';
  };

  const fetchPaymentDetails = async () => {
    try {
      const paymentData = await paymentService.getPaymentByOrderId(orderId);
      setPayment(paymentData);
      
      // Xác nhận thanh toán thành công dựa vào VNPay response, không cần so sánh hash
      // Hash verification đã được xử lý ở backend trong VNPay callback
      if (vnpResponseCode === '00' && vnpTransactionStatus === '00') {
        await updatePaymentAndAppointmentStatus(paymentData);
      }
    } catch (err) {
      console.error('Error fetching payment details:', err);
      setError('Không thể tải thông tin thanh toán');
    } finally {
      setLoading(false);
    }
  };

  const updatePaymentAndAppointmentStatus = async (paymentData) => {
    if (updatingStatus) return; // Tránh gọi nhiều lần
    
    setUpdatingStatus(true);
    try {
      let updateSuccess = true;
      let errorMessages = [];

      // 1. Cập nhật payment status thành SUCCESS nếu chưa phải
      if (paymentData.status !== 'SUCCESS') {
        try {
          await paymentService.updatePaymentStatus(paymentData.id, 'SUCCESS');
          console.log('Payment status updated to SUCCESS');
        } catch (error) {
          console.warn('Failed to update payment status:', error);
          updateSuccess = false;
          errorMessages.push('Không thể cập nhật trạng thái thanh toán');
        }
      }
      
      // 2. Cập nhật appointment status thành PAYMENT_PENDING nếu có appointment
      if (paymentData.appointment && paymentData.appointment.id) {
        try {
          // Sử dụng appointmentService để cập nhật trạng thái
          await appointmentService.updateAppointmentStatus(paymentData.appointment.id, 'CONFIRMED');
          console.log('Appointment status updated to CONFIRMED');
        } catch (error) {
          console.warn('Failed to update appointment status:', error);
          updateSuccess = false;
          errorMessages.push('Không thể cập nhật trạng thái lịch hẹn');
        }
      } else {
        console.log('No appointment found to update');
      }
      
      // 3. Nếu cập nhật thành công, refresh payment data
      if (updateSuccess) {
        try {
          const updatedPayment = await paymentService.getPaymentByOrderId(orderId);
          setPayment(updatedPayment);
          setUpdateCompleted(true);
          console.log('Payment and appointment status updated successfully');
        } catch (error) {
          console.warn('Failed to refresh payment data:', error);
        }
      } else {
        // Hiển thị cảnh báo nếu có lỗi cập nhật
        console.warn('Some updates failed:', errorMessages.join(', '));
        // Có thể hiển thị thông báo lỗi cho người dùng ở đây
      }
      
    } catch (error) {
      console.error('Error updating payment and appointment status:', error);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });

  if (loading) {
    return (
      <div className="psp">
        <div className="psp__loader">
          <div className="psp__spinner" />
          <p>Đang xử lý thông tin thanh toán...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="psp">
        <div className="psp__error">
          <div className="psp__error-ring">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <path d="M8.5 8.5l7 7M15.5 8.5l-7 7" />
            </svg>
          </div>
          <h2>Đã xảy ra lỗi</h2>
          <p>{error}</p>
          <Link to="/" className="psp__btn psp__btn--ghost">
            <IconHome className="psp__btn-icon" />
            Về trang chủ
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="psp">
      <div className="psp__shell">
        {/* Header */}
        <header className="psp__header">
          <div className="psp__icon-wrap">
            <IconCheckRing className="psp__icon psp__icon--lg" />
          </div>
          <div className="psp__headings">
            <h1 className="psp__title">Thanh toán thành công!</h1>
            <p className="psp__subtitle">Cảm ơn bạn đã sử dụng dịch vụ của HealthConnect</p>
            <div className="psp__meta">
              {orderId && (
                <span className="psp__chip">
                  <span className="psp__chip-label">Mã giao dịch</span>
                  <span className="psp__chip-value">{orderId}</span>
                </span>
              )}
              <span className="psp__badge">PAID</span>
            </div>
          </div>
        </header>

        {/* Details */}
        {payment && (
          <section className="psp__section psp__section--muted">
            <h2 className="psp__h2">
              <IconLayers className="psp__h2-icon" />
              Chi tiết giao dịch
            </h2>

            <div className="psp__kv">
              <div className="psp__row">
                <span className="psp__label">Mã giao dịch:</span>
                <span className="psp__value">{payment.orderId}</span>
              </div>
              <div className="psp__row">
                <span className="psp__label">Số tiền:</span>
                <span className="psp__value psp__value--amount">{formatCurrency(payment.amount)}</span>
              </div>
              <div className="psp__row">
                <span className="psp__label">Phương thức:</span>
                <span className="psp__value">{payment.method}</span>
              </div>
              <div className="psp__row">
                <span className="psp__label">Trạng thái:</span>
                <span className="psp__status psp__status--success">{payment.status}</span>
              </div>
              {payment.paymentDate && (
                <div className="psp__row">
                  <span className="psp__label">Ngày thanh toán:</span>
                  <span className="psp__value">{formatDate(payment.paymentDate)}</span>
                </div>
              )}
            </div>

            {/* Hiển thị trạng thái cập nhật */}
            {updatingStatus && (
              <div className="psp__update-status">
                <div className="psp__spinner" />
                <p>Đang cập nhật trạng thái thanh toán và lịch hẹn...</p>
              </div>
            )}

            {/* Hiển thị thông báo thành công */}
            {updateCompleted && !updatingStatus && (
              <div className="psp__update-success">
                <div className="psp__success-icon">✓</div>
                <p>Đã cập nhật trạng thái thanh toán và lịch hẹn thành công!</p>
              </div>
            )}
          </section>
        )}

        {/* Appointment Information */}
        {payment && payment.appointment && (
          <section className="psp__section">
            <h2 className="psp__h2">
              <IconCalendar className="psp__h2-icon" />
              Thông tin lịch hẹn
            </h2>
            
            <div className="psp__kv">
              <div className="psp__row">
                <span className="psp__label">Mã lịch hẹn:</span>
                <span className="psp__value">#{payment.appointment.id}</span>
              </div>
              <div className="psp__row">
                <span className="psp__label">Bác sĩ:</span>
                <span className="psp__value">{payment.appointment.doctorSlot?.doctor?.fullName || 'N/A'}</span>
              </div>
              <div className="psp__row">
                <span className="psp__label">Ngày khám:</span>
                <span className="psp__value">
                  {payment.appointment.doctorSlot?.date ? 
                    new Date(payment.appointment.doctorSlot.date).toLocaleDateString('vi-VN') : 'N/A'}
                </span>
              </div>
              <div className="psp__row">
                <span className="psp__label">Giờ khám:</span>
                <span className="psp__value">
                  {payment.appointment.doctorSlot?.startTime ? 
                    new Date(`2000-01-01T${payment.appointment.doctorSlot.startTime}`).toLocaleTimeString('vi-VN', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    }) : 'N/A'}
                </span>
              </div>
              <div className="psp__row">
                <span className="psp__label">Trạng thái lịch hẹn:</span>
                <span className="psp__status psp__status--info">
                  {payment.appointment.status === 'PAYMENT_PENDING' ? 'Chờ xác nhận từ bác sĩ' : 
                   payment.appointment.status === 'CONFIRMED' ? 'Đã xác nhận' : 
                   payment.appointment.status}
                </span>
              </div>
            </div>
          </section>
        )}

        {/* Next steps */}
        <section className="psp__section">
          {/* <h3 className="psp__h3 psp__h3--center">Bước tiếp theo</h3> */}
          <ul className="psp__list">
            {[
              // 'Bạn sẽ nhận được email xác nhận trong vòng 5 phút',
              'Vui lòng chú ý giờ khám và tham gia đúng hẹn để tránh việc bị hủy lịch hẹn',
              // '',
            ].map((t, i) => (
              <li className="psp__li" key={i}>
                <Bullet className="psp__li-icon" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Actions */}
        <div className="psp__actions">
          <Link to="/" className="psp__btn psp__btn--ghost">
            <IconHome className="psp__btn-icon" />
            Về trang chủ
          </Link>
          <Link to="/all-appointments" className="psp__btn psp__btn--outline">
            <IconCalendar className="psp__btn-icon" />
            Xem lịch hẹn
          </Link>
        </div>

        {/* Contact */}
        <section className="psp__section psp__section--muted">
          <h3 className="psp__h3 psp__h3--center">Hỗ trợ</h3>
          <div className="psp__contact">
            <div className="psp__contact-item">
              <span className="psp__contact-ico"><IconPhone /></span>
              <div>
                <div className="psp__contact-k">Hotline</div>
                <div className="psp__contact-v">1900-xxxx</div>
              </div>
            </div>
            <div className="psp__contact-item">
              <span className="psp__contact-ico"><IconMail /></span>
              <div>
                <div className="psp__contact-k">Email</div>
                <div className="psp__contact-v">support@healthconnect.com</div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
