const Joi = require("joi");

const fetch_product_review_query = Joi.object({
  productId: Joi.number()
    .integer()
    .required()
    .description("The ID of the product"),
});

// const add_product_review_payload = Joi.object({
//   productId: Joi.number()
//     .integer()
//     .allow(null)
//     .description("The ID of the product"),
//   reviewHeading: Joi.string()
//     .max(100)
//     .optional()
//     .description("The headline of the review (up to 100 characters)"),
//   reviewText: Joi.string()
//     .max(1000)
//     .optional()
//     .description("The review content for the product (up to 1000 characters)"),
//   rating: Joi.number()
//     .integer()
//     .min(1)
//     .max(5)
//     .description("The rating of the product (from 1 to 5)"),
//   image_count: Joi.number()
//     .integer()
//     .description("The number of images attached to the review"),
//   // photo: Joi.string().optional().description('A photo associated with the review')
// }).unknown();

const add_product_review_payload = Joi.object({
  productId: Joi.number()
    .integer()
    .required()
    .description("The ID of the product"),
  reviewHeading: Joi.string()
    .max(100)
    .optional()
    .description("The headline of the review (up to 100 characters)"),
  reviewText: Joi.string()
    .max(1000)
    .optional()
    .description("The review content for the product (up to 1000 characters)"),
  rating: Joi.number()
    .integer()
    .min(1)
    .max(5)
    .required()
    .description("The rating of the product (from 1 to 5)"),
  image_count: Joi.number()
    .integer()
    .required()
    .description("The number of images attached to the review"),
  // photo: Joi.string().optional().description('A photo associated with the review')
}).unknown();

const accept_product_review_admin_payload = Joi.object({
  reviewId: Joi.number()
    .integer()
    .required()
    .description("The ID of the review to accept"),
});

const decline_product_review_admin_payload = Joi.object({
  reviewId: Joi.number()
    .integer()
    .required()
    .description("The ID of the review to delete"),
});

const check_review_status_query = Joi.object({
  productId: Joi.number()
    .integer()
    .required()
    .description("The ID of the product"),
});
// const check_review_status_query = Joi.object({
//     productId: Joi.alternatives().try(Joi.number().integer(), Joi.string()).required().description('The ID of the product'),
// });

module.exports = {
  fetch_product_review_query,
  add_product_review_payload,
  accept_product_review_admin_payload,
  decline_product_review_admin_payload,
  check_review_status_query,
};
