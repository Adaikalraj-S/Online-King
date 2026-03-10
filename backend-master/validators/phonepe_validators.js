const Joi = require("joi");

const phonePayValidator = Joi.object({
  name: Joi.string().required(),
  amount: Joi.number().integer().positive().required(),
  mobileNumber: Joi.string().required(),
  phonepay_merchant_payment_id: Joi.string().required(),
  phonepay_redirect_url: Joi.string().required(),
  phonepay_callback_url: Joi.string().required(),
  // salt_key: Joi.string().required(),
  environment: Joi.string().valid("development", "production").required(),
});

const paymentStatusValidators = Joi.object({
  order_id: Joi.number().integer().required(),
});

const phonePayHeaderValidator = Joi.object({
  "x-verify": Joi.string().required(), // Validating the x-verify header
}).unknown();

const serverCallbackPayload = Joi.string().required();

module.exports = {
  phonePayValidator,
  paymentStatusValidators,
  phonePayHeaderValidator,
  serverCallbackPayload,
};
