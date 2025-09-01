# Tích hợp VNPay vào HealthConnect - Tổng quan

## 🎯 Mục tiêu
Tích hợp thanh toán trực tuyến VNPay vào hệ thống HealthConnect để xử lý việc thanh toán lịch hẹn khám bệnh.

## 🏗️ Kiến trúc hệ thống

### Backend (Spring Boot)
```
backend/
├── src/main/java/com/HealthConnect/
│   ├── Config/
│   │   └── VNPayConfig.java              # Cấu hình VNPay
│   ├── Controller/
│   │   ├── VNPayController.java          # API xử lý VNPay
│   │   └── PaymentController.java        # API quản lý thanh toán
│   ├── Dto/VNPay/
│   │   ├── VNPayPaymentRequest.java      # DTO yêu cầu thanh toán
│   │   ├── VNPayPaymentResponse.java     # DTO phản hồi thanh toán
│   │   ├── VNPayCallbackRequest.java     # DTO callback VNPay
│   │   └── VNPayCallbackResponse.java    # DTO phản hồi callback
│   ├── Model/
│   │   └── Payment.java                  # Model thanh toán
│   ├── Repository/
│   │   └── PaymentRepository.java        # Repository thanh toán
│   └── Service/
│       ├── VNPayService.java             # Service xử lý VNPay
│       └── PaymentService.java           # Service quản lý thanh toán
```

### Frontend (React)
```
frontend/
├── src/
│   ├── Components/payment/
│   │   ├── PaymentForm.jsx               # Form thanh toán
│   │   └── PaymentForm.css               # CSS cho form
│   ├── pages/
│   │   ├── PaymentSuccessPage.jsx        # Trang thanh toán thành công
│   │   ├── PaymentSuccessPage.css        # CSS trang thành công
│   │   ├── PaymentCancelPage.jsx         # Trang thanh toán bị hủy
│   │   └── PaymentCancelPage.css         # CSS trang hủy
│   └── services/
│       └── paymentService.js             # Service gọi API thanh toán
```

## 🔧 Cài đặt và cấu hình

### 1. Backend Dependencies
Thêm vào `pom.xml`:
```xml
<dependency>
    <groupId>org.apache.httpcomponents.client5</groupId>
    <artifactId>httpclient5</artifactId>
</dependency>
<dependency>
    <groupId>commons-codec</groupId>
    <artifactId>commons-codec</artifactId>
</dependency>
```

### 2. Biến môi trường
Tạo file `.env` với các biến:
```bash
# VNPay Configuration
VNPAY_TMN_CODE=your-tmn-code
VNPAY_HASH_SECRET=your-hash-secret
VNPAY_PAYMENT_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
VNPAY_RETURN_URL=http://localhost:3000/payment-success
VNPAY_CANCEL_URL=http://localhost:3000/payment-cancel
VNPAY_API_URL=https://sandbox.vnpayment.vn/merchant_webapi/api/transaction
```

### 3. Database Migration
Hệ thống sẽ tự động tạo bảng `payments` khi khởi động.

## 🚀 API Endpoints

### VNPay API
- `POST /api/vnpay/create-payment` - Tạo thanh toán VNPay
- `GET /api/vnpay/callback` - Callback từ VNPay
- `GET /api/vnpay/payment-status/{orderId}` - Kiểm tra trạng thái

### Payment API
- `POST /api/payments/create` - Tạo thanh toán
- `POST /api/payments/vnpay/create` - Tạo thanh toán VNPay
- `GET /api/payments/order/{orderId}` - Lấy thanh toán theo order ID
- `GET /api/payments/appointment/{appointmentId}` - Lấy thanh toán theo appointment
- `GET /api/payments/status/{status}` - Lấy thanh toán theo trạng thái
- `PUT /api/payments/{paymentId}/status` - Cập nhật trạng thái
- `GET /api/payments/all` - Lấy tất cả thanh toán

## 💳 Luồng thanh toán

### 1. Khởi tạo thanh toán
```
User → Frontend → Backend → VNPay → Payment URL
```

### 2. Thực hiện thanh toán
```
User → VNPay Payment Page → Bank/ATM → VNPay
```

### 3. Callback và xác nhận
```
VNPay → Backend Callback → Update Database → Redirect User
```

## 🔐 Bảo mật

