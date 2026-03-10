
"use client";
import { useSnackbar } from '@/app/SnackBarProvider';
import useUserStore from '@/app/storeContext/userStore';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import axios from "../../../../axios";

// import {
//   // GetCountries,
//   // GetState,
//   // GetCity,
//   GetLanguages,
//   GetRegions,
//   GetPhonecodes //async functions
// } from "react-country-state-city";

const GetCountries = async () => {
  const response = await axios.get('api/get-countries')
  return response.data.countries
}
const GetState = async (country_id) => {
  const response = await axios.get(`api/get-states?country_id=${country_id}`)
  return response.data.countries
}
const GetCity = async (country_id, state_id) => {
  const response = await axios.get(`api/get-cities?country_id=${country_id}&state_id=${state_id}`)
  return response.data.countries
}

const FormAddress = ({ formType, address, onChange }) => {
   console.log(address , "sanjay");
  const [formData, setFormData] = useState(address);
  const [errors, setErrors] = useState({});
  const [countries, setCountries] = useState([]);


  const { openSnackbar } = useSnackbar();
      const router = useRouter();
      const { addShippingAddress, addBillingAddress, resetShippingAddress, resetBillingAddress, isFormeditable, handleAddressEdit } = useUserStore();
     console.log(isFormeditable, "formstatus");

  const [countriesList, setCountriesList] = useState([]);
  const [stateList, setStateList] = useState([]);
  const [cityList, setCityList] = useState([]);


  const [countryid, setCountryid] = useState(null);
  const [stateid, setStateid] = useState(0);
  const [cityid, setCityid] = useState(0);

  useEffect(() => {
    // GetPhonecodes().then((result) => {
    //   setPhonecodeList(result);
    // });
    // GetRegions().then((result) => {
    //   setRegionsList(result);
    // });
    GetCountries().then((result) => {
      setCountriesList(result);
    });
    GetState().then((result) => {
      console.log(result, "state")
      setStateList(result);
    });
    GetCity().then((result) => {
      setCityList(result);
    });

  }, []);

  useEffect(() => {
    setFormData(address);
    if (countriesList.find(e => e.name == address.country)) {
      setCountryid(countriesList.find(e => e.name == address.country).id)
      console.log('222', address.country)
      console.log('222', countriesList.find(e => e.name == address.country))
      GetState(countriesList.find(e => e.name == address.country).id).then((result) => {
        setStateList(result)
        if (result.find(e => e.name == address.state)) {
          setStateid(result.find(e => e.name == address.state).id)
          GetCity(countriesList.find(e => e.name == address.country).id, result.find(e => e.name == address.state).id).then((city) => {
            setCityList(city)
            if (city.find(e => e.name == address.city)) {
              setCityid(city.find(e => e.name == address.city).id)
            }
          })
        }
      })
    }
  }, [address]);

  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   if(name === "country" || name === "state" || name === "city") {

  //     switch (name) {
  //       case "country":
  //         setFormData((prev) => ({ ...prev, [name]: value.name }));
  //       onChange(formType, name, value);
  //     // Remove error message for the current field
  //     setErrors((prev) => ({ ...prev, [name]: "" }));
  //         break;
  //         case "state":
  //           setFormData((prev) => ({ ...prev, [name]: value.name }));
  //       onChange(formType, name, value);
  //       // Remove error message for the current field
  //       setErrors((prev) => ({ ...prev, [name]: "" }));
  //           break;
  //           case "city":
  //             setFormData((prev) => ({ ...prev, [name]: value.name }));
  //         onChange(formType, name, value);
  //         // Remove error message for the current field
  //         setErrors((prev) => ({ ...prev, [name]: "" }));
  //             break;
      
  //       default:
  //         break;
  //     }
  //     setFormData((prev) => ({ ...prev, [name]: value.name }));
  //     onChange(formType, name, value);
  //     // Remove error message for the current field
  //     setErrors((prev) => ({ ...prev, [name]: "" }));
  //   } else {

  //     setFormData((prev) => ({ ...prev, [name]: value }));
  //     onChange(formType, name, value);
  //     // Remove error message for the current field
  //     setErrors((prev) => ({ ...prev, [name]: "" }));
  //   }
  // };

  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    console.log(name, "name-09")
  
    if (name === "country" || name === "state" || name === "city") {
      switch (name) {
        case "country":
          const cList = await GetCountries();
          setFormData((prev) => ({ ...prev, [name]: cList[value]?.name }));
          onChange(formType, name, cList[value].name);
          setCountryid(value);
          // console.log('222', cList[value].id)
          GetState(value).then((result) => {
            setStateList(result);
            // if (address.state) {
            //   const available_state = result.find(e => e.name == address.state)
            //   console.log('Line 129:222', available_state);
            //   if (available_state) {
            //     setStateid(available_state.id)
            //   }
            // }
          });
          break;
          
          case "state":
            
            const state = stateList.find(el => el.id == e.target.value); //here you will get full state object.
            // console.log(state, "check", countryid)
            setFormData((prev) => ({ ...prev, [name]: state.name }));
            onChange(formType, name, state.name);
            setStateid(value);
            GetCity(countryid, state.id).then((result) => {
              setCityList(result);
              // if (address.city) {
              //   const available_city = result.find(e => e.name == address.city)
              //   console.log('Line 148:222', available_city);
              //   if (available_city) {
              //     setStateid(available_city.id)
              //   }
              // }
            });

          // setFormData((prev) => ({ ...prev, [name]: value.name }));
          // onChange(formType, name, value.name);
          // setStateid(value.id);
          // GetCity(value.id).then((result) => {
          //   setCityList(result);
          // });
          break;
        case "city":
          const city = cityList.find(e =>e.id == value); //here you will get full state object.
          console.log(city, "li")
            setFormData((prev) => ({ ...prev, [name]: city.name }));
            onChange(formType, name, city.name);
            setCityid(value);
              
        break;
        default:
          setFormData((prev) => ({ ...prev, [name]: value.name }));
          onChange(formType, name, value.name);
          setCountryid(value.id);
          // GetState(value.id).then((result) => {
          //   setStateList(result);
          // });
          break;
      }
    } else if(name === "gst_no") {
      setFormData((prev) => ({ ...prev, [name]: value.toUpperCase() }));
      onChange(formType, name, value.toUpperCase());
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
      onChange(formType, name, value);
    }
  
    // Clear any errors for the current field
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };
  

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullname || formData.fullname.trim().length === 0) {
      newErrors.fullname = "Full Name is required.";
    }

    const mobileRegex = /^[0-9]{10}$/;
    if (!formData.mobile || !mobileRegex.test(formData.mobile)) {
      newErrors.mobile = "Valid 10-digit Phone Number is required.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      newErrors.email = "Valid Email is required.";
    }

    if (!formData.add1 || formData.add1.trim().length === 0) {
      newErrors.add1 = "Address Line 1 is required.";
    }

    if (!formData.city || formData.city.trim().length === 0) {
      newErrors.city = "City is required.";
    }

    if (!formData.state || formData.state.trim().length === 0) {
      newErrors.state = "State is required.";
    }

    const pincodeRegex = /^[0-9]{5,6}$/;
    if (!formData.pincode || !pincodeRegex.test(formData.pincode)) {
      newErrors.pincode = "Valid Pincode is required.";
    }

    if (!formData.country || formData.country.trim().length === 0) {
      newErrors.country = "Country is required.";
    }

    if (formType === "Shipping" && !formData.add_type) {
      newErrors.add_type = "Address Type is required.";
    }

     // Optional GST Validation for Shipping
  const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[A-Z0-9]{1}[Z]{1}[A-Z0-9]{1}$/;
  if (formData.gst_no && !gstRegex.test(formData.gst_no)) {
    newErrors.gst_no = "Enter a valid 15-digit GST number.";
  }
    console.log(newErrors, "error")
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const handleSubmit = () => {
   
    if(!validateForm()) {

        return
    }
  
    // Handle submission based on formType
    if (formType === "Shipping") {
      if(
        isFormeditable
      ) 
      {
        handleAddressEdit(formData, openSnackbar);
      }
      else
      {
      addShippingAddress(formData, openSnackbar, router);
      }
      resetShippingAddress();
    } else {
      addBillingAddress(formData, openSnackbar, router);
      resetBillingAddress();
    }
  
    // Reset form data after successful submission
    setFormData({
      fullname: "",
      mobile: "",
      email: "",
      add_type: "",
      add1: "",
      add2: "",
      landmark: "",
      city: "",
      state: "",
      pincode: "",
      country: "",
      gst_no: formType === "Shipping" ? "" : undefined, // Include GST only for Shipping
    });
  
    // Clear any previous errors
    setErrors({});
  };
  
  //  console.log(stateList, "formdata-state", formData)
  return (
  <div className="form-area">
  <div>
    <h1 className="text-2xl font-bold mb-4">{formType} Address</h1>

    {/* Full Name */}
    <div className="flex flex-col md:flex-row md:space-x-5 items-center mb-6">
      <div className="w-full md:w-1/2 mb-5 md:mb-0">
        <div className="input-com w-full h-full">
          <label className="input-label capitalize block mb-2 text-gray-600 text-[13px] font-normal">
            Full Name <span className="!text-rose-600">*</span>
          </label>
          <div className="input-wrapper border border-gray-300 w-full h-full overflow-hidden relative">
            <input
              type="text"
              value={formData.fullname}
              name="fullname"
              onChange={handleInputChange}
              placeholder="Full Name"
              className="input-field placeholder:text-sm text-sm px-6 text-gray-600 w-full font-normal bg-white focus:ring-0 focus:outline-none h-[50px]"
            />
          </div>
          {errors.fullname && <p className="text-red-500 text-sm mt-1">{errors.fullname}</p>}
        </div>
      </div>

      {/* Phone Number */}
      <div className="w-full md:flex-1">
        <div className="input-com w-full h-full">
          <label className="input-label capitalize block mb-2 text-gray-600 text-[13px] font-normal">
            Phone No. <span className="!text-rose-600">*</span>
          </label>
          <div className="input-wrapper border border-gray-300 w-full h-full overflow-hidden relative">
            <input
              type="text"
              value={formData.mobile}
              name="mobile"
              onChange={handleInputChange}
              placeholder="Phone No."
              className="input-field placeholder:text-sm text-sm px-6 text-gray-600 w-full font-normal bg-white focus:ring-0 focus:outline-none h-[50px]"
            />
          </div>
          {errors.mobile && <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>}
        </div>
      </div>
    </div>

    {/* Email */}
    <div className="flex flex-col md:space-x-5 items-center mb-6">
      <div className="w-full">
        <div className="input-com w-full h-full">
          <label className="input-label capitalize block mb-2 text-gray-600 text-[13px] font-normal">
            Email
          </label>
          <div className="input-wrapper border border-gray-300 w-full h-full overflow-hidden relative">
            <input
              type="text"
              value={formData.email}
              name="email"
              onChange={handleInputChange}
              placeholder="Email"
              className="input-field placeholder:text-sm text-sm px-6 text-gray-600 w-full font-normal bg-white focus:ring-0 focus:outline-none h-[50px]"
            />
          </div>
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>
      </div>
    </div>

    {/* GST Details */}
    <div className="flex flex-col md:space-x-5 items-center mb-6">
      <div className="w-full">
        <div className="input-com w-full h-full">
          <label className="input-label capitalize block mb-2 text-gray-600 text-[13px] font-normal">
            GST NO. (<span className="text-sm text-slate-500">optional</span>)
          </label>
          <div className="input-wrapper border border-gray-300 w-full h-full overflow-hidden relative">
            <input
              type="text"
              value={formData.gst_no}
              name="gst_no"
              onChange={handleInputChange}
              placeholder="Enter 15-digit GST Number here"
              className="input-field placeholder:text-sm text-sm px-6 text-gray-600 w-full font-normal bg-white focus:ring-0 focus:outline-none h-[50px]"
            />
          </div>
          {errors.gst_no && <p className="text-red-500 text-sm mt-1">{errors.gst_no}</p>}
        </div>
      </div>
    </div>

    {/* Address Line 1 */}
    <div className="mb-6">
      <div className="w-full">
        <div className="input-com w-full h-full">
          <label className="input-label capitalize block mb-2 text-gray-600 text-[13px] font-normal">
            Flat / House No. / Building  <span className="!text-rose-600">*</span>
          </label>
          <div className="input-wrapper border border-gray-300 w-full h-full overflow-hidden relative">
            <input
              type="text"
              value={formData.add1}
              name="add1"
              onChange={handleInputChange}
              placeholder="Flat / House No. / Building"
              className="input-field placeholder:text-sm text-sm px-6 text-gray-600 w-full font-normal bg-white focus:ring-0 focus:outline-none h-[50px]"
            />
          </div>
          {errors.add1 && <p className="text-red-500 text-sm mt-1">{errors.add1}</p>}
        </div>
      </div>
    </div>

    {/* Street / Landmark */}
    <div className="flex flex-col md:flex-row md:space-x-5 items-center mb-6">
      <div className="w-full md:w-1/2 mb-5 md:mb-0">
        <div className="input-com w-full h-full">
          <label className="input-label capitalize block mb-2 text-gray-600 text-[13px] font-normal">
            Area / Street / Sector
          </label>
          <div className="input-wrapper border border-gray-300 w-full h-full overflow-hidden relative">
            <input
              type="text"
              value={formData.add2}
              name="add2"
              onChange={handleInputChange}
              placeholder="Area / Street / Sector"
              className="input-field placeholder:text-sm text-sm px-6 text-gray-600 w-full font-normal bg-white focus:ring-0 focus:outline-none h-[50px]"
            />
          </div>
          {errors.add2 && <p className="text-red-500 text-sm mt-1">{errors.add2}</p>}
        </div>
      </div>
      <div className="w-full md:flex-1">
        <div className="input-com w-full h-full">
          <label className="input-label capitalize block mb-2 text-gray-600 text-[13px] font-normal">
            Landmark
          </label>
          <div className="input-wrapper border border-gray-300 w-full h-full overflow-hidden relative">
            <input
              type="text"
              value={formData.landmark}
              name="landmark"
              onChange={handleInputChange}
              placeholder="Landmark"
              className="input-field placeholder:text-sm text-sm px-6 text-gray-600 w-full font-normal bg-white focus:ring-0 focus:outline-none h-[50px]"
            />
          </div>
          {errors.landmark && <p className="text-red-500 text-sm mt-1">{errors.landmark}</p>}
        </div>
      </div>
    </div>

  

    {/* Country State */}
      
    <div className="flex flex-col md:flex-row md:space-x-5 items-center mb-6">
       {/* Country */}
       <div className="">
        <label className="input-label capitalize block mb-2 text-gray-600 text-[13px] font-normal">
            Country <span className="!text-rose-600">*</span>
          </label>
          <select
            name="country"
            value={countryid}
            onChange={(e) => {
              handleInputChange(e)
            }}
            className="border border-gray-300 w-full p-3"
          >
            <option value="">Select a country</option>
            {/* {countries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))} */}
          {countriesList.map((item, index) => (
          <option key={index} value={item.id}>
            {item.name}
          </option>
        ))}
          </select>
          {errors.country && <p className="text-red-500 text-sm">{errors.country}</p>}
        </div>
    
             {/* State */}
       <div className="md:w-1/2">
      <label className="input-label capitalize block mb-2 text-gray-600 text-[13px] font-normal">State <span className="!text-rose-600">*</span></label>      
        <select
          name="state"  
          value={stateid}
          onChange={(e) => {
            handleInputChange(e);
          
          }}
          className="border border-gray-300 w-full p-3"
        >
          <option value="">Select State</option>
          {stateList.map((state,index) => (
            <option key={state.id} value={state.id}>
              {state.name}
            </option>
          ))}
        </select>
        {errors.state && <p className="text-red-500 text-sm">{errors.state}</p>}
      </div>

    
     

    </div>

       {/*City, Pincode */}
       <div className="flex flex-col md:flex-row md:space-x-5 items-center mb-6">
     {/* State Field */}

   <div className="w-1/2">
      <label className="input-label capitalize block mb-2 text-gray-600 text-[13px] font-normal">City <span className="!text-rose-600">*</span></label>      
        <select
          name="city"  
          value={cityid}
          onChange={(e) => {
            handleInputChange(e);
            //setFormData((prev) => ({ ...prev, city: "" })); // Reset city
          }}
          className="border border-gray-300 w-full p-3"
        >
          <option value="">Select City</option>
          {cityList.map((city,index) => (
            <option key={city.id} value={city.id}>
              {city.name}
            </option>
          ))}
        </select>
        {errors.city && <p className="text-red-500 text-sm">{errors.city}</p>}
      </div>

{/* Pincode Field */}
<div className="w-full md:flex-1">
  <div className="input-com w-full h-full">
    <label className="input-label capitalize block mb-2 text-gray-600 text-[13px] font-normal">
      Pincode <span className="!text-rose-600">*</span>
    </label>
    <div className="input-wrapper border border-gray-300 w-full h-full overflow-hidden relative">
      <input
        type="text"
        value={formData.pincode}
        name="pincode"
        onChange={handleInputChange}
        placeholder="Pincode"
        className="input-field placeholder:text-sm text-sm px-6 text-gray-600 w-full font-normal bg-white focus:ring-0 focus:outline-none h-[50px]"
      />
    </div>
    {errors.pincode && <p className="text-red-500 text-sm mt-1">{errors.pincode}</p>}
  </div>
</div>

    
         

    </div>

    
  </div>
    {/* Address Type (For Shipping Only) */}
    {formType === "Shipping" && (
          <div className="mb-6">
            <label className="block mb-2 text-gray-600">Address Type</label>
            <div className="flex items-center">
              <label className="mr-4">
                <input
                  type="radio"
                  name="add_type"
                  value="home"
                  checked={formData.add_type === "home"}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                Home
              </label>
              <label className="mr-4">
                <input
                  type="radio"
                  name="add_type"
                  value="office"
                  checked={formData.add_type === "office"}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                Office
              </label>
              <label>
                <input
                  type="radio"
                  name="add_type"
                  value="other"
                  checked={formData.add_type === "other"}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                Other
              </label>
            </div>
            {errors.add_type && <p className="text-red-500 text-sm">{errors.add_type}</p>}
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            className="bg-blue-500 text-white px-4 py-2"
            onClick={handleSubmit }
          >
            Submit
          </button>
        </div>
</div>

  );
};

export default FormAddress;


