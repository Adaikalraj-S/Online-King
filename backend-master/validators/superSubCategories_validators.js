const Joi = require("joi");

const fetch_super_sub_categories_payload = Joi.object({
    id: Joi.number().integer().allow(null),
    category_id: Joi.number().integer().allow(null),
    sub_category_id: Joi.number().integer().allow(null),
    super_sub_category_name: Joi.string().allow(null),
})
const add_super_sub_categories_payload = Joi.object({
    super_sub_category_name: Joi.string().required(),
    sub_category_id: Joi.number().integer().required(),
    category_id: Joi.number().integer().required(),
    image: Joi.any().allow(null),
})

const update_super_sub_categories_payload = Joi.object({
    super_sub_category_id: Joi.number().integer().positive().required(),
    super_sub_category_name: Joi.string(),
    image: Joi.any(),
    sub_category_id: Joi.number().integer().positive(),
    category_id: Joi.number().integer().positive(),
});


const delete_super_sub_categories_payload = Joi.object({
    super_sub_category_id: Joi.number().integer().positive().required()
})

const change_status_supersubcategory_validator = Joi.object({
    super_sub_category_id: Joi.number().integer().required()
})


module.exports = {
    fetch_super_sub_categories_payload,
    add_super_sub_categories_payload,
    update_super_sub_categories_payload,
    delete_super_sub_categories_payload,
    change_status_supersubcategory_validator
};