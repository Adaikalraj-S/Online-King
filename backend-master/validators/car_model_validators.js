const Joi = require("joi");

const fetch_car_model_payload = Joi.object({
    id: Joi.number().integer().allow(null),
    brand_id: Joi.number().integer().allow(null),
    model_name: Joi.string().allow(null),
})
const add_car_model_payload = Joi.object({
    car_brand_id: Joi.number().integer().positive().required(),
    model_name: Joi.string().required(),
    start_year: Joi.string().regex(/^\d{4}$/).required(),
    end_year: Joi.string().regex(/^\d{4}$/).allow(null).optional(),
    image: Joi.any().required(),
})
const model_image = Joi.object({
    image: Joi.string(),
})
const update_car_model_payload = Joi.object({
    car_model_id: Joi.number().integer().positive().required(),
    car_brand_id: Joi.number().integer().positive().required(),
    model_name: Joi.string().required(),
    start_year: Joi.string().required(),
    end_year: Joi.string().allow('').optional(),
    image: Joi.any(),
})

const delete_car_model_validator = Joi.object({
    car_model_id: Joi.number().integer().required()
})
const change_status_car_model_validator = Joi.object({
    car_model_id: Joi.number().integer().required()
})


module.exports = {
    fetch_car_model_payload,
    model_image,
    add_car_model_payload,
    update_car_model_payload,
    delete_car_model_validator,
    change_status_car_model_validator
};