import React, { useState,useCallback } from 'react';
import axios from '../../../axios';
import { useDialog } from '../context/DialogProvider';

import { useSnackbar } from '../SnackbarProvider';





const EditCouponForm = ({ editData, goBack,  customerData, resetButton }) => {
    console.log(editData, "edit-Data")

  const {showDialog} = useDialog();

  const [formData, setFormData] = useState({
    coupon_id: editData.id,
    // user_id: editData.user_id,
    coupon_type: editData.coupon_type || '',
    discount: editData.discount || null,
    max_discount: editData.max_discount || null,
    discount_type: editData.discount_type || "",
    coupon_title: editData.coupon_title || '',
    coupon_name: editData.coupon_name || '',
    max_use_per_user: editData.max_use_per_user || '',
    min_order_amount: editData.min_order_amount || '',
    start_date: editData.start_date ? new Date(editData.start_date).toISOString().split('T')[0] : '',
    expiry_date: editData.expiry_date ? new Date(editData.expiry_date).toISOString().split('T')[0] : '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    // Logic for form submission goes here
    // You can send formData to the backend via API call or handle it as needed

    const res = await saveEdit(formData)
    
    console.log('Form Data:', formData,res);
    handleReset();
  };
  const { openSnackbar } = useSnackbar();

  const fetchCouponData = useCallback(() => {
    axios.get('/api/get-all-coupons-admin', {
      headers: {
        Authorization: localStorage.getItem('onlineKingToken')
      }
    })
    .then((res) => {
      if (res.data.status === 'success') {
        console.log("success",res.data.coupons);
        
      }
    })
    .catch((err) => {
      console.error('Error fetching coupons:', err);
    });
  }, []);


  const saveEdit = async (editData, fetchCouponData) => {
    try {
      const response = await axios.post('/api/edit-coupons', editData);
  
      if (response.data.status === 'success') {
        console.log('Coupon updated successfully.');
        // Call fetchCouponData after successful API call
        // customerData();
        openSnackbar(response.data.message, 'success');
      }
  
      return response.data;
    } catch (error) {
      console.error('Error updating coupon:', error);
      throw error;
    }
  };
  const handleReset = () => {
    setFormData({
      coupon_type: '',
      coupon_title: '',
      coupon_name: '',
      max_use_per_user: '',
      min_order_amount: '',
      start_date: '',
      expiry_date: '',
    });
    //resetButton(); // Call any additional reset logic if needed
    goBack()
    customerData();

  };
  return (
    <div className="py-[10px] flex flex-col space-y-5">
      <div className="flex flex-col space-y-1">
        <span className="text-[30px] text-[#101828] font-[500]">Coupon Setup</span>
        <span className="text-[#667085] font-[400] text-[16px]">Effortless Discount Management for Admin Efficiency.</span>
      </div>

      <div className="grid grid-cols-3 gap-[10px]">
        <div className="flex flex-col space-y-1 w-full">
          <span>Coupon Type </span>
          <select
            name="coupon_type"
            value={formData.coupon_type}
            onChange={handleInputChange}
            className="inputText"
          >
            <option>Select Coupon Type Here</option>
            <option value="Default">Default</option>
            <option value="First Order">First Order</option>
            <option value="Free Delivery">Free Delivery</option>
            <option value="Customer wise">Customer wise</option>
            <option value="Subscribed Customer">Subscribed Customer</option>
            <option value="Dealer Wise">Dealer Wise</option>
          </select>
        </div>

        <div className="flex flex-col space-y-1 w-full">
          <span>Coupon Title </span>
          <input
            type="text"
            placeholder="Enter coupon title"
            value={formData.coupon_title}
            onChange={handleInputChange}
            className="inputText"
            name="coupon_title"
          />
        </div>

        <div className="flex flex-col space-y-1 w-full">
          <span>Coupon Code </span>
          <input
            type="text"
            placeholder="Enter coupon code"
            value={formData.coupon_name}
            onChange={handleInputChange}
            className="inputText"
            name="coupon_name"
          />
        </div>

        <div className="flex flex-col space-y-1 w-full">
          <span>Limit for Same User </span>
          <input
            type="text"
            placeholder="Enter limit"
            value={formData.max_use_per_user}
            onChange={handleInputChange}
            className="inputText"
            name="max_use_per_user"
          />
        </div>
        <div className="flex flex-col space-y-1 w-full">
          <span>Minimum Purchase </span>
          <input
            type="text"
            placeholder="Enter minimum purchase"
            value={formData.min_order_amount}
            onChange={handleInputChange}
            className="inputText"
            name="min_order_amount"
          />
        </div>
    {/* Discout type jsx */}
        <div className="flex flex-col space-y-1 w-full">
          <span>Discount Type </span>
          <select
            name="discount_type"
            value={formData.discount_type}
            onChange={handleInputChange}
            className="inputText"
          >
            <option>Select Coupon Type Here</option>
            <option value="">Default</option>
            <option value="Amount">Amount</option>
            <option value="Percent">Percent</option>
          </select>
        </div>

        <div className="flex flex-col space-y-1 w-full">
          <span> Discount </span>
          <input
            type="text"
            placeholder="Enter Discount"
            value={formData.discount}
            onChange={handleInputChange}
            className="inputText"
            name="discount"
          />
        </div>

        {
            formData.max_discount &&
            <div className="flex flex-col space-y-1 w-full">
          <span>Maximum discount </span>
          <input
            type="text"
            placeholder="Enter minimum purchase"
            value={formData.max_discount}
            onChange={handleInputChange}
            className="inputText"
            name="max_discount"
          />
        </div>

        }
        

        <div className="flex flex-col space-y-1 w-full">
          <span>Start Date </span>
          <input
            type="date"
            value={formData.start_date}
            onChange={handleInputChange}
            className="inputText"
            name="start_date"
          />
        </div>

        <div className="flex flex-col space-y-1 w-full">
          <span>Expiry Date </span>
          <input
            type="date"
            value={formData.expiry_date}
            onChange={handleInputChange}
            className="inputText"
            name="expiry_date"
          />
        </div>
        
      </div>

      <div className="flex items-center gap-[24px] justify-end">
        <button className="resetButton" onClick={handleReset}>Back</button>
        <button className="submitButton" onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
};

export default EditCouponForm;
