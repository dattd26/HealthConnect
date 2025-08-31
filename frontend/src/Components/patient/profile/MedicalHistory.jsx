import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { config } from '../../../config/config.js';
import { Calendar, User, FileText, Download, Share2 } from 'lucide-react';
import { AuthContext } from '../../../context/AuthContext';

const MedicalHistory = () => {
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterBy, setFilterBy] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchMedicalRecords = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${config.API_BASE_URL}/medical-records/patient/${user.id}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
          }
        });
        setMedicalRecords(response.data);
      } catch (error) {
        setError("Đã xảy ra lỗi khi tải lịch sử khám: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMedicalRecords();
  }, [user]);

  const handleViewDetails = (record) => {
    setSelectedRecord(record);
  };

  const handleCloseDetails = () => {
    setSelectedRecord(null);
  };

  const handleDownloadRecord = (recordId) => {
    // Implementation for downloading the record as PDF
    console.log("Downloading record:", recordId);
  };

  const handleShareRecord = (recordId) => {
    // Implementation for sharing the record
    console.log("Sharing record:", recordId);
  };

  const filteredRecords = medicalRecords.filter(record => {
    // Filter by search term
    const searchMatch = searchTerm === '' || 
      record.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.doctor.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.hospitalName.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by category
    const categoryMatch = filterBy === 'all' || record.visitType === filterBy;
    
    return searchMatch && categoryMatch;
  });

  if (loading) return (
    <div className="flex justify-center items-center h-40">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return <div className="text-red-500 p-4">{error}</div>;

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Lịch sử khám bệnh</h2>
      
      {/* Filters and Search */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-1/3">
          <select
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Tất cả loại khám</option>
            <option value="EXAMINATION">Khám thông thường</option>
            <option value="TEST">Xét nghiệm</option>
            <option value="EMERGENCY">Cấp cứu</option>
            <option value="FOLLOW_UP">Tái khám</option>
          </select>
        </div>
        <div className="w-full md:w-2/3">
          <input
            type="text"
            placeholder="Tìm kiếm theo tên bác sĩ, chẩn đoán, bệnh viện..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Records List */}
      {filteredRecords.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Không có lịch sử khám bệnh</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRecords.map((record) => (
            <div key={record.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex flex-col md:flex-row justify-between">
                <div className="mb-3 md:mb-0">
                  <h3 className="text-lg font-medium text-gray-800">{record.visitType === 'EXAMINATION' ? 'Khám thông thường' : 
                                                                     record.visitType === 'TEST' ? 'Xét nghiệm' :
                                                                     record.visitType === 'EMERGENCY' ? 'Cấp cứu' : 'Tái khám'}</h3>
                  <div className="flex items-center text-gray-500 text-sm mt-1">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>{new Date(record.visitDate).toLocaleDateString('vi-VN')}</span>
                  </div>
                  <div className="flex items-center text-gray-500 text-sm mt-1">
                    <User className="w-4 h-4 mr-1" />
                    <span>BS. {record.doctor.fullName}</span>
                  </div>
                  <div className="mt-2">
                    <span className="text-sm">Chẩn đoán: </span>
                    <span className="text-sm font-medium">{record.diagnosis}</span>
                  </div>
                </div>
                <div className="flex flex-row md:flex-col gap-2 items-start">
                  <button
                    onClick={() => handleViewDetails(record)}
                    className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300 flex items-center"
                  >
                    <FileText className="w-4 h-4 mr-1" />
                    Chi tiết
                  </button>
                  <button
                    onClick={() => handleDownloadRecord(record.id)}
                    className="px-3 py-1.5 text-sm bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition duration-300 flex items-center"
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Tải xuống
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Medical Record Details Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Chi tiết khám bệnh</h2>
                <button
                  onClick={handleCloseDetails}
                  className="text-gray-500 hover:text-gray-700"
                >
                  &times;
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-500">Ngày khám</p>
                  <p className="font-medium">{new Date(selectedRecord.visitDate).toLocaleDateString('vi-VN')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Loại khám</p>
                  <p className="font-medium">
                    {selectedRecord.visitType === 'EXAMINATION' ? 'Khám thông thường' : 
                     selectedRecord.visitType === 'TEST' ? 'Xét nghiệm' :
                     selectedRecord.visitType === 'EMERGENCY' ? 'Cấp cứu' : 'Tái khám'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Bác sĩ</p>
                  <p className="font-medium">BS. {selectedRecord.doctor.fullName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Bệnh viện/Phòng khám</p>
                  <p className="font-medium">{selectedRecord.hospitalName}</p>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-medium text-gray-800 mb-2">Triệu chứng</h3>
                <p className="text-gray-700 bg-gray-50 p-3 rounded-md">
                  {selectedRecord.symptoms}
                </p>
              </div>

              <div className="mb-6">
                <h3 className="font-medium text-gray-800 mb-2">Chẩn đoán</h3>
                <p className="text-gray-700 bg-gray-50 p-3 rounded-md">
                  {selectedRecord.diagnosis}
                </p>
              </div>

              {selectedRecord.prescriptions && selectedRecord.prescriptions.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-medium text-gray-800 mb-2">Đơn thuốc</h3>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b">
                          <th className="pb-2">Tên thuốc</th>
                          <th className="pb-2">Liều lượng</th>
                          <th className="pb-2">Hướng dẫn</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedRecord.prescriptions.map((prescription, index) => (
                          <tr key={index} className="border-b last:border-0">
                            <td className="py-2">{prescription.medicationName}</td>
                            <td className="py-2">{prescription.dosage}</td>
                            <td className="py-2">{prescription.instructions}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {selectedRecord.testResults && selectedRecord.testResults.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-medium text-gray-800 mb-2">Kết quả xét nghiệm</h3>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <ul className="space-y-2">
                      {selectedRecord.testResults.map((test, index) => (
                        <li key={index}>
                          <p className="font-medium">{test.testName}</p>
                          <p className="text-sm">{test.result}</p>
                          {test.normalRange && (
                            <p className="text-xs text-gray-500">Chỉ số bình thường: {test.normalRange}</p>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              <div className="mb-6">
                <h3 className="font-medium text-gray-800 mb-2">Ghi chú</h3>
                <p className="text-gray-700 bg-gray-50 p-3 rounded-md">
                  {selectedRecord.notes || 'Không có ghi chú'}
                </p>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => handleShareRecord(selectedRecord.id)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition duration-300 flex items-center"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Chia sẻ
                </button>
                <button
                  onClick={() => handleDownloadRecord(selectedRecord.id)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300 flex items-center"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Tải xuống PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicalHistory; 