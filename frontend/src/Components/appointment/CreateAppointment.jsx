import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { appointmentService } from "../../services/appointmentService";
import { AuthContext } from "../../context/AuthContext";
import dayjs from "dayjs";
import medicalSpecialtyService from "../../services/medicalSpecialtyService";
import DoctorCard from "../doctor/DoctorCard";

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
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [consultationType, setConsultationType] = useState("online");
  const [preferredTimeSlot, setPreferredTimeSlot] = useState(null);

  // Medical Information
  const [symptoms, setSymptoms] = useState("");
  const [medicalHistory, setMedicalHistory] = useState("");
  const [attachments, setAttachments] = useState([]);

  // Additional Options
  const [noteForDoctor, setNoteForDoctor] = useState("");
  const [bookingFor, setBookingFor] = useState("self");
  const [acceptTerms, setAcceptTerms] = useState(false);

  // Specialty / Doctors
  const [specialties, setSpecialties] = useState([]);
  const [selectedSpecialtyCode, setSelectedSpecialtyCode] = useState("");
  const [doctorsList, setDoctorsList] = useState([]);

  useEffect(() => {
    const fetchSpecialties = async () => {
      try {
        const specs = await medicalSpecialtyService.getMedicalSpecialties();
        setSpecialties(specs || []);
      } catch (err) {
        console.error("Error loading specialties:", err);
      }
    };
    fetchSpecialties();
  }, []);

  // Auto-fill patient information from profile
  useEffect(() => {
    if (!user) return;
    if (bookingFor === "self") {
      setFullName(user.fullName || "");
      setGender((user.gender || "").toLowerCase());
      setDateOfBirth(user.dateOfBirth || "");
      setPhoneNumber(user.phone || "");
      setEmail(user.email || "");
      setAddress(user.address || "");
    } else {
      setFullName("");
      setGender("");
      setDateOfBirth("");
      setPhoneNumber("");
      setEmail("");
      setAddress("");
    }
  }, [bookingFor, user]);

  // Handle specialty → doctors
  const handleSelectSpecialty = (e) => {
    const code = e.target.value;
    setSelectedSpecialtyCode(code);
    setSelectedDoctor(null);
    setPreferredTimeSlot(null);
    if (!code) {
      setDoctorsList([]);
      return;
    }
    const spec = specialties.find((s) => s.code === code);
    setDoctorsList(spec?.doctors || []);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    // optional: filter size <= 5MB
    const valid = files.filter((f) => f.size <= 5 * 1024 * 1024);
    setAttachments(valid);
  };

  const handleSelectDoctor = (doctor, slot) => {
    setSelectedDoctor(doctor);
    setPreferredTimeSlot(slot);
  };

  const canSubmit =
    !!fullName &&
    !!gender &&
    !!dateOfBirth &&
    !!phoneNumber &&
    !!email &&
    !!selectedDoctor &&
    !!preferredTimeSlot &&
    !!symptoms &&
    acceptTerms &&
    !loading;

  const minDate = dayjs().add(1, "day").format("YYYY-MM-DD");
  const maxDate = dayjs().add(30, "day").format("YYYY-MM-DD");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!acceptTerms) {
      alert("Vui lòng chấp nhận điều khoản và điều kiện trước khi đặt lịch.");
      return;
    }
    if (!selectedDoctor || !preferredTimeSlot) {
      alert("Vui lòng chọn bác sĩ và thời gian khám.");
      return;
    }

    const apptDateTime = dayjs(
      `${preferredTimeSlot.date}T${preferredTimeSlot.startTime}`
    );
    if (apptDateTime.isBefore(dayjs().add(24, "hour"))) {
      alert("Cần đặt lịch hẹn trước ít nhất 24 giờ.");
      return;
    }
    if (apptDateTime.isAfter(dayjs().add(30, "day"))) {
      alert("Không thể đặt lịch hẹn trước quá 30 ngày.");
      return;
    }

    setLoading(true);
    try {
      const appointmentData = {
        doctorId: parseInt(selectedDoctor.id, 10),
        date: preferredTimeSlot.date,
        startTime: preferredTimeSlot.startTime,
        notes: `Triệu chứng: ${symptoms}\nTiền sử: ${medicalHistory}\nGhi chú: ${noteForDoctor}\nHình thức: ${consultationType === "online" ? "Khám online" : "Khám trực tiếp"}`,
      };

      const data = await appointmentService.createAppointment(appointmentData);

      // Lưu pending để sang trang thanh toán
      localStorage.setItem(
        "pendingAppointment",
        JSON.stringify({
          appointmentId: data.id,
          doctorName: selectedDoctor.name,
          specialty: selectedDoctor.specialty,
          date: preferredTimeSlot.date,
          startTime: preferredTimeSlot.startTime,
          consultationType,
          amount: 500000,
        })
      );

      navigate("/payment", {
        state: {
          appointment: data,
          doctor: selectedDoctor,
          timeSlot: preferredTimeSlot,
          consultationType,
        },
      });
    } catch (err) {
      console.error("Lỗi tạo lịch hẹn:", err);
      const msg =
        err?.response?.data?.message ||
        "Đã xảy ra lỗi khi đặt lịch. Vui lòng thử lại sau.";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  // Quick summary box
  const Summary = () => (
    <div className="rounded-lg border border-blue-100 bg-blue-50 p-4 text-sm text-blue-700">
      <div className="font-semibold mb-2">Tóm tắt lựa chọn</div>
      <ul className="space-y-1">
        <li>
          <span className="font-medium">Chuyên khoa:</span>{" "}
          {selectedSpecialtyCode
            ? specialties.find((s) => s.code === selectedSpecialtyCode)?.name
            : "—"}
        </li>
        <li>
          <span className="font-medium">Bác sĩ:</span>{" "}
          {selectedDoctor ? selectedDoctor.name : "—"}
        </li>
        <li>
          <span className="font-medium">Thời gian:</span>{" "}
          {preferredTimeSlot
            ? `${dayjs(preferredTimeSlot.date).format("DD/MM/YYYY")} • ${preferredTimeSlot.startTime}`
            : "—"}
        </li>
        <li>
          <span className="font-medium">Hình thức:</span>{" "}
          {consultationType === "online" ? "Khám online" : "Khám trực tiếp"}
        </li>
      </ul>
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white rounded-t-xl">
        <h2 className="text-xl font-semibold text-blue-700">Đặt lịch hẹn mới</h2>
        <p className="text-sm text-gray-500 mt-1">
          Chọn chuyên khoa, bác sĩ và thời gian phù hợp. Điền thông tin y tế để bác sĩ chuẩn bị tốt nhất.
        </p>
      </div>

      <form onSubmit={handleSubmit} id="create-appointment-form" className="p-6 space-y-8">
        {/* Booking for */}
        <section className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">Người đặt hộ</label>
          <div className="flex flex-wrap gap-4">
            <label className="inline-flex items-center gap-2">
              <input
                type="radio"
                className="form-radio text-blue-600"
                name="bookingFor"
                value="self"
                checked={bookingFor === "self"}
                onChange={() => setBookingFor("self")}
              />
              <span>Đặt cho bản thân</span>
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                type="radio"
                className="form-radio text-blue-600"
                name="bookingFor"
                value="other"
                checked={bookingFor === "other"}
                onChange={() => setBookingFor("other")}
              />
              <span>Đặt cho người thân</span>
            </label>
          </div>
        </section>

        {/* Personal info */}
        <section className="space-y-4">
          <h3 className="text-base font-semibold text-gray-800">Thông tin cá nhân</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên *</label>
              <input
                type="text"
                className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Giới tính *</label>
              <select
                className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={gender || ""}
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
                className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                required
                max={dayjs().format("YYYY-MM-DD")}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại *</label>
              <input
                type="tel"
                className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
                placeholder="0xxxxxxxxx"
              />
            </div>
            {/* <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
              <input
                type="email"
                className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="email@domain.com"
              />
            </div> */}
            {/* <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
              <input
                type="text"
                className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành"
              />
            </div> */}
          </div>
        </section>

        {/* Appointment info */}
        <section className="space-y-4">
          <h3 className="text-base font-semibold text-gray-800">Thông tin khám bệnh</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Specialty */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Chuyên khoa *</label>
              <select
                className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={selectedSpecialtyCode}
                onChange={handleSelectSpecialty}
                required
              >
                <option value="">-- Chọn chuyên khoa --</option>
                {specialties.map((spec) => (
                  <option key={spec.code} value={spec.code}>
                    {spec.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hình thức khám *</label>
              <div className="flex flex-wrap gap-6 mt-2">
                <label className="inline-flex items-center gap-2 text-gray-500">
                  <input
                    type="radio"
                    className="form-radio text-blue-600"
                    name="consultationType"
                    value="inperson"
                    checked={consultationType === "inperson"}
                    onChange={() => setConsultationType("inperson")}
                    disabled
                  />
                  <span>Khám trực tiếp (sắp mở)</span>
                </label>
                <label className="inline-flex items-center gap-2">
                  <input
                    type="radio"
                    className="form-radio text-blue-600"
                    name="consultationType"
                    value="online"
                    checked={consultationType === "online"}
                    onChange={() => setConsultationType("online")}
                  />
                  <span>Khám online</span>
                </label>
              </div>
            </div>
          </div>

          {/* Doctor list */}
          <div className="mt-2">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">Bác sĩ phù hợp</label>
              {doctorsList.length > 0 && (
                <div className="text-sm text-gray-500">
                  {doctorsList.length} bác sĩ có sẵn
                </div>
              )}
            </div>
            
            {doctorsList.length > 0 ? (
              <div className="relative">
                <div className="space-y-4 max-h-96 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                  {doctorsList.map((doctor) =>
                    doctor ? (
                      <DoctorCard
                        key={doctor.id}
                        doctor={doctor}
                        onSelect={(d, slot) => handleSelectDoctor(d, slot)}
                        isDisabled={selectedDoctor !== null && doctor.id !== selectedDoctor?.id}
                        confirmed={selectedDoctor?.id === doctor.id}
                      />
                    ) : null
                  )}
                </div>
                
                {/* Scroll indicator */}
                {doctorsList.length > 3 && (
                  <div className="mt-2 text-center">
                    <div className="inline-flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                      <span>↓ Cuộn xuống để xem thêm {doctorsList.length - 3} bác sĩ</span>
                    </div>
                  </div>
                )}
                
                {/* Quick selection hint */}
                {doctorsList.length > 1 && !selectedDoctor && (
                  <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center gap-2 text-sm text-yellow-700">
                      <span className="text-lg">💡</span>
                      <span>
                        Mẹo: Có {doctorsList.length} bác sĩ để lựa chọn. 
                        Hãy cuộn xuống để xem tất cả và chọn bác sĩ phù hợp nhất.
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-sm text-gray-600 italic">
                Vui lòng chọn chuyên khoa để xem danh sách bác sĩ.
              </div>
            )}
            
            {/* Summary */}
            <div className="mt-4">
              <Summary />
            </div>
          </div>
        </section>

        {/* Medical info */}
        <section className="space-y-4">
          <h3 className="text-base font-semibold text-gray-800">Thông tin y tế</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Triệu chứng hiện tại *</label>
              <textarea
                className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-24 resize-y"
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                placeholder="Mô tả chi tiết các triệu chứng bạn đang gặp phải"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tiền sử bệnh lý</label>
              <textarea
                className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-16 resize-y"
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
                className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                onChange={handleFileChange}
                accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
              />
              <p className="text-xs text-gray-500 mt-1">
                Hỗ trợ: JPG, PNG, PDF, DOC — tối đa 5MB/tệp
              </p>
              {attachments.length > 0 && (
                <ul className="mt-2 text-sm text-gray-700 list-disc pl-5 space-y-1">
                  {attachments.map((f) => (
                    <li key={f.name}>
                      {f.name} <span className="text-gray-500">({Math.round(f.size / 1024)}KB)</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </section>

        {/* Terms */}
        <section className="space-y-3">
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              className="form-checkbox text-blue-600"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              required
            />
            <span className="text-sm text-gray-700">
              Tôi đồng ý với các{" "}
              <a href="#" className="text-blue-600 hover:underline">
                điều khoản và điều kiện
              </a>{" "}
              của dịch vụ
            </span>
          </label>
        </section>

        {/* Submit */}
        <div className="pt-2">
          <button
            type="submit"
            form="create-appointment-form"
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={!canSubmit}
            aria-busy={loading ? "true" : "false"}
          >
            {loading ? "Đang xử lý..." : "Đặt lịch khám"}
          </button>
          {/* gợi ý thời gian hợp lệ */}
          <p className="text-xs text-gray-500 mt-2">
            Thời gian khám phải cách hiện tại tối thiểu 24 giờ và không quá {dayjs(maxDate).diff(dayjs(), "day")} ngày.
          </p>
        </div>
      </form>
    </div>
  );
};

export default CreateAppointment;
