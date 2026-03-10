"use client";
import React, { useState } from "react";
import axios from "../../../../axios"
import { useSnackbar } from "@/app/SnackBarProvider";

const ContactUsForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    subject: "",
    message: "",
  });

  const {openSnackbar} = useSnackbar()
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
  
    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required.";
    }
  
    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email address.";
    }
  
    // Mobile number validation
    if (!formData.mobile.trim()) {
      newErrors.mobile = "Mobile Number is required.";
    } else if (!/^\d{10}$/.test(formData.mobile)) {
      newErrors.mobile = "Enter a 10-digit valid mobile number.";
    }
  
    // Subject validation
    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required.";
    }
  
    // Message validation
    if (!formData.message.trim()) {
      newErrors.message = "Message is required.";
    }
  
    console.log(newErrors, "er");
    setErrors(newErrors);
  
    return Object.keys(newErrors).length === 0;
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Form Data:", formData);
      setSubmitted(true);
      // Simulate form submission
      try {
        const res = await axios.post("api/create-customer-enquiry", formData);
        console.log(res.data.data, "enquiry")
        if(res.data.status === "success") {
            openSnackbar(res.data.message, "success")
        } else {
            openSnackbar(res.data.message, "error")
        }
      } catch (error) {
        const {response:{data:{message}}} = error
        console.log(error, "Error in creating enquiry",message)
        openSnackbar(message, "error")
      }
   
      setTimeout(() => {
        setSubmitted(false);
        setFormData({ name: "", email: "", subject: "", message: "", mobile:"" });
      }, 3000);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-md">
      <h1 className="text-3xl font-bold text-gray-800 text-center mb-4">
        Contact Us
      </h1>
      <p className="text-gray-600 text-center mb-6 underline">
        Got a question or feedback? We'd love to hear from you!
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className={`mt-1 block w-full rounded-md border ${
              errors.name ? "border-red-500" : "border-gray-300"
            } shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm p-2`}
            placeholder="Enter your full name"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className={`mt-1 block w-full p-2 rounded-md border ${
              errors.email ? "border-red-500" : "border-gray-300"
            } shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm`}
            placeholder="Enter your email address"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>
        
         {/* Mobile */}
         <div>
          <label htmlFor="mobile" className="block text-sm font-medium text-gray-700">
            Mobile No.
          </label>
          <input
            type="text"
            id="mobile"
            name="mobile"
            value={formData.mobile}
            onChange={handleInputChange}
            className={`mt-1 block w-full p-2 rounded-md border ${
              errors.email ? "border-red-500" : "border-gray-300"
            } shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm`}
            placeholder="Enter your mobile no."
          />
          {errors.mobile && <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>}
        </div>


        {/* Subject */}
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
            Subject
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleInputChange}
            className={`mt-1 block w-full rounded-md border p-2 ${
              errors.subject ? "border-red-500" : "border-gray-300"
            } shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm`}
            placeholder="Enter the subject of your message"
          />
          {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject}</p>}
        </div>

        {/* Message */}
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            className={`mt-1 block w-full p-2 rounded-md border ${
              errors.message ? "border-red-500" : "border-gray-300"
            } shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm`}
            placeholder="Write your message here"
            rows={4}
          />
          {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md shadow hover:bg-blue-600 transition duration-300"
            disabled={submitted}
          >
            {submitted ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
      {submitted && (
        <p className="text-green-500 text-sm text-center mt-4">
          Thank you for contacting us! We'll get back to you soon.
        </p>
      )}
    </div>
  );
};

export default ContactUsForm;
