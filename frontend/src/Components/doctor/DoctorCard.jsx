import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { CheckCircle, Clock, XIcon, RefreshCw, AlertCircle } from "lucide-react";
import { useEffect, useState, useMemo, useCallback, memo } from "react";
import dayjs from "dayjs";
import { useSlots } from "../../hooks/useSlots";
import { useToast } from "../common/Toast";
import ErrorBoundary from "../common/ErrorBoundary";

const dayMap = {
  "Su": "CN",
  "Mo": "T2",
  "Tu": "T3",
  "We": "T4",
  "Th": "T5",
  "Fr": "T6",
  "Sa": "T7",
};

// Memoized DateButton component to prevent unnecessary re-renders
const DateButton = memo(function DateButton({ date, selectedDate, slotsGroupedByDate, onDateSelect, dayMap }) {
  const dateStr = useMemo(() => date.format('YYYY-MM-DD'), [date]);
  const slotsForDate = useMemo(() => slotsGroupedByDate[dateStr] || [], [slotsGroupedByDate, dateStr]);
  const availableCount = useMemo(() => 
    slotsForDate.filter(slot => slot.status === 'AVAILABLE').length, 
    [slotsForDate]
  );
  const isSelected = useMemo(() => date.isSame(selectedDate, "day"), [date, selectedDate]);

  const handleClick = useCallback(() => {
    onDateSelect(date);
  }, [date, onDateSelect]);

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={availableCount === 0}
      className={`text-xs px-3 py-1 rounded-full border transition relative ${
        isSelected
          ? "bg-blue-700 text-white"
          : availableCount > 0
          ? "bg-gray-100 text-gray-700 hover:bg-gray-300"
          : "bg-gray-50 text-gray-400 cursor-not-allowed"
      }`}
      title={`${availableCount} slots available`}
    >
      <div className="flex flex-col items-center">
        <span>{dayMap[date.format("dd")]} - {date.format("DD/MM")}</span>
        {availableCount > 0 && (
          <span className="text-[10px] opacity-75">({availableCount})</span>
        )}
      </div>
    </button>
  );
});

// Memoized SlotButton component
const SlotButton = memo(function SlotButton({ slot, selectedSlot, onSelectSlot }) {
  const isDisabled = slot.status === "BOOKED" || slot.status === "BLOCKED";
  const isSelected = selectedSlot === slot;
  
  const handleClick = useCallback(() => {
    onSelectSlot(slot);
  }, [slot, onSelectSlot]);

  return (
    <button
      type="button"
      key={`${slot.date}-${slot.startTime}`}
      disabled={isDisabled}
      onClick={handleClick}
      className={`text-xs font-medium px-3 py-1 rounded-full transition relative ${
        isDisabled
          ? "bg-gray-400 text-gray-600 cursor-not-allowed"
          : isSelected
          ? "bg-blue-100 hover:bg-blue-300 text-blue-800 ring-2 ring-blue-300"
          : "bg-gray-100 text-gray-700 hover:bg-gray-300"
      }`}
      title={`${slot.startTime} - ${slot.endTime} (${slot.status})`}
    >
      {slot.startTime}
      {slot.status === "BLOCKED" && (
        <span className="ml-1 text-red-500">⚠</span>
      )}
    </button>
  );
});
  
