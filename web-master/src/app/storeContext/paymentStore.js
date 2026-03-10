import axios from "../../../axios";
import {create} from "zustand";
import { debounce } from "lodash";
import Razorpay from "razorpay";
import logo from "../Asset/OnlineKingLogo.svg";
import useProductStore from "../storeContext/store";
import Swal from "sweetalert2";

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
});
// const { totalMRP, totalPRICE } = useProductStore();

const usePaymentStore = create((set, get) => ({
  isAuthenticated: false,
  error: null,
  phonePayData: {},
  razorPayData: {},

  checkLocalStorageAndVerifyToken: () => {
    const token = localStorage.getItem("onlineKingWebToken");
    if (!token) {
      set({ isAuthenticated: false });
      return Promise.resolve(false);
    }

    return axios
      .get("/api/verify-token", {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        if (response.data.status === "success") {
          set({ isAuthenticated: true });
          return true;
        } else {
          set({ isAuthenticated: false });
          return false;
        }
      })
      .catch((error) => {
        set({ isAuthenticated: false });
        return false;
      });
  },

  convertCartData: (cartData) => {
    // Initialize descriptions with the product name
    let descriptions = cartData.product.product_name;

    // Filter the attributes combination by combination_id
    const combination = cartData.product.product_attributes_associations?.find(
      (attr) => attr.id === cartData.combination_id
    );

    // Format attributes if the combination is found
    if (combination) {
      const formattedAttributes = combination.attributes_combinations.map(
        (attr) => {
          const attributeName = attr.product_attribute.attribute_name.replace(
            /\s+/g,
            ""
          );
          const attributeValue = attr.attribute_value;
          return `${attributeName}-${attributeValue}`;
        }
      );

      descriptions += ` (${formattedAttributes.join(", ")})`;
    }

    // Calculate the default price
    let MRP = cartData.product.default_price;

    // Calculate the discounted product price
    let productPrice = cartData.product.default_price;
    if (
      cartData.product.discount_type === "percent" ||
      cartData.product.discount_type === "percentage"
    ) {
      productPrice = productPrice * (1 - cartData.product.discount / 100);
    } else if (cartData.product.discount_type === "amount") {
      productPrice = productPrice - cartData.product.discount;
    }

    // Initialize unitPrice with the product price including discount
    let unitPrice = productPrice;

    // If a combination is found, update the unit price with the combination price
    if (combination) {
      let combinationPrice = combination.price;
      MRP = combination.price;

      if (cartData.product.discount_type === "percent") {
        combinationPrice =
          combinationPrice * (1 - cartData.product.discount / 100);
      } else if (cartData.product.discount_type === "amount") {
        combinationPrice = combinationPrice - cartData.product.discount;
      }

      unitPrice = combinationPrice;
    }

    // Initialize gstTaxTotal
    let gstTaxTotal = 0;

    // Calculate GST amount
    const gstAmount = () => {
      let totalPrice = unitPrice * cartData.quantity;
      let netAmount = (
        (totalPrice / (100 + cartData.product?.tax_rate)) *
        100
      ).toFixed(2);
      let gst = (netAmount * (cartData.product?.tax_rate / 100)).toFixed(2);
      return gst;
    };

    gstTaxTotal = parseFloat(gstAmount());

    // Construct the new cart item object
    const newCartData = {
      product_id: cartData.product_id,
      product_description: descriptions,
      combination_id: cartData.combination_id,
      unit_price: MRP,
      discount: MRP * cartData.quantity - unitPrice * cartData.quantity,
      sub_total: gstTaxTotal,
      quantity: cartData.quantity,
      total_amount: unitPrice * cartData.quantity,
      gst: cartData.product?.tax_rate,
      igst: gstTaxTotal,
    };

    return newCartData;
  },

  placeOrder: async (
    cartData,
    totalPrice,
    couponId,
    selectedAddressId,
    useShippingForBilling,
    selectedBillingAddressId,
    selectedPaymentMethod,
    payment_id,
    payment_order_id,
    payment_signature,
    openSnackbar,
    router,
    totalMRP,
    type = null
  ) => {
    const { checkLocalStorageAndVerifyToken, convertCartData } = get(); // Extract convertCartData from get()
    await checkLocalStorageAndVerifyToken();
    const { isAuthenticated } = get();
    if (!isAuthenticated) {
      return;
    }

    const data = {
      address_id: selectedAddressId,
      is_billing_same_as_shipping: useShippingForBilling,
      billing_address_id: useShippingForBilling
        ? selectedAddressId
        : selectedBillingAddressId,
      payment_via: selectedPaymentMethod,
      payment_id,
      payment_order_id,
      payment_signature,
      pre_order: type ? true : false,
      total_product_amount: totalMRP ? totalMRP : 0,
      total_discount_amount: totalPrice - totalMRP ? totalMRP : 0 ,
      coupon_id: couponId ? couponId : null,
      products: cartData.map((item) => convertCartData(item)), // Call convertCartData directly
      total_amount: totalPrice,
    };

    try {
      const response = await axios.post("/api/place-order", data, {
        headers: {
          Authorization: localStorage.getItem("onlineKingWebToken"),
        },
      });
      if (selectedPaymentMethod == 'PhonePe') {
        return response.data
      }
      if (response.data.status === "success") {
        console.log(response.data);
        openSnackbar(response.data.message, "success");

        // Display SweetAlert2 success message
        Swal.fire({
          icon: "success",
          title: "Order Placed Successfully!",
          text: "You will be redirected to the homepage shortly.",
          timer: 3000, // Timer set for 3 seconds
          showConfirmButton: false,
          willClose: () => {
            // Redirect to homepage after 3 seconds
            router.push("/profile/my-orders");
          },
        });
      } else {
        console.log(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  },

  createRazorPayOrder: async (amount) => {
    console.log("here", typeof amount);
    const { checkLocalStorageAndVerifyToken } = get();
    await checkLocalStorageAndVerifyToken();
    const { isAuthenticated } = get();

    if (!isAuthenticated) {
      return;
    }
    try {
      const res = await axios.post(
        "/api/create-razorpay-orderId",
        {
          amount: amount.toFixed(2) * 100,
        },
        {
          headers: {
            Authorization: localStorage.getItem("onlineKingWebToken"), // Headers
          },
        }
      );
      if (res.data.status === "success") {
        console.log(res.data, "razor-order");
        set({ razorPayData: res.data.data });
        return res.data.data;
      } else {
        console.error("Error in creating razorPay order", error);
      }
    } catch (error) {
      console.error("Error in creating razor pay order", error);
    }
  },

  initiateRazorpayPayment: async (totalprice, orderId) => {
    console.log(totalprice * 100, "total-intiate");
    let newtotal = totalprice * 100;
    const { checkLocalStorageAndVerifyToken } = get();
    await checkLocalStorageAndVerifyToken();
    const { isAuthenticated } = get();

    if (!isAuthenticated) {
      return;
    }

    try {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);

      return new Promise((resolve, reject) => {
        script.onload = () => {
          const razorpay = new window.Razorpay({
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
            currency: "INR",
            amount: newtotal,
            order_id: orderId,
            name: "Online King",
            description: "Payment for your product",
            image: logo,
            theme: {
              color: "#45b348",
            },
            handler: (response) => {
              set({ razorPayData: response.data });
              resolve(response);
            },
            prefill: {
              email: "abc@xyz.com",
              contact: "9999999999",
              name: "Subham",
            },
          });

          razorpay.open();
        };

        script.onerror = () => {
          reject(new Error("Razorpay SDK failed to load"));
        };
      });
    } catch (error) {
      console.error("Error initiating Razorpay payment:", error);
    }
  },

  initiatePhonePePayment: async (totalprice, name, phone, phonepay_merchant_payment_id) => {
    const { checkLocalStorageAndVerifyToken } = get();
    await checkLocalStorageAndVerifyToken();
    const { isAuthenticated } = get();

    if (!isAuthenticated) {
      return;
    }
    try {
      localStorage.setItem('PHONEPETRID', phonepay_merchant_payment_id)
      const response = await axios({
        method: 'POST',
        url: "/api/payment",
        data: {
          name,
          amount: Number(totalprice) * 100,
          mobileNumber: phone,
          phonepay_merchant_payment_id,
          // phonepay_merchant_id: process.env.NEXT_PUBLIC_PHONE_PAY_MERCHANT_ID,
          phonepay_redirect_url: `${process.env.NEXT_PUBLIC_APP_URL}/processing-payment`,
          phonepay_callback_url: `${process.env.NEXT_PUBLIC_BASE_IMAGE_URL}/api/phonepe-server-callback`,
          // salt_key: process.env.NEXT_PUBLIC_PHONEPAY_SALT_KEY,
          environment: "development",
        }
      });
      if (response.data.status == "success") {
        set({ phonePayData: response.data.data });
        window.location.href = response.data.data.instrumentResponse.redirectInfo.url
      } else {
        console.error("Error initiating PhonePe payment:", response.data);
      }
      // return response.data.data
    } catch (error) {
      console.error("Error initiating PhonePe payment:", error);
    }
  },
}));

export default usePaymentStore;
