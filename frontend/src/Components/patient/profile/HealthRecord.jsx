import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { config } from '../../../config/config.js';
import { Plus, Trash2, Save } from 'lucide-react';

const HealthRecord = ({ userData }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [healthData, setHealthData] = useState({
    bloodType: '',
    height: '',
    weight: '',
    bmi: '',
    medicalConditions: [],
    allergies: [],
    medications: []
  });
  const [newCondition, setNewCondition] = useState('');
  const [newAllergy, setNewAllergy] = useState('');
  const [newMedication, setNewMedication] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchHealthData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${config.API_BASE_URL}/user/health-record`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
          }
        });
        
        if (response.data) {
          setHealthData(response.data);
        }
      } catch (error) {
        console.error("Error fetching health data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHealthData();
  }, []);

  const calculateBMI = () => {
    if (healthData.height && healthData.weight) {
      const heightInMeters = healthData.height / 100;
      const bmi = (healthData.weight / (heightInMeters * heightInMeters)).toFixed(1);
      setHealthData({
        ...healthData,
        bmi: bmi
      });
    }
  };

  useEffect(() => {
    if (isEditing) {
      calculateBMI();
    }
  }, [healthData.height, healthData.weight, isEditing]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setHealthData({
      ...healthData,
      [name]: value
    });
  };

  const handleAddCondition = () => {
    if (newCondition.trim()) {
      setHealthData({
        ...healthData,
        medicalConditions: [...healthData.medicalConditions, newCondition.trim()]
      });
      setNewCondition('');
    }
  };

  const handleRemoveCondition = (index) => {
    const updatedConditions = [...healthData.medicalConditions];
    updatedConditions.splice(index, 1);
    setHealthData({
      ...healthData,
      medicalConditions: updatedConditions
    });
  };

  const handleAddAllergy = () => {
    if (newAllergy.trim()) {
      setHealthData({
        ...healthData,
        allergies: [...healthData.allergies, newAllergy.trim()]
      });
      setNewAllergy('');
    }
  };

  const handleRemoveAllergy = (index) => {
    const updatedAllergies = [...healthData.allergies];
    updatedAllergies.splice(index, 1);
    setHealthData({
      ...healthData,
      allergies: updatedAllergies
    });
  };

  const handleAddMedication = () => {
    if (newMedication.trim()) {
      setHealthData({
        ...healthData,
        medications: [...healthData.medications, newMedication.trim()]
      });
      setNewMedication('');
    }
  };

  const handleRemoveMedication = (index) => {
    const updatedMedications = [...healthData.medications];
    updatedMedications.splice(index, 1);
    setHealthData({
      ...healthData,
      medications: updatedMedications
    });
  };

  const handleSubmit = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const token = localStorage.getItem('token');
              await axios.put(`${config.API_BASE_URL}/user/health-record/update`, healthData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        }
      });
      setSuccess("Hồ sơ sức khỏe đã được cập nhật thành công!");
      setIsEditing(false);
    } catch (error) {
      setError(error.response?.data?.message || "Đã xảy ra lỗi khi cập nhật hồ sơ sức khỏe");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset to original data
    const fetchHealthData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${config.API_BASE_URL}/user/health-record`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
          }
        });
        
        if (response.data) {
          setHealthData(response.data);
        }
      } catch (error) {
        console.error("Error fetching health data:", error);
      }
    };

    fetchHealthData();
    setIsEditing(false);
    setError(null);
    setSuccess(null);
  };

  const getBMIStatus = (bmi) => {
    if (!bmi) return { status: 'Không có dữ liệu', color: 'gray-500' };
    
    const bmiValue = parseFloat(bmi);
    if (bmiValue < 18.5) return { status: 'Thiếu cân', color: 'yellow-500' };
    if (bmiValue < 25) return { status: 'Bình thường', color: 'green-500' };
    if (bmiValue < 30) return { status: 'Thừa cân', color: 'orange-500' };
    return { status: 'Béo phì', color: 'red-500' };
  };

  const bmiStatus = getBMIStatus(healthData.bmi);

  if (loading) return (
    <div className="flex justify-center items-center h-40">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Hồ sơ sức khỏe</h2>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
          >
            Cập nhật
          </button>
        ) : (
          <div className="flex space-x-3">
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition duration-300"
            >
              Hủy
            </button>
            <button
              onClick={handleSubmit}
              disabled={saving}
              className={`px-4 py-2 flex items-center ${saving ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} text-white rounded-md transition duration-300`}
            >
              {saving ? 'Đang lưu...' : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Lưu
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Health Metrics */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <h3 className="font-medium text-gray-800 mb-4">Chỉ số cơ bản</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nhóm máu</label>
              {isEditing ? (
                <select
                  name="bloodType"
                  value={healthData.bloodType || ''}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">-- Chọn nhóm máu --</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              ) : (
                <p className="text-gray-800">{healthData.bloodType || 'Chưa cập nhật'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Chiều cao (cm)</label>
              {isEditing ? (
                <input
                  type="number"
                  name="height"
                  value={healthData.height || ''}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <p className="text-gray-800">{healthData.height ? `${healthData.height} cm` : 'Chưa cập nhật'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cân nặng (kg)</label>
              {isEditing ? (
                <input
                  type="number"
                  name="weight"
                  value={healthData.weight || ''}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <p className="text-gray-800">{healthData.weight ? `${healthData.weight} kg` : 'Chưa cập nhật'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">BMI</label>
              <div className="flex items-center">
                <p className="text-gray-800 mr-2">{healthData.bmi || 'Chưa cập nhật'}</p>
                {healthData.bmi && (
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${bmiStatus.color} bg-opacity-20 text-${bmiStatus.color}`}>
                    {bmiStatus.status}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Medical Conditions */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <h3 className="font-medium text-gray-800 mb-4">Tiền sử bệnh lý</h3>
          
          {isEditing ? (
            <div className="mb-4">
              <div className="flex">
                <input
                  type="text"
                  value={newCondition}
                  onChange={(e) => setNewCondition(e.target.value)}
                  placeholder="Thêm tiền sử bệnh"
                  className="flex-1 p-2 border border-gray-300 rounded-l-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={handleAddCondition}
                  className="px-3 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 transition duration-300"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>
          ) : null}

          {healthData.medicalConditions && healthData.medicalConditions.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {healthData.medicalConditions.map((condition, index) => (
                <li key={index} className="py-2 flex justify-between items-center">
                  <span>{condition}</span>
                  {isEditing && (
                    <button 
                      onClick={() => handleRemoveCondition(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 italic">Không có tiền sử bệnh</p>
          )}
        </div>

        {/* Allergies */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <h3 className="font-medium text-gray-800 mb-4">Dị ứng</h3>
          
          {isEditing ? (
            <div className="mb-4">
              <div className="flex">
                <input
                  type="text"
                  value={newAllergy}
                  onChange={(e) => setNewAllergy(e.target.value)}
                  placeholder="Thêm dị ứng"
                  className="flex-1 p-2 border border-gray-300 rounded-l-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={handleAddAllergy}
                  className="px-3 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 transition duration-300"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>
          ) : null}

          {healthData.allergies && healthData.allergies.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {healthData.allergies.map((allergy, index) => (
                <li key={index} className="py-2 flex justify-between items-center">
                  <span>{allergy}</span>
                  {isEditing && (
                    <button 
                      onClick={() => handleRemoveAllergy(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 italic">Không có dị ứng</p>
          )}
        </div>

        {/* Medications */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <h3 className="font-medium text-gray-800 mb-4">Thuốc đang sử dụng</h3>
          
          {isEditing ? (
            <div className="mb-4">
              <div className="flex">
                <input
                  type="text"
                  value={newMedication}
                  onChange={(e) => setNewMedication(e.target.value)}
                  placeholder="Thêm thuốc đang dùng"
                  className="flex-1 p-2 border border-gray-300 rounded-l-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={handleAddMedication}
                  className="px-3 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 transition duration-300"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>
          ) : null}

          {healthData.medications && healthData.medications.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {healthData.medications.map((medication, index) => (
                <li key={index} className="py-2 flex justify-between items-center">
                  <span>{medication}</span>
                  {isEditing && (
                    <button 
                      onClick={() => handleRemoveMedication(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 italic">Không có thuốc đang sử dụng</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default HealthRecord; 