### 1. Chữ ký số
- Sử dụng HMAC-SHA512 để tạo chữ ký
- Xác thực tất cả tham số từ VNPay
- Bảo vệ khỏi tấn công man-in-the-middle

### 2. Validation
- Kiểm tra tất cả tham số đầu vào
- Xác thực số tiền và thông tin giao dịch
- Log đầy đủ các giao dịch

### 3. HTTPS
- Sử dụng HTTPS cho tất cả API endpoints
- Bảo vệ thông tin thanh toán

## 📱 Frontend Integration

### 1. PaymentForm Component
- Hỗ trợ 3 phương thức: VNPay, Tiền mặt, Chuyển khoản
- Tự động chuyển hướng đến VNPay
- Xử lý lỗi và loading states

### 2. Success/Cancel Pages
- Trang thành công hiển thị chi tiết giao dịch
- Trang hủy cung cấp hướng dẫn và hỗ trợ
- Responsive design cho mobile

### 3. Payment Service
- Gọi API thanh toán
- Xử lý lỗi và response
- Quản lý state thanh toán

## 🧪 Testing

### 1. Sandbox Environment
- Sử dụng VNPay sandbox để test
- Các giao dịch test không tính phí
- Dữ liệu test được reset định kỳ

### 2. Test Cases
- Thanh toán thành công
- Thanh toán thất bại
- Hủy thanh toán
- Timeout giao dịch
- Callback không hợp lệ

## 📊 Monitoring và Logging

### 1. Logs
- Ghi log đầy đủ các giao dịch
- Log lỗi và exception
- Audit trail cho thanh toán

### 2. Metrics
- Số lượng giao dịch
- Tỷ lệ thành công/thất bại
- Thời gian xử lý

## 🚨 Xử lý lỗi

### 1. Lỗi thường gặp
- **Invalid Hash**: Kiểm tra Hash Secret
- **Timeout**: Kiểm tra network và cấu hình
- **Callback Failed**: Kiểm tra URL và firewall
- **Database Error**: Kiểm tra kết nối DB

### 2. Fallback Strategy
- Retry mechanism cho giao dịch thất bại
- Fallback sang phương thức thanh toán khác
- Manual intervention khi cần thiết

## 🔄 Deployment

### 1. Production Checklist
- [ ] Cập nhật VNPay production URLs
- [ ] Cấu hình SSL certificates
- [ ] Test callback endpoints
- [ ] Cấu hình monitoring
- [ ] Backup database

### 2. Environment Variables
```bash
# Production
VNPAY_PAYMENT_URL=https://pay.vnpay.vn/vpcpay.html
VNPAY_RETURN_URL=https://yourdomain.com/payment-success
VNPAY_CANCEL_URL=https://yourdomain.com/payment-cancel
```

## 📚 Tài liệu tham khảo

### 1. VNPay Documentation
- [VNPay API Documentation](https://sandbox.vnpayment.vn/apis/docs/huong-dan-tich-hop)
- [VNPay Sandbox](https://sandbox.vnpayment.vn/)

### 2. Spring Boot
- [Spring Boot Security](https://spring.io/projects/spring-security)
- [Spring Boot Validation](https://spring.io/guides/gs/validating-form-input/)

### 3. React
- [React Router](https://reactrouter.com/)
- [React Hooks](https://reactjs.org/docs/hooks-intro.html)

## 🤝 Hỗ trợ

### 1. Team Development
- Backend: Spring Boot, Java 17
- Frontend: React 18, JavaScript
- Database: MySQL 8.0
- Payment Gateway: VNPay

### 2. Contact
- **Email**: support@healthconnect.com
- **Hotline**: 1900-xxxx
- **Documentation**: [Internal Wiki](link-to-wiki)

## 📈 Roadmap

### Phase 1 (Current) ✅
- [x] Tích hợp VNPay cơ bản
- [x] Frontend components
- [x] API endpoints
- [x] Database models

### Phase 2 (Next)
- [ ] Tích hợp thêm payment gateways
- [ ] Advanced reporting và analytics
- [ ] Mobile app integration
- [ ] Multi-currency support

### Phase 3 (Future)
- [ ] AI-powered fraud detection
- [ ] Blockchain integration
- [ ] International payments
- [ ] Subscription billing

---

**Lưu ý**: Đây là tài liệu kỹ thuật. Vui lòng cập nhật khi có thay đổi trong hệ thống.
