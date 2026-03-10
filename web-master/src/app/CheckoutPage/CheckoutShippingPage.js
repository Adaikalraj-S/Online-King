"use client";
import React, { useEffect, useState, useCallback, useContext } from "react";
import Image from "next/image";
import edit from "../Asset/tabler_edit.svg";
import headphone from "../Asset/HeadphoneBoat.svg";
import rupee from "../Asset/Rupee.svg";
import greenRupee from "../Asset/greenRupee.svg";
import { useMultistepContext } from "./StepperContext";
import axios from "../../../axios";
import { useSnackbar } from "../SnackBarProvider";
import { CartContext } from "../Context/CartContext";

const CheckoutShippingPage = (props) => {
  const { setStep } = useMultistepContext();
  const { openSnackbar } = useSnackbar();
  const [cartData, setCartData] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalWeight, setTotalWeight] = useState(0);
  // const [cartCounter, setCartCounter] = useContext(CartContext)
  const [openCoupon, setOpenCoupon] = useState(false);
  const [couponData, setCouponData] = useState([]);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponAmount, setCouponAmount] = useState(0);
  const [getAllShippingCharge, setGetAllShippingCharge] = useState([]);
  const [shippingOption, setShippingOption] = useState(2);
  const [idMatch, setIdMatch] = useState([]);
  const [addressType, setAddressType] = useState("home");
  const [addressData1, setAddressData1] = useState({
    home: {},
    office: {},
  });

  const handleSubmit = () => {
    setStep(3);
  };

  useEffect(() => {
    let unmounted = false;
    if (!unmounted) {
      fetchAddressData();
      fetchCartData();
    }

    return () => {
      unmounted = true;
    };
  }, []);

  //---------------------FetchCartData---------------------------------------------------
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
          router.push("/login");
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

  useEffect(() => {
    const fetchShippingCharge = async () => {
      try {
        if (shiprocketToken && addressDetails.zipcode) {
          const response = await axios.post(`/api/get-shipping-price`, {
            pickup_pincode: process.env.NEXT_PUBLIC_SHIPROCKET_PICKUP_PINCODE,
            delivery_pincode: addressDetails.zipcode,
            COD: false,
            weight: "2",
            token: shiprocketToken,
          });

          if (response.data.code === 200) {
            setGetAllShippingCharge(response.data.data);
          } else if (response.data.message === "Session expired") {
            openSnackbar(response.data.message, "error");
            router.push("/login");
          }
        }
      } catch (error) {
        console.error(error);
        if (error.response && error.response.data.statusCode === 400) {
          openSnackbar(error.response.data.message, "error");
        }
      }
    };

    fetchShippingCharge();
  }, []);

  const [shippingCharge, setShippingCharge] = useState(0);
  const [shippingData, setShippingData] = useState({});

  useEffect(() => {
    const lowestShippingCharge = getAllShippingCharge.reduce(
      (minCharge, shippingOption) => {
        return shippingOption.charge < minCharge
          ? shippingOption.charge
          : minCharge;
      },
      Infinity
    );

    const lowestShippingData = getAllShippingCharge.reduce(
      (minCharge, shippingOption) => {
        return shippingOption.charge < minCharge
          ? shippingOption.charge
          : minCharge;
      },
      getAllShippingCharge[0]
    );

    setShippingData(lowestShippingData);

    if (totalPrice > 1000) {
      setShippingCharge(0);
    } else if (shippingOption === 1) {
      setShippingCharge(0);
    } else {
      setShippingCharge(lowestShippingCharge);
    }
  }, [
    getAllShippingCharge,
    totalPrice,
    calculateGST,
    cartData,
    shippingOption,
  ]);

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

  //-----------------------------AddressDataFetch-----------------------------------------
  //-----------------------------AddressDataFetch-----------------------------------------
