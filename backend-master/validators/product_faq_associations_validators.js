const Joi = require("joi");

const fetch_faq_of_product = Joi.object({
  product_id: Joi.number().integer().required(),
});

const create_faq_of_product = Joi.object({
  product_id: Joi.number().integer().required(),
  faq_heading: Joi.string().allow(null),
  faq_content: Joi.string().allow(null),
});

// const create_faq_of_product_admin = Joi.object({
//   // product_id: Joi.number().integer().required(),
//   // faq_heading: Joi.string().allow(null),
//   // faq_content: Joi.string().allow(null),
//   faqs: Joi.string().required(),
// });

const create_faq_of_product_admin = Joi.object({
  faqs: Joi.string()
    .custom((value, helpers) => {
      try {
        // Parse the stringified JSON
        const parsed = JSON.parse(value);

        // Validate if it's an array
        if (!Array.isArray(parsed)) {
          return helpers.error("any.invalid");
        }

        // Create a schema for each object in the array
        const schema = Joi.array().items(
          Joi.object({
            product_id: Joi.number().integer().required(),
            faq_heading: Joi.string().allow(null),
            faq_content: Joi.string().allow(null),
          })
        );

        // Validate the parsed array
        const { error } = schema.validate(parsed);
        if (error) {
          return helpers.error("any.invalid");
        }

        // Return the parsed value if it's valid
        return value;
      } catch (e) {
        return helpers.error("any.invalid");
      }
    })
    .required(),
});

const fetch_faq_query = Joi.object({
  type: Joi.string().valid("question"),
});

module.exports = {
  fetch_faq_of_product,
  create_faq_of_product,
  create_faq_of_product_admin,
  fetch_faq_query,
};
