import React from 'react';

const LoadingSpinner = ({ 
  size = "medium", 
  color = "blue", 
  className = "",
  message = "",
  showMessage = false
}) => {
  const sizeClasses = {
    tiny: "w-4 h-4",
    small: "w-6 h-6",
    medium: "w-8 h-8",
    large: "w-12 h-12"
  };

  const colorClasses = {
    blue: "border-t-blue-500",
    green: "border-t-green-500",
    red: "border-t-red-500",
    purple: "border-t-purple-500",
    gray: "border-t-gray-500"
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className={`${sizeClasses[size]} animate-spin rounded-full border-2 border-gray-200 ${colorClasses[color]}`}></div>
      {showMessage && message && (
        <p className="text-gray-600 text-sm mt-2 font-medium">{message}</p>
      )}
    </div>
  );
};

export default LoadingSpinner;
