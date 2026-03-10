const Joi = require("joi");

//validatate query for fetching feature

const getFeatureQuery = Joi.object({
  id: Joi.alternatives()
    .try(
      Joi.string(), // For a single ID passed as a string
      Joi.array().items(Joi.string()) // For an array of IDs passed as strings
    )
    .optional(),
  product_id: Joi.alternatives()
    .try(
      Joi.string(), // For a single product_id passed as a string
      Joi.array().items(Joi.string()) // For an array of product_ids passed as strings
    )
    .optional(),
  status: Joi.boolean().optional(), // If you want to validate the status as well
});

// Validation for creating a new feature
const createFeatureValidator = Joi.object({
  feature_name: Joi.string().max(255).required().messages({
    "string.base": "Feature name must be a string.",
    "string.empty": "Feature name cannot be empty.",
    "string.max": "Feature name must be less than or equal to 255 characters.",
    "any.required": "Feature name is required.",
  }),

  feature_description: Joi.string().allow(null, "").messages({
    "string.base": "Features description must be a string.",
  }),

  image: Joi.any().allow(""),

  // product_id: Joi.number().integer().allow(null).messages({
  //   "number.base": "Product ID must be a number.",
  //   "number.integer": "Product ID must be an integer.",
  // }),
});

// Validation for updating an existing feature
const updateFeatureValidator = Joi.object({
  //   id: Joi.number().integer().required().message({
  //     "number.base": " ID must be a number.",
  //     "number.integer": "ID must be an integer.",
  //   }),
  id: Joi.number().integer().required(),

  feature_name: Joi.string().max(255).messages({
    "string.base": "Feature name must be a string.",
    "string.max": "Feature name must be less than or equal to 255 characters.",
  }),

  feature_description: Joi.string().allow(null, "").messages({
    "string.base": "Features description must be a string.",
  }),

  image: Joi.any().allow(""),

  // product_id: Joi.number().integer().allow(null).messages({
  //   "number.base": "Product ID must be a number.",
  //   "number.integer": "Product ID must be an integer.",
  // }),
});

// Validation for deleting a feature
const deleteFeatureValidator = Joi.object({
  feature_id: Joi.number().integer().required().messages({
    "number.base": "feature ID must be a number.",
    "number.integer": "feature ID must be an integer.",
    "any.required": "feature ID is required for deletion.",
  }),
});

const toggelFeatureStatusValidator = Joi.object({
  feature_id: Joi.number().integer().required().messages({
    "number.base": "feature ID must be a number.",
    "number.integer": "feature ID must be an integer.",
    "any.required": "feature ID is required for deletion.",
  }),
});

module.exports = {
  createFeatureValidator,
  updateFeatureValidator,
  deleteFeatureValidator,
  toggelFeatureStatusValidator,
  getFeatureQuery,
};
