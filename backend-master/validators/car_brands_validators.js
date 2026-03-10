const Joi = require("joi");

const fetch_car_brands_payload = Joi.object({
    id: Joi.number().integer().allow(null),
    car_brand_name: Joi.string().allow(null),
})
const add_car_brand_payload = Joi.object({
    car_brand_name: Joi.string().required(),
    image: Joi.any().required(),
})
const brand_image = Joi.object({
    image: Joi.string(),
})
const update_car_brand_payload = Joi.object({
    car_brand_id: Joi.number().integer().positive().required(),
    car_brand_name: Joi.string().required(),
    image: Joi.any(),
})

const delete_car_brand_validator = Joi.object({
    car_brand_id: Joi.number().integer().required()
})
const change_status_car_brand_validator = Joi.object({
    car_brand_id: Joi.number().integer().required()
})


module.exports = {
    fetch_car_brands_payload,
    add_car_brand_payload,
    brand_image,
    update_car_brand_payload,
    delete_car_brand_validator,
    change_status_car_brand_validator
};