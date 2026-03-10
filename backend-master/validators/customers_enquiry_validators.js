const Joi = require("joi");

const customers_enquiry_payload = Joi.object({
  name: Joi.string().min(2).max(100).required().messages({
    "string.empty": "Name is required.",
    "string.min": "Name must be at least 2 characters long.",
    "string.max": "Name cannot exceed 100 characters.",
  }),

  mobile: Joi.string()
    .pattern(/^\d{10,15}$/)
    .required()
    .messages({
      "string.empty": "Mobile number is required.",
      "string.pattern.base": "Mobile number must be between 10 to 15 digits.",
    }),

  email: Joi.string().email().required().messages({
    "string.empty": "Email is required.",
    "string.email": "Please provide a valid email address.",
  }),

  subject: Joi.string().max(200).allow(null, "").messages({
    "string.max": "Subject cannot exceed 200 characters.",
  }),

  message: Joi.string().max(2000).required().messages({
    "string.empty": "Message is required.",
    "string.max": "Message cannot exceed 2000 characters.",
  }),
});

module.exports = {
  customers_enquiry_payload,
};
