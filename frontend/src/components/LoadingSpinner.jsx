// components/LoadingSpinner.js
import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center mt-6 z-50">
      <svg
        className="animate-spin h-16 w-16 text-white"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        ></path>
      </svg>
      <p className="ml-4 text-lg">Processing image...</p>
    </div>
  );
};

export default LoadingSpinner;
