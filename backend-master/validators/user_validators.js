const Joi = require("joi");

const admin_add_payload = Joi.object({
  fullname: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const admin_login_payload = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const customer_registration_query = Joi.object({
  type: Joi.string().valid("CUSTOMER", "DEALER").required(),
});

const edit_user_details = Joi.object({
  fullname: Joi.string().allow(""),
  email: Joi.string().allow(""),
  phone: Joi.string().allow(""),
  dob: Joi.string().allow(""),
  gender: Joi.string().allow(""),
  profile_img: Joi.any(),
});

const customer_registration_payload = Joi.object({
  fullname: Joi.string().required(),
  username: Joi.string().required(),
  // email: Joi.string().allow(null),
  password: Joi.string().required(),
  confirm_password: Joi.string().required(),
});

const customer_registration_otp_validation_payload = Joi.object({
  user_id: Joi.number().integer().required(),
  otp: Joi.string().required(),
});

const forgot_password_payload = Joi.object({
  username: Joi.string().required(),
});

const verify_forgot_password_payload = Joi.object({
  user_id: Joi.number().integer().required(),
  otp: Joi.string().required(),
  new_password: Joi.string().required(),
  confirm_password: Joi.string().required(),
});

const approve_dealer_payload = Joi.object({
  dealer_id: Joi.number().integer().required(),
});

const dealer_reject_validator = Joi.object({
  dealer_id: Joi.number().integer().required(),
  rejected_reason: Joi.string().required(),
});

const status_change_dealer_payload = Joi.object({
  dealer_id: Joi.number().integer().required(),
});

const customer_login_payload = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

const dealer_personal_details_payload = Joi.object({
  dealer_id: Joi.number().integer().required(),
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  dob: Joi.string().allow(null).allow(""),
  gender: Joi.string().allow(null).allow(""),
  language: Joi.string().allow(null).allow(""),
  personal_email: Joi.string().required(),
  personal_mobile: Joi.string().required(),
  personal_alt_mobile: Joi.string().allow(null).allow(""),
  add1: Joi.string().required(),
  add2: Joi.string().allow(null),
  area: Joi.string().required(),
  city: Joi.string().required(),
  country: Joi.string().required(),
  state: Joi.string().required(),
  pincode: Joi.string().required(),
  landmark: Joi.string().required(),
});

module.exports = {
  admin_add_payload,
  admin_login_payload,
  forgot_password_payload,
  customer_registration_query,
  verify_forgot_password_payload,
  // get_dealer_approve_query,
  approve_dealer_payload,
  customer_registration_payload,
  customer_registration_otp_validation_payload,
  customer_login_payload,
  dealer_personal_details_payload,
  // dealer_approve_query,
  dealer_reject_validator,
  status_change_dealer_payload,
  edit_user_details,
};
