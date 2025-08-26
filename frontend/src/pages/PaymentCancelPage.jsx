import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import './PaymentCancelPage.css';

/* ====== Light-weight SVG icons (no deps) ====== */
const IconClose = (props) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
    <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.08" />
    <path d="M15.5 8.5L8.5 15.5M8.5 8.5l7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);

const IconRetry = (props) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
    <path d="M20 12a8 8 0 1 1-2.34-5.66" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M20 5v5h-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IconPhone = (props) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
    <path d="M22 16.92v2a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.08 4.18 2 2 0 0 1 4.06 2h2a2 2 0 0 1 2 1.72c.12.89.33 1.76.62 2.6a2 2 0 0 1-.45 2.11L7.1 9.91a16 16 0 0 0 6 6l1.48-1.13a2 2 0 0 1 2.11-.45c.84.29 1.71.5 2.6.62A2 2 0 0 1 22 16.92z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IconChat = (props) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
    <path d="M21 15a4 4 0 0 1-4 4H9l-6 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 9h8M8 13h5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
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

const Bullet = (props) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
    <circle cx="12" cy="12" r="6" fill="currentColor" opacity="0.2" />
    <path d="M9.5 12.5l2 2 3.5-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
/* ============================================== */

const PaymentCancelPage = () => {
  const [searchParams] = useSearchParams();
  
  const orderId = searchParams.get('orderId');
  const status = searchParams.get('status'); // 'failed' | 'error' | 'canceled'
  const code = searchParams.get('code');     // VNPay response code (e.g., '24')
  const reason = searchParams.get('reason');

  const getStatusTitle = () => {
    if (status === 'failed') return 'Giao dịch thất bại';
    if (status === 'error') return 'Có lỗi khi xử lý';
    return 'Thanh toán đã bị hủy';
  };

  const getDetailedReason = () => {
    if (reason) return reason;

    switch (code) {
      case '24': return 'Bạn đã hủy giao dịch thanh toán';
      case '51': return 'Tài khoản không đủ số dư để thực hiện giao dịch';
      case '65': return 'Giao dịch vượt quá hạn mức cho phép';
      case '75': return 'Ngân hàng đang bảo trì hệ thống';
      case '79': return 'Giao dịch đã được hoàn tiền';
      default:   return 'Có lỗi xảy ra trong quá trình thanh toán';
    }
  };

  return (
    <div className="pcp">
      <div className="pcp__shell">
        {/* Header */}
        <header className="pcp__header">
          <div className="pcp__icon-wrap">
            <IconClose className="pcp__icon pcp__icon--lg" />
          </div>

          <div className="pcp__headings">
            <h1 className="pcp__title">{getStatusTitle()}</h1>
            <p className="pcp__subtitle">{getDetailedReason()}</p>

            <div className="pcp__meta">
              {orderId && (
                <span className="pcp__chip">
                  <span className="pcp__chip-label">Mã giao dịch</span>
                  <span className="pcp__chip-value">{orderId}</span>
                </span>
              )}
              {code && (
                <span className="pcp__chip pcp__chip--warn">
                  <span className="pcp__chip-label">Mã lỗi</span>
                  <span className="pcp__chip-value">{code}</span>
                </span>
              )}
              {status && (
                <span className="pcp__badge">
                  {status === 'failed' ? 'Failed' : status === 'error' ? 'Error' : 'Canceled'}
                </span>
              )}
            </div>
          </div>
        </header>

        {/* Possible reasons */}
        <section className="pcp__section">
          <h3 className="pcp__h3">Lý do có thể</h3>
          <ul className="pcp__list">
            {[
              'Bạn đã nhấn nút "Hủy" trên trang thanh toán',
              'Phiên thanh toán đã hết hạn',
              'Có lỗi kỹ thuật xảy ra',
              'Bạn đóng trình duyệt trong quá trình thanh toán',
              'Tài khoản không đủ số dư',
              'Giao dịch vượt quá hạn mức cho phép',
            ].map((text, idx) => (
              <li key={idx} className="pcp__li">
                <Bullet className="pcp__li-icon" />
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* What next */}
        <section className="pcp__section pcp__grid">
          <h3 className="pcp__h3 pcp__h3--center">Bạn có thể làm gì?</h3>

          <div className="pcp__card">
            <div className="pcp__card-icon">
              <IconRetry className="pcp__icon" />
            </div>
            <h4 className="pcp__card-title">Thử lại</h4>
            <p className="pcp__card-desc">Thực hiện thanh toán lại cho lịch hẹn của bạn</p>
            <Link to="/book-appointment" className="pcp__btn pcp__btn--primary">
              Đặt lịch hẹn mới
            </Link>
          </div>

          <div className="pcp__card">
            <div className="pcp__card-icon">
              <IconPhone className="pcp__icon" />
            </div>
            <h4 className="pcp__card-title">Liên hệ hỗ trợ</h4>
            <p className="pcp__card-desc">Gọi điện để được hỗ trợ trực tiếp</p>
            <a href="tel:1900-xxxx" className="pcp__btn pcp__btn--success">Gọi ngay</a>
          </div>

          <div className="pcp__card">
            <div className="pcp__card-icon">
              <IconChat className="pcp__icon" />
            </div>
            <h4 className="pcp__card-title">Chat với chúng tôi</h4>
            <p className="pcp__card-desc">Nhận hỗ trợ trực tuyến qua chat</p>
            <button className="pcp__btn pcp__btn--violet">Bắt đầu chat</button>
          </div>
        </section>

        {/* Actions */}
        <div className="pcp__actions">
          <Link to="/" className="pcp__btn pcp__btn--ghost">
            <IconHome className="pcp__btn-icon" />
            Về trang chủ
          </Link>
          <Link to="/profile/appointments" className="pcp__btn pcp__btn--outline">
            <IconCalendar className="pcp__btn-icon" />
            Xem lịch hẹn
          </Link>
        </div>

        {/* Contacts */}
        <section className="pcp__section pcp__section--muted">
          <h3 className="pcp__h3 pcp__h3--center">Thông tin liên hệ</h3>
          <div className="pcp__contact-grid">
            {[
              { k: 'Hotline', v: '1900-xxxx' },
              { k: 'Email', v: 'support@healthconnect.com' },
              { k: 'Địa chỉ', v: '123 Đường ABC, Quận XYZ, TP.HCM' },
              { k: 'Giờ làm việc', v: 'Thứ 2 - Chủ nhật: 7:00 - 20:00' },
            ].map((item, idx) => (
              <div className="pcp__contact-item" key={idx}>
                <span className="pcp__contact-k">{item.k}</span>
                <span className="pcp__contact-v">{item.v}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Tips */}
        <section className="pcp__section">
          <h3 className="pcp__h3 pcp__h3--center">Mẹo hữu ích</h3>
          <div className="pcp__tips">
            {[
              'Đảm bảo kết nối internet ổn định',
              'Không đóng trình duyệt trong quá trình thanh toán',
              'Kiểm tra thông tin thẻ/bank trước khi thanh toán',
              'Lưu lại mã giao dịch để tra cứu khi cần',
            ].map((t, i) => (
              <div className="pcp__tip" key={i}>
                <span className="pcp__tip-num">{i + 1}</span>
                <span className="pcp__tip-text">{t}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default PaymentCancelPage;
