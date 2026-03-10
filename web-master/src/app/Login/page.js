"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import login from "../Asset/Ecom Image.jpeg";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSnackbar } from "../SnackBarProvider";
import axios from "../../../axios";
import HeaderMain from "../HomePage/HeaderMain";
import Footer from "../HomePage/Footer";
import WebSpeciails from "../HomePage/WebSpeciails";
import useProductStore from "../storeContext/store";
import Navbar from "../components/Navbar/Navbar";
import logo from "../Asset/OnlineKingLogo.svg";
import OTPInput from "../components/utils/OtpInput";
import TermAndConditions from "../components/utils/TermAndConditions";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Page = () => {
  const { openSnackbar } = useSnackbar();
  const router = useRouter();

  const {
    isAuthenticated,
    checkLocalStorageAndVerifyToken,
    loginUser,
    forgetPasswordOtp,
    verifyForgetPassword,
  } = useProductStore();

  useEffect(() => {
    checkLocalStorageAndVerifyToken();
  }, [checkLocalStorageAndVerifyToken, isAuthenticated]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isDealerLogin, setIsDealerLogin] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const [forgotPassword, setForgotPassword] = useState(false);
  const [forgotPasswordPayload, setForgotPasswordPayload] = useState({
    user_id: null,
    new_password: "",
    confirm_password: "",
    otp: "",
  });
  const [errors, setErrors] = useState({});
  const [passwordVisiblity, setPasswordVisiblity] = useState(false);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0; // Ensure timer stops at 0
          }
          return prev - 1;
        });
      }, 1000);

      // Cleanup function to clear the interval when the component unmounts
      return () => clearInterval(timer);
    }
  }, [resendTimer]);

  const [username, setUsername] = useState("");
  const [otpField, setOtpField] = useState(false);
  const [termCheckbox, setTermCheckbox] = useState(false);

  const validateFields = () => {
    console.log(email, "email");
    const newErrors = {};
    if (forgotPassword) {
      if (!username) newErrors.username = "Please enter your email.";
      if (otpField) {
        if (
          !forgotPasswordPayload.otp ||
          forgotPasswordPayload.otp.length !== 4
        ) {
          newErrors.otp = "Please enter a valid 4-digit OTP.";
        }
        if (!forgotPasswordPayload.new_password)
          newErrors.new_password = "New password is required.";
        if (forgotPasswordPayload.new_password.length < 8)
          newErrors.new_password =
            "Password must be at least 8 characters long.";

        if (!forgotPasswordPayload.confirm_password)
          newErrors.confirm_password = "Please confirm your password.";
        if (
          forgotPasswordPayload.new_password !==
          forgotPasswordPayload.confirm_password
        ) {
          newErrors.confirm_password = "Passwords do not match.";
        }
      }
    } else {
      if (!email) newErrors.email = "Email is required.";
      if (!password) newErrors.password = "Password is required.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const userLogin = () => {
    console.log(errors, "error");
    if (!validateFields()) return;
    const loginType = isDealerLogin ? "DEALER" : "CUSTOMER";
    loginUser(
      { username: email, password: password },
      loginType,
      openSnackbar,
      router
    );
  };

  const handleForgotPassword = async () => {
    console.log(username, "user", forgotPasswordPayload);
    if (!validateFields()) return;
    // if (!username) {
    //   return;
    // }
    const res = await forgetPasswordOtp({ username: username });
    if (res.status === "success") {
      console.log(res, "res-otp");
      setOtpField(true);
      setForgotPasswordPayload((prev) => ({ ...prev, user_id: res.user_id }));
    } else {
      openSnackbar(res.message, "error");
    }
  };

  const handleForgotPassswordInput = (e) => {
    const { name, value } = e.target;
    setForgotPasswordPayload((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors({});
  };

  const handleVerifyForgotPassword = async () => {
    console.log("clicked", forgotPasswordPayload.otp);

    try {
      // if (!forgotPasswordPayload.otp) {
      //   return;
      // }
      if (!validateFields()) return;

      const res = await verifyForgetPassword(
        forgotPasswordPayload,
        openSnackbar
      );
      console.log(res, "vb");
      if (res.status === "success") {
        setForgotPassword((prev) => !prev);
        setOtpField((prev) => !prev);
        setForgotPasswordPayload({
          user_id: null,
          new_password: "",
          confirm_password: "",
          otp: "",
        });
      } else {
        // setForgotPassword((prev) => !prev);
        // setOtpField((prev) => !prev);
        // setForgotPasswordPayload({
        //   user_id: null,
        //   new_password: "",
        //   confirm_password: "",
        //   otp: "",
        // });
      }
    } catch (error) {
      console.log("Error in verifiying", error);
    }
  };

  const handleOtpChange = (otpValue) => {
    console.log(otpValue, "otp-value");
    setForgotPasswordPayload((prev) => ({ ...prev, otp: otpValue }));
    setErrors((prev) => ({ ...prev, otp: "" }));
  };

  const handleBack = () => {
    setForgotPassword((prev) => !prev);
    setOtpField((prev) => !prev);
    setErrors({});
  };

  const handleResendOTP = async () => {
    setResendTimer(60);
    const res = await forgetPasswordOtp({ username: username });
    if (res.status === "success") {
      console.log(res, "res-otp");
      // setOtpField(true);
      // setForgotPasswordPayload((prev) => ({ ...prev, user_id: res.user_id }));
    } else {
      openSnackbar(res.message, "error");
    }
  };

  return (
    <>
      <Navbar />
      {/* <div className="flex justify-center items-center min-h-screen py-6 bg-gray-100">
        {!forgotPassword ? (
          <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
            <div className="w-full flex justify-center items-center">
              <Image
                src={logo}
                width={1000}
                height={1000}
                className="w-24 object-contain"
              />
            </div>
            <h2 className="text-3xl font-semibold text-center mb-6">Login</h2>

            <div className="mb-4">
              <label htmlFor="Email" className="block text-xl font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                id="Email"
                placeholder="Enter email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                onChange={(e) => setemail(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-xl font-medium mb-1"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="Enter Your Password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="flex items-center justify-between mb-4">
              <span
                onClick={() => setForgotPassword((prev) => !prev)}
                className="text-sm text-green-600 hover:underline cursor-pointer"
              >
                Forgot Password?
              </span>
            </div>
            <TermAndConditions
              checked={termCheckbox}
              onChecked={setTermCheckbox}
            />
            <button
              className={`w-full ${!termCheckbox ? `bg-gray-400` : "hover:bg-green-700"} py-2 bg-green-600 text-white text-lg font-semibold rounded-lg  focus:outline-none`}
              disabled={!termCheckbox}
              onClick={userLogin}
            >
              LOGIN NOW
            </button>

            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600">New to our site?</p>
              <Link href="/SignUp">
                <button className="mt-2 text-green-600 hover:underline">
                  Register Now
                </button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
            <div className="w-full flex justify-center items-center">
              <Image
                src={logo}
                width={1000}
                height={1000}
                className="w-24 object-contain"
              />
            </div>
            <h2 className="text-3xl font-semibold text-center mb-6">
              Reset Password
            </h2>

            <div className="mb-4">
              <label htmlFor="Email" className="block text-xl font-medium mb-1">
                email/Email Address
              </label>
              <input
                type="email"
                id="Email"
                name="username"
                value={username}
                placeholder="email No.(91) or Email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            {otpField ? (
              <div className="mb-4">
                <OTPInput length={4} onOtpChange={handleOtpChange} />
              </div>
            ) : (
              <>
                <div className="mb-4">
                  <label
                    htmlFor="new_password"
                    className="block text-xl font-medium mb-1"
                  >
                    New Password
                  </label>
                  <input
                    type="password"
                    id="new_password"
                    name="new_password"
                    placeholder="Enter Your New Password"
                    value={forgotPasswordPayload.new_password}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                    onChange={handleForgotPassswordInput}
                  />
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="password"
                    className="block text-xl font-medium mb-1"
                  >
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    id="confirm_password"
                    name="confirm_password"
                    value={forgotPasswordPayload.confirm_password}
                    placeholder="Confirm your password"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                    onChange={handleForgotPassswordInput}
                  />
                </div>
              </>
            )}

            <button
              className="w-full py-2 bg-green-600 text-white text-lg font-semibold rounded-lg hover:bg-green-700 focus:outline-none"
              onClick={async () =>
                otpField
                  ? await handleVerifyForgotPassword()
                  : handleForgotPassword()
              }
            >
              {otpField ? "Verify Otp" : "Send Otp"}
            </button>

            <button
              className="w-full py-2 bg-gray-600 text-white text-lg font-semibold mt-4 rounded-lg hover:bg-gray-700 focus:outline-none"
              onClick={handleBack}
            >
              Back
            </button>

            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600">New to our site?</p>
              <Link href="/SignUp">
                <button className="mt-2 text-green-600 hover:underline">
                  Register Now
                </button>
              </Link>
            </div>
          </div>
        )}
      </div> */}
      <div className="flex justify-center items-center min-h-screen py-6 bg-gray-100">
        {!forgotPassword ? (
          <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
            <div className="w-full flex justify-center items-center">
              <Image
                src={logo}
                width={1000}
                height={1000}
                className="w-24 object-contain"
                alt="logo"
              />
            </div>
            <h2 className="text-3xl font-semibold text-center mb-6">Login</h2>

            <div className="mb-4">
              <label htmlFor="email" className="block text-xl font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="Enter email"
                className={`w-full px-4 py-2 border ${
                  errors.email ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600`}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div className="mb-4 relative">
              <label
                htmlFor="password"
                className="block text-xl font-medium mb-1"
              >
                Password
              </label>
              <input
                type={passwordVisiblity ? "text" : "password"}
                id="password"
                placeholder="Enter your password"
                className={`w-full px-4 py-2 border relative ${
                  errors.password ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600`}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div
                className="absolute top-11 right-3 flex items-center cursor-pointer"
                onClick={() => setPasswordVisiblity((prev) => !prev)}
              >
                {passwordVisiblity ? <FaEye /> : <FaEyeSlash />}
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            <div className="flex items-center justify-between mb-4">
              <span
                onClick={() => {
                  setForgotPassword((prev) => !prev);
                  setErrors({});
                }}
                className="text-sm text-green-600 hover:underline cursor-pointer"
              >
                Forgot Password?
              </span>
            </div>
            <TermAndConditions
              checked={termCheckbox}
              onChecked={setTermCheckbox}
            />
            <button
              className={`w-full ${
                !termCheckbox ? `opacity-50` : "hover:bg-green-700"
              } py-2 bg-green-600 text-white text-lg font-semibold rounded-lg focus:outline-none`}
              disabled={!termCheckbox}
              onClick={userLogin}
            >
              LOGIN NOW
            </button>

            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600">New to our site?</p>
              <Link href="/SignUp">
                <button className="mt-2 text-green-600 hover:underline">
                  Register Now
                </button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
            <div className="w-full flex justify-center items-center">
              <Image
                src={logo}
                width={1000}
                height={1000}
                className="w-24 object-contain"
                alt="logo"
              />
            </div>
            <h2 className="text-3xl font-semibold text-center mb-6">
              Reset Password
            </h2>

            {otpField ? (
              <>
                <div className="mb-4 relative">
                  <OTPInput length={4} onOtpChange={handleOtpChange} />
                  {errors.otp && (
                    <p className="text-red-500 text-sm mt-4">{errors.otp}</p>
                  )}
                  {resendTimer > 0 ? (
                    <p className="text-sm text-gray-500">
                      Resend OTP in{" "}
                      <span className="font-bold">{resendTimer}</span> seconds
                    </p>
                  ) : (
                    <button
                      className="text-blue-500 mt-2 hover:text-orange-900 underline text-sm"
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
                <>
                  <div className="mb-4 relative">
                    <label
                      htmlFor="new_password"
                      className="block text-xl font-medium mb-1"
                    >
                      New Password
                    </label>
                    <input
                      type={passwordVisiblity ? "text" : "password"}
                      id="new_password"
                      name="new_password"
                      placeholder="Enter your new password"
                      value={forgotPasswordPayload.new_password}
                      className={`w-full px-4 py-2 border ${
                        errors.new_password
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600`}
                      onChange={handleForgotPassswordInput}
                    />
                    <div
                      className="absolute top-11 right-3 flex items-center cursor-pointer"
                      onClick={() => setPasswordVisiblity((prev) => !prev)}
                    >
                      {passwordVisiblity ? <FaEye /> : <FaEyeSlash />}
                    </div>
                    {errors.new_password && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.new_password}
                      </p>
                    )}
                  </div>

                  <div className="mb-4 relative">
                    <label
                      htmlFor="confirm_password"
                      className="block text-xl font-medium mb-1"
                    >
                      Confirm Password
                    </label>
                    <input
                      type={passwordVisiblity ? "text" : "password"}
                      id="confirm_password"
                      name="confirm_password"
                      placeholder="Confirm your password"
                      value={forgotPasswordPayload.confirm_password}
                      className={`w-full px-4 py-2 border ${
                        errors.confirm_password
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600`}
                      onChange={handleForgotPassswordInput}
                    />
                    <div
                      className="absolute top-11 right-3 flex items-center cursor-pointer"
                      onClick={() => setPasswordVisiblity((prev) => !prev)}
                    >
                      {passwordVisiblity ? <FaEye /> : <FaEyeSlash />}
                    </div>
                    {errors.confirm_password && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.confirm_password}
                      </p>
                    )}
                  </div>
                </>
              </>
            ) : (
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-xl font-medium mb-1"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="username"
                  value={username}
                  placeholder="Email"
                  className={`w-full px-4 py-2 border ${
                    errors.username ? "border-red-500" : "border-gray-300"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600`}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setErrors({});
                  }}
                />
                {errors.username && (
                  <p className="text-red-500 text-sm mt-1">{errors.username}</p>
                )}
              </div>
            )}
            <button
              className="w-full py-2 bg-green-600 text-white text-lg font-semibold rounded-lg hover:bg-green-700 focus:outline-none"
              onClick={async () =>
                otpField
                  ? await handleVerifyForgotPassword()
                  : handleForgotPassword()
              }
            >
              {otpField ? "Verify OTP" : "Send OTP"}
            </button>
            <button
              className="w-full py-2 bg-gray-600 text-white text-lg font-semibold mt-4 rounded-lg hover:bg-gray-700 focus:outline-none"
              onClick={handleBack}
            >
              Back
            </button>

            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600">New to our site?</p>
              <Link href="/SignUp">
                <button className="mt-2 text-green-600 hover:underline">
                  Register Now
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>

      <WebSpeciails />
      <Footer />
    </>
  );
};

export default Page;
