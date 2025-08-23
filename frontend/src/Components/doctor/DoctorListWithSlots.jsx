import React, { useState, useEffect } from 'react';
import DoctorCard from './DoctorCard';
import SlotSummary from './SlotSummary';
import { Card, CardContent } from '../ui/card';
import { Search, Users, Calendar } from 'lucide-react';
import SlotService from '../../services/slotService';

/**
 * Enhanced doctor list component with slot integration
 * Shows doctor cards with slot summaries for better UX
 */
const DoctorListWithSlots = ({ 
  doctors = [], 
  onDoctorSelect, 
  selectedDoctor, 
  showSlotSummary = true,
  preloadSlots = true 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredDoctors, setFilteredDoctors] = useState(doctors);

  // Preload slots for better performance
  useEffect(() => {
    if (preloadSlots && doctors.length > 0) {
      const doctorIds = doctors.map(d => d.id);
      SlotService.preloadSlots(doctorIds);
    }
  }, [doctors, preloadSlots]);

  // Filter doctors based on search
  useEffect(() => {
    if (!searchTerm) {
      setFilteredDoctors(doctors);
    } else {
      const filtered = doctors.filter(doctor =>
        doctor.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.specialty?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredDoctors(filtered);
    }
  }, [doctors, searchTerm]);

  if (doctors.length === 0) {
    return (
      <Card className="w-full">
        <CardContent className="p-8 text-center">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Không có bác sĩ nào
          </h3>
          <p className="text-gray-500">
            Hiện tại chưa có bác sĩ nào trong hệ thống.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Tìm kiếm bác sĩ theo tên hoặc chuyên khoa..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Tìm thấy {filteredDoctors.length} bác sĩ
          {searchTerm && ` cho "${searchTerm}"`}
        </p>
        
        {showSlotSummary && (
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Calendar className="w-3 h-3" />
            <span>Tổng quan lịch khám 7 ngày tới</span>
          </div>
        )}
      </div>

      {/* Doctor list */}
      <div className="space-y-4">
        {filteredDoctors.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Search className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">
                Không tìm thấy bác sĩ nào phù hợp với từ khóa "{searchTerm}"
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredDoctors.map((doctor) => (
            <div key={doctor.id} className="space-y-2">
              {/* Slot summary */}
              {showSlotSummary && (
                <SlotSummary doctorId={doctor.id} days={7} />
              )}
              
              {/* Doctor card */}
              <DoctorCard
                doctor={doctor}
                onSelect={onDoctorSelect}
                isDisabled={false}
                comfirmed={selectedDoctor?.id === doctor.id}
              />
            </div>
          ))
        )}
      </div>

      {/* Performance info (dev mode only) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-600">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="font-medium">Performance Info</span>
          </div>
          <p>• Slot caching: Enabled</p>
          <p>• Preload slots: {preloadSlots ? 'Yes' : 'No'}</p>
          <p>• Doctors loaded: {doctors.length}</p>
          <p>• Filtered results: {filteredDoctors.length}</p>
        </div>
      )}
    </div>
  );
};

export default DoctorListWithSlots;