const DoctorCardContent = memo(function DoctorCardContent({ doctor, onSelect, isDisabled, comfirmed }) {
  const today = useMemo(() => dayjs(), []); // Cache today value
  const [selectedDate, setSelectedDate] = useState(today);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const toast = useToast();

  // Memoize the error handler to prevent hook re-creation
  const handleError = useCallback((err) => {
    console.error("Error fetching slots:", err);
    toast.error("Không thể tải lịch khám: " + err.message);
  }, [toast]);

  // Use the optimized slots hook with caching
  const {
    slotsGroupedByDate,
    flatSlots,
    loading,
    error,
    refreshSlots,
    hasCachedData
  } = useSlots(doctor?.id, {
    enableCache: true,
    autoRefresh: false,
    onError: handleError
  });

  // Generate selectable dates based on available slots
  const selectableDates = useMemo(() => {
    const dates = [];
    const availableDates = Object.keys(slotsGroupedByDate);
    
    // If no slots available, show next 7 days
    if (availableDates.length === 0) {
      for (let i = 0; i < 7; i++) {
        dates.push(today.add(i, 'day'));
      }
      return dates;
    }

    // Show dates that have available slots
    availableDates
      .sort()
      .slice(0, 14) // Limit to 2 weeks
      .forEach(dateStr => {
        dates.push(dayjs(dateStr));
      });

    return dates;
  }, [slotsGroupedByDate, today]);

  // Get filtered slots for selected date - memoized with date string for better performance
  const selectedDateStr = useMemo(() => selectedDate.format('YYYY-MM-DD'), [selectedDate]);
  const filteredSlots = useMemo(() => {
    return slotsGroupedByDate[selectedDateStr] || [];
  }, [selectedDateStr, slotsGroupedByDate]);

  // Auto-select first available date if current selection has no slots - debounced
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (filteredSlots.length === 0 && selectableDates.length > 0) {
        const firstAvailableDate = selectableDates.find(date => {
          const dateStr = date.format('YYYY-MM-DD');
          return slotsGroupedByDate[dateStr]?.length > 0;
        });
        
        if (firstAvailableDate && !firstAvailableDate.isSame(selectedDate, 'day')) {
          setSelectedDate(firstAvailableDate);
        }
      }
    }, 100); // Small debounce to prevent rapid updates

    return () => clearTimeout(timeoutId);
  }, [filteredSlots.length, selectableDates, slotsGroupedByDate, selectedDate]);

  const handleSelectDoctor = useCallback(() => {
    if (selectedSlot) {
      onSelect(doctor, selectedSlot);
    }
  }, [selectedSlot, onSelect, doctor]);

  const handleSelectSlot = useCallback((slot) => {
    if (slot.status === "BOOKED" || slot.status === "BLOCKED") {
      return;
    }
    setSelectedSlot(prev => prev === slot ? null : slot);
  }, []);

  const handleRefresh = useCallback(() => {
    refreshSlots();
    setSelectedSlot(null);
    toast.info("Đang làm mới lịch khám...");
  }, [refreshSlots, toast]);

  // Memoized date selection handler to prevent recreating on every render
  const handleDateSelect = useCallback((date) => {
    setSelectedDate(date);
    setSelectedSlot(null);
  }, []);

  // Show loading state
  if (loading && !hasCachedData) {
    return (
      <Card className="w-full max-w-full mx-auto rounded-2xl shadow-lg">
        <CardContent className="p-4 flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gray-200 animate-pulse"></div>
            <div className="flex-1">
              <div className="h-6 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
          <div className="border-t pt-3">
            <div className="h-4 bg-gray-200 rounded animate-pulse mb-3"></div>
            <div className="flex gap-2 mb-3">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="h-8 w-16 bg-gray-200 rounded-full animate-pulse"></div>
              ))}
            </div>
            <div className="flex gap-2">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-8 w-12 bg-gray-200 rounded-full animate-pulse"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
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
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold flex items-center gap-1 text-blue-700">
              <Clock className="w-4 h-4" /> Thời gian khám
            </h3>
            <div className="flex items-center gap-2">
              {error && (
                <div className="flex items-center gap-1 text-red-500 text-xs">
                  <AlertCircle className="w-3 h-3" />
                  <span>Lỗi tải lịch</span>
                </div>
              )}
              {hasCachedData && (
                <div className="text-xs text-green-600">Cached</div>
              )}
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="text-gray-500 hover:text-blue-600 transition-colors"
                title="Làm mới lịch khám"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
        
          {/* Menu chọn ngày */}
          <div className={`${comfirmed ? "pointer-events-none opacity-50" : ""}`}> 
            <div className="flex gap-2 flex-wrap mb-3">
            {selectableDates.map((date, index) => (
              <DateButton
                key={date.format('YYYY-MM-DD')} // Use date as key for better performance
                date={date}
                selectedDate={selectedDate}
                slotsGroupedByDate={slotsGroupedByDate}
                onDateSelect={handleDateSelect}
                dayMap={dayMap}
              />
            ))}
          </div>

          {/* Các slot tương ứng */}
          <div className="flex flex-wrap gap-2 min-h-[40px]">
            {loading && !hasCachedData ? (
              // Loading skeleton for slots
              [1, 2, 3, 4].map(i => (
                <div key={i} className="h-8 w-12 bg-gray-200 rounded-full animate-pulse"></div>
              ))
            ) : filteredSlots.length > 0 ? (
              filteredSlots.map((slot) => (
                <SlotButton
                  key={`${slot.date}-${slot.startTime}`}
                  slot={slot}
                  selectedSlot={selectedSlot}
                  onSelectSlot={handleSelectSlot}
                />
              ))
            ) : error ? (
              <div className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                <span>Không thể tải lịch khám</span>
              </div>
            ) : (
              <span className="text-sm text-gray-500">Không có lịch trống</span>
            )}
          </div>
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
              onSelect(null, null);
              return;
            }
            handleSelectDoctor();
          }}
          disabled={!comfirmed && (!selectedSlot || loading)}
        >
          <div className="flex items-center justify-center gap-2">
            {loading && !hasCachedData ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" /> 
                <span>Đang tải...</span>
              </>
            ) : comfirmed ? (
              <>
                <XIcon className="w-4 h-4" />
                <span>Hủy chọn</span>
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                <span>Xác nhận chọn BS</span>
              </>
            )}
          </div>
        </Button>
      </CardContent>
    </Card>
  );
});

// Export with ErrorBoundary wrapper
export default function DoctorCard(props) {
  return (
    <ErrorBoundary fallbackMessage="Không thể tải thông tin bác sĩ">
      <DoctorCardContent {...props} />
    </ErrorBoundary>
  );
}