const [addressData, setAddressData] = useState([]);
const [selected, setSelected] = useState(null);
const [addressDetails, setAddressDetails] = useState({});
const [getAddressData, setGetAddressData] = useState({
  fullname: "",
  add_type: "",
  phone: "",
  add1: "",
  add2: "",
  city: "",
  state: "",
  zipcode: "",
  landmark: "",
  area: "",
  country: "",
});

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
      router.push("/Login");
    }
  } catch (error) {
    console.error(error);
    if (error.response && error.response.data.statusCode === 400) {
      openSnackbar(error.response.data.message, "error");
    }
  }
};

const getData = (e) => {
  const { value, name } = e.target;
  setGetAddressData((prevData) => ({
    ...prevData,
    [name]: value,
  }));
};

const reset = () => {
  setGetAddressData({
    fullname: "",
    add_type: "",
    add1: "",
    phone: "",
    city: "",
    state: "",
    zipcode: "",
    landmark: "",
    area: "",
    country: "",
  });

  document.getElementById("fullname").value = "";
  document.getElementById("add1").value = "";
  document.getElementById("city").value = "";
  document.getElementById("state").value = "";
  document.getElementById("country").value = "";
  document.getElementById("zipcode").value = "";
  document.getElementById("landmark").value = "";
  document.getElementById("area").value = "";
  document.getElementById("phone").value = "";
};

const handleAddressSubmit = () => {
  return new Promise((resolve, reject) => {
    axios
      .post(
        "/api/add-addresses",
        {
          fullname: getAddressData.fullname,
          add1: getAddressData.add1,
          city: getAddressData.city,
          state: getAddressData.state,
          country: getAddressData.country,
          pincode: getAddressData.zipcode,
          landmark: getAddressData.landmark,
          area: getAddressData.area,
          mobile: getAddressData.phone,
          add_type: getAddressData.add_type,
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
          resolve(true);
        } else if (res.data.message === "Session expired") {
          localStorage.removeItem("onlineKinguserid");
          router.push("/Login");
          resolve(false);
        }
      })
      .catch((err) => {
        console.log(err);
        if (err.response && err.response.data.statusCode === 400) {
          openSnackbar(err.response.data.message, "error");
        }
        resolve(false);
      });
  });
};

