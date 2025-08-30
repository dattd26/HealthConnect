import React from 'react';

const LoadingSkeleton = ({ 
  type = "text", // text, avatar, card, list, table
  lines = 3,
  className = "",
  height = "h-4",
  width = "w-full"
}) => {
  const renderSkeleton = () => {
    switch (type) {
      case "text":
        return (
          <div className="space-y-2">
            {Array.from({ length: lines }).map((_, index) => (
              <div
                key={index}
                className={`animate-pulse bg-gray-200 rounded ${height} ${width} ${
                  index === lines - 1 ? "w-3/4" : ""
                }`}
              />
            ))}
          </div>
        );

      case "avatar":
        return (
          <div className="flex items-center space-x-4">
            <div className={`animate-pulse bg-gray-200 rounded-full ${height} w-12`} />
            <div className="space-y-2 flex-1">
              <div className="animate-pulse bg-gray-200 rounded h-4 w-3/4" />
              <div className="animate-pulse bg-gray-200 rounded h-3 w-1/2" />
            </div>
          </div>
        );

      case "card":
        return (
          <div className="animate-pulse">
            <div className="bg-gray-200 rounded-lg h-48 w-full mb-4" />
            <div className="space-y-2">
              <div className="bg-gray-200 rounded h-4 w-3/4" />
              <div className="bg-gray-200 rounded h-3 w-1/2" />
            </div>
          </div>
        );

      case "list":
        return (
          <div className="space-y-3">
            {Array.from({ length: lines }).map((_, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="animate-pulse bg-gray-200 rounded h-10 w-10" />
                <div className="flex-1 space-y-2">
                  <div className="animate-pulse bg-gray-200 rounded h-4 w-3/4" />
                  <div className="animate-pulse bg-gray-200 rounded h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        );

      case "table":
        return (
          <div className="animate-pulse">
            <div className="space-y-3">
              {Array.from({ length: lines }).map((_, index) => (
                <div key={index} className="flex space-x-4">
                  <div className="animate-pulse bg-gray-200 rounded h-4 w-1/4" />
                  <div className="animate-pulse bg-gray-200 rounded h-4 w-1/3" />
                  <div className="animate-pulse bg-gray-200 rounded h-4 w-1/4" />
                  <div className="animate-pulse bg-gray-200 rounded h-4 w-1/6" />
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return (
          <div className={`animate-pulse bg-gray-200 rounded ${height} ${width}`} />
        );
    }
  };

  return (
    <div className={className}>
      {renderSkeleton()}
    </div>
  );
};

export default LoadingSkeleton;
