const Joi = require("joi");

const createRazorPay = Joi.object({
  amount: Joi.number().integer().required(),
});

const verifyRazorPayment = Joi.object({
  razorpay_order_id: Joi.string().required(),
  razorpay_payment_id: Joi.string().required(),
  razorpay_signature: Joi.string().required(),
  order_id: Joi.number().integer().required(),
});

const fetchRazorPaymentDetails = Joi.object({
  order_id: Joi.string().allow(null),
  pay_id: Joi.string().allow(null),
});

const refundRazorDetails = Joi.object({
  pay_id: Joi.string().required(),
  amount: Joi.number().required(),
  instant: Joi.boolean(),
  receipt: Joi.string(),
  notes: Joi.string(),
});

module.exports = {
  createRazorPay,
  verifyRazorPayment,
  fetchRazorPaymentDetails,
  refundRazorDetails,
};
