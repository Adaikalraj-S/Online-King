"use client";
import HeaderMain from "@/app/HomePage/HeaderMain";
import axios from "../../../../axios";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { useSnackbar } from "@/app/SnackBarProvider";
import Footer from "@/app/HomePage/Footer";
import WebSpeciails from "@/app/HomePage/WebSpeciails";
import MyOrdersComponents from "../../HomePage/MyOrdersComponents";
import Image from "next/image";
import MyAddressComponent from "../../HomePage/MyAddressComponent";
import MyWishlist from "@/app/HomePage/MyWishlist";
import Link from "next/link";
import WishList from "@/app/components/WishList/WishList";
import FirstStep from "@/app/components/checkout/FirstStep";
import Navbar from "@/app/components/Navbar/Navbar";
import useProductStore from "../../storeContext/store";
import OTPInput from "@/app/components/utils/OtpInput";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import profile from "../../Asset/Profile.svg";


const Page = ({ params }) => {
  const {
    isAuthenticated,
    checkLocalStorageAndVerifyToken,
    loginUser,
    forgetPasswordOtp,
    verifyForgetPassword,
  } = useProductStore();
  const router = useRouter();
  const { openSnackbar } = useSnackbar();
  const section = params.slug;

  const [activeTab, setActiveTab] = useState("my-account");
  const [userData, setUserData] = useState({});
  const [editData, setEditData] = useState({
    fullname: "",
    email: "",
    phone: "",
    dob: "",
    gender: "",
    profile_img: "",
  });
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [addresses, setAddresses] = useState({
    shipping: [],
    billing: [],
  });
  const [newAddress, setNewAddress] = useState({
    type: "Shipping",
    fullname: "",
    mobile: "",
    add1: "",
    add2: "",
    city: "",
    state: "",
    country: "",
    zipcode: "",
  });

  const [changePasswordData, setChangePasswordData] = useState({
    user_id: null,
    otp: "",
    new_password: "",
    confirm_password: "",
  });

  const [enterOtp, setEnterOtp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (section === "my-orders") {
      setActiveTab("my-orders");
    } else if (section === "my-address") {
      setActiveTab("my-address");
    } else if (section === "my-wishlist") {
      setActiveTab("my-wishlist");
    } else if (section === "change-password") {
      setActiveTab("change-password");
    }
  }, [section]);

  useEffect(() => {
    if(isAuthenticated) {

      fetchProfile();
    } else {
      router.push("/Login")
    }
    fetchProfile();
  }, []);

  const fetchProfile = useCallback(() => {
    axios
      .get(`/api/fetch-customer-details`, {
        headers: {
          Authorization: localStorage.getItem("onlineKingWebToken"),
        },
      })
      .then((res) => {
        console.log(res, "profile");
        if (res.data.code === 200) {
          setUserData(res.data.customer_data);
          setChangePasswordData((prev) => ({
            ...prev,
            user_id: res.data.customer_data.customer.id,
          }));
          setEditData({
            fullname: res.data.customer_data.customer.fullname || "",
            email: res.data.customer_data.customer.email || "",
            phone: res.data.customer_data.customer.phone || "",
            dob: res.data.customer_data.customer.dob || "",
            gender: res.data.customer_data.customer.gender || "",
            profile_img: "", // Profile image is handled separately
          });

          // Separate addresses into shipping and billing
          const shippingAddresses =
            res.data.customer_data.customer_addresses.filter(
              (addr) => addr.type === "Shipping"
            );
          const billingAddresses =
            res.data.customer_data.customer_addresses.filter(
              (addr) => addr.type === "Billing"
            );
          setAddresses({
            shipping: shippingAddresses,
            billing: billingAddresses,
          });

          // Check if profile image exists, then set it for preview
          if (res.data.customer_data.customer.profile_img) {
            setProfileImagePreview(
              `${process.env.NEXT_PUBLIC_BASE_IMAGE_URL}${res.data.customer_data.customer.profile_img}`
            );
          } else {
            setProfileImagePreview(null); // No image, set to null
          }
        }
      })
      .catch((err) => {
        if (err.response && err.response.data.statusCode === 400) {
          openSnackbar(err.response.data.message, "error");
          router.push("/Login")
        }
      });
  }, [openSnackbar]);

  const handleTabChange = (tab) => {
    //setActiveTab(tab);
    router.push(`/profile/${tab}`);
  };

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = useCallback(() => {
    axios
      .get(`/api/fetch-orders`, {
        headers: {
          Authorization: localStorage.getItem("onlineKingWebToken"),
        },
      })
      .then((res) => {
        if (res.data.code === 200) {
          setOrders(res.data.orders);
        } else if (res.data.message === "Session expired") {
          openSnackbar(res.data.message, "error");
          router.push("/Login");
        }
      })
      .catch((err) => {
        if (err.response && err.response.data.statusCode === 400) {
          openSnackbar(err.response.data.message, "error");
        }
      });
  }, [openSnackbar]);

  const handleLogout = () => {
    localStorage.removeItem("onlineKingWebToken");
    openSnackbar("You have been logged out successfully.", "success");
    router.push("/Login");
  };

  const handleInputChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditData({ ...editData, profile_img: file });
      setProfileImagePreview(URL.createObjectURL(file));
    }
  };

  const handleAddressChange = (e, index, type) => {
    const updatedAddresses = { ...addresses };
    updatedAddresses[type][index][e.target.name] = e.target.value;
    setAddresses(updatedAddresses);
  };

  const handleNewAddressChange = (e) => {
    setNewAddress({ ...newAddress, [e.target.name]: e.target.value });
  };

  const handleUpdateAccount = () => {
    const formData = new FormData();
    formData.append("fullname", editData.fullname);
    formData.append("email", editData.email);
    formData.append("phone", editData.phone);
    formData.append("dob", editData.dob);
    formData.append("gender", editData.gender);
    if (editData.profile_img) {
      formData.append("profile_img", editData.profile_img);
    }

    axios
      .post("/api/edit-customer-details", formData, {
        headers: {
          Authorization: localStorage.getItem("onlineKingWebToken"),
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        if (res.data.code === 200) {
          openSnackbar("Account updated successfully", "success");
          fetchProfile(); // Refresh user data after update
        } else {
          openSnackbar("Failed to update account", "error");
        }
      })
      .catch((err) => {
        console.log(err);
        openSnackbar("An error occurred while updating account", "error");
      });
  };

  const handleUpdateAddress = (id, addressData) => {
    axios
      .post(
        "/api/edit-customer-address",
        { id, ...addressData },
        {
          headers: {
            Authorization: localStorage.getItem("onlineKingWebToken"),
          },
        }
      )
      .then((res) => {
        if (res.data.code === 200) {
          openSnackbar("Address updated successfully", "success");
          fetchProfile(); // Refresh address data after update
        } else {
          openSnackbar("Failed to update address", "error");
        }
      })
      .catch((err) => {
        console.log(err);
        openSnackbar("An error occurred while updating address", "error");
      });
  };

  const handleAddNewAddress = () => {
    axios
      .post("/api/add-customer-address", newAddress, {
        headers: {
          Authorization: localStorage.getItem("onlineKingWebToken"),
        },
      })
      .then((res) => {
        if (res.data.code === 200) {
          openSnackbar("Address added successfully", "success");
          fetchProfile(); // Refresh address data after addition
          setNewAddress({
            type: "Shipping",
            fullname: "",
            mobile: "",
            add1: "",
            add2: "",
            city: "",
            state: "",
            country: "",
            zipcode: "",
          }); // Reset new address form
        } else {
          openSnackbar("Failed to add address", "error");
        }
      })
      .catch((err) => {
        console.log(err);
        openSnackbar("An error occurred while adding address", "error");
      });
  };

  console.log(userData, "lp");

  const sendChangePasswordOtp = async () => {
    console.log(changePasswordData, "change-data");
    const res = await forgetPasswordOtp({
      username: userData?.customer?.username,
    });
    console.log(res, "pass-otp");
    if (res.status === "success") {
      setEnterOtp(true);
    }
  };

  const handleOtpChange = (value) => {
    setChangePasswordData((prev) => ({ ...prev, otp: value }));
  };

  const handleChangePassword = async () => {
    console.log(changePasswordData, "sava-data");
    const res = await verifyForgetPassword(changePasswordData, openSnackbar);
    console.log(res, "ver-pass");
    if (res) {
      setEnterOtp(false);
    }
  };

  return (
    <>
      {/* <HeaderMain /> */}
      <Navbar />
      <div className="container mx-auto py-[40px]">
        <div className="flex justify-center mt-8">
          <div className="md:flex w-full">
            {/* Sidebar */}
            <div className="md:w-1/4">
              <div className="bg-[#fff] border p-4 rounded-md">
                <div className="flex flex-col justify-center items-center">
                  {profileImagePreview ? (
                    <Image
                      src={profileImagePreview}
                      alt="Profile Image"
                      width={100}
                      height={100}
                      className="rounded-full mb-4 object-cover"
                    />
                  ) : (
                    <Image
                      src={profile}
                      alt="Profile Image"
                      width={100}
                      height={100}
                      className="rounded-full mb-4 object-cover"
                    />
                  )}
                    {/* <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                      <span>No Image</span>
                    </div> */}
                  <span className="text-center text-[14px] font-[400]">
                    Welcome
                  </span>
                  <h2 className="text-[17px] text-center font-bold mb-4">
                    {userData.customer?.fullname || "Guest"}
                  </h2>
                </div>
                {/* <ul 
                >
                  <li
                    className={`py-2 cursor-pointer profileTab ${activeTab === "my-account" ? "active" : ""}`}
                    onClick={() => handleTabChange("my-account")}
                  >
                    My Account
                  </li>
                  <li
                    className={`py-2 cursor-pointer profileTab ${activeTab === "my-orders" ? "active" : ""}`}
                    onClick={() => handleTabChange("my-orders")}
                  >
                    My Orders
                  </li>

                  <li
                    className={`py-2 cursor-pointer profileTab ${activeTab === "my-wishlist" ? "active" : ""}`}
                    onClick={() => handleTabChange("my-wishlist")}
                  >
                    <div className="flex items-center">
                      My Wishlist
                      
                    </div>
                  </li>

                  <li
                    className={`py-2 cursor-pointer profileTab ${activeTab === "my-address" ? "active" : ""}`}
                    onClick={() => handleTabChange("my-address")}
                  >
                    My Address
                  </li>
                 
                  <li
                    className={`py-2 cursor-pointer profileTab ${activeTab === "change-password" ? "active" : ""}`}
                    onClick={() => handleTabChange("change-password")}
                  >
                    Change Password
                  </li>
                  <li
                    className={`py-2 cursor-pointer profileTab`}
                    onClick={handleLogout}
                  >
                    Logout
                  </li>
                </ul> */}
                <div className="md:block flex flex-row gap-4 items-center overflow-x-auto feature-container">
                  <div
                    className={`py-2 cursor-pointer text-nowrap profileTab ${activeTab === "my-account" ? "active" : ""}`}
                    onClick={() => handleTabChange("my-account")}
                  >
                    My Account
                  </div>
                  <div
                    className={`py-2 cursor-pointer text-nowrap profileTab ${activeTab === "my-orders" ? "active" : ""}`}
                    onClick={() => handleTabChange("my-orders")}
                  >
                    My Orders
                  </div>
                  <div
                    className={`py-2 cursor-pointer text-nowrap profileTab ${activeTab === "my-wishlist" ? "active" : ""}`}
                    onClick={() => handleTabChange("my-wishlist")}
                  >
                    <div className="flex items-center">My Wishlist</div>
                  </div>
                  <div
                    className={`py-2 cursor-pointer profileTab text-nowrap ${activeTab === "my-address" ? "active" : ""}`}
                    onClick={() => handleTabChange("my-address")}
                  >
                    My Address
                  </div>
                  <div
                    className={`py-2 cursor-pointer text-nowrap profileTab ${activeTab === "change-password" ? "active" : ""}`}
                    onClick={() => handleTabChange("change-password")}
                  >
                    Change Password
                  </div>
                  <div
                    className={`py-2 cursor-pointer profileTab text-nowrap`}
                    onClick={handleLogout}
                  >
                    Logout
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="md:w-3/4 px-4">
              {activeTab === "my-account" && (
                <div className="flex flex-col space-y-3 border px-[10px] py-[10px]">
                  <h2 className="text-lg font-bold mb-4">My Account</h2>
                  {/* Account details input fields */}
                  <div className="flex flex-col space-y-1">
                    <label className="text-[13px] font-[400] text-[#AFAFAF]">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="fullname"
                      className="p-[8px] border border-[#AFAFAF] text-[13px]"
                      value={editData.fullname}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="flex flex-col space-y-1">
                    <label className="text-[13px] font-[400] text-[#AFAFAF]">
                      Email Id
                    </label>
                    <input
                      type="email"
                      name="email"
                      className="p-[8px] border border-[#AFAFAF] text-[13px]"
                      value={editData.email}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="flex flex-col space-y-1">
                    <label className="text-[13px] font-[400] text-[#AFAFAF]">
                      Mobile Number
                    </label>
                    <input
                      type="text"
                      name="phone"
                      className="p-[8px] border border-[#AFAFAF] text-[13px]"
                      value={editData.phone}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="flex flex-col space-y-1">
                    <label className="text-[13px] font-[400] text-[#AFAFAF]">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      name="dob"
                      className="p-[8px] border border-[#AFAFAF] text-[13px]"
                      value={editData.dob}
                      onChange={handleInputChange}
                    />
                  </div>

                  {/* <div className='flex flex-col space-y-1'>
                    <label className='text-[13px] font-[400] text-[#AFAFAF]'>Gender</label>
                    <select name="gender" className='p-[8px] border border-[#AFAFAF] text-[13px]' value={editData.gender} onChange={handleInputChange}>
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div> */}

                  <div className="flex flex-col space-y-1">
                    <label className="text-[13px] font-[400] text-[#AFAFAF]">
                      Profile Image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      className="p-[8px] border border-[#AFAFAF] text-[13px]"
                      onChange={handleImageChange}
                    />
                  </div>

                  <button
                    onClick={handleUpdateAccount}
                    className="text-[13px] font-[400] text-center bg-[#000] text-[#fff] py-3 cursor-pointer"
                  >
                    Update Account
                  </button>
                </div>
              )}

              {activeTab === "change-password" && (
                <div className="flex flex-col space-y-3 border px-[10px] py-[10px] rounded">
                  <h2 className="text-lg font-bold mb-4">Change Password</h2>
                  {/* Account details input fields */}
                  <div className="flex flex-col space-y-1">
                    <label className="text-[13px] font-[400] text-[#AFAFAF]">
                      Username
                    </label>
                    <input
                      type="text"
                      name="username"
                      disabled
                      className="p-[8px] border border-[#AFAFAF] text-[13px] rounded"
                      value={userData?.customer?.username}
                    />
                  </div>
                  {!enterOtp ? (
                    <>
                      <div className="flex flex-col space-y-1">
                        <label className="text-[13px] font-[400] text-[#AFAFAF]">
                          New Password <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            name="new_password"
                            className="p-[8px] w-full border border-[#AFAFAF] text-[13px] focus:outline-none focus:ring-2 focus:ring-green-600 rounded"
                            value={changePasswordData.new_password}
                            onChange={(e) =>
                              setChangePasswordData((prev) => ({
                                ...prev,
                                [e.target.name]: e.target.value,
                              }))
                            }
                          />
                          <div
                            className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                            onClick={() => setShowPassword((prev) => !prev)}
                          >
                            {showPassword ? <FaEye /> : <FaEyeSlash />}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col space-y-1">
                        <label className="text-[13px] font-[400] text-[#AFAFAF]">
                          Confirm Password{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            name="confirm_password"
                            className="p-[8px] w-full border border-[#AFAFAF] text-[13px] focus:outline-none focus:ring-2 focus:ring-green-600 rounded"
                            value={changePasswordData.confirm_password}
                            onChange={(e) =>
                              setChangePasswordData((prev) => ({
                                ...prev,
                                [e.target.name]: e.target.value,
                              }))
                            }
                          />
                          <div
                            className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                            onClick={() => setShowPassword((prev) => !prev)}
                          >
                            {showPassword ? <FaEye /> : <FaEyeSlash />}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-end p-4">
                        <button
                          onClick={sendChangePasswordOtp}
                          className="text-white bg-green-500 px-4 py-2 rounded-lg hover:bg-green-600"
                        >
                          Send Otp
                        </button>
                      </div>
                    </>
                  ) : (
                    //   <div className="flex flex-col space-y-1">
                    //   <label className="text-[13px] font-[400] text-[#AFAFAF]">
                    //     Enter Otp <span className="text-red-500">*</span>
                    //   </label>
                    //   <div className="flex items-center gap-4">
                    //   {Array.from({length: 4}).map((e,i) => (
                    //     <input
                    //     key={`${i}`}
                    //     type="text"
                    //     name="otp"
                    //     className="border border-[#AFAFAF] text-[13px] rounded w-12 h-12"
                    //     value={changePasswordData.otp}
                    //     onChange={(e) => setChangePasswordData((prev) => ({...prev, [e.target.name]:e.target.value}))}

                    //   />
                    //   ))}
                    //   </div>

                    // </div>
                    <>
                      <OTPInput length={4} onOtpChange={handleOtpChange} />
                      <div className="flex items-center gap-4 justify-end p-4">
                        <button
                          onClick={() => setEnterOtp((prev) => !prev)}
                          className="text-white bg-green-500 px-4 py-2 rounded-lg hover:bg-green-600"
                        >
                          Back
                        </button>
                        <button
                          onClick={handleChangePassword}
                          className="text-white bg-green-500 px-4 py-2 rounded-lg hover:bg-green-600"
                        >
                          Save Password
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* My Address Tab */}

              {activeTab === "my-orders" && (
                <div>
                  <MyOrdersComponents
                    fetchOrders={fetchOrders}
                    orders={orders}
                  />
                </div>
              )}

              {activeTab === "my-address" && (
                <div>
                  {/* <MyAddressComponent userData={userData} fetchProfile={fetchProfile} /> */}
                  <FirstStep />
                </div>
              )}

              {activeTab === "my-wishlist" && (
                <div>
                  <WishList />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <WebSpeciails />
      <Footer />
    </>
  );
};

export default Page;
