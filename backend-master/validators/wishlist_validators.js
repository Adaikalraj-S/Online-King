const Joi = require("joi");

const type_of_user = Joi.object({
    type: Joi.string().valid("CUSTOMER", "DEALER").required(),
});

const add_to_wishlist_payload = Joi.object({
    product_id: Joi.number().integer().required(),
    combination_id: Joi.number().allow(null),
});

const remove_from_wishlist_payload = Joi.object({
    product_id: Joi.number().integer().required(),
    combination_id: Joi.number().allow(null),
});


module.exports = {
    type_of_user,
    add_to_wishlist_payload,
    remove_from_wishlist_payload
};