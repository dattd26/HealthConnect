import React from 'react';

const Loading = () => {
  return (
    // <div className="flex items-center justify-center min-h-screen">
    //   <div className="relative">
    //     <div className="w-12 h-12 rounded-full absolute border-4 border-solid border-gray-200"></div>
    //     <div className="w-12 h-12 rounded-full animate-spin absolute border-4 border-solid border-blue-500 border-t-transparent"></div>
    //   </div>
    //   <span className="ml-4 text-lg font-semibold text-gray-700">Đang tải...</span>
    // </div>
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
};

export default Loading; 