"use client"
import React from 'react';

const TermAndConditions = ({ checked, onChecked, text = null }) => {
  const handleCheckbox = (e) => {
    onChecked(e.target.checked);
  };

  return (
    <div className="flex items-center gap-2 my-2">
      <div className="relative pt-2">
        <input
          type="checkbox"
          className="bg-green-500 w-4 h-4 border-2 border-gray-300 rounded-md transition duration-200 cursor-pointer"
          checked={checked}
          onChange={handleCheckbox}
        />
        {/* {checked && (
          <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-xs">
            ✓
          </span>
        )} */}
      </div>
      <p className="text-gray-700 text-sm font-medium">
        {text ? (
          text
        ) : (
          <>
            I accept the{' '}
            <span className="text-blue-500 hover:underline">Terms</span> and{' '}
            <span className="text-blue-500 hover:underline">Conditions</span>
          </>
        )}
      </p>
    </div>
  );
};

export default TermAndConditions;
