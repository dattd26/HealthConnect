## 🌐 Demo Website

**Website chính thức**: [healthconnect-5zg3.onrender.com](https://healthconnect-5zg3.onrender.com/)

## 🔑 Tài khoản Test

| Vai trò | Tài khoản | Mật khẩu |
|---------|-----------|-----------|
| **👨‍🦱 Bệnh nhân** | `tranvana` | `123` |
| **👨‍⚕️ Bác sĩ** | `lethib` | `123` |
| **👨‍💼 Admin** | `admin` | `Admin@123` |

## 🧪 Test Zoom Meeting

**Test cuộc họp trực tuyến**: [healthconnect-5zg3.onrender.com/appointments/1/meeting](https://healthconnect-5zg3.onrender.com/appointments/1/meeting)

> 💡 **Lưu ý**: Sử dụng tài khoản bac si de host truoc


# 🏥 HealthConnect

**Nền tảng đặt lịch tư vấn - khám sức khỏe y tế online với tích hợp thanh toán VNPay và họp trực tuyến Zoom Meeting SDK**

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.4.2-green.svg)](https://spring.io/projects/spring-boot)
[![Java](https://img.shields.io/badge/Java-17-orange.svg)](https://www.oracle.com/java/)
[![React](https://img.shields.io/badge/React-19.0.0-blue.svg)](https://reactjs.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-blue.svg)](https://www.mysql.com/)
[![Docker](https://img.shields.io/badge/Docker-✓-blue.svg)](https://www.docker.com/)

## 📋 Mục lục

- [Giới thiệu](#giới-thiệu)
- [Tính năng chính](#tính-năng-chính)
- [Công nghệ sử dụng](#công-nghệ-sử-dụng)
- [Cài đặt và chạy](#cài-đặt-và-chạy)
- [Cấu trúc project](#cấu-trúc-project)
- [API Documentation](#api-documentation)
- [Tích hợp thanh toán VNPay](#tích-hợp-thanh-toán-vnpay)
- [Tích hợp Zoom Meeting SDK](#tích-hợp-zoom-meeting-sdk)
- [Đóng góp](#đóng-góp)
- [Giấy phép](#giấy-phép)

## 🎯 Giới thiệu

HealthConnect là một nền tảng y tế số toàn diện, cung cấp dịch vụ đặt lịch khám bệnh trực tuyến với các tính năng hiện đại:

- **Đặt lịch hẹn khám bệnh** online/offline linh hoạt
- **Tích hợp thanh toán trực tuyến** qua cổng thanh toán VNPay
- **Họp trực tuyến** qua Zoom Meeting SDK với chất lượng cao
- **Quản lý hồ sơ bệnh nhân** và lịch sử khám bệnh chi tiết
- **Hệ thống phân quyền** và xác thực bảo mật cao

### Đối tượng sử dụng

- **👨‍⚕️ Bác sĩ**: Quản lý lịch hẹn, khám bệnh trực tuyến, xem hồ sơ bệnh nhân
- **👨‍🦱 Bệnh nhân**: Đặt lịch, thanh toán, tham gia khám online
- **👨‍💼 Quản trị viên**: Quản lý hệ thống, báo cáo thống kê, quản lý người dùng

## ✨ Tính năng chính

### 🔐 Xác thực và Bảo mật
- Đăng ký/đăng nhập với xác thực email
- JWT token authentication
- Phân quyền theo vai trò (ROLE_ADMIN, ROLE_DOCTOR, ROLE_PATIENT)
- Bảo mật API với Spring Security

### 📅 Quản lý Lịch hẹn
- Đặt lịch hẹn với bác sĩ
- Quản lý lịch làm việc của bác sĩ
- Hệ thống slot thời gian linh hoạt
- Thông báo email tự động

### 💳 Thanh toán Online
- Tích hợp cổng thanh toán VNPay
- Xử lý thanh toán an toàn
- Quản lý trạng thái thanh toán
- Lịch sử giao dịch chi tiết

### 🎥 Khám bệnh Trực tuyến
- Tích hợp Zoom Meeting SDK
- Phòng họp trực tuyến chất lượng cao
- Chia sẻ màn hình và tài liệu
- Ghi âm cuộc họp (tùy chọn)

### 📊 Dashboard và Báo cáo
- Dashboard cho từng vai trò
- Thống kê lịch hẹn và doanh thu
- Báo cáo hiệu suất bác sĩ
- Quản lý hồ sơ bệnh nhân

## 🛠️ Công nghệ sử dụng

### Backend
- **Framework**: Spring Boot 3.4.2
- **Language**: Java 17
- **Database**: MySQL 8.0
- **ORM**: Spring Data JPA
- **Security**: Spring Security + JWT
- **Build Tool**: Maven
- **Container**: Docker

### Frontend
- **Framework**: React 19.0.0
- **Language**: JavaScript/JSX
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM 7.1.3
- **UI Components**: Radix UI
- **Charts**: Chart.js + React Chart.js 2
- **HTTP Client**: Axios

### Công cụ và Dịch vụ
- **Container**: Docker & Docker Compose
- **Payment Gateway**: VNPay API
- **Video Conference**: Zoom Meeting SDK
- **Email Service**: SMTP
- **Version Control**: Git

## 🚀 Cài đặt và chạy

### Yêu cầu hệ thống
- Java 17 hoặc cao hơn
- Node.js 18+ và npm
- MySQL 8.0
- Docker và Docker Compose (tùy chọn)

### Cách 1: Chạy với Docker (Khuyến nghị)

```bash
# Clone repository
git clone <repository-url>
cd HealthConnect

# Chạy toàn bộ hệ thống
docker-compose up -d

# Truy cập ứng dụng
# Frontend: http://localhost:3000
# Backend: http://localhost:8080
```

### Cách 2: Chạy thủ công

#### Backend
```bash
cd backend

# Cài đặt dependencies
mvn clean install

# Cấu hình database trong application.properties
# Chạy ứng dụng
mvn spring-boot:run
```

#### Frontend
```bash
cd frontend

# Cài đặt dependencies
npm install

# Chạy ứng dụng
npm start
```

### Cấu hình Database
1. Tạo database MySQL mới
2. Cập nhật thông tin kết nối trong `backend/src/main/resources/application.properties`
3. Chạy script migration trong `backend/src/main/resources/db/`

## 📁 Cấu trúc Project

```
HealthConnect/
├── backend/                          # Spring Boot Backend
│   ├── src/main/java/com/HealthConnect/
│   │   ├── Config/                   # Cấu hình hệ thống
│   │   ├── Controller/               # REST API Controllers
│   │   ├── Service/                  # Business Logic
│   │   ├── Repository/               # Data Access Layer
│   │   ├── Model/                    # Entity Models
│   │   ├── Dto/                      # Data Transfer Objects
│   │   ├── Jwt/                      # JWT Authentication
│   │   └── Exception/                # Exception Handling
│   ├── src/main/resources/
│   │   ├── application.properties    # Cấu hình ứng dụng
│   │   └── db/                       # Database scripts
│   └── pom.xml                       # Maven dependencies
├── frontend/                         # React Frontend
│   ├── src/
│   │   ├── Components/               # React Components
│   │   ├── pages/                    # Page Components
│   │   ├── services/                 # API Services
│   │   ├── context/                  # React Context
│   │   ├── config/                   # Configuration
│   │   └── styles/                   # CSS Styles
│   └── package.json                  # Node.js dependencies
└── docker-compose.yml               # Container orchestration
```

## 🔌 API Documentation

### Endpoints chính

#### Authentication
- `POST /api/auth/register` - Đăng ký tài khoản
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/verify-email` - Xác thực email

#### Appointments
- `GET /api/appointments` - Lấy danh sách lịch hẹn
- `POST /api/appointments` - Tạo lịch hẹn mới
- `PUT /api/appointments/{id}` - Cập nhật lịch hẹn
- `DELETE /api/appointments/{id}` - Xóa lịch hẹn

#### Doctors
- `GET /api/doctors` - Lấy danh sách bác sĩ
- `GET /api/doctors/{id}/availability` - Lấy lịch làm việc bác sĩ
- `POST /api/doctors/availability` - Cập nhật lịch làm việc

#### Payments
- `POST /api/payments/create` - Tạo giao dịch thanh toán
- `POST /api/payments/vnpay-callback` - Callback từ VNPay
- `GET /api/payments/history` - Lịch sử giao dịch

## 💳 Tích hợp thanh toán VNPay

### Tính năng
- Tích hợp cổng thanh toán VNPay
- Hỗ trợ thanh toán qua thẻ ATM, thẻ tín dụng
- Xử lý callback và cập nhật trạng thái giao dịch
- Bảo mật thông tin thanh toán

### Cấu hình
```properties
# VNPay Configuration
vnpay.tmn-code=YOUR_TMN_CODE
vnpay.hash-secret=YOUR_HASH_SECRET
vnpay.payment-url=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
vnpay.return-url=http://localhost:3000/payment/success
```

## 🎥 Tích hợp Zoom Meeting SDK

### Tính năng
- Tạo phòng họp tự động cho mỗi lịch hẹn
- Tham gia họp trực tuyến với chất lượng cao
- Chia sẻ màn hình và tài liệu
- Ghi âm cuộc họp (tùy chọn)

### Cấu hình
```javascript
// Zoom SDK Configuration
const zoomConfig = {
  apiKey: 'YOUR_ZOOM_API_KEY',
  meetingNumber: appointment.zoomMeetingId,
  userName: user.name,
  passWord: appointment.zoomPassword
};
```