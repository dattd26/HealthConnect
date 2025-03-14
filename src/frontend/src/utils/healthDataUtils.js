/**
 * Phân tích xu hướng dữ liệu sức khỏe
 * 
 * @param {Array} history - Mảng dữ liệu lịch sử
 * @param {string} key - Khóa dữ liệu cần phân tích (đối với dữ liệu phức tạp như huyết áp)
 * @returns {Object|null} Đối tượng chứa thông tin xu hướng
 */
export const getTrend = (history, key = null) => {
  if (!history || history.length < 2) return null;
  
  // Lấy 2 giá trị gần nhất để phân tích xu hướng
  const sortedHistory = [...history].sort((a, b) => new Date(b.date) - new Date(a.date));
  const latestValue = key ? sortedHistory[0][key] : sortedHistory[0].value;
  const previousValue = key ? sortedHistory[1][key] : sortedHistory[1].value;
  
  if (latestValue === previousValue) {
    return { direction: 'stable', value: 'Ổn định', color: 'text-gray-500' };
  }
  
  const percentChange = ((latestValue - previousValue) / previousValue) * 100;
  const absoluteChange = Math.abs(percentChange).toFixed(1);
  
  if (percentChange > 0) {
    // Xác định mức độ và màu sắc dựa trên loại chỉ số
    const isCritical = absoluteChange > 10;
    return {
      direction: 'up',
      value: `+${absoluteChange}%`,
      label: 'Tăng',
      color: isCritical ? 'text-red-500' : 'text-amber-500'
    };
  } else {
    const isCritical = absoluteChange > 10;
    return {
      direction: 'down',
      value: `-${absoluteChange}%`,
      label: 'Giảm',
      color: isCritical ? 'text-blue-500' : 'text-emerald-500'
    };
  }
};

/**
 * Tạo khuyến nghị sức khỏe dựa trên các chỉ số
 * 
 * @param {Object} metrics - Dữ liệu các chỉ số sức khỏe
 * @returns {Array} Danh sách các khuyến nghị sức khỏe
 */
export const generateHealthRecommendations = (metrics) => {
  const recommendations = [];
  
  // Kiểm tra nhịp tim
  if (metrics.heartRate > 100) {
    recommendations.push({
      title: 'Nhịp tim cao',
      description: 'Nhịp tim của bạn đang cao. Hãy nghỉ ngơi, tránh caffeine và theo dõi nếu tình trạng kéo dài.',
      priority: 'medium'
    });
  } else if (metrics.heartRate < 60) {
    recommendations.push({
      title: 'Nhịp tim thấp',
      description: 'Nhịp tim của bạn đang thấp. Điều này có thể bình thường nếu bạn là vận động viên, nếu không hãy theo dõi các triệu chứng khác.',
      priority: 'low'
    });
  }
  
  // Kiểm tra huyết áp
  if (metrics.bloodPressure.systolic >= 140 || metrics.bloodPressure.diastolic >= 90) {
    recommendations.push({
      title: 'Huyết áp cao',
      description: 'Huyết áp của bạn đang cao. Hãy giảm muối trong khẩu phần ăn, tập thể dục nhẹ nhàng và tham khảo ý kiến bác sĩ.',
      priority: 'high'
    });
  }
  
  // Kiểm tra SpO2
  if (metrics.spo2 < 95) {
    recommendations.push({
      title: 'Mức oxy trong máu thấp',
      description: 'Mức oxy trong máu của bạn đang thấp. Hãy thực hiện các bài tập thở sâu và tham khảo ý kiến bác sĩ nếu chỉ số dưới 90%.',
      priority: 'high'
    });
  }
  
  // Thêm các khuyến nghị chung
  recommendations.push({
    title: 'Duy trì lối sống lành mạnh',
    description: 'Uống đủ nước, ngủ 7-8 giờ mỗi ngày và tập thể dục đều đặn để duy trì sức khỏe tối ưu.',
    priority: 'low'
  });
  
  return recommendations;
};

// Thêm các hàm tiện ích khác... 