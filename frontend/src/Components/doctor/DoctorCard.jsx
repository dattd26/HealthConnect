import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { CheckCircle, Clock, XIcon } from "lucide-react";
import { useEffect } from "react";
import axios from "axios";
import { useState } from "react";
import dayjs from "dayjs";

export default function DoctorCard({ doctor, onSelect, isDisabled, comfirmed }) {
  const [slots, setSlots] = useState([]);
  const today = dayjs();
  const [selectedDate, setSelectedDate] = useState(today);
  const [selectableDates, setSelectableDates] = useState([]);
  const [filteredSlots, setFilteredSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedSlotId, setSelectedSlotId] = useState(null);

  const getDateOfWeekday  = (dayOfWeek) => {
    const dayMap = {
      "SUNDAY": 0,
      "MONDAY": 1,
      "TUESDAY": 2,
      "WEDNESDAY": 3,
      "THURSDAY": 4,
      "FRIDAY": 5,
      "SATURDAY": 6,
    };
    const today = new Date();
    const currentDay = today.getDay();
    const targetDay = dayMap[dayOfWeek];

    const difference = (targetDay - currentDay + 7) % 7;
    const resultDate = new Date(today);
    resultDate.setDate(resultDate.getDate() + difference);

    return resultDate;
  }
  const generateSlotsFromSchedule = (schedule) => {
    const slots = [];

    schedule.forEach(({ dayOfWeek, startTime, endTime, duration }) => {
      const date = getDateOfWeekday(dayOfWeek);

      const [startHour, startMinute] = startTime.split(":").map(Number);
      const [endHour, endMinute] = endTime.split(":").map(Number);

      const durationMinutes = parseISO8601Duration(duration); // ví dụ PT30M => 30

      const startDateTime = new Date(date);
      startDateTime.setHours(startHour, startMinute, 0, 0);

      const endDateTime = new Date(date);
      endDateTime.setHours(endHour, endMinute, 0, 0);

      let current = new Date(startDateTime);

      while (current < endDateTime) {
        slots.push({slotId: new Date(current).toISOString(), start: new Date(current), end: new Date(current.getTime() + durationMinutes * 60000)});
        current = new Date(current.getTime() + durationMinutes * 60000);
      }
    });

    return slots;
  };

  const parseISO8601Duration = (duration) => {
    const match = duration.match(/PT(\d+)M/);
    return match ? parseInt(match[1]) : 0;
  };

  useEffect(() => {
    const fetchAvailableSlots = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/doctors/${doctor.id}/available-slots`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
          }
        });
        setSlots(generateSlotsFromSchedule(response.data));
      }
      catch (error) {
        console.error("Error fetching available slots:", error);
        setSlots([]);
      }
    }
    fetchAvailableSlots();
    setSelectableDates(getSelectableDates());
  }, [doctor]);

  useEffect(() => {
    setFilteredSlots(slots.filter(slot => (
      dayjs(slot.start).isSame(selectedDate, 'day')
    )));
  }, [selectedDate, slots]);

  const getSelectableDates = () => {
    const dates = [];

    for (let i = 0; i < 7 - today.day(); i++) {
      const date = today.add(i, 'day');
      dates.push(date);
    }
    const startDateNextWeek = today.add(7 - today.day(), 'day');

    for (let i = 0; i < 7; i++) {
      const date = startDateNextWeek.add(i, 'day');
      dates.push(date);
    }
    return dates;
  } 
  // const handleSelectDate = () => {

  //   onSelect(date,)
  // }
  const handleSelectDoctor = () => {
    if (selectedSlot) {
      onSelect(
        doctor,
        selectedSlot,
      );
    }
  }
  return (
    <Card className={`w-full max-w-full mx-auto rounded-2xl shadow-lg ${isDisabled ? "pointer-events-none opacity-50" : ""}`}>
      <CardContent className="p-4 flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <img
            // src={doctor.avatarUrl}
            alt={doctor.fullName}
            className="w-16 h-16 rounded-full object-cover"
          />
          <div>
            <h2 className="text-lg font-bold">{doctor.fullName}</h2>
            <p className="text-sm text-gray-600">Chuyên gia tham vấn cá nhân và gia đình tại SUNNYCARE
Hiện đang phụ trách Phòng tâm lý y học của Viện pháp y
Chuyên gia chuyên tham vấn các rối nhiễu tâm lý, loạn thần, định hướng nghề nghiệp</p>
            {/* <p className="text-sm text-gray-500">{doctor.hospital}</p> */}
          </div>
        </div>

        <div className="border-t pt-3">
        <h3 className="text-sm font-semibold mb-2 flex items-center gap-1 text-blue-700">
          <Clock className="w-4 h-4" /> Thời gian khám, Hôm nay
        </h3>
        {/* Menu chọn ngày */}
      <div className="flex gap-2 flex-wrap mb-3">
        {selectableDates.map((date, index) => (
          <button
            type="button"
            key={index}
            onClick={() => {
              setSelectedDate(date);
            }}
            className={`text-xs px-3 py-1 rounded-full border transition ${
              date.isSame(selectedDate, "day")
                ? "bg-blue-700 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {date.format("dd DD/MM")}
          </button>
        ))}
      </div>

      {/* Các slot tương ứng */}
      <div className="flex flex-wrap gap-2">
        {filteredSlots.length > 0 ? (
          filteredSlots.map((slot, index) => (
            <button
              type="button"
              key={index}
              onClick={() => {
                setSelectedSlot(slot);
                setSelectedSlotId(slot.slotId);
              }}
              className={`${selectedSlotId === slot.slotId ? "bg-blue-100 hover:bg-blue-300 text-blue-800" : "bg-gray-100 text-gray-700 hover:bg-gray-300"} text-xs font-medium px-3 py-1 rounded-full transition`}
            >
              {dayjs(slot.start).format("HH:mm")} - {dayjs(slot.end).format("HH:mm")} | {dayjs(slot.start).format("DD/MM/YYYY")}
            </button>
          ))
        ) : (
          <span className="text-sm text-gray-500">Không có lịch trống</span>
        )}
      </div>
      </div>
        
        <Button
          type="button"
          className={`w-full mt-3 transition-all duration-200 ${
            comfirmed ? "bg-red-500 hover:bg-red-600 text-white" : "bg-green-600 hover:bg-green-700 text-white"
          }`}
          onClick={() => {
            if (comfirmed) {
              setSelectedSlot(null);
              setSelectedSlotId(null);
              onSelect(null, null);
              return;
            }
            handleSelectDoctor();
          }}
          disabled={!selectedSlot}
        >
            <div className="flex items-center justify-center gap-2">
            {comfirmed ? (
              <><XIcon className="w-4 h-4" /> Hủy chọn</>
            ) : (
              <><CheckCircle className="w-4 h-4" /> Xác nhận chọn BS</>
            )}
            </div>
        </Button>
      </CardContent>
    </Card>
  );
}
