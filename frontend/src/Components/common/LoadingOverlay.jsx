import React from 'react';

const LoadingOverlay = ({ 
  isLoading, 
  children, 
  message = "Đang tải...", 
  size = "medium",
  position = "center",
  overlayOpacity = "bg-black/20",
  showSpinner = true,
  showMessage = true,
  className = ""
}) => {
  if (!isLoading) return children;

  const sizeClasses = {
    small: "w-6 h-6",
    medium: "w-12 h-12", 
    large: "w-16 h-16"
  };

  const positionClasses = {
    top: "top-4",
    center: "top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2",
    bottom: "bottom-4"
  };

  return (
    <div className={`relative ${className}`}>
      {children}
      
      {/* Semi-transparent overlay */}
      <div className={`absolute inset-0 ${overlayOpacity} backdrop-blur-sm transition-all duration-300`}>
        {/* Loading indicator */}
        <div className={`absolute ${positionClasses[position]} flex flex-col items-center justify-center`}>
          {showSpinner && (
            <div className={`${sizeClasses[size]} animate-spin rounded-full border-4 border-gray-200 border-t-blue-500 mb-3`}></div>
          )}
          {showMessage && (
            <div className="text-center">
              <p className="text-gray-700 font-medium text-sm bg-white/80 backdrop-blur-sm px-3 py-2 rounded-lg shadow-sm">
                {message}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoadingOverlay;
