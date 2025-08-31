import React, { useContext, useEffect, useState } from 'react';
import {
  Video,
  CreditCard,
  Shield,
  Users,
  Award,
  CheckCircle,
  ArrowRight,
  Play,
  Calendar,
  Star,
  UserCheck,
  MessageCircle
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import telemedicineImage from "../assets/images/telemedicine-7520691_1280.jpg";
import { AuthContext } from '../context/AuthContext';
import VideoDemoModal from '../Components/home/VideoDemoModal';

/**
 * Design goals
 * - Use the same primary gradient as Navbar: var(--primary-600) → var(--secondary-600)
 * - Reduce color noise; keep surfaces light, accents via the gradient
 * - Consistent button styles (primary gradient + subtle outline secondary)
 */

const Homepage = () => {
  const { user, logout } = useContext(AuthContext);
  const [isLogged, setIsLogged] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    setIsLogged(Boolean(user));
  }, [user]);

  useEffect(() => {
    const interval = setInterval(() => setCurrentStep((p) => (p + 1) % 3), 3000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { number: "---", label: "Bệnh nhân tin tưởng", icon: Users },
    { number: "---", label: "Bác sĩ chuyên khoa", icon: UserCheck },
    { number: "---", label: "Tỷ lệ hài lòng", icon: Award },
    { number: "24/7", label: "Hỗ trợ trực tuyến", icon: Calendar }
  ];

  const features = [
    {
      icon: Video,
      title: "Tư vấn qua Video HD",
      description: "Hình ảnh rõ nét, âm thanh ổn định"
    },
    {
      icon: CreditCard,
      title: "Thanh toán trực tuyến",
      description: "Nhiều phương thức, bảo mật tuyệt đối"
    },
    {
      icon: Shield,
      title: "Bảo mật thông tin",
      description: ""
    },
    {
      icon: MessageCircle,
      title: "Hỗ trợ tư vấn",
      description: "Hỗ trợ sau khám qua chat/email"
    }
  ];

  const steps = [
    { step: '01', title: 'Đăng ký tài khoản', description: 'Tạo tài khoản trong 30 giây', icon: UserCheck },
    { step: '02', title: 'Chọn bác sĩ phù hợp', description: 'Lọc theo chuyên khoa, đánh giá, giá', icon: Users },
    { step: '03', title: 'Kết nối & Khám bệnh', description: 'Tham gia video call, nhận tư vấn', icon: Video }
  ];

  const doctors = [
    {
      name: "TS. Nguyễn Văn An",
      specialty: "Chuyên khoa Tim mạch",
      experience: "15 năm kinh nghiệm",
      rating: "-",
      reviews: "-",
      image: "https://via.placeholder.com/400x300/4F46E5/FFFFFF?text=TS.+Nguyễn+Văn+An"
    },
    {
      name: "BS. Trần Thị Bình",
      specialty: "Chuyên khoa Nhi",
      experience: "12 năm kinh nghiệm",
      rating: "-",
      reviews: "-",
      image: "https://via.placeholder.com/400x300/10B981/FFFFFF?text=BS.+Trần+Thị+Bình"
    },
    {
      name: "PGS.TS Lê Văn Cường",
      specialty: "Chuyên khoa Thần kinh",
      experience: "20 năm kinh nghiệm",
      rating: "-",
      reviews: "-",
      image: "https://via.placeholder.com/400x300/F59E0B/FFFFFF?text=PGS.TS+Lê+Văn+Cường"
    }
  ];

  const primaryGrad = {
    background: 'linear-gradient(135deg, var(--primary-600), var(--secondary-600))'
  };

  const primaryTextGrad = {
    backgroundImage: 'linear-gradient(135deg, var(--primary-600), var(--secondary-600))',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    color: 'transparent'
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative pt-24 pb-20 px-4 overflow-hidden">
        {/* unify hero glow with header colors */}
        <div className="absolute inset-0 opacity-10" style={primaryGrad}></div>
        <div className="container mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 mb-12 lg:mb-0 lg:pr-12">
              <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium mb-6 text-white" style={primaryGrad}>
                <Video className="w-4 h-4 mr-2" />
                Giải pháp y tế số hàng đầu Việt Nam
              </div>

              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Khám bệnh trực tuyến
                <span className="block" style={primaryTextGrad}>Tiện lợi & An toàn</span>
              </h1>

              <p className="text-lg text-gray-600 mb-8 leading-relaxed max-w-xl">
                Kết nối với đội ngũ bác sĩ hàng đầu chỉ sau vài phút. Trải nghiệm y tế hiện đại, tiết kiệm thời gian và chi phí.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link to="/book-appointment" className="group">
                  <button
                    className="px-8 py-4 text-white rounded-xl flex items-center transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    style={primaryGrad}
                  >
                    <Calendar className="mr-2 w-5 h-5" />
                    Đặt lịch ngay
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>

                <button
                  className="px-8 py-4 bg-white text-gray-700 rounded-xl flex items-center transition-all duration-300 shadow-lg hover:shadow-xl border border-gray-200"
                  onClick={() => setIsVideoModalOpen(true)}
                >
                  <Play className="mr-2 w-5 h-5" />
                  Xem demo
                </button>
              </div>

              <div className="flex items-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  Miễn phí đăng ký
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  Bảo mật tuyệt đối
                </div>
              </div>
            </div>

            <div className="lg:w-1/2">
              <div className="relative">
                <div className="absolute -inset-4 rounded-3xl blur opacity-20" style={primaryGrad}></div>
                <img
                  src={telemedicineImage}
                  alt="Telemedicine Illustration"
                  className="relative rounded-3xl shadow-2xl w-full h-auto max-h-[600px] object-cover"
                />

                <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={primaryGrad}>
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">---</div>
                      <div className="text-sm text-gray-600">Bệnh nhân tin tưởng</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-14 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((S, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-shadow">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4" style={primaryGrad}>
                  <S.icon className="w-7 h-7 text-white" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{S.number}</div>
                <div className="text-gray-600 text-sm">{S.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold text-gray-900 mb-3">Dịch vụ y tế hiện đại</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">Công nghệ y tế tiên tiến mang lại sự tiện lợi và an toàn tối đa</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {features.map((f, i) => (
              <div key={i} className="group bg-white rounded-2xl border border-gray-100 p-8 shadow-sm hover:shadow-md transition-all">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-5" style={primaryGrad}>
                  <f.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-gray-600 leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4 bg-slate-50">
        <div className="container mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold text-gray-900 mb-3">Quy trình đơn giản 3 bước</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">Từ đăng ký đến khám bệnh chỉ mất vài phút</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((st, i) => (
              <div key={i} className="relative">
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-full w-full h-px bg-gradient-to-r from-gray-200 to-gray-100" />
                )}
                <div className="relative bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-all border border-gray-100">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-white text-2xl font-bold" style={primaryGrad}>
                    {st.step}
                  </div>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={primaryGrad}>
                    <st.icon className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">{st.title}</h4>
                  <p className="text-gray-600">{st.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Doctors */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold text-gray-900 mb-3">Đội ngũ bác sĩ chuyên nghiệp</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">Chuyên môn cao, kinh nghiệm lâu năm</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {doctors.map((d, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden border border-gray-100 group">
                <div className="relative overflow-hidden">
                  <img src={d.image} alt={d.name} className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center space-x-2 text-white">
                      <Star className="w-5 h-5 text-yellow-400 fill-current" />
                      <span className="font-medium">{d.rating}</span>
                      <span className="text-sm opacity-90">({d.reviews} đánh giá)</span>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-1">{d.name}</h4>
                  <p className="text-[15px] text-gray-700 mb-1">{d.specialty}</p>
                  <p className="text-gray-500 text-sm mb-5">{d.experience}</p>
                  <Link to="/book-appointment" className="block w-full">
                    <button className="w-full px-6 py-3 text-white rounded-xl font-medium transition-all" style={primaryGrad}>
                      Đặt lịch ngay
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/#" className="inline-flex items-center font-medium text-gray-700 hover:text-gray-900">
              Xem tất cả bác sĩ
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0" style={primaryGrad} />
        <div className="absolute inset-0 bg-black/10" />
        <div className="container mx-auto relative z-10 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">Bắt đầu trải nghiệm y tế hiện đại</h2>
          <p className="text-lg text-white/80 mb-10 max-w-3xl mx-auto">Tham gia cùng hàng nghìn bệnh nhân đã tin tưởng sử dụng dịch vụ của chúng tôi.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/register">
              <button className="px-8 py-4 bg-white text-gray-900 rounded-xl font-medium hover:bg-gray-100 transition-all shadow-lg">
                Đăng ký ngay
              </button>
            </Link>
            <Link to="/book-appointment">
              <button className="px-8 py-4 bg-white/10 text-white rounded-xl font-medium hover:bg-white/15 transition-all border border-white/30 shadow-lg">
                Đặt lịch khám
              </button>
            </Link>
          </div>
        </div>
      </section>

      <VideoDemoModal
        open={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        mp4Src="/videos/demo.mp4"
      />
    </div>
  );
};

export default Homepage;
