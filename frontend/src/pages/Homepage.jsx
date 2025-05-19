import React, { useContext, useEffect, useState } from 'react';
import { Video, FileText, CreditCard, ChevronRight, Star, Menu } from 'lucide-react';
import { Link } from 'react-router-dom';
import telemedicineImage from "../assets/images/telemedicine-7520691_1280.jpg";
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
const Homepage = () => {
  const { user, logout } = useContext(AuthContext);
  const [isLogged, setIsLogged] = useState(false);  // Corrected syntax here
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  }
  useEffect(() => {
    if (user) {
      setIsLogged(true);
    }
    else {
      setIsLogged(false);
    }
  }, [user]);  // Added user as dependency

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 bg-white">
        <div className="container mx-auto flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Khám bệnh trực tuyến - Tiện lợi, An toàn, Chuyên nghiệp
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Kết nối với bác sĩ hàng đầu chỉ sau 5 phút, mọi lúc mọi nơi.
            </p>
            <button className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center transition-colors shadow-md">
              <Link to="/book-appointment"> Đặt lịch ngay</Link> 
              <ChevronRight className="ml-2 w-5 h-5" />
            </button>
          </div>
          <div className="md:w-1/2">
            <img
              src={telemedicineImage}
              alt="Telemedicine Illustration"
              className="rounded-xl shadow-lg w-full h-auto max-h-[600px] object-cover"
            />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-blue-600">Dịch vụ y tế hiện đại</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <Video className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-bold mb-3">Tư vấn qua Video</h3>
              <p className="text-gray-600">
                Gặp bác sĩ trực tiếp qua chất lượng hình ảnh HD.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <FileText className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-bold mb-3">Đơn thuốc điện tử</h3>
              <p className="text-gray-600">
                Nhận đơn thuốc số hóa, gửi trực tiếp đến nhà thuốc.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <CreditCard className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-bold mb-3">Thanh toán an toàn</h3>
              <p className="text-gray-600">
                Hỗ trợ Visa, Mastercard, MoMo, ZaloPay.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-blue-600">Quy trình đơn giản</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex flex-col items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-bold mb-4">
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
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-blue-600">Đội ngũ bác sĩ chuyên nghiệp</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((doctor) => (
              <div key={doctor} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow">
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
                  <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
                    <Link to="/book-appointment" className="w-full inline-block"> Đặt lịch ngay</Link> 
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/doctors" className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center">
              Xem tất cả bác sĩ <ChevronRight className="ml-1 w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Bắt đầu trải nghiệm y tế hiện đại ngay hôm nay</h2>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
            Dịch vụ khám bệnh trực tuyến chất lượng cao, tiết kiệm thời gian và chi phí cho bạn và gia đình
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/register" className="px-6 py-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-gray-100 transition-colors">
              Đăng ký ngay
            </Link>
            <Link to="/book-appointment" className="px-6 py-3 bg-blue-700 text-white rounded-lg font-medium hover:bg-blue-800 transition-colors">
              Đặt lịch khám
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      {/* <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-1">
              <h5 className="text-xl font-bold mb-4">HealthConnect</h5>
              <p className="text-gray-400">
                Giải pháp Telemedicine hàng đầu Việt Nam
              </p>
            </div>
            <div>
              <h5 className="text-xl font-bold mb-4">Dịch vụ</h5>
              <div className="space-y-2">
                <Link to="/services" className="block text-gray-400 hover:text-white">
                  Khám bệnh online
                </Link>
                <Link to="/services" className="block text-gray-400 hover:text-white">
                  Đặt lịch khám
                </Link>
                <Link to="/services" className="block text-gray-400 hover:text-white">
                  Tư vấn sức khỏe
                </Link>
              </div>
            </div>
            <div>
              <h5 className="text-xl font-bold mb-4">Liên hệ</h5>
              <p className="text-gray-400">Email: support@healthconnect.vn</p>
              <p className="text-gray-400">Hotline: 1900 1234</p>
            </div>
            <div>
              <h5 className="text-xl font-bold mb-4">Pháp lý</h5>
              <div className="space-y-2">
                <Link to="/privacy" className="block text-gray-400 hover:text-white">
                  Chính sách bảo mật
                </Link>
                <Link to="/terms" className="block text-gray-400 hover:text-white">
                  Điều khoản sử dụng
                </Link>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500">
            <p>© {new Date().getFullYear()} HealthConnect. Tất cả các quyền được bảo lưu.</p>
          </div>
        </div>
      </footer> */}
    </div>
  );
};

export default Homepage;