'use client';
import React, { useState, useCallback } from 'react';
import axios from 'axios';
import { useSnackbar } from '@/app/SnackBarProvider';

const MyAddressComponent = ({ userData, fetchProfile }) => {
  const { openSnackbar } = useSnackbar();
  const [editAddress, setEditAddress] = useState(null); // State for managing the address being edited
  const [isAddingNew, setIsAddingNew] = useState(false); // State for managing adding new address
  const [addressForm, setAddressForm] = useState({
    type: 'Shipping', // Default to 'Shipping', can be changed to 'Billing'
    fullname: '',
    mobile: '',
    add1: '',
    add2: '',
    city: '',
    state: '',
    country: '',
    zipcode: '',
  });

  const handleEditAddress = (address) => {
    // Set the selected address for editing
    setEditAddress(address);
    setAddressForm({
      type: address.type,
      fullname: address.fullname,
      mobile: address.mobile,
      add1: address.add1,
      add2: address.add2,
      city: address.city,
      state: address.state,
      country: address.country,
      zipcode: address.zipcode,
    });
  };

  const handleAddressChange = (e) => {
    // Update address form state on input change
    setAddressForm({ ...addressForm, [e.target.name]: e.target.value });
  };

  const handleUpdateAddress = async () => {
    try {
      const response = await axios.put('/api/edit-customer-address', {
        addressId: editAddress.id,
        ...addressForm,
      }, {
        headers: {
          Authorization: localStorage.getItem('onlineKingWebToken'),
        },
      });

      if (response.data.status === 'success') {
        openSnackbar('Address updated successfully', 'success');
        setEditAddress(null); // Clear edit state after successful update
        fetchProfile(); // Re-fetch profile to update UI
      }
    } catch (error) {
      console.error('Error updating address:', error);
      openSnackbar('Failed to update address', 'error');
    }
  };

  const handleAddNewAddress = async () => {
    try {
      const response = await axios.post('/api/add-addresses', {
        ...addressForm,
      }, {
        headers: {
          Authorization: localStorage.getItem('onlineKingWebToken'),
        },
      });

      if (response.data.status === 'success') {
        openSnackbar('New address added successfully', 'success');
        setIsAddingNew(false); // Close add new form after adding
        fetchProfile(); // Re-fetch profile to update UI
      }
    } catch (error) {
      console.error('Error adding new address:', error);
      openSnackbar('Failed to add new address', 'error');
    }
  };

  const handleDeleteAddress = async (addressId) => {
    try {
      const response = await axios.delete(`/api/delete-customer-address/${addressId}`, {
        headers: {
          Authorization: localStorage.getItem('onlineKingWebToken'),
        },
      });

      if (response.data.status === 'success') {
        openSnackbar('Address deleted successfully', 'success');
        fetchProfile(); // Re-fetch profile to update UI
      }
    } catch (error) {
      console.error('Error deleting address:', error);
      openSnackbar('Failed to delete address', 'error');
    }
  };

  return (
    <div className='flex flex-col space-y-3 border px-[10px] py-[10px]'>
      <h2 className="text-lg font-bold mb-4">My Address</h2>

      {/* Button to add new address, always visible */}
      <div className='flex justify-end mb-4'>
        <button onClick={() => setIsAddingNew(!isAddingNew)} className='text-[13px] font-[400] text-center bg-[#45B348] text-[#fff] py-2 cursor-pointer'>
          {isAddingNew ? 'Cancel Adding New Address' : 'Add New Address'}
        </button>
      </div>

      {/* Shipping Addresses */}
      <div className='mt-4'>
        <h3 className="text-md font-bold mb-2">Shipping Address</h3>
        {userData.customer_addresses?.filter(address => address.type === 'Shipping').map((address, index) => (
          <div key={index} className='flex flex-col space-y-1 border p-2 mb-2'>
            <span className='text-[13px]'>{`${address.add1}, ${address.add2}, ${address.city}, ${address.state}, ${address.country}, ${address.zipcode}`}</span>
            <span className='text-[13px]'>Phone: {address.mobile}</span>
            <span className='text-[13px]'>Email: {address.email}</span>

            {/* Button to edit the shipping address
            <button onClick={() => handleEditAddress(address)} className='text-[13px] font-[400] text-center bg-[#000] text-[#fff] py-2 mt-2 cursor-pointer'>
              Edit Shipping Address
            </button> */}

            {/* Button to delete the shipping address */}
            <button onClick={() => handleDeleteAddress(address.id)} className='text-[13px] font-[400] text-center bg-black text-[#fff] py-2 mt-2 cursor-pointer'>
              Delete Shipping Address
            </button>
          </div>
        ))}
      </div>

      {/* Billing Addresses */}
      <div className='mt-4'>
        <h3 className="text-md font-bold mb-2">Billing Address</h3>
        {userData.customer_addresses?.filter(address => address.type === 'Billing').map((address, index) => (
          <div key={index} className='flex flex-col space-y-1 border p-2 mb-2'>
            <span className='text-[13px]'>{`${address.add1}, ${address.add2}, ${address.city}, ${address.state}, ${address.country}, ${address.zipcode}`}</span>
            <span className='text-[13px]'>Phone: {address.mobile}</span>
            <span className='text-[13px]'>Email: {address.email}</span>

            {/* Button to edit the billing address */}
            {/* <button onClick={() => handleEditAddress(address)} className='text-[13px] font-[400] text-center bg-[#000] text-[#fff] py-2 mt-2 cursor-pointer'>
              Edit Billing Address
            </button> */}

            {/* Button to delete the billing address */}
            <button onClick={() => handleDeleteAddress(address.id)} className='text-[13px] font-[400] text-center bg-black text-[#fff] py-2 mt-2 cursor-pointer'>
              Delete Billing Address
            </button>
          </div>
        ))}
      </div>

      {/* Form to edit address */}
      {editAddress && (
        <div className='mt-4 bg-white p-4 rounded-lg shadow-md'>
          <h3 className="text-lg font-bold mb-2">Edit Address</h3>
          <div className='flex flex-col space-y-1 mb-4'>
            <label className='text-[13px] font-[400] text-[#AFAFAF]'>Full Name</label>
            <input type='text' name="fullname" className='p-[8px] border border-[#AFAFAF] text-[13px]' value={addressForm.fullname} onChange={handleAddressChange} />

            <label className='text-[13px] font-[400] text-[#AFAFAF]'>Mobile</label>
            <input type='text' name="mobile" className='p-[8px] border border-[#AFAFAF] text-[13px]' value={addressForm.mobile} onChange={handleAddressChange} />

            <label className='text-[13px] font-[400] text-[#AFAFAF]'>Address Line 1</label>
            <input type='text' name="add1" className='p-[8px] border border-[#AFAFAF] text-[13px]' value={addressForm.add1} onChange={handleAddressChange} />

            <label className='text-[13px] font-[400] text-[#AFAFAF]'>Address Line 2</label>
            <input type='text' name="add2" className='p-[8px] border border-[#AFAFAF] text-[13px]' value={addressForm.add2} onChange={handleAddressChange} />

            <label className='text-[13px] font-[400] text-[#AFAFAF]'>City</label>
            <input type='text' name="city" className='p-[8px] border border-[#AFAFAF] text-[13px]' value={addressForm.city} onChange={handleAddressChange} />

            <label className='text-[13px] font-[400] text-[#AFAFAF]'>State</label>
            <input type='text' name="state" className='p-[8px] border border-[#AFAFAF] text-[13px]' value={addressForm.state} onChange={handleAddressChange} />

            <label className='text-[13px] font-[400] text-[#AFAFAF]'>Country</label>
            <input type='text' name="country" className='p-[8px] border border-[#AFAFAF] text-[13px]' value={addressForm.country} onChange={handleAddressChange} />

            <label className='text-[13px] font-[400] text-[#AFAFAF]'>Zip Code</label>
            <input type='text' name="zipcode" className='p-[8px] border border-[#AFAFAF] text-[13px]' value={addressForm.zipcode} onChange={handleAddressChange} />

            <button onClick={handleUpdateAddress} className='text-[13px] font-[400] text-center bg-[#45B348] text-[#fff] py-2 mt-2 cursor-pointer'>
              Update Address
            </button>
          </div>
        </div>
      )}

      {/* Form to add new address */}
      {isAddingNew && (
        <div className='mt-4 bg-white p-4 rounded-lg shadow-md'>
          <h3 className="text-lg font-bold mb-2">Add New Address</h3>
          <div className='flex flex-col space-y-1 mb-4'>
            <label className='text-[13px] font-[400] text-[#AFAFAF]'>Full Name</label>
            <input type='text' name="fullname" className='p-[8px] border border-[#AFAFAF] text-[13px]' value={addressForm.fullname} onChange={handleAddressChange} />

            <label className='text-[13px] font-[400] text-[#AFAFAF]'>Mobile</label>
            <input type='text' name="mobile" className='p-[8px] border border-[#AFAFAF] text-[13px]' value={addressForm.mobile} onChange={handleAddressChange} />

            <label className='text-[13px] font-[400] text-[#AFAFAF]'>Address Line 1</label>
            <input type='text' name="add1" className='p-[8px] border border-[#AFAFAF] text-[13px]' value={addressForm.add1} onChange={handleAddressChange} />

            <label className='text-[13px] font-[400] text-[#AFAFAF]'>Address Line 2</label>
            <input type='text' name="add2" className='p-[8px] border border-[#AFAFAF] text-[13px]' value={addressForm.add2} onChange={handleAddressChange} />

            <label className='text-[13px] font-[400] text-[#AFAFAF]'>City</label>
            <input type='text' name="city" className='p-[8px] border border-[#AFAFAF] text-[13px]' value={addressForm.city} onChange={handleAddressChange} />

            <label className='text-[13px] font-[400] text-[#AFAFAF]'>State</label>
            <input type='text' name="state" className='p-[8px] border border-[#AFAFAF] text-[13px]' value={addressForm.state} onChange={handleAddressChange} />

            <label className='text-[13px] font-[400] text-[#AFAFAF]'>Country</label>
            <input type='text' name="country" className='p-[8px] border border-[#AFAFAF] text-[13px]' value={addressForm.country} onChange={handleAddressChange} />

            <label className='text-[13px] font-[400] text-[#AFAFAF]'>Zip Code</label>
            <input type='text' name="zipcode" className='p-[8px] border border-[#AFAFAF] text-[13px]' value={addressForm.zipcode} onChange={handleAddressChange} />

            <button onClick={handleAddNewAddress} className='text-[13px] font-[400] text-center bg-[#45B348] text-[#fff] py-2 mt-2 cursor-pointer'>
              Add Address
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyAddressComponent;
