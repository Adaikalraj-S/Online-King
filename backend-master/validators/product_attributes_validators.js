const Joi = require("joi");

const fetch_all_attributes_validator = Joi.object({
    id: Joi.number().integer().allow(null),
    attribute_name: Joi.string().allow(null),
})

const add_attributes_validator = Joi.object({
    attribute_name: Joi.string().required(),
})

const updateAttributesValidator = Joi.object({
    attribute_id: Joi.number().integer().positive().required(),
    attribute_name: Joi.string(),
});

const deleteAttributesValidator = Joi.object({
    attribute_id: Joi.number().integer().positive().required()
});

const statusChangeAttributesValidator = Joi.object({
    attribute_id: Joi.number().integer().positive().required()
});

module.exports = {
    fetch_all_attributes_validator,
    add_attributes_validator,
    updateAttributesValidator,
    deleteAttributesValidator,
    statusChangeAttributesValidator
};