import React from "react";
import PropTypes from "prop-types";

const LoadingSpinner = ({ size = 50, color = "#0084ff" }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75">
      <div
        className="inline-block border-4 border-solid rounded-full animate-spin"
        style={{
          width: size,
          height: size,
          borderWidth: size / 10,
          borderColor: `${color}40`, // Màu viền nhạt
          borderTopColor: color, // Màu viền trên
        }}
      ></div>
    </div>
  );
};

LoadingSpinner.propTypes = {
  size: PropTypes.number,
  color: PropTypes.string,
};

export default LoadingSpinner;
