import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export const HealthChart = () => {
  const data = {
    labels: ["T2", "T3", "T4", "T5", "T6", "T7", "CN"],
    datasets: [
      {
        label: "Huyết áp tâm thu",
        data: [120, 115, 118, 125, 122, 119, 123],
        borderColor: "#e74c3c",
      },
      {
        label: "Nhịp tim",
        data: [72, 75, 70, 68, 73, 71, 69],
        borderColor: "#3498db",
      },
    ],
  };
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        enabled: true,
      },
    },
    scales: {
      x: {
        type: "category",
      },
    },
  };
  
  return (<div style={{ width: "400px", height: "300px" }}>
    <Line data={data} options={options} />
  </div>);
};