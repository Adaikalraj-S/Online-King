const Joi = require("joi");

const fetchAllAddress = Joi.object({
  address_id: Joi.number().integer().allow(null),
});

const add_address_payload = Joi.object({
  fullname: Joi.string().required(),
  mobile: Joi.string().required(),
  email: Joi.string().allow(""),
  add_type: Joi.string().allow(""),
  add1: Joi.string().required(),
  add2: Joi.string().allow(""),
  city: Joi.string().required(),
  state: Joi.string().required(),
  country: Joi.string().required(),
  pincode: Joi.string().required(),
  area: Joi.string().allow(""),
  landmark: Joi.string().allow(""),
  type: Joi.string().allow(""),
  gst_no: Joi.string().allow(""),
});

const edit_address_payload = Joi.object({
  address_id: Joi.number().integer().required(), // Address identifier for editing
  fullname: Joi.string().required(),
  mobile: Joi.string().required(),
  email: Joi.string().allow(""),
  add_type: Joi.string().allow(""),
  add1: Joi.string().required(),
  add2: Joi.string().allow(""),
  city: Joi.string().required(),
  state: Joi.string().required(),
  country: Joi.string().required(),
  pincode: Joi.string().required(),
  area: Joi.string().allow(""),
  landmark: Joi.string().allow(""),
  type: Joi.string().allow(""),
  gst_no: Joi.string().allow(""),
});

const add_address_query = Joi.object({
  user_id: Joi.number().integer().optional(),
});

module.exports = {
  add_address_payload,
  fetchAllAddress,
  add_address_query,
  edit_address_payload,
};
