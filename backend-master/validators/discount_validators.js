const Joi = require("joi");

const createDiscountValidator = Joi.object({
  discount_name: Joi.string().required(),
  product_brand_id: Joi.number().integer().positive().allow(null),
  image: Joi.any().required(),
  category_id: Joi.number().integer().positive().allow(null),
  sub_category_id: Joi.number().integer().positive().allow(null),
  super_sub_category_id: Joi.number().integer().positive().allow(null),
  products: Joi.string().allow(""),
  discount_type: Joi.string().required(),
  discount: Joi.number().required(),
  min_amount: Joi.number().required(),
  max_amount: Joi.number().required(),
  start_date: Joi.date().required(),
  expiry_date: Joi.date().required(),
});

const editDiscountValidator = Joi.object({
  discount_id: Joi.number().integer().positive().required(),
  discount_name: Joi.string().required(),
  image: Joi.any().optional(), // Allows for optional image file
  product_brand_id: Joi.number().allow(null).optional(),
  category_id: Joi.number().allow(null).optional(),
  sub_category_id: Joi.number().allow(null).optional(),
  super_sub_category_id: Joi.number().allow(null).optional(),
  products: Joi.string().optional(), // Assuming products is a JSON string
  discount_type: Joi.string()
    .valid("percent", "percentage", "amount")
    .required(),
  discount: Joi.number().optional(),
  min_amount: Joi.number().optional(),
  max_amount: Joi.number().optional(),
  start_date: Joi.date().optional(),
  expiry_date: Joi.date().optional(),
});

const statusUpdatePayload = Joi.object({
  discount_id: Joi.number().integer().required(),
});

const deleteDiscountPayload = Joi.object({
  discount_id: Joi.number().integer().required(),
});

const show_discount_in_web = Joi.object({
  discount_id: Joi.number().integer().allow(null),
});

module.exports = {
  createDiscountValidator,
  editDiscountValidator,
  statusUpdatePayload,
  deleteDiscountPayload,
  show_discount_in_web,
};
