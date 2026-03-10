const Joi = require("joi");

const type_of_user = Joi.object({
  type: Joi.string().valid("CUSTOMER", "DEALER").required(),
});

const add_to_cart_payload = Joi.object({
  // user_id: Joi.number().integer().required(),
  product_id: Joi.number().integer().required(),
  combination_id: Joi.number().allow(null),
  quantity: Joi.number().integer().allow(null),
});

const handle_increament_payload = Joi.object({
  product_id: Joi.number().integer().required(),
  combination_id: Joi.number().allow(null),
});

const handle_decrement_payload = Joi.object({
  product_id: Joi.number().integer().required(),
  combination_id: Joi.number().allow(null),
});

const remove_from_cart_payload = Joi.object({
  product_id: Joi.number().integer().required(),
  combination_id: Joi.number().allow(null),
});

module.exports = {
  type_of_user,
  add_to_cart_payload,
  handle_increament_payload,
  handle_decrement_payload,
  remove_from_cart_payload,
};
