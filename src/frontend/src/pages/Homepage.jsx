import React, { useContext, useEffect, useState } from 'react';
import { Search, Video, FileText, CreditCard, ChevronRight, Star, Menu } from 'lucide-react';
import { Link } from 'react-router-dom';
import telemedicineImage from "../assets/images/telemedicine-7520691_1280.jpg";
import { AuthContext } from '../context/AuthContext';
const Homepage = () => {
  const { user } = useContext(AuthContext);
  const [isLogged, setIsLogged] = useState(false);  // Corrected syntax here

  useEffect(() => {
    if (user) {
      setIsLogged(true);
    }
  }, [user]);  // Added user as dependency

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 w-full bg-white shadow-sm z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Link to="/" className="text-[#3498db] font-bold text-2xl">
                HealthConnect
              </Link>
              <svg className="w-6 h-6 text-[#3498db]" viewBox="0 0 24 24">
                <path fill="currentColor" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/>
              </svg>
            </div>
            
            <nav className="hidden md:flex items-center space-x-6">
              <a href="#" className="text-gray-700 hover:text-[#3498db]">Trang chủ</a>
              <a href="#" className="text-gray-700 hover:text-[#3498db]">Tìm bác sĩ</a>
              <a href="#" className="text-gray-700 hover:text-[#3498db]">Giới thiệu</a>
              <a href="#" className="text-gray-700 hover:text-[#3498db]">Blog</a>
            </nav>

            <div className="hidden md:flex items-center space-x-4">
              {
                isLogged ? (
                  <Link 
                    to="/dashboard"
                    className="px-4 py-2 bg-[#3498db] text-white rounded-lg hover:bg-blue-600"
                  >
                    Dashboard
                  </Link>
                ) : (
                  <>
                    <Link 
                        to="/login"
                        className="px-4 py-2 text-[#3498db] hover:bg-blue-50 rounded-lg"
                    >
                        Đăng nhập
                    </Link>
                    <Link to="/register" className="px-4 py-2 bg-[#3498db] text-white rounded-lg hover:bg-blue-600">
                      Đăng ký
                    </Link> 
                  </>
                )
              } 
            </div>

            <button className="md:hidden">
              <Menu className="w-6 h-6 text-gray-700" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4">
        <div className="container mx-auto flex flex-col md:flex-row items-center" >
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Khám bệnh trực tuyến - Tiện lợi, An toàn, Chuyên nghiệp
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Kết nối với bác sĩ hàng đầu chỉ sau 5 phút, mọi lúc mọi nơi.
            </p>
            <button className="px-8 py-4 bg-[#3498db] text-white rounded-lg hover:bg-blue-600 flex items-center">
              Đặt lịch ngay
              <ChevronRight className="ml-2 w-5 h-5" />
            </button>
          </div>
          <div className="md:w-1/2">
            <img
              src={telemedicineImage}
              alt="Telemedicine Illustration"
              className="rounded-xl shadow-lg w-full h-[600px] object-cover"
            />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <Video className="w-12 h-12 text-[#3498db] mb-4" />
              <h3 className="text-xl font-bold mb-3">Tư vấn qua Video</h3>
              <p className="text-gray-600">
                Gặp bác sĩ trực tiếp qua chất lượng hình ảnh HD.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <FileText className="w-12 h-12 text-[#3498db] mb-4" />
              <h3 className="text-xl font-bold mb-3">Đơn thuốc điện tử</h3>
              <p className="text-gray-600">
                Nhận đơn thuốc số hóa, gửi trực tiếp đến nhà thuốc.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <CreditCard className="w-12 h-12 text-[#3498db] mb-4" />
              <h3 className="text-xl font-bold mb-3">Thanh toán an toàn</h3>
              <p className="text-gray-600">
                Hỗ trợ Visa, Mastercard, MoMo, ZaloPay.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Quy trình đơn giản</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-[#3498db] text-white flex items-center justify-center text-xl font-bold mb-4">
                  {step}
                </div>
                <h4 className="text-xl font-bold mb-2">
                  {step === 1 && "Đăng ký tài khoản"}
                  {step === 2 && "Chọn bác sĩ"}
                  {step === 3 && "Kết nối & Thanh toán"}
                </h4>
                <p className="text-gray-600 text-center">
                  {step === 1 && "Tạo tài khoản trong 30 giây."}
                  {step === 2 && "Lọc theo chuyên khoa, đánh giá, giá cả."}
                  {step === 3 && "Tham gia video call và thanh toán trực tuyến."}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Doctors */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Đội ngũ bác sĩ chuyên nghiệp</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((doctor) => (
              <div key={doctor} className="bg-white rounded-xl shadow-sm overflow-hidden">
                <img
                  src={`/api/placeholder/400/300`}
                  alt={`Doctor ${doctor}`}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h4 className="text-xl font-bold mb-2">TS. Nguyễn Văn {String.fromCharCode(64 + doctor)}</h4>
                  <p className="text-gray-600 mb-2">Chuyên khoa Tim mạch</p>
                  <div className="flex items-center mb-4">
                    <Star className="w-5 h-5 text-yellow-400" />
                    <span className="ml-1">4.9 (120 đánh giá)</span>
                  </div>
                  <button className="w-full px-4 py-2 bg-[#3498db] text-white rounded-lg hover:bg-blue-600">
                    Đặt lịch ngay
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h5 className="text-xl font-bold mb-4">HealthConnect</h5>
              <p className="text-gray-400">
                Giải pháp Telemedicine hàng đầu Việt Nam
              </p>
            </div>
            <div>
              <h5 className="text-xl font-bold mb-4">Liên hệ</h5>
              <p className="text-gray-400">Email: support@healthconnect.vn</p>
              <p className="text-gray-400">Hotline: 1900 1234</p>
            </div>
            <div>
              <h5 className="text-xl font-bold mb-4">Pháp lý</h5>
              <div className="space-y-2">
                <a href="#" className="block text-gray-400 hover:text-white">
                  Chính sách bảo mật
                </a>
                <a href="#" className="block text-gray-400 hover:text-white">
                  Điều khoản sử dụng
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;