const handleAddressEdit = (addressId) => {
  return new Promise((resolve, reject) => {
    axios
      .post(
        `/api/edit-addresses`,
        {
          address_id: addressId,
          fullname: getAddressData.fullname,
          add1: getAddressData.add1,
          city: getAddressData.city,
          state: getAddressData.state,
          country: getAddressData.country,
          pincode: getAddressData.zipcode,
          landmark: getAddressData.landmark,
          area: getAddressData.area,
          mobile: getAddressData.phone,
          add_type: getAddressData.add_type,
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
          resolve(true);
        } else if (res.data.message === "Session expired") {
          localStorage.removeItem("onlineKinguserid");
          router.push("/Login");
          resolve(false);
        }
      })
      .catch((err) => {
        console.log(err);
        if (err.response && err.response.data.statusCode === 400) {
          openSnackbar(err.response.data.message, "error");
        }
        resolve(false);
      });
  });
};

  const handleClick = async () => {
    // Check if address submission is successful
    const isAddressSubmitted = await handleAddressSubmit();

    // If address is submitted successfully, proceed to the next step
    if (isAddressSubmitted) {
      handleSubmit();
    }
  };

  useEffect(() => {
    if (props.decodedParam) {
      console.log(typeof props.decodedParam, "TYPE");
      const filteredItems = cartData.filter(
        (value) => value.id === parseInt(props.decodedParam)
      );
      console.log(filteredItems, "FILTER");

      console.log(cartData, "CAR");
      console.log(props.decodedParam, "DECOD");
      // console.log(filteredItems,"FIL")
      setIdMatch(filteredItems);
    }
  }, [cartData, props.decodedParam]);

  const handleAddressTypeChange = (type) => {
    setAddressType(type);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAddressData({
      ...addressData,
      [addressType]: {
        ...addressData[addressType],
        [name]: value,
      },
    });
  };

  //-----------------------------BillingAddressToggle---------------------
  const [isCheckedBilling, setIsCheckedBilling] = useState(true);
  const handleCheckboxChange = () => {
    setIsCheckedBilling(!isCheckedBilling);
  };

  return (
    <div className="  px-32  mx-auto  font-fontNew">
      <div className="flex flex-col lg:flex-row lg:px-2 gap-8 pb-96">
        <div className="border border-gray-300 rounded-2xl shadow-xl w-full lg:w-1/2 p-4 lg:p-12">
          <div className="flex-col flex gap-2">
            <h2 className="text-2xl">Fast Checkout</h2>
            <div className="flex gap-12 py-4">
              <div className="flex gap-12 py-4">
                <div className="flex items-center gap-2">
                  <label htmlFor="home">Home</label>
                  <input
                    type="radio"
                    id="Address-type-home"
                    name="add_type"
                    onChange={getData}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label htmlFor="office">Office</label>
                  <input
                    type="radio"
                    id="Address-type-office"
                    name="add_type"
                    onChange={getData}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label htmlFor="others">Others</label>
                  <input
                    type="radio"
                    id="Address-type-other"
                    name="add_type"
                    onChange={getData}
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-col lg:flex-row gap-4">
              {["Kormangala", "Kormangala"].map((location, idx) => (
                <div
                  key={idx}
                  className="border border-gray-300 rounded-xl shadow-lg p-4 w-full"
                >
                  <div className="flex justify-between items-center pb-3">
                    <h1 className="font-bold text-2xl">{location}</h1>
                    <Image src={edit} alt="Edit" />
                  </div>
                  <p className="text-lg">
                    Opp JR Mansion, 3rd floor 8th block, Bangalore
                  </p>
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-5 mt-6">
              <h1 className="text-3xl">Shipping Details</h1>
              <div className=" flex flex-col ">
                <div className=" flex gap-11">
                  <div>
                    <label htmlFor="">Full Name</label>
                    <div className="border border-gray-400 rounded-lg px-3 h-14 mt-2 ">
                      <input
                        type="text"
                        id="fullname"
                        name="fullname"
                        className="h-full w-1/2 outline-none"
                        placeholder="Enter Name"
                        onChange={getData}
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="">Phone Number</label>
                    <div className="border border-gray-400 rounded-lg px-3 h-14 mt-2 ">
                      <input
                        type="text"
                        id="phone"
                        name="phone"
                        className="h-full w-1/2 outline-none"
                        placeholder="Mobile Number"
                        onChange={getData}
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label htmlFor="">
                    Flat, House No, Building Company, Apartment
                  </label>
                  <div className="border border-gray-400 rounded-lg px-3 h-14 mt-2 ">
                    <input
                      type="text"
                      className="h-full w-full outline-none"
                      id="add1"
                      name="add1"
                      onChange={getData}
                    />
                  </div>
                </div>
                <div className=" flex gap-9">
                  <div className=" flex-col">
                    <label htmlFor="">Area, Street, sector</label>
                    <div className="border border-gray-400 rounded-lg px-3 h-14 mt-2 ">
                      <input
                        type="text"
                        className="h-full w-full outline-none"
                        id="area"
                        name="area"
                        onChange={getData}
                      />
                    </div>
                  </div>
                  <div className=" flex-col">
                    <label htmlFor="">Landmark</label>
                    <div className="border border-gray-400 rounded-lg px-3 h-14 mt-2 ">
                      <input
                        type="text"
                        className="h-full w-full outline-none"
                        id="landmark"
                        name="landmark"
                        onChange={getData}
                      />
                    </div>
                  </div>
                </div>
                <div className=" flex gap-9">
                  <div className=" flex-col">
                    <label htmlFor="">State</label>
                    <div className="border border-gray-400 rounded-lg px-3 h-14 mt-2 ">
                      <input
                        type="text"
                        className=" h-full w-full outline-none"
                        onChange={getData}
                        id="state"
                        name="state"
                      />
                    </div>
                  </div>
                  <div className=" flex-col">
                    <label htmlFor="">Town/City</label>
                    <div className="border border-gray-400 rounded-lg px-3 h-14 mt-2 ">
                      <input
                        type="text"
                        className=" h-full w-full outline-none"
                        onChange={getData}
                        id="city"
                        name="city"
                      />
                    </div>
                  </div>
                </div>
                <div className=" flex gap-11">
                  <div className=" flex-col">
                    <label htmlFor="">Pincode</label>
                    <div className="border border-gray-400 rounded-lg px-3 h-14 mt-2 ">
                      <input
                        type="text"
                        className=" h-full  w-1/2 outline-none"
                        placeholder="560068"
                        onChange={getData}
                        id="zipcode"
                        name="zipcode"
                      />
                    </div>
                  </div>
                  <div className=" flex-col">
                    <label htmlFor="">Country</label>
                    <div className="border border-gray-400 rounded-lg px-3 h-14 mt-2 ">
                      <input
                        type="text"
                        className=" h-full  w-1/2 outline-none"
                        onChange={getData}
                        id="country"
                        name="country"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 mt-4">
                <input
                  type="checkbox"
                  id="defaultAddress"
                  unchecked={isCheckedBilling}
                  onChange={handleCheckboxChange}
                />
                <label htmlFor="defaultAddress">
                  Is Billing and Shipping Address same?
                </label>
              </div>
              {isCheckedBilling && (
                <div>
                  <h1 className=" text-3xl">Billing Address</h1>
                  <div>
                    <label htmlFor="">Email Address</label>
                    <div className="border border-gray-400 rounded-lg px-3 h-14 mt-2 ">
                      <input
                        type="text"
                        id="fullname"
                        name="fullname"
                        className="h-full w-1/2 outline-none"
                        placeholder="Enter Name"
                        onChange={getData}
                      />
                    </div>
                  </div>
                  <div className=" flex gap-10">
                    <div>
                      <label htmlFor="">Full Name</label>
                      <div className="border border-gray-400 rounded-lg px-3 h-14 mt-2 ">
                        <input
                          type="text"
                          id="fullname"
                          name="fullname"
                          className="h-full w-1/2 outline-none"
                          placeholder="Enter Name"
                          onChange={getData}
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor=""> Phone Number</label>
                      <div className="border border-gray-400 rounded-lg px-3 h-14 mt-2 ">
                        <input
                          type="text"
                          id="fullname"
                          name="fullname"
                          className="h-full w-1/2 outline-none"
                          placeholder="Enter Name"
                          onChange={getData}
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="">Address line 1</label>
                    <div className="border border-gray-400 rounded-lg px-3 h-14 mt-2 ">
                      <input
                        type="text"
                        className="h-full w-full outline-none"
                        id="area"
                        name="area"
                        onChange={getData}
                      />
                    </div>
                  </div>
                  <div className=" flex gap-6">
                    <div>
                      <label htmlFor="">Area,Street,Sector </label>
                      <div className="border border-gray-400 rounded-lg px-3 h-14 mt-2 ">
                        <input
                          type="text"
                          className="h-full w-full outline-none"
                          id="area"
                          name="area"
                          onChange={getData}
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="">LandMark</label>
                      <div className="border border-gray-400 rounded-lg px-3 h-14 mt-2 ">
                        <input
                          type="text"
                          className="h-full w-full outline-none"
                          id="area"
                          name="area"
                          onChange={getData}
                        />
                      </div>
                    </div>
                  </div>
                  <div className=" flex gap-6">
                    <div>
                      <label htmlFor="">Pincode </label>
                      <div className="border border-gray-400 rounded-lg px-3 h-14 mt-2 ">
                        <input
                          type="text"
                          className="h-full w-full outline-none"
                          id="area"
                          name="area"
                          onChange={getData}
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="">Town/City</label>
                      <div className="border border-gray-400 rounded-lg px-3 h-14 mt-2 ">
                        <input
                          type="text"
                          className="h-full w-full outline-none"
                          id="area"
                          name="area"
                          onChange={getData}
                        />
                      </div>
                    </div>
                  </div>
                  <div className=" flex gap-6">
                    <div>
                      <label htmlFor="">State </label>
                      <div className="border border-gray-400 rounded-lg px-3 h-14 mt-2 ">
                        <input
                          type="text"
                          className="h-full w-full outline-none"
                          id="area"
                          name="area"
                          onChange={getData}
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="">Country</label>
                      <div className="border border-gray-400 rounded-lg px-3 h-14 mt-2 ">
                        <input
                          type="text"
                          className="h-full w-full outline-none"
                          id="area"
                          name="area"
                          onChange={getData}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="border border-gray-300 rounded-2xl shadow-xl w-full lg:w-2/5 p-4 lg:p-10">
          <div className="flex-col flex gap-5">
            <h1 className="text-3xl font-semibold">Your Order</h1>
            <hr />
            <div className="border border-gray-300 rounded-2xl shadow-xl p-4 lg:p-6 flex flex-col gap-4">
              {cartData.map((value, index) => {
                return (
                  <div key={`${index}`} className="flex gap-4 lg:gap-5">
                    <div className="border border-gray-300 rounded-2xl shadow-xl p-3 w-24 h-24 lg:w-32 lg:h-32">
                      <Image src={headphone} alt="Headphone" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <h1 className="font-bold">
                        {value?.product?.product_name}
                      </h1>
                      <div className="flex gap-2 lg:gap-2">
                        <p>Colour:</p>
                        <p>Black</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Image src={rupee} alt="Rupee" />
                        <p className="text-2xl">
                          {value?.product?.default_price}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex gap-3 mt-4">
              <div className="border border-gray-300 rounded-lg p-2 w-full lg:w-2/3">
                <input
                  type="text"
                  placeholder="Discount Code"
                  className="w-full outline-none"
                />
              </div>
              <button className="border border-gray-300 rounded-lg p-2 w-full lg:w-1/3">
                Apply
              </button>
            </div>
            <div className="border border-gray-300 rounded-2xl shadow-xl p-4 lg:p-6 flex flex-col gap-2 mt-4">
              <h2 className="text-lg font-semibold">Price Details (1 item)</h2>
              <hr />
              <div className="flex justify-between">
                <h1>Total Price</h1>
                <div className="flex items-center gap-2">
                  <Image src={rupee} alt="Rupee" />
                  {/* <p>{value?.product?.default_price}</p> */}
                </div>
              </div>
              <div className="flex justify-between">
                <h1>Discount on MRP</h1>
                <div className="flex items-center gap-2 text-green-600">
                  <p>-</p>
                  <Image src={greenRupee} alt="Rupee" />
                  <p>1000</p>
                </div>
              </div>
              <div className="flex justify-between">
                <h1>Coupon Discount</h1>
                <p className="text-red-600">Apply Coupon</p>
              </div>
              <div className="flex justify-between">
                <h1>Shipping Fee</h1>
                <p className="text-green-600">{getAllShippingCharge}</p>
              </div>
              <hr />
              <div className="flex justify-between">
                <h1>Total Cost</h1>
                <div className="flex items-center gap-2">
                  <Image src={rupee} alt="Rupee" />
                  <p>{totalPrice}</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3 mt-6">
              <button
                className="bg-green-500 hover:bg-green-600 text-white rounded-lg py-4 w-full text-3xl"
                // onClick={handleClick}>Make Payment
                onClick={handleSubmit}
              >
                Make Payment
              </button>
              <button
                className="  bg-green-900 hover:bg-green-600 text-white rounded-lg py-4 w-full text-3xl"
                onClick={() => {
                  setStep(1);
                }}
              >
                Back
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutShippingPage;
