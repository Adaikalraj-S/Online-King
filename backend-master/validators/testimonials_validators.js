const Joi = require("joi");

// const fetch_all_testimonials_admin_validator = Joi.object({
//     id: Joi.number().integer().allow(null),
//     installer_name: Joi.string().allow(null),
//     company_name: Joi.string().allow(null),
//     city: Joi.string().allow(null),
// })

const add_testimonials_payload = Joi.object({
    customer_id: Joi.number().integer().positive().required(),
    rating: Joi.number().required(),
    heading: Joi.string().required(),
    description: Joi.string().required()
})

const edit_testimonials_payload = Joi.object({
    testimonial_id: Joi.number().integer().positive().required(),
    customer_id: Joi.number().integer().positive().required(),
    rating: Joi.number().required(),
    heading: Joi.string().required(),
    description: Joi.string().required()
})

const deleteTestimonialsValidator = Joi.object({
    testimonial_id: Joi.number().integer().positive().required()
});

const statusChangeTestimonialsValidator = Joi.object({
    testimonial_id: Joi.number().integer().positive().required()
});

module.exports = {
    // fetch_all_testimonials_admin_validator,
    add_testimonials_payload,
    edit_testimonials_payload,
    deleteTestimonialsValidator,
    statusChangeTestimonialsValidator
};