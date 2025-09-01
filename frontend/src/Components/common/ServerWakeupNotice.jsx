import React, { useState } from "react";
import { Clock } from "lucide-react";

const ServerWakeupNotice = ({ className = "" }) => {
  const [showNotice, setShowNotice] = useState(true);

  if (!showNotice) return null;

  return (
    <div className={`mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg ${className}`}>
      <div className="flex items-start space-x-3">
        <Clock className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="text-sm font-medium text-blue-800 mb-1">
            Lưu ý về Server
          </h3>
          <p className="text-sm text-blue-700 mb-2">
            Ứng dụng đang được deploy trên Render miễn phí. Server có thể cần 1-2 phút để waking up khi truy cập lần đầu. 
            Nếu gặp lỗi kết nối, vui lòng thử lại sau vài phút.
          </p>
          <button
            onClick={() => setShowNotice(false)}
            className="text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            Đã hiểu
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServerWakeupNotice;
