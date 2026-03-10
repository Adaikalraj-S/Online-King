const Joi = require("joi");

const fetch_all_subscribers_validator = Joi.object({
    id: Joi.number().integer().allow(null),
    email: Joi.string().allow(null),
})

const add_subscribers_validator = Joi.object({
    email: Joi.string().required(),
})

const updateAttributesValidator = Joi.object({
    attribute_id: Joi.number().integer().positive().required(),
    attribute_name: Joi.string(),
});

const deleteSubscriberValidator = Joi.object({
    subscriber_id: Joi.number().integer().positive().required()
});

const statusChangeSubscriberValidator = Joi.object({
    subscriber_id: Joi.number().integer().positive().required()
});

module.exports = {
    fetch_all_subscribers_validator,
    add_subscribers_validator,
    // updateAttributesValidator,
    deleteSubscriberValidator,
    statusChangeSubscriberValidator
};