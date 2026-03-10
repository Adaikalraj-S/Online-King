"use client";
import React, { useState, useContext, useCallback, useEffect } from "react";
import Image from "next/image";
import edit from "../Asset/tabler_edit.svg";
import headphone from "../Asset/HeadphoneBoat.svg";
import rupee from "../Asset/Rupee.svg";
import greenRupee from "../Asset/greenRupee.svg";
import { useMultistepContext } from "./StepperContext";
import axios from "../../../axios";
import { CartContext } from "../Context/CartContext";
import { useSnackbar } from "../SnackBarProvider";

const CheckoutPersonalPage = (props) => {
  const { setStep, userData, setUserData } = useMultistepContext();
  const [errors, setErrors] = useState({});
  const [cartData, setCartData] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalWeight, setTotalWeight] = useState(0);
  // const [cartCounter, setCartCounter] = useContext(CartContext)
  const [getAllShippingCharge, setGetAllShippingCharge] = useState([]);
  const { openSnackbar } = useSnackbar();
  const [shippingOption, setShippingOption] = useState(2);
  const [idMatch, setIdMatch] = useState([]);
  const [selectedOption, setSelectedOption] = useState("home");

  const fetchCartData = useCallback(() => {
    axios
      .get(`/api/get-carts`, {
        headers: {
          Authorization: localStorage.getItem("onlineKingWebToken"),
        },
      })
      .then((res) => {
        if (res.data.code == 200) {
          if (res.data.cartItems.length === 0) {
            router.push("/");
          } else {
            setCartData(res.data.cartItems);
            setTotalPrice(res.data.totalPrice);

            // const weight = res.data.cartItems.reduce((acc, cart) => {
            //     const productWeight = Number(cart.product.weight) * Number(cart.quantity);
            //     return acc + productWeight;
            // }, 0);
            // setTotalWeight(weight);
          }
        } else if (res.data.message === "Session expired") {
          openSnackbar(res.data.message, "error");
          router.push("/Login");
        }
      })
      .catch((err) => {
        console.log(err);
        if (err.response && err.response.data.statusCode === 400) {
          openSnackbar(err.response.data.message, "error");
        }
      });
  }, []);

  useEffect(() => {
    let unmounted = false;
    if (!unmounted) {
      fetchCartData();
      // fetchDeliveryTypeData()
      fetchCouponData();
      // fetchUserRoleData()
      fetchAddressData();
    }

    return () => {
      unmounted = true;
    };
  }, []);

  const calculateGST = (carts) => {
    let totalPrice = 0;
    let totalGST = 0;

    for (const cart of carts) {
      const price = Number(cart.product.default_price) * Number(cart.quantity);
      const gst = (price * Number(cart.product.tax_rate)) / 100;

      totalPrice += price;
      totalGST += gst;
    }

    const percentage = (totalGST / totalPrice) * 100;
    return parseFloat(percentage).toFixed(2);
  };
  //---------------------CouponData----------------------------------------------------
  const [openCoupon, setOpenCoupon] = useState(false);
  const [couponData, setCouponData] = useState([]);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponAmount, setCouponAmount] = useState(0);

  const handleClickOpenCoupon = () => {
    fetchCouponData();
    setOpenCoupon(true);
  };
  const handleCloseCoupon = () => {
    setOpenCoupon(false);
  };

  const fetchCouponData = useCallback(() => {
    axios
      .get(`/api/get-coupons`, {
        headers: {
          Authorization: localStorage.getItem("onlineKingWebToken"),
        },
      })
      .then((res) => {
        if (res.data.code == 200) {
          setCouponData(res.data.coupons);
        } else if (res.data.message === "Session expired") {
          openSnackbar(res.data.message, "error");
          router.push("Login");
        }
      })
      .catch((err) => {
        console.log(err);
        if (err.response && err.response.data.statusCode === 400) {
          openSnackbar(err.response.data.message, "error");
        }
      });
  }, []);

  const handleApplyCoupon = (coupon) => {
    if (totalPrice >= coupon.min_order_amount) {
      let discountAmount = 0;
      setAppliedCoupon(coupon);
      if (coupon.discount_type === "Percent") {
        discountAmount = (coupon.discount / 100) * totalPrice;
        discountAmount = Math.min(discountAmount, coupon.max_discount);
      } else if (coupon.discount_type === "Amount") {
        discountAmount = coupon.discount;
        discountAmount = Math.min(discountAmount, coupon.max_discount);
      }
      const newCumulativeDiscountAmount = discountAmount.toFixed(2);

      openSnackbar(`Coupon applied successfully`, "success");
      handleCloseCoupon();
      setCouponAmount(newCumulativeDiscountAmount);
    } else {
      openSnackbar(
        `Minimum order amount is ${coupon.min_order_amount}`,
        "error"
      );
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponAmount(0);
  };
  // useEffect(() => {
  //     const fetchShippingCharge = async () => {
  //         try {
  //             if (shiprocketToken && addressDetails.zipcode) {
  //                 const response = await axios.post(`/api/get-shipping-price`, {
  //                     pickup_pincode: process.env.NEXT_PUBLIC_SHIPROCKET_PICKUP_PINCODE,
  //                     delivery_pincode: addressDetails.zipcode,
  //                     COD: false,
  //                     weight: '2',
  //                     token: shiprocketToken
  //                 });

  //                 if (response.data.code === 200) {
  //                     setGetAllShippingCharge(response.data.data);
  //                 } else if (response.data.message === 'Session expired') {
  //                     openSnackbar(response.data.message, 'error');
  //                     router.push('/Login');
  //                 }
  //             }
  //         } catch (error) {
  //             console.error(error);
  //             if (error.response && error.response.data.statusCode === 400) {
  //                 openSnackbar(error.response.data.message, 'error');
  //             }
  //         }
  //     };

  //     fetchShippingCharge()
  // }, []);

  // const [shippingCharge, setShippingCharge] = useState(0);
  // const [shippingData, setShippingData] = useState({})

  // useEffect(() => {
  //     const lowestShippingCharge = getAllShippingCharge.reduce((minCharge, shippingOption) => {
  //         return shippingOption.charge < minCharge ? shippingOption.charge : minCharge;
  //     }, Infinity);

  //     const lowestShippingData = getAllShippingCharge.reduce((minCharge, shippingOption) => {
  //         return shippingOption.charge < minCharge ? shippingOption.charge : minCharge;
  //     }, getAllShippingCharge[0]);

  //     setShippingData(lowestShippingData)

  //     if (totalPrice > 1000) {
  //         setShippingCharge(0);
  //     } else if (shippingOption === 1) {
  //         setShippingCharge(0);
  //     } else {
  //         setShippingCharge(lowestShippingCharge);
  //     }
  // }, [getAllShippingCharge, totalPrice, calculateGST, cartData, shippingOption]);

  const handleRemoveProduct = (data) => {
    axios
      .post(
        "/api/remove-from-cart",
        {
          product_id: data.id,
        },
        {
          headers: {
            Authorization: localStorage.getItem("onlineKingWebToken"),
          },
        }
      )
      .then((res) => {
        if (res.data.status === "success") {
          openSnackbar(res.data.message, "success");
          setCartCounter((prev) => prev - 1);
          fetchCartData();
        } else {
          openSnackbar(res.data.message, "error");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, firstName: e.target.value });
  };
  const handleInputChange1 = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, lastName: e.target.value });
  };
  const handleInputChange2 = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, email: e.target.value });
  };
  const handleInputChange3 = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, phone: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStep(2);
  };

  //-----------------------------------------------------PersonalDetailsFetch--------------------------------------------
  const [addressData, setAddressData] = useState([]);
  const [selected, setSelected] = useState(null);

  const [addressDetails, setAddressDetails] = useState({});
  useEffect(() => {
    setAddressDetails(addressData.find((item) => item.id === selected));
  }, [addressData, selected]);

  const handleAddressChange = (address) => {
    setSelected(address);
  };

  const fetchAddressData = async () => {
    try {
      const response = await axios.get(`/api/get-all-addresses`, {
        headers: {
          Authorization: localStorage.getItem("onlineKingWebToken"),
        },
      });

      if (response.data.code === 200) {
        setAddressData(response.data.addresses);
        if (response.data.addresses.length > 0) {
          setSelected(response.data.addresses[0].id);
        }
      } else if (response.data.message === "Session expired") {
        openSnackbar(response.data.message, "error");
        localStorage.removeItem("onlineKinguserid");
        router.push("/login");
      }
    } catch (error) {
      console.error(error);
      if (error.response && error.response.data.statusCode === 400) {
        openSnackbar(error.response.data.message, "error");
      }
    }
  };

  const [getAddressData, setGetAddressData] = useState({
    firstname: "",
    lastname: "",
    phone: "",
    email: "",
  });
  const getData = (e) => {
    const { value, name } = e.target;

    setGetAddressData((pevData) => ({
      ...pevData,
      [name]: value,
    }));
  };

  const reset = () => {
    setGetAddressData({
      firstname: "",
      lastname: "",
      phone: "",
      email: "",
    });

    document.getElementById("firstname").value = "";
    document.getElementById("lastname").value = "";
    document.getElementById("phone").value = "";
    document.getElementById("email").value = "";
  };

  const handleAddressSubmit = () => {
    axios
      .post(
        "/api/add-addresses",
        {
          firsftname: getAddressData.firstname,
          lastname: getAddressData.lastname,
          mobile: getAddressData.phone,
          email: getAddressData.email,
        },
        {
          headers: {
            Authorization: localStorage.getItem("onlineKingWebToken"),
          },
        }
      )
      .then((res) => {
        if (res.data.code === 200) {
          openSnackbar(res.data.message, "success");
          fetchAddressData();
          reset();
        } else if (res.data.message === "Session expired") {
          localStorage.removeItem("onlineKinguserid");
          router.push("/login");
        }
      })
      .catch((err) => {
        console.log(err);
        if (err.response && err.response.data.statusCode === 400) {
          openSnackbar(err.response.data.message, "error");
        }
      });
  };

  //   useEffect(() => {
  //     if(props.decodedParam){
  //       console.log(typeof props.decodedParam,"TYPE");
  //       const filteredItems = cartData.filter((value) => (value.id  === parseInt(props.decodedParam)));
  //     console.log(filteredItems,"FILTER")

  //     console.log(cartData,"CAR")
  // console.log(props.decodedParam,"DECOD")
  //     // console.log(filteredItems,"FIL")
  //     setIdMatch(filteredItems);
  //     }
  //   }, [cartData, props.decodedParam]);

  console.log(cartData, "CDA");

  return (
    <div>
      <div className="flex flex-col lg:flex-row px-4 sm:px-8 lg:px-32 gap-10 pb-20 lg:pb-32 font-fontNew">
        <div className="w-full lg:w-3/5 border border-gray-300 rounded-2xl shadow-xl p-6 lg:p-10">
          <form onSubmit={""}>
            <div className="flex-col gap-2">
              <h2 className="text-xl lg:text-2xl font-semibold">
                Fast Checkout
              </h2>
              <div className="border border-gray-300 rounded-xl shadow-lg p-4  w-80 lg:p-6 my-4">
                <div className="flex justify-between items-center mb-4">
                  <h1 className="font-bold text-lg lg:text-2xl">Pankaj Roy</h1>
                  <Image src={edit} alt="Edit" />
                </div>
                <div className="flex flex-col gap-2">
                  <p className="text-base lg:text-lg">abc@gmail.com</p>
                  <p className="text-base lg:text-lg">9436675822</p>
                </div>
              </div>
              <h1 className="py-6 lg:py-9 text-xl lg:text-3xl font-semibold">
                Personal Details
              </h1>
              <div className="flex flex-col lg:flex-row gap-4 lg:gap-7">
                <div className="flex flex-col w-full lg:w-1/2 px">
                  <label
                    htmlFor="FirstName"
                    className="text-sm lg:text-base px"
                  >
                    First Name
                  </label>
                  <div className="border border-gray-400 rounded-lg px-4">
                    <input
                      type="text"
                      id="FirstName"
                      name="firstName"
                      className=" w-auto h-12 px-4 lg:px-6 outline-none"
                      value={userData["firstName"]}
                      onChange={getData}
                      required
                    />
                  </div>
                  {errors.firstName && (
                    <p className="text-red-500 text-sm">{errors.firstName}</p>
                  )}
                </div>
                <div className="flex flex-col w-full lg:w-1/2">
                  <label htmlFor="LastName" className="text-sm lg:text-base">
                    Last Name
                  </label>
                  <div className="border border-gray-400 rounded-lg px-4">
                    <input
                      type="text"
                      id="LastName"
                      name="lastName"
                      className=" w-auto h-12 px-4 lg:px-6 outline-none"
                      // value={formValues.lastName}
                      value={userData["lastName"]}
                      onChange={getData}
                      required
                    />
                  </div>
                  {errors.lastName && (
                    <p className="text-red-500 text-sm">{errors.lastName}</p>
                  )}
                </div>
              </div>
              <div className="flex flex-col mt-4">
                <label htmlFor="email" className="text-sm lg:text-base">
                  Email Address
                </label>
                <div className="border border-gray-300 rounded-xl shadow-lg px-5">
                  <input
                    type="text"
                    name="email"
                    id="email"
                    className=" w-auto h-12 lg:h-14 px-4 lg:px-6 outline-none"
                    // value={formValues.email}
                    value={userData["email"]}
                    onChange={getData}
                    required
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email}</p>
                )}
              </div>
              <div className="flex flex-col mt-4">
                <label htmlFor="phone" className="text-sm lg:text-base">
                  Phone Number
                </label>
                <div className="border border-gray-300 rounded-xl shadow-lg px-5 w-[22rem]">
                  <input
                    type="text"
                    name="phone"
                    id="phone"
                    className="w-auto h-12 lg:h-14 px-4 lg:px-6 outline-none"
                    // value={formValues.phone}
                    value={userData["phone"]}
                    onChange={getData}
                    required
                  />
                </div>
                {errors.phone && (
                  <p className="text-red-500 text-sm">{errors.phone}</p>
                )}
              </div>
              <div className="mt-6">
                <button
                  type="submit"
                  className="bg-[#45B348] hover:bg-green-400 active:bg-green-400 focus:outline-none focus:ring focus:ring-violet-300 w-full lg:w-96 h-14 lg:h-20 text-white rounded-lg"
                  onClick={handleSubmit}
                >
                  <h1
                    className="text-center text-lg lg:text-3xl"
                    onClick={handleAddressSubmit}
                  >
                    Continue
                  </h1>
                </button>
              </div>
            </div>
          </form>
        </div>
        <div className="w-full lg:w-2/5 border border-gray-300 rounded-2xl shadow-xl p-6 lg:p-10">
          {/* idMatch?.map((value)=>( */}
          <div className="flex flex-col gap-5">
            <h1 className="text-xl lg:text-3xl font-semibold">Your Order</h1>
            <hr />
            <div className="border border-gray-300 rounded-2xl shadow-xl p-4 lg:p-6 flex flex-col justify-between gap-4">
              {cartData.map((value, index) => {
                return (
                  <div key={`${index}`} className=" flex flex-col">
                    <div className="flex gap-4">
                      <div className="border border-gray-300 rounded-2xl shadow-xl p-2 lg:p-4">
                        <Image
                          src={headphone}
                          alt="Headphone"
                          className="w-24 h-24 lg:w-32 lg:h-32"
                        />
                      </div>
                      <div>
                        {console.log(value.product.product_name)}
                        <h1 className="font-bold text-base lg:text-lg">
                          {value?.product?.product_name}
                        </h1>
                        <div className="flex gap-4 py-2">
                          <p className="text-sm lg:text-base">Colour:</p>
                          <p className="text-sm lg:text-base">Black</p>
                        </div>
                        <div className="flex gap-2 lg:gap-5 py-4">
                          <Image src={rupee} alt="Rupee" />
                          <p className="text-base lg:text-2xl">
                            {value?.product?.default_price}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div>
              <div className="flex gap-3 py-3">
                {cartData.map((value) => {
                  return;
                })}
                <div className="border border-gray-300 rounded-lg px-3 py-2 w-2/3 lg:w-3/4">
                  <input
                    type="text"
                    placeholder="Discount Code"
                    className="outline-none w-full h-full"
                  />
                </div>
                <div className="border border-gray-300 rounded-lg px-3 py-2 w-1/3 lg:w-1/4 hover:bg-green-600">
                  <h2 className="text-center ">Apply</h2>
                </div>
              </div>
              <div className="border border-gray-300 rounded-2xl shadow-xl p-4 lg:p-6 flex flex-col gap-2">
                <h2 className="text-lg lg:text-xl font-semibold">
                  Price Details (1 item)
                </h2>
                <hr />
                <div>
                  <div className="flex justify-between">
                    <h1 className="text-sm lg:text-base">Total Price</h1>
                    <div className="flex gap-2">
                      <Image
                        src={rupee}
                        alt="Rupee"
                        className="w-4 h-4 lg:w-5 lg:h-5"
                      />
                      <p className="text-sm lg:text-base">{totalPrice}</p>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <h1 className="text-sm lg:text-base">Discount on MRP</h1>
                    <div className="flex gap-2">
                      <p className="text-green-600">-</p>
                      <Image
                        src={greenRupee}
                        alt="Green Rupee"
                        className="w-4 h-4 lg:w-5 lg:h-5"
                      />
                      <p className="text-green-600 text-sm lg:text-base">{}</p>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    {couponData &&
                      couponData.map((value) => {
                        {
                          console.log(couponData, "COU");
                        }
                        return (
                          <div key={value.id}>
                            {" "}
                            {/* Assuming there's an 'id' property in each 'couponData' item */}
                            <h1 className="text-sm lg:text-base">
                              Coupon Discount
                            </h1>
                            <h1
                              className="text-red-600 text-sm lg:text-base cursor-pointer"
                              onClick={() => handleApplyCoupon(value)}
                            >
                              Apply Coupon{" "}
                            </h1>
                          </div>
                        );
                      })}
                  </div>
                  <div className="flex justify-between">
                    <h1 className="text-sm lg:text-base">Shipping Fee</h1>
                    <h1 className="text-green-600 text-sm lg:text-base">
                      {""}
                    </h1>
                  </div>
                  <hr />
                  <div className="flex justify-between">
                    <h1 className="text-sm lg:text-base">Total Cost</h1>
                    <div className="flex gap-2">
                      <Image
                        src={rupee}
                        alt="Rupee"
                        className="w-4 h-4 lg:w-5 lg:h-5"
                      />
                      <p className="text-sm lg:text-base">{totalPrice}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPersonalPage;
