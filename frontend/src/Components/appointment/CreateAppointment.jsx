import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { appointmentService } from "../../services/appointmentService";
import { AuthContext } from "../../context/AuthContext";
import dayjs from 'dayjs'

const CreateAppointment = ({ doctors }) => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  
  // Personal Information
  const [fullName, setFullName] = useState("");
  const [gender, setGender] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  
  // Appointment Information
  const [specialty, setSpecialty] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [consultationType, setConsultationType] = useState("inperson");
  const [preferredDate, setPreferredDate] = useState("");
  const [preferredTimeSlot, setPreferredTimeSlot] = useState("");
  
  // Medical Information
  const [symptoms, setSymptoms] = useState("");
  const [medicalHistory, setMedicalHistory] = useState("");
  const [attachments, setAttachments] = useState([]);
  
  // Additional Options
  const [noteForDoctor, setNoteForDoctor] = useState("");
  const [bookingFor, setBookingFor] = useState("self");
  const [acceptTerms, setAcceptTerms] = useState(false);
  
  // Specialties list
  const specialties = [
    "Nội tổng quát",
    "Nhi khoa",
    "Da liễu",
    "Tim mạch",
    "Tiêu hóa",
    "Thần kinh",
    "Tai mũi họng",
    "Mắt",
    "Chỉnh hình",
    "Sản phụ khoa"
  ];
  
  // Time slots
  const timeSlots = [
    { id: "morning", label: "Buổi sáng (8:00 - 11:30)" },
    { id: "afternoon", label: "Buổi chiều (13:30 - 17:00)" },
    { id: "evening", label: "Buổi tối (18:00 - 20:30)" },
  ];

  // Auto-fill patient information from profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        // This would be replaced with an actual API call to get user profile
        // const response = await axios.get("http://localhost:8080/api/user/profile", {
        //   headers: { Authorization: `Bearer ${token}` },
        // });
        // const profile = response.data;
        
        // For now we'll just simulate this
        setFullName(user.fullName);
        setGender(user.gender);
        setDateOfBirth(user.dateOfBirth);
        setPhoneNumber(user.phone);
        setEmail(user.email);
        setAddress(user.address);
        
      } catch (err) {
        console.error("Error loading user profile:", err);
      }
    };
    
    fetchUserProfile();
  }, [bookingFor, user]);

  // Filter doctors based on specialty
  const filteredDoctors = specialty 
    ? doctors.filter(doctor => doctor.specialty === specialty)
    : doctors;

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setAttachments(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!acceptTerms) {
      alert("Vui lòng chấp nhận điều khoản và điều kiện trước khi đặt lịch.");
      return;
    }
    
    setLoading(true);
    
    try {
      // Format the appointment data
      const formData = new FormData();
      
      // Personal information
      formData.append("fullName", fullName);
      formData.append("gender", gender);
      formData.append("dateOfBirth", dateOfBirth);
      formData.append("phoneNumber", phoneNumber);
      formData.append("email", email);
      formData.append("address", address);
      
      // Appointment details
      formData.append("specialty", specialty);
      formData.append("doctorId", doctorId);
      formData.append("consultationType", consultationType);
      formData.append("preferredDate", preferredDate);
      formData.append("preferredTimeSlot", preferredTimeSlot);
      
      // Medical information
      formData.append("symptoms", symptoms);
      formData.append("medicalHistory", medicalHistory);
      attachments.forEach(file => {
        formData.append("attachments", file);
      });
      
      // Additional information
      formData.append("noteForDoctor", noteForDoctor);
      formData.append("bookingFor", bookingFor);
      
      // For now, using the existing service but ideally would update the backend API
      const appointmentData = {
        doctorId: parseInt(doctorId, 10),
        appointmentTime: `${preferredDate}T${preferredTimeSlot === "morning" ? "09:00" : preferredTimeSlot === "afternoon" ? "14:00" : "18:00"}`,
        notes: `Triệu chứng: ${symptoms}\nTiền sử: ${medicalHistory}\nGhi chú: ${noteForDoctor}\nHình thức: ${consultationType === "inperson" ? "Khám trực tiếp" : "Khám online"}`,
      };
      
      const data = await appointmentService.createAppointment(appointmentData);
      console.log(data);
      alert("Lịch hẹn đã được tạo thành công! Bạn sẽ nhận được email xác nhận trong ít phút.");
      navigate("/book-appointment");
    } catch (err) {
      console.error("Lỗi tạo lịch hẹn:", err);
      alert("Đã xảy ra lỗi khi đặt lịch. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-blue-600 mb-4">Đặt lịch hẹn mới</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Người đặt hộ</label>
              <div className="flex space-x-4 mt-1">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio text-blue-600"
                    name="bookingFor"
                    value="self"
                    checked={bookingFor === "self"}
                    onChange={() => setBookingFor("self")}
                  />
                  <span className="ml-2">Đặt cho bản thân</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio text-blue-600"
                    name="bookingFor"
                    value="other"
                    checked={bookingFor === "other"}
                    onChange={() => setBookingFor("other")}
                  />
                  <span className="ml-2">Đặt cho người thân</span>
                </label>
              </div>
            </div>
        {/* Personal Information Section */}
        <div className="border-b pb-4">
          <h3 className="text-lg font-medium text-gray-800 mb-3">Thông tin cá nhân</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên *</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Giới tính *</label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                value={gender.toLowerCase()}
                onChange={(e) => setGender(e.target.value)}
                required
              >
                <option value="">-- Chọn giới tính --</option>
                <option value="male">Nam</option>
                <option value="female">Nữ</option>
                <option value="other">Khác</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ngày sinh *</label>
              <input
                type="date"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại *</label>
              <input
                type="tel"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
              <input
                type="email"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
          </div>
        </div>
        
        {/* Appointment Information Section */}
        <div className="border-b pb-4">
          <h3 className="text-lg font-medium text-gray-800 mb-3">Thông tin khám bệnh</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Chuyên khoa *</label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                required
              >
                <option value="">-- Chọn chuyên khoa --</option>
                {specialties.map((spec, index) => (
                  <option key={index} value={spec}>{spec}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bác sĩ *</label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                value={doctorId}
                onChange={(e) => setDoctorId(e.target.value)}
                required
              >
                <option value="">-- Chọn bác sĩ --</option>
                {filteredDoctors.map((doctor) => (
                  <option key={doctor.id} value={doctor.id}>
                    {doctor.fullName || doctor.username}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hình thức khám *</label>
              <div className="flex space-x-4 mt-1">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio text-blue-600"
                    name="consultationType"
                    value="inperson"
                    checked={consultationType === "inperson"}
                    onChange={() => setConsultationType("inperson")}
                  />
                  <span className="ml-2">Khám trực tiếp</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio text-blue-600"
                    name="consultationType"
                    value="online"
                    checked={consultationType === "online"}
                    onChange={() => setConsultationType("online")}
                  />
                  <span className="ml-2">Khám online</span>
                </label>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ngày khám mong muốn *</label>
              <input
                type="date"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                value={preferredDate}
                onChange={(e) => setPreferredDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Khung giờ *</label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                value={preferredTimeSlot}
                onChange={(e) => setPreferredTimeSlot(e.target.value)}
                required
              >
                <option value="">-- Chọn khung giờ --</option>
                {timeSlots.map((slot) => (
                  <option key={slot.id} value={slot.id}>{slot.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        {/* Medical Information Section */}
        <div className="border-b pb-4">
          <h3 className="text-lg font-medium text-gray-800 mb-3">Thông tin y tế</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Triệu chứng hiện tại *</label>
              <textarea
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 min-h-24 resize-y"
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                placeholder="Mô tả chi tiết các triệu chứng bạn đang gặp phải"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tiền sử bệnh lý</label>
              <textarea
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 min-h-16 resize-y"
                value={medicalHistory}
                onChange={(e) => setMedicalHistory(e.target.value)}
                placeholder="Các bệnh lý đã mắc trước đây, dị ứng, thuốc đang sử dụng..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tệp đính kèm</label>
              <input
                type="file"
                multiple
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                onChange={handleFileChange}
                accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
              />
              <p className="text-xs text-gray-500 mt-1">Hỗ trợ: JPG, PNG, PDF, DOC - tối đa 5MB/tệp</p>
            </div>
          </div>
        </div>
        
        {/* Additional Options Section */}
        <div className="border-b pb-4">
          <h3 className="text-lg font-medium text-gray-800 mb-3">Tùy chọn bổ sung</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú thêm cho bác sĩ</label>
              <textarea
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 min-h-16 resize-y"
                value={noteForDoctor}
                onChange={(e) => setNoteForDoctor(e.target.value)}
                placeholder="Thông tin bổ sung, yêu cầu đặc biệt..."
              />
            </div>
            
            
          </div>
        </div>
        
        {/* Terms and Conditions */}
        <div className="mb-4">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              className="form-checkbox text-blue-600"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              required
            />
            <span className="ml-2 text-sm text-gray-700">
              Tôi đồng ý với các <a href="#" className="text-blue-600 hover:underline">điều khoản và điều kiện</a> của dịch vụ
            </span>
          </label>
        </div>
        
        {/* Submit Button */}
        <button 
          type="submit"
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? "Đang xử lý..." : "Đặt lịch khám"}
        </button>
      </form>
    </div>
  );
};

export default CreateAppointment;