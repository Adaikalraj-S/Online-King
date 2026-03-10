"use client";
import React, { useState, useEffect, useCallback, useContext } from "react";
import Image from "next/image";
import headphone from "../Asset/HeadphoneBoat.svg";
import rupee from "../Asset/Rupee.svg";
import greenRupee from "../Asset/greenRupee.svg";
import Link from "next/link";
import axios from "../../../axios";
import { useSnackbar } from "../SnackBarProvider";
import { CartContext } from "../Context/CartContext";
import logo from "../Asset/OnlineKingLogo.svg";

const PaymentPage = (props) => {
  //------------------------------------FetchCart Data-----------------------------------------------------------------------
  const [cartData, setCartData] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalWeight, setTotalWeight] = useState(0);
  const { openSnackbar } = useSnackbar();
  // const [cartCounter, setCartCounter] = useContext(CartContext)
  const [openCoupon, setOpenCoupon] = useState(false);
  const [couponData, setCouponData] = useState([]);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponAmount, setCouponAmount] = useState(0);
  const [getAllShippingCharge, setGetAllShippingCharge] = useState([]);
  const [shippingOption, setShippingOption] = useState(2);
  const [idMatch, setIdMatch] = useState([]);

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
    }

    return () => {
      unmounted = true;
    };
  }, [fetchCartData]);

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
  console.log(couponData, "CD");

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

  //-------------------------PlaceOrder------------------------------------------------------
  const [totalPriceWithoutGst, setTotalPriceWithoutGst] = useState(0);

  // useEffect(() => {
  //   const script = document.createElement('script');
  //   script.src = 'https://checkout.razorpay.com/v1/checkout.js';
  //   script.async = true;
  //   document.body.appendChild(script);

  //   // Return a cleanup function
  //   return () => {
  //     if (script.parentNode) {
  //       document.body.removeChild(script);
  //     }
  //   };
  // }, []);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const calculateGstAmount = (total) => {
    const GST_RATE = 0.18; // GST rate is 18%
    return total * GST_RATE;
  };

  // const totalGstAmount  = (calculateGstAmount(totalPriceWithoutGst));
  const totalGstAmount = totalPrice;

  // const totalPriceWithGst = totalPriceWithoutGst + totalGstAmount;
  const totalPriceWithGst = totalPrice;

  const placeOrder = () => {
    if (!window.Razorpay) {
      openSnackbar("Razorpay SDK not loaded. Please try again later.");
      return;
    }
    // if(!address){
    //   toast.error("Please choose the address for delivery");
    //   return;
    // }

    const userDetailsString = localStorage.getItem("user_details");
    const userDetails = JSON.parse(userDetailsString);

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
      currency: "INR",
      amount: Math.round(totalPriceWithGst * 100), // Convert to paise
      name: "Online King",
      description: "Payment for your product",
      image: "/images/arrow.png",
      theme: {
        color: "blue",
      },
      handler: async (response) => {
        try {
          console.log(response);
          // toast.success("Payment successful");
          const accessToken = localStorage.getItem("access_token");
          const orderResponse = await axios.post(
            "/api/place-order",
            {
              address_id: address.id,
              payment_type: "RAZORPAY",
              order_status: "PENDING",
              payment_id: response.razorpay_payment_id,
              // total_gst_amount: totalGstAmount,
              total_gst_amount: totalPrice,
              // total_product_amount: totalPriceWithoutGst,
              total_product_amount: totalPrice,
              // total_amount: totalPriceWithGst,
              total_amount: totalPrice,

              products: cartItems.map((item) => ({
                product_id: item.product.id,
                quantity: item.quantity,
              })),
            },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: accessToken,
              },
            }
          );

          if (orderResponse.data.status === "success") {
            fetchCartItems();
            openSnackbar("Order created successfully");
          } else {
            console.error("Failed to create order");
            openSnackbar("Failed to create order. Please try again later.");
          }
        } catch (error) {
          console.error("Error creating order:", error);
          openSnackbar("Error creating order. Please try again later.");
        }
      },

      // prefill: {
      //   email: userDetails.email,
      //   contact: userDetails.mobile,
      //   name: userDetails.name,
      // },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  //   useEffect(() => {
  //     const script = document.createElement('script');
  //     script.src = 'https://checkout.razorpay.com/v1/checkout.js';
  //     script.async = true;
  //     document.body.appendChild(script);
  //   return ()=>{
  //     document.body.removeChild(script)
  //   }
  //   }, []);

  // let totalAmountWithoutCoupon = totalPrice + shippingCharge;
  // if (appliedCoupon) {
  //     totalAmountWithoutCoupon -= parseFloat(couponAmount);
  // }
  // const formattedTotalAmount = parseFloat(totalAmountWithoutCoupon).toFixed(2);
  // console.log(formattedTotalAmount)

  // const placeOrder = () => {
  //         const productData = cartData.map(cartItem => ({
  //             product_id: cartItem.product_id,
  //             quantity: cartItem.quantity
  //         }));

  //         const couponId = appliedCoupon ? appliedCoupon.id : null;
  //         const razorpay = new window.Razorpay({
  //             key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  //             currency: 'INR',
  //             amount: parseFloat(formattedTotalAmount).toFixed(2) * 100,
  //             name: 'OnlineKing',
  //             description: 'Payment for your product',
  //             image: {logo},
  //             theme: {
  //                 color: '#45B348',
  //             },
  //             handler: (response) => {
  //                 console.log(response)
  //                 axios.post('/api/place-order', {
  //                     address_id: selected,
  //                     delivery_type_id: shippingOption,
  //                     payment_id: response.razorpay_payment_id,
  //                     coupon_id: couponId,
  //                     shipping_charge: shippingCharge,
  //                     total_product_amount: totalPrice,
  //                     products: productData,
  //                     total_amount: (totalPrice + (totalPrice * calculateGST(cartData) / 100) + shippingCharge).toFixed(2)
  //                 }, {
  //                     headers: {
  //                         Authorization: localStorage.getItem('onlineKingWebToken'),
  //                     }
  //                 })
  //                     .then(res => {
  //                         console.log(res)
  //                         if (res.data.status === 'success') {
  //                             openSnackbar(res.data.message, 'success')
  //                             router.push('/')
  //                         } else {
  //                             openSnackbar(res.data.message, 'error')
  //                         }
  //                     })
  //                     .catch(err => {
  //                         console.log(err)
  //                     })
  //             },
  //             // prefill: {
  //             //     email: addressDetails.email,
  //             //     contact: addressDetails.mobile,
  //             //     name: addressDetails.fullname,
  //             // },
  //         });

  //         razorpay.open();

  //   }

  //------------------------------------------------------------------------------

  useEffect(() => {
    if (props.decodedParam) {
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

  return (
    <div className="flex justify-center items-center  font-fontNew">
      <div className="w-[40rem] lg:w-[60rem] border border-gray-300 rounded-2xl shadow-xl p-6 lg:p-10">
        <div className="flex flex-col gap-5">
          <h1 className="text-xl lg:text-3xl font-semibold text-center">
            Your Order
          </h1>
          <hr />
          <div className="border border-gray-300 rounded-2xl shadow-xl p-4 lg:p-6 flex flex-col  justify-between gap-4">
            {cartData?.map((value, index) => (
              <div key={`${index}`} className="flex gap-4">
                <div className="border border-gray-300 rounded-2xl shadow-xl p-2 lg:p-4">
                  <Image
                    src={headphone}
                    alt="Headphone"
                    className="w-24 h-24 lg:w-32 lg:h-32"
                  />
                </div>
                <div>
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
            ))}
          </div>
          <div className="flex gap-3">
            <div className="border border-gray-300 rounded-lg px-3 py-2 w-2/3 lg:w-3/4">
              <input
                type="text"
                placeholder="Discount Code"
                className="outline-none w-full h-full"
              />
            </div>
            <div className="border border-gray-300 rounded-lg px-3 py-2 w-1/3 lg:w-1/4">
              <h2 className="text-center">Apply</h2>
            </div>
          </div>
          <div className="border border-gray-300 rounded-2xl shadow-xl p-4 lg:p-6 flex flex-col gap-2">
            <h2 className="text-lg lg:text-xl font-semibold">
              Price Details (1 item)
            </h2>
            <hr />
            <div className="flex justify-between">
              <h1 className="text-sm lg:text-base">Total Price</h1>
              <div className="flex gap-2">
                <Image
                  src={rupee}
                  alt="Rupee"
                  className="w-4 h-4 lg:w-5 lg:h-5"
                />
                {/* <p className="text-sm lg:text-base">{value?.product?.default_price}</p> */}
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
                <p className="text-green-600 text-sm lg:text-base">1000</p>
              </div>
            </div>
            <div className="flex justify-between">
              <h1 className="text-sm lg:text-base">Coupon Discount</h1>
              <h1 className="text-red-600 text-sm lg:text-base">
                Apply Coupon
              </h1>
            </div>
            <div className="flex justify-between">
              <h1 className="text-sm lg:text-base">Shipping Fee</h1>
              <h1 className="text-green-600 text-sm lg:text-base">Free</h1>
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
            <div className="mt-6">
              <Link href={"payment"}>
                <button className="bg-[#45B348] hover:bg-green-400 active:bg-green-400 focus:outline-none focus:ring focus:ring-violet-300 w-full h-14 lg:h-20 text-white rounded-lg">
                  <h1
                    className="text-center text-lg lg:text-3xl"
                    onClick={placeOrder}
                  >
                    Continue
                  </h1>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
