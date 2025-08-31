import React, { useEffect, useState } from "react";
import { Activity, Heart, Thermometer, Droplet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import axios from "axios";
import { config } from "../../config/config.js";

// Map type từ API tới title và icon
const metricMap = {
  HEART_RATE: { 
    title: "Nhịp tim", 
    icon: Heart, 
    unit: "bpm",
    normalRange: { min: 60, max: 100 } 
  },
  BLOOD_PRESSURE: { 
    title: "Huyết áp", 
    icon: Activity, 
    unit: "mmHg",
    normalRange: { systolic: { min: 90, max: 120 }, diastolic: { min: 60, max: 80 } }
  },
  BLOOD_GLUCOSE: { 
    title: "Đường huyết", 
    icon: Droplet, 
    unit: "mg/dL",
    normalRange: { min: 70, max: 100 } 
  },
  BODY_TEMPERATURE: { 
    title: "Nhiệt độ cơ thể", 
    icon: Thermometer, 
    unit: "°C",
    normalRange: { min: 36, max: 37.5 } 
  }, 
};

// Logic tính status và statusClass dựa trên value
const getStatus = (type, value) => {
  const metric = metricMap[type];
  
  if (!metric || !value) {
    return { status: "Không xác định", statusClass: "text-gray-500" };
  }
  
  switch (type) {
    case "HEART_RATE": 
      if (value >= metric.normalRange.min && value <= metric.normalRange.max) {
        return { status: "Bình thường", statusClass: "text-green-500" };
      }
      return { status: "Bất thường", statusClass: "text-red-500" };
    
    case "BODY_TEMPERATURE":
      if (value >= metric.normalRange.min && value <= metric.normalRange.max) {
        return { status: "Ổn định", statusClass: "text-green-500" };
      }
      return { status: "Bất thường", statusClass: "text-red-500" };
    
    case "BLOOD_GLUCOSE":
      if (value >= metric.normalRange.min && value <= metric.normalRange.max) {
        return { status: "Bình thường", statusClass: "text-green-500" };
      }
      return { status: value < metric.normalRange.min ? 
        { status: "Hạ đường huyết", statusClass: "text-orange-500" } : 
        { status: "Tăng đường huyết", statusClass: "text-red-500" }
      };
    
    case "BLOOD_PRESSURE":
      // Thường sẽ có hai giá trị (tâm thu/tâm trương) - giả sử value là chuỗi "120/80"
      try {
        const [systolic, diastolic] = value.split('/').map(num => parseInt(num.trim()));
        const systolicNormal = systolic >= metric.normalRange.systolic.min && systolic <= metric.normalRange.systolic.max;
        const diastolicNormal = diastolic >= metric.normalRange.diastolic.min && diastolic <= metric.normalRange.diastolic.max;
        
        if (systolicNormal && diastolicNormal) {
          return { status: "Bình thường", statusClass: "text-green-500" };
        } else if (systolic > 120 || diastolic > 80) {
          return { status: "Cao huyết áp", statusClass: "text-red-500" };
        } else {
          return { status: "Thấp huyết áp", statusClass: "text-orange-500" };
        }
      } catch (e) {
        return { status: "Định dạng không đúng", statusClass: "text-gray-500" };
      }
    
    default:
      return { status: "Không xác định", statusClass: "text-gray-500" };
  }
};

export function HealthMetrics() {
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedMetricType, setSelectedMetricType] = useState("HEART_RATE");
  
  const [newMetric, setNewMetric] = useState({
    type: "HEART_RATE",
    value: "",
  });

  const [bloodPressureInput, setBloodPressureInput] = useState({
    systolic: "",
    diastolic: ""
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const headers = {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      };
      // Lấy tất cả các loại chỉ số sức khỏe, không chỉ HEART_RATE
              const response = await axios.get(`${config.API_BASE_URL}/health-data`, { headers });
      setMetrics(response.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching health metrics:", error);
      setError("Không thể tải dữ liệu chỉ số sức khỏe. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleTypeChange = (type) => {
    setSelectedMetricType(type);
    setNewMetric({...newMetric, type});
    
    if (type === "BLOOD_PRESSURE") {
      setBloodPressureInput({systolic: "", diastolic: ""});
    } else {
      setNewMetric({...newMetric, type, value: ""});
    }
  };

  const handleAddMetric = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      };
      
      let metricToSend = {...newMetric};
      
      // Xử lý đặc biệt cho huyết áp
      if (newMetric.type === "BLOOD_PRESSURE") {
        if (!bloodPressureInput.systolic || !bloodPressureInput.diastolic) {
          alert("Vui lòng nhập đầy đủ chỉ số huyết áp");
          return;
        }
        metricToSend.value = `${bloodPressureInput.systolic}/${bloodPressureInput.diastolic}`;
      }
      
      // Kiểm tra giá trị
      if (!metricToSend.value) {
        alert("Vui lòng nhập giá trị cho chỉ số sức khỏe");
        return;
      }
      
              await axios.post(`${config.API_BASE_URL}/health-data`, metricToSend, { headers });
      // Fetch lại dữ liệu sau khi thêm thành công
      fetchData();
      setShowAddForm(false);
      setNewMetric({ type: "HEART_RATE", value: "" });
      setBloodPressureInput({systolic: "", diastolic: ""});
    } catch (error) {
      console.error("Error adding health metric:", error);
      alert("Không thể thêm chỉ số sức khỏe. Vui lòng thử lại.");
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Chỉ số sức khỏe</h2>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          {showAddForm ? "Hủy" : "Thêm chỉ số"}
        </button>
      </div>
      
      {/* Form thêm chỉ số mới */}
      {showAddForm && (
        <div className="mb-6 p-6 border rounded-lg bg-white shadow-sm">
          <h3 className="font-medium mb-4 text-lg">Thêm chỉ số mới</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium mb-1">Loại chỉ số</label>
              <select 
                value={newMetric.type}
                onChange={(e) => handleTypeChange(e.target.value)}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {Object.keys(metricMap).map(type => (
                  <option key={type} value={type}>{metricMap[type].title}</option>
                ))}
              </select>
            </div>
            
            {newMetric.type === "BLOOD_PRESSURE" ? (
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium mb-1">Tâm thu (mmHg)</label>
                  <input 
                    type="number" 
                    value={bloodPressureInput.systolic}
                    onChange={(e) => setBloodPressureInput({...bloodPressureInput, systolic: e.target.value})}
                    placeholder="Ví dụ: 120"
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Tâm trương (mmHg)</label>
                  <input 
                    type="number" 
                    value={bloodPressureInput.diastolic}
                    onChange={(e) => setBloodPressureInput({...bloodPressureInput, diastolic: e.target.value})}
                    placeholder="Ví dụ: 80"
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium mb-1">
                  Giá trị ({metricMap[newMetric.type]?.unit})
                </label>
                <input 
                  type="number" 
                  value={newMetric.value}
                  onChange={(e) => setNewMetric({...newMetric, value: e.target.value})}
                  placeholder={`Nhập ${metricMap[newMetric.type]?.title.toLowerCase()}`}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            )}
            
            <div className="md:col-span-2 mt-2">
              <button 
                onClick={handleAddMetric}
                className="w-full px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Hiển thị trạng thái loading hoặc lỗi */}
      {loading && <p className="text-center py-4">Đang tải dữ liệu...</p>}
      {error && <p className="text-center py-4 text-red-500">{error}</p>}
      
      {/* Hiển thị các chỉ số */}
      {!loading && !error && metrics.length === 0 && (
        <p className="text-center py-8 text-gray-500">Chưa có dữ liệu chỉ số sức khỏe. Hãy thêm chỉ số mới.</p>
      )}
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, index) => {
          const mappedMetric = metricMap[metric.type] || {title: metric.type, icon: null, unit: ""};
          const IconComponent = mappedMetric.icon;
          const formattedValue = `${metric.value} ${mappedMetric.unit}`;
          const { status, statusClass } = getStatus(metric.type, metric.value);
          
          return (
            <Card key={index} className="glass-card bg-gradient-to-r from-blue-100 to-blue-200 p-4 rounded-2xl shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {mappedMetric.title}
                </CardTitle>
                {IconComponent && <IconComponent className="h-5 w-5 text-primary" />}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formattedValue}</div>
                {status && (
                  <p className={`text-xs mt-1 ${statusClass}`}>
                    Trạng thái: {status}
                  </p>
                )}
                <p className="text-xs mt-1 text-gray-500">
                  Thời gian: {new Date(metric.timestamp).toLocaleString()}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
