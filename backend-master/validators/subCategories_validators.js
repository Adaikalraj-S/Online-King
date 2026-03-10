const Joi = require("joi");

const fetch_sub_categories_payload = Joi.object({
    id: Joi.number().integer().allow(null),
    category_id: Joi.number().integer().allow(null),
    sub_category_name: Joi.string().allow(null),
})
const add_sub_categories_payload = Joi.object({
    sub_category_name: Joi.string().required(),
    category_id: Joi.number().integer().required(),
    image: Joi.any().allow(null),
})

const update_sub_categories_payload = Joi.object({
    category_id:Joi.number().integer().positive().required(),
    sub_category_id: Joi.number().integer().positive().required(),
    sub_category_name: Joi.string(),
    image: Joi.any(),
})
const delete_sub_categories_payload = Joi.object({
    sub_category_id: Joi.number().integer().positive().required()
})

const change_status_subcategory_validator = Joi.object({
    sub_category_id: Joi.number().integer().required()
})


module.exports = {
    fetch_sub_categories_payload,
    add_sub_categories_payload,
    update_sub_categories_payload,
    delete_sub_categories_payload,
    change_status_subcategory_validator
};