"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import login from "../Asset/Ecom Image.jpeg";
import logo from "../Asset/OnlineKingLogo.svg";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSnackbar } from "../SnackBarProvider";
import axios from "../../../axios";
import OtpInput from "react-otp-input";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import HeaderMain from "../HomePage/HeaderMain";
import Footer from "../HomePage/Footer";
import WebSpeciails from "../HomePage/WebSpeciails";
import Navbar from "../components/Navbar/Navbar";
import useUserStore from "../storeContext/userStore";
import TermAndConditions from "../components/utils/TermAndConditions";

const Page = () => {
  const { openSnackbar } = useSnackbar();
  const router = useRouter();

  const { addAddressOnRegistration } = useUserStore();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [otpStep, setOtpStep] = useState(false); // Step state to control flip between signup and OTP
  const [otp, setOtp] = useState("");
  const [resendTimer, setResendTimer] = useState(60);
  const [userId, setUserId] = useState("");
  const [addressType, setAddressType] = useState("");
  const [termCheckbox, setTermCheckbox] = useState(false);
  const [errors, setErrors] = useState({});

  // const [getUserData, setGetUserData] = useState({
  //   fullname: "",
  //   username: "",
  //   password: "",
  //   cpassword: "",
  // });
  const [getUserData, setGetUserData] = useState({
    mobile: "",
    email: "",
    add_type: "",
    add1: "",
    add2: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
    area: "",
    landmark: "",
    type: "",
    gst_no: "",
    fullname: "",
    username: "",
    password: "",
    cpassword: "",
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const getData = (e) => {
    const { value, name } = e.target;
    setGetUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateFields = () => {
    const newErrors = {};

    // Register form validation
    if (!getUserData.fullname) newErrors.fullname = "Full name is required.";
    if (!getUserData.username || !/\S+@\S+\.\S+/.test(getUserData.username))
      newErrors.username = "Valid email is required.";
    if (!getUserData.password || getUserData.password.length < 8)
      newErrors.password = "Password must be at least 8 characters long.";
    if (!getUserData.cpassword)
      newErrors.cpassword = "Confirm password is required.";
    if (getUserData.password !== getUserData.cpassword)
      newErrors.cpassword = "Passwords do not match.";

    // Address form validation (if active)
    if (isFlipped) {
      if (!getUserData.mobile || !/^\d{10}$/.test(getUserData.mobile))
        newErrors.mobile = "Valid 10-digit mobile number is required.";
      if (!getUserData.add1) newErrors.add1 = "Address 1 is required.";
      if (!getUserData.city) newErrors.city = "City is required.";
      if (!getUserData.pincode || !/^\d{6}$/.test(getUserData.pincode))
        newErrors.pincode = "Valid pincode is required.";
      if (!getUserData.state) newErrors.state = "State is required.";
      if (!getUserData.country) newErrors.country = "Country is required.";
      // GST Validation
      if (
        getUserData.gst_no &&
        !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/.test(
          getUserData.gst_no
        )
      ) {
        newErrors.gst_no = "Invalid GST number.";
      }
    }

    // OTP form validation
    if (otpStep && (!otp || otp.length !== 4))
      newErrors.otp = "Valid 4-digit OTP is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = () => {
    axios
      .post(`/api/register-customer-dealer?type=CUSTOMER`, {
        fullname: getUserData.fullname,
        username: getUserData.username,
        password: getUserData.password,
        confirm_password: getUserData.cpassword,
      })
      .then((res) => {
        if (res.data.status === "success") {
          openSnackbar(res.data.message, "success");
          setUserId(res.data.created_user.id);
          setOtpStep(true); // Show OTP section after successful registration
          setResendTimer(60);
          return res.data;
        } else {
          openSnackbar(res.data.message, "error");
        }
      })
      .catch((err) => {
        openSnackbar(err.response.data.message, "error");
      });
  };

  useEffect(() => {
    let intervalId;
    if (resendTimer > 0) {
      intervalId = setInterval(() => {
        setResendTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [resendTimer]);

  const handleResendOTP = () => {
    setResendTimer(60);
    handleRegister();
  };

  const handleVerifyOTP = async (type = null) => {
    if (otp === "") {
      openSnackbar("Please enter OTP", "error");
      return;
    }
    try {
      const response = await axios.post(
        `/api/verify-otp-customer-dealer?type=CUSTOMER`,
        {
          user_id: userId,
          otp: otp,
        }
      );

      if (response.data.status === "success") {
        if (type === "address") {
          const { username, password, cpassword, ...rest } = getUserData;
          const res = await addAddressOnRegistration(
            { ...rest, user_id: userId },
            openSnackbar
          );
          console.log(res, "res-address");
        }
        openSnackbar(response.data.message, "success");
        router.push("/Login");
      } else {
        openSnackbar(response.data.message, "error");
      }
    } catch (err) {
      openSnackbar(err.response?.data?.message || "An error occurred", "error");
    }
  };

  const handleFlipToAddress = () => {
    if (!validateFields()) return;
    setIsFlipped(true);
  };

  const handleFlipToRegister = () => {
    setIsFlipped(false);
  };

  const handleBackToSignup = () => {
    setOtpStep(false); // Hide OTP section and show Signup form again
  };

  const handleResetAddress = () => {
    setIsFlipped(false);
  };

  const handleAddressSubmit = async () => {
    //setOtpStep(false);
    console.log("adding address", getUserData);
    setOtpStep(true);
    setAddressType("address");
    handleRegister();
    //console.log(newUser, "new-user");
  };

  return (
    <>
      {/* <HeaderMain /> */}
      <Navbar />
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="relative w-full my-8 max-w-xl">
          <div
            className={`transform transition-transform duration-500 ${isFlipped ? "rotate-y-180" : ""}`}
          >
            {/* Register Form */}
            <div
              className={`bg-white shadow-lg rounded-lg p-8 h-full backface-hidden ${
                otpStep || isFlipped ? "hidden" : "block"
              }`}
            >
              <div className="flex justify-center">
                <img
                  src="/OnlineKingLogo.svg"
                  className="rounded-lg w-24 object-contain"
                  alt="logo"
                />
              </div>
              <h1 className="text-3xl font-semibold text-center mb-3">
                Register
              </h1>

              <div className="text-center mb-6">
                <h1 className="text-xl">Already have an account?</h1>
                <Link href={"/Login"}>
                  <h1 className="text-xl text-green-600 hover:underline">
                    Login
                  </h1>
                </Link>
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col">
                  <label
                    htmlFor="fullname"
                    className="block text-xl font-medium mb-1"
                  >
                    Enter Full Name
                  </label>
                  <input
                    type="text"
                    id="fullname"
                    name="fullname"
                    placeholder="Please Enter Your Full Name"
                    className={`border px-4 py-2 rounded-lg ${
                      errors.fullname ? "border-red-500" : "border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-green-600`}
                    onChange={getData}
                  />
                  {errors.fullname && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.fullname}
                    </p>
                  )}
                </div>
                <div className="flex flex-col">
                  <label
                    htmlFor="username"
                    className="block text-xl font-medium mb-1"
                  >
                    Enter Email
                  </label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    placeholder="Enter Email here..."
                    className={`border px-4 py-2 rounded-lg ${
                      errors.username ? "border-red-500" : "border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-green-600`}
                    onChange={getData}
                  />
                  {errors.username && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.username}
                    </p>
                  )}
                </div>
                <div className="flex flex-col relative">
                  <label
                    htmlFor="password"
                    className="block text-xl font-medium mb-1"
                  >
                    Enter Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      placeholder="Enter Password"
                      className={`border px-4 py-2 rounded-lg pr-10 ${
                        errors.password ? "border-red-500" : "border-gray-300"
                      } w-full focus:outline-none focus:ring-2 focus:ring-green-600`}
                      onChange={getData}
                    />
                    <div
                      className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? <FaEye /> : <FaEyeSlash />}
                    </div>
                    {errors.password && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.password}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex flex-col relative">
                  <label
                    htmlFor="cpassword"
                    className="block text-xl font-medium mb-1"
                  >
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="cpassword"
                      name="cpassword"
                      placeholder="Confirm Password"
                      className={`border px-4 py-2 rounded-lg pr-10 ${
                        errors.cpassword ? "border-red-500" : "border-gray-300"
                      } w-full focus:outline-none focus:ring-2 focus:ring-green-600`}
                      onChange={getData}
                    />
                    <div
                      className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                      onClick={toggleConfirmPasswordVisibility}
                    >
                      {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
                    </div>
                    {errors.cpassword && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.cpassword}
                      </p>
                    )}
                  </div>
                </div>
                <TermAndConditions
                  checked={termCheckbox}
                  onChecked={setTermCheckbox}
                />
                <button
                  className={`w-full bg-green-600 ${
                    !termCheckbox ? "opacity-50" : " hover:bg-green-700"
                  } text-white font-bold py-2 px-4 rounded-lg focus:outline-none`}
                  disabled={!termCheckbox}
                  onClick={() => {
                    if (validateFields()) handleRegister();
                  }}
                >
                  SEND OTP
                </button>

                <button
                  className="mt-4 bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none"
                  onClick={handleFlipToAddress}
                >
                  Add Address Details
                </button>
              </div>
            </div>
            {/* <div
              className={`bg-white shadow-lg rounded-lg p-8 h-full backface-hidden absolute inset-0 ${otpStep ? "hidden" : "block"}`}
            >
              <div className="flex justify-center">
                <img
                  src="/OnlineKingLogo.svg"
                  className="rounded-lg w-24 object-contain"
                  alt="logo"
                />
              </div>
              <h1 className="text-3xl font-semibold text-center mb-3">
                Register
              </h1>

              <div className="text-center mb-6">
                <h1 className="text-xl">Already have an account?</h1>
                <Link href={"/Login"}>
                  <h1 className="text-xl text-green-600 hover:underline">
                    Login
                  </h1>
                </Link>
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col">
                  <label
                    htmlFor="fullname"
                    className="block text-xl font-medium mb-1"
                  >
                    Enter Full Name
                  </label>
                  <input
                    type="text"
                    id="fullname"
                    name="fullname"
                    placeholder="Please Enter Your Full Name"
                    className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
                    onChange={getData}
                  />
                </div>
                <div className="flex flex-col">
                  <label
                    htmlFor="username"
                    className="block text-xl font-medium mb-1"
                  >
                    Enter Email
                  </label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    placeholder="Enter Email here..."
                    className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
                    onChange={getData}
                  />
                </div>
                <div className="flex flex-col">
                  <label
                    htmlFor="password"
                    className="block text-xl font-medium mb-1"
                  >
                    Enter Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      placeholder="Enter Password"
                      className="border border-gray-300 rounded-lg px-4 py-2 pr-10 w-full focus:outline-none focus:ring-2 focus:ring-green-600"
                      onChange={getData}
                    />
                    <div
                      className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? <FaEye /> : <FaEyeSlash />}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col">
                  <label
                    htmlFor="cpassword"
                    className="block text-xl font-medium mb-1"
                  >
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="cpassword"
                      name="cpassword"
                      placeholder="Confirm Password"
                      className="border border-gray-300 rounded-lg px-4 py-2 pr-10 w-full focus:outline-none focus:ring-2 focus:ring-green-600"
                      onChange={getData}
                    />
                    <div
                      className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                      onClick={toggleConfirmPasswordVisibility}
                    >
                      {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
                    </div>
                  </div>
                </div>
                <div>
                  <TermAndConditions
                    checked={termCheckbox}
                    onChecked={setTermCheckbox}
                  />
                  <button
                    className={`w-full bg-green-600 ${!termCheckbox ? "bg-gray-500" : " hover:bg-green-700"} text-white font-bold py-2 px-4 rounded-lg focus:outline-none`}
                    disabled={!termCheckbox}
                    onClick={handleRegister}
                  >
                    SEND OTP
                  </button>
                </div>

                <button
                  className="mt-4 bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none"
                  onClick={handleFlipToAddress}
                >
                  Add Address Details
                </button>
              </div>
            </div> */}

            {/* Your Address Form */}
            <div
              className={`bg-white shadow-lg rounded-lg p-8 w-full transform rotate-y-180 backface-hidden ${
                !isFlipped || otpStep ? "hidden" : "block"
              }`}
            >
              <h2 className="text-2xl font-medium text-center mb-4">
                Your Address
              </h2>
              <div className="flex flex-wrap gap-4">
                <div className="flex flex-col w-full">
                  <label
                    htmlFor="mobile"
                    className="block text-xl font-medium mb-1"
                  >
                    Mobile No.
                  </label>
                  <input
                    type="text"
                    id="mobile"
                    name="mobile"
                    placeholder="Mobile No."
                    value={getUserData.mobile}
                    className={`border px-4 py-2 rounded-lg ${
                      errors.mobile ? "border-red-500" : "border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-green-600 bg-white`}
                    onChange={getData}
                  />
                  {errors.mobile && (
                    <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>
                  )}
                </div>
                <div className="flex flex-col w-full">
                  <label
                    htmlFor="add1"
                    className="block text-xl font-medium mb-1"
                  >
                    Address 1
                  </label>
                  <input
                    type="text"
                    id="add1"
                    name="add1"
                    placeholder="Address Line 1"
                    value={getUserData.add1}
                    className={`border px-4 py-2 rounded-lg ${
                      errors.add1 ? "border-red-500" : "border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-green-600 bg-white`}
                    onChange={getData}
                  />
                  {errors.add1 && (
                    <p className="text-red-500 text-sm mt-1">{errors.add1}</p>
                  )}
                </div>
                <div className="flex flex-col w-full">
                  <label
                    htmlFor="add2"
                    className="block text-xl font-medium mb-1"
                  >
                    Address 2
                  </label>
                  <input
                    type="text"
                    id="add2"
                    name="add2"
                    placeholder="Address Line 2"
                    value={getUserData.add2}
                    className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-600 bg-white"
                    onChange={getData}
                  />
                </div>
                <div className="flex flex-row w-full gap-4">
                  <div className="flex flex-col w-1/2">
                    <label
                      htmlFor="city"
                      className="block text-xl font-medium mb-1"
                    >
                      City
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      placeholder="City"
                      value={getUserData.city}
                      className={`border px-4 py-2 rounded-lg ${
                        errors.city ? "border-red-500" : "border-gray-300"
                      } focus:outline-none focus:ring-2 focus:ring-green-600 bg-white`}
                      onChange={getData}
                    />
                    {errors.city && (
                      <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                    )}
                  </div>
                  <div className="flex flex-col w-1/2">
                    <label
                      htmlFor="pincode"
                      className="block text-xl font-medium mb-1"
                    >
                      Post Code
                    </label>
                    <input
                      type="text"
                      id="pincode"
                      name="pincode"
                      placeholder="Post Code"
                      value={getUserData.pincode}
                      className={`border px-4 py-2 rounded-lg ${
                        errors.pincode ? "border-red-500" : "border-gray-300"
                      } focus:outline-none focus:ring-2 focus:ring-green-600 bg-white`}
                      onChange={getData}
                    />
                    {errors.pincode && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.pincode}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex flex-row w-full gap-4">
                  <div className="flex flex-col w-1/2">
                    <label
                      htmlFor="state"
                      className="block text-xl font-medium mb-1"
                    >
                      Region/State
                    </label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      placeholder="Region/State"
                      value={getUserData.state}
                      className={`border px-4 py-2 rounded-lg ${
                        errors.state ? "border-red-500" : "border-gray-300"
                      } focus:outline-none focus:ring-2 focus:ring-green-600 bg-white`}
                      onChange={getData}
                    />
                    {errors.state && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.state}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col w-1/2">
                    <label
                      htmlFor="country"
                      className="block text-xl font-medium mb-1"
                    >
                      Country
                    </label>
                    <input
                      type="text"
                      id="country"
                      name="country"
                      placeholder="Country"
                      value={getUserData.country}
                      className={`border px-4 py-2 rounded-lg ${
                        errors.country ? "border-red-500" : "border-gray-300"
                      } focus:outline-none focus:ring-2 focus:ring-green-600 bg-white`}
                      onChange={getData}
                    />
                    {errors.country && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.country}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex flex-col w-full">
                  <label
                    htmlFor="gst_no"
                    className="block text-xl font-medium mb-1"
                  >
                    GST Number
                  </label>
                  <input
                    type="text"
                    id="gst_no"
                    name="gst_no"
                    placeholder="GST"
                    value={getUserData.gst_no}
                    className={`border px-4 py-2 rounded-lg ${
                      errors.gst_no ? "border-red-500" : "border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-green-600 bg-white`}
                    onChange={getData}
                  />
                  {errors.gst_no && (
                    <p className="text-red-500 text-sm mt-1">{errors.gst_no}</p>
                  )}
                </div>
              </div>
              <div className="flex flex-col items-center mt-4">
                <button
                  className="bg-green-600 text-white font-bold w-96 py-3 px-4 rounded-lg hover:bg-green-700 focus:outline-none mb-2"
                  onClick={() => {
                    if (validateFields()) handleAddressSubmit();
                  }}
                >
                  {isFlipped ? "Send Otp for registration" : ""}
                </button>
                <button
                  className="text-red-500 underline text-sm"
                  onClick={handleResetAddress}
                >
                  Skip for Now?
                </button>
              </div>
            </div>

            {/* OTP Verification Form */}
            <div
              className={`bg-white shadow-lg rounded-lg p-8 w-full h-full backface-hidden ${
                otpStep ? "block" : "hidden"
              }`}
            >
              <h2 className="text-2xl font-medium text-center mb-4">
                Verify OTP
              </h2>
              <div className="flex flex-wrap gap-4 justify-center">
                <div className="w-full max-w-md">
                  <div className="bg-white text-black rounded-lg shadow-lg p-6">
                    <div className="flex justify-center">
                      <img
                        src="/OnlineKingLogo.svg"
                        className="rounded-lg"
                        alt="logo"
                      />
                    </div>
                    <div className="text-center mt-4">
                      <h3 className="font-semibold text-2xl">Verify OTP</h3>
                    </div>
                    <div className="mt-4">
                      <OtpInput
                        inputStyle={`border-2 ${
                          errors.otp ? "border-red-500" : "border-gray-300"
                        } rounded-lg text-center`}
                        containerStyle="flex justify-center text-4xl"
                        value={otp}
                        onChange={(value) => {
                          setOtp(value);
                          setErrors((prevErrors) => ({
                            ...prevErrors,
                            otp: "",
                          }));
                        }}
                        numInputs={4}
                        inputType="text"
                        placeholder={0}
                        renderSeparator={<span>-</span>}
                        renderInput={(props) => <input {...props} />}
                        shouldAutoFocus
                      />
                      {errors.otp && (
                        <p className="text-red-500 text-sm mt-1 text-center">
                          {errors.otp}
                        </p>
                      )}
                    </div>
                    <div className="mt-4 text-center">
                      {resendTimer > 0 ? (
                        <p className="text-sm text-gray-500">
                          Resend OTP in{" "}
                          <span className="font-bold">{resendTimer}</span>{" "}
                          seconds
                        </p>
                      ) : (
                        <button
                          className="text-blue-500 hover:text-orange-900 underline text-sm"
                          onClick={() => {
                            setErrors((prevErrors) => ({
                              ...prevErrors,
                              otp: "",
                            }));
                            handleResendOTP();
                          }}
                        >
                          Didn&apos;t receive OTP? Resend OTP
                        </button>
                      )}
                    </div>
                    <div className="flex justify-center mt-4">
                      <button
                        className={`bg-green-500 text-white font-bold py-2 px-6 rounded-lg shadow-md hover:bg-green-600 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-300 ease-in-out ${
                          otp.length !== 4
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                        onClick={() => {
                          if (otp.length !== 4) {
                            setErrors((prevErrors) => ({
                              ...prevErrors,
                              otp: "Please enter a valid 4-digit OTP.",
                            }));
                            return;
                          }
                          setErrors({});
                          !addressType
                            ? handleVerifyOTP()
                            : handleVerifyOTP(addressType);
                        }}
                        disabled={otp.length !== 4}
                      >
                        Submit OTP
                      </button>
                    </div>

                    <div className="flex justify-center mt-4">
                      <button
                        className="text-white bg-gray-800 font-bold py-2 px-6 rounded-lg shadow-md hover:bg-gray-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-300 ease-in-out"
                        onClick={() => {
                          setErrors({});
                          handleBackToSignup();
                        }}
                      >
                        Back to Signup
                      </button>
                    </div>
                  </div>
                </div>
              </div>
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
