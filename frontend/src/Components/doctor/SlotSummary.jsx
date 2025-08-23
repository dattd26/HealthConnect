import React from 'react';
import { Calendar, Clock, AlertCircle } from 'lucide-react';
import { useSlotSummary } from '../../hooks/useSlots';
import dayjs from 'dayjs';

const SlotSummary = ({ doctorId, days = 7 }) => {
  const { summary, loading, error } = useSlotSummary(doctorId, days);

  if (loading) {
    return (
      <div className="bg-gray-50 rounded-lg p-3">
        <div className="flex items-center gap-2 mb-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-medium text-gray-600">Tổng quan lịch khám</span>
        </div>
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="h-8 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 rounded-lg p-3">
        <div className="flex items-center gap-2 text-red-600">
          <AlertCircle className="w-4 h-4" />
          <span className="text-sm">Không thể tải tổng quan lịch</span>
        </div>
      </div>
    );
  }

  const today = dayjs();
  const summaryDates = Array.from({ length: days }, (_, i) => {
    const date = today.add(i, 'day');
    const dateStr = date.format('YYYY-MM-DD');
    const count = summary[dateStr] || 0;
    
    return {
      date,
      dateStr,
      count,
      isToday: date.isSame(today, 'day'),
      isWeekend: date.day() === 0 || date.day() === 6
    };
  });

  const totalSlots = Object.values(summary).reduce((sum, count) => sum + count, 0);

  return (
    <div className="bg-blue-50 rounded-lg p-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-medium text-blue-800">Tổng quan lịch khám</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-blue-600">
          <Clock className="w-3 h-3" />
          <span>{totalSlots} slots</span>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {summaryDates.map(({ date, count, isToday, isWeekend }) => (
          <div
            key={date.format('YYYY-MM-DD')}
            className={`text-center p-1 rounded text-xs ${
              isToday
                ? 'bg-blue-600 text-white font-bold'
                : count > 0
                ? 'bg-green-100 text-green-800'
                : isWeekend
                ? 'bg-gray-100 text-gray-400'
                : 'bg-red-100 text-red-600'
            }`}
            title={`${date.format('DD/MM')} - ${count} slots available`}
          >
            <div className="font-medium">{date.format('DD')}</div>
            <div className="text-[10px] opacity-75">
              {count > 0 ? count : '—'}
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex justify-between items-center mt-2 text-xs text-blue-600">
        <span>Hôm nay</span>
        <span>{days} ngày tới</span>
      </div>
    </div>
  );
};

export default SlotSummary;
