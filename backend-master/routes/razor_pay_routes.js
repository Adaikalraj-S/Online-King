const { razorPayValidators, headerValidator } = require("../validators");
const { razorPay_controllers } = require("../controllers");

const tags = ["api", "Razor Pay Setup"];

const razor_pay_routes = [
  {
    method: "POST",
    path: "/create-razorpay-orderId",
    options: {
      description: "create razor pay order-id.",
      tags,
      validate: {
        headers: headerValidator,
        payload: razorPayValidators.createRazorPay,
      },
      handler: razorPay_controllers.createRazorPayOrder,
    },
  },
  {
    method: "POST",
    path: "/verify-razor-payment",
    options: {
      description: "Verify razor payment with signature.",
      tags,
      validate: {
        headers: headerValidator,
        payload: razorPayValidators.verifyRazorPayment,
      },
      handler: razorPay_controllers.verifyRazorPayment,
    },
  },
  {
    method: "POST",
    path: "/get-razor-payments-details",
    options: {
      description: "Get Razor pay payment status and details.",
      tags,
      validate: {
        headers: headerValidator,
        payload: razorPayValidators.fetchRazorPaymentDetails,
      },
      handler: razorPay_controllers.getRazorpayPaymentDetails,
    },
  },
  {
    method: "POST",
    path: "/refund-razor-payment",
    options: {
      description: "Intiate razor pay refund.",
      tags,
      validate: {
        headers: headerValidator,
        payload: razorPayValidators.refundRazorDetails,
      },
      handler: razorPay_controllers.refundRazorPayment,
    },
  },
];

module.exports = razor_pay_routes;
