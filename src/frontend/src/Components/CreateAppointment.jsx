import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./style.css"
const CreateAppointment = ({ doctors }) => {
  const [doctorId, setDoctorId] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [notes, setNotes] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "/api/appointments",
        { doctorId, appointmentTime, notes },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Lịch hẹn đã được tạo thành công!");
      navigate("/appointments");
    } catch (err) {
      console.error("Lỗi tạo lịch hẹn:", err);
    }
  };

  return (
    <div className="create-appointment">
      <h2>Đặt lịch hẹn mới</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Chọn bác sĩ:</label>
          <select
            value={doctorId}
            onChange={(e) => setDoctorId(e.target.value)}
            required
          >
            <option value="">-- Chọn bác sĩ --</option>
            {doctors.map((doctor) => (
              <option key={doctor.id} value={doctor.id}>
                {doctor.username}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Thời gian:</label>
          <input
            type="datetime-local"
            value={appointmentTime}
            onChange={(e) => setAppointmentTime(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Ghi chú:</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
        <button type="submit">Đặt lịch</button>
      </form>
    </div>
  );
};

export default CreateAppointment;