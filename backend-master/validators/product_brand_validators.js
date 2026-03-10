const Joi = require("joi");

const fetch_product_brands_payload = Joi.object({
    id: Joi.number().integer().allow(null),
    product_brand_name: Joi.string().allow(null),
})
const add_product_brand_payload = Joi.object({
    product_brand_name: Joi.string().required(),
    image: Joi.any().required(),
})
const brand_image = Joi.object({
    image: Joi.string(),
})
const update_product_brand_payload = Joi.object({
    product_brand_id: Joi.number().integer().positive().required(),
    product_brand_name: Joi.string().required(),
    image: Joi.any(),
})

const delete_product_brand_validator = Joi.object({
    product_brand_id: Joi.number().integer().required()
})
const change_status_product_brand_validator = Joi.object({
    product_brand_id: Joi.number().integer().required()
})


module.exports = {
    fetch_product_brands_payload,
    add_product_brand_payload,
    brand_image,
    update_product_brand_payload,
    delete_product_brand_validator,
    change_status_product_brand_validator
};