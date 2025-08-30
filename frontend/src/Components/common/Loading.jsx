import React from 'react';
import LoadingSpinner from './LoadingSpinner';

const Loading = ({ 
  fullScreen = true, 
  size = "large", 
  message = "Đang tải...",
  className = ""
}) => {
  if (fullScreen) {
    return (
      <div className={`flex justify-center items-center min-h-screen bg-gray-50 ${className}`}>
        <div className="text-center">
          <LoadingSpinner size={size} color="blue" showMessage={true} message={message} />
        </div>
      </div>
    );
  }

  return <LoadingSpinner size={size} color="blue" showMessage={true} message={message} />;
};

export default Loading; 