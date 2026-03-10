const Joi = require("joi");

const fetch_car_lists_payload = Joi.object({
    id: Joi.number().integer().allow(null),
    brand_id: Joi.number().integer().allow(null),
    model_id: Joi.number().integer().allow(null),
})
const add_car_lists_payload = Joi.object({
    brand_id: Joi.number().integer().required(),
    model_id: Joi.number().integer().required(),
})
const brand_image = Joi.object({
    image: Joi.string(),
})
const update_car_lists_payload = Joi.object({
    car_lists_id: Joi.number().integer().positive().required(),
    brand_id: Joi.number().integer().positive().required(),
    model_id: Joi.number().integer().positive().required(),
})

const delete_car_lists_validator = Joi.object({
    car_lists_id: Joi.number().integer().required()
})
const change_status_car_lists_validator = Joi.object({
    car_lists_id: Joi.number().integer().required()
})


module.exports = {
    fetch_car_lists_payload,
    add_car_lists_payload,
    update_car_lists_payload,
    delete_car_lists_validator,
    change_status_car_lists_validator
};