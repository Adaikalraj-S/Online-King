"use client"
import React, { useState } from "react";

const OTPInput = ({ length = 4, onOtpChange }) => {
  const [otp, setOtp] = useState(Array(length).fill(""));

  // Handle OTP input
  const handleChange = (e, index) => {
    const { value } = e.target;
    if (/^\d?$/.test(value)) { // Allow only a single digit
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      onOtpChange(newOtp.join("")); // Pass the combined OTP to the parent component

      // Move to the next input field if there's a next field
      if (value && index < length - 1) {
        document.getElementById(`otp-input-${index + 1}`).focus();
      }
    }
  };

  // Handle backspace to go to the previous input field
  const handleBackspace = (e, index) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      document.getElementById(`otp-input-${index - 1}`).focus();
    }
  };

  return (
    <div className="flex flex-col space-y-1">
      <label className="text-[13px] font-[400] text-[#AFAFAF]">
        Enter OTP <span className="text-red-500">*</span>
      </label>
      <div className="flex items-center gap-4">
        {otp.map((digit, index) => (
          <input
            key={index}
            id={`otp-input-${index}`}
            type="text"
            maxLength="1"
            className="border border-[#AFAFAF] text-center text-[18px] rounded w-12 h-12 focus:border-green-500 focus:outline-none transition-all duration-200"
            value={digit}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleBackspace(e, index)}
          />
        ))}
      </div>
    </div>
  );
};

export default OTPInput;
