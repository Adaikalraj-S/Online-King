const Joi = require("joi");

const fetch_categories_payload = Joi.object({
    id: Joi.number().integer().allow(null),
    category_name: Joi.string().allow(null),
})
const add_categories_payload = Joi.object({
    category_name: Joi.string().required(),
    image: Joi.any().allow(null),
})
const category_image = Joi.object({
    image: Joi.string(),
    path: Joi.string(),
})
const update_categories_payload = Joi.object({
    category_id: Joi.number().integer().required(),
    category_name: Joi.string().required(),
    image: Joi.any(), 
})

const delete_category_validator = Joi.object({
    category_id: Joi.number().integer().required()
})
const change_status_category_validator = Joi.object({
    category_id: Joi.number().integer().required()
})


module.exports = {
    fetch_categories_payload,
    add_categories_payload,
    category_image,
    update_categories_payload,
    delete_category_validator,
    change_status_category_validator
};