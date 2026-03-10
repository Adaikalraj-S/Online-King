const Joi = require("joi");

const createCouponValidator = Joi.object({
  coupon_type: Joi.string().required(),
  coupon_title: Joi.string().required(),
  coupon_name: Joi.string().required(),
  min_order_amount: Joi.number().integer(),
  max_discount: Joi.number().integer().allow(null),
  discount_type: Joi.string(),
  discount: Joi.number().positive(),
  max_use_per_user: Joi.number().integer(),
  max_use: Joi.number().integer().allow(null),
  user_id: Joi.number().integer().allow(null),
  dealer_id: Joi.number().integer().allow(null),
  start_date: Joi.date().allow(null),
  expiry_date: Joi.date().allow(null),
});

const editCouponPayload = Joi.object({
  coupon_id: Joi.number().integer().required(),
  coupon_type: Joi.string().allow(""),

  coupon_title: Joi.string().required(),
  coupon_name: Joi.string().required(),
  min_order_amount: Joi.number().positive().required(),
  max_discount: Joi.number().positive().required(),
  discount_type: Joi.string().valid("Percent", "Amount").required(),
  discount: Joi.number().positive().required(),
  max_use_per_user: Joi.number().integer().min(1).required(),
  max_use: Joi.number().integer().min(1).allow(null),
  expiry_date: Joi.date().iso().required(),
  start_date: Joi.date().allow(null),
});

const statusUpdatePayload = Joi.object({
  coupon_id: Joi.number().integer().required(),
});

const deleteCouponPayload = Joi.object({
  coupon_id: Joi.number().integer().required(),
});

const is_applicablePayload = Joi.object({
  coupon_id: Joi.number().integer().required(),
  totalprice: Joi.number().required(),
});

module.exports = {
  createCouponValidator,
  editCouponPayload,
  statusUpdatePayload,
  deleteCouponPayload,
  is_applicablePayload,
};
