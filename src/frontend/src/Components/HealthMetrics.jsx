import React, { useEffect, useState } from "react";
import { Activity, Heart, Thermometer, Droplet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import axios from "axios";

// Map type từ API tới title và icon
const metricMap = {
  HEART_RATE: { title: "Nhịp tim", icon: Heart, unit: "bpm" },
  BLOOD_PRESSURE: { title: "Huyết áp", icon: Activity, unit: "mmHg" },
  BLOOD_GLUCOSE: { title: "Đường huyết", icon: Droplet, unit: "mg/dL" },
  BODY_TEMPERATURE: { title: "Nhiệt độ cơ thể", icon: Thermometer, unit: "°C" }, 
};
// Logic tính status và statusClass dựa trên value
const getStatus = (type, value) => {
  switch (type) {
    case "HEART_RATE": 
      if (value >= 60 && value <= 100) return { status: "Bình thường", statusClass: "text-blue-500" };
      return { status: "Bất thường", statusClass: "text-red-500" };
    case "BODY_TEMPERATURE":
      if (value >= 36 && value <= 37) return { status: "Ổn định", statusClass: "text-green-500" };
      return { status: "Bất thường", statusClass: "text-red-500" };
    default:
      return { status: null, statusClass: null };
  }
}
export function HealthMetrics() {
  const [metrics, setMetrics] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        };
        const response = await axios.get("http://localhost:8080/api/health-data?type=HEART_RATE", { headers });
        setMetrics(response.data); // Lưu dữ liệu từ API vào state
      } catch (error) {
        console.error("Error fetching health metrics:", error);
      }
    };

    fetchData();
  }, []);


  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => {
        const mappedMetric = metricMap[metric.type] || {title: metric.type, icon: null, unit: ""};
        const IconComponent = mappedMetric.icon;
        const formattedValue = `${metric.value} ${mappedMetric.unit}`;
        const { status, statusClass } = getStatus(metric.type, metric.value);
        return (
          <Card key={metric.title} className="glass-card bg-gradient-to-r from-blue-100 to-blue-200 p-4 rounded-2xl shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {metric.type}
              </CardTitle>
              {IconComponent && <IconComponent className="h-5 w-5 text-primary" />}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              {/* {metric.trend && (
                <p className={`text-xs mt-1 ${metric.trendClass}`}>
                  Xu hướng: {metric.trend}
                </p>
              )} */}
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
        )}
      )}
    </div>
  );
}
