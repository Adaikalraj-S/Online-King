const Joi = require("joi");
const { pre_order } = require("../config/databases");

// const productSchema = Joi.object({
//   product_id: Joi.number().required(),
//   quantity: Joi.number().integer().min(1).required(),
//   combination_id: Joi.number().allow(null),
// });

const productSchema = Joi.object({
  product_id: Joi.number().required(),
  product_description: Joi.string().required(),
  combination_id: Joi.number().optional().allow(null),
  //combination_name: Joi.string().optional().allow(null),
  unit_price: Joi.number().precision(2).required(),
  quantity: Joi.number().integer().min(1).required(),
  sub_total: Joi.number().precision(2).required(),
  total_amount: Joi.number().precision(2).required(),
  //description: Joi.string().allow(null),
  cgst: Joi.number().allow(null),
  sgst: Joi.number().allow(null),
  igst: Joi.number().allow(null),
  gst: Joi.number().allow(null),
  default_price: Joi.number().allow(null),
  discount_type: Joi.string().allow(null),
  discount: Joi.number().allow(null),
});

const createOrderSchema = Joi.object({
  address_id: Joi.number().integer().allow(null),
  is_billing_same_as_shipping: Joi.boolean().required(),
  billing_address_id: Joi.number().integer().allow(null),
  payment_via: Joi.string().required(),
  payment_id: Joi.string().allow(null),
  payment_order_id: Joi.string().allow("").allow(null),
  payment_signature: Joi.string().allow("").allow('null'),
  shipping_charge: Joi.number().allow(null),
  total_product_amount: Joi.number().required(),
  total_discount_amount: Joi.number().allow(null),
  coupon_id: Joi.number().integer().allow(null),
  products: Joi.array().items(productSchema).min(1).required(),
  total_amount: Joi.number().required(),
  pre_order: Joi.boolean().optional(),
});

const cancelOrderByAdmin = Joi.object({
  order_id: Joi.number().integer().required(),
  cancellation_reason: Joi.string().required(),
});

const approveOrderValidator = Joi.object({
  order_id: Joi.number().integer().required(),
});

const updateOrderStatusValidator = Joi.object({
  order_id: Joi.number().integer().required(),
  order_status_id: Joi.number().integer().required(),
  cancellation_reason: Joi.string().allow(""),
  order_status_message: Joi.string().allow(""),
});

const invoice_payload = Joi.object({
  order_id: Joi.number().integer().required(),
});

module.exports = {
  createOrderSchema,
  cancelOrderByAdmin,
  approveOrderValidator,
  updateOrderStatusValidator,
  invoice_payload,
};
