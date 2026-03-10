const tags = ["api", "Customer-Review"];

const { product_review_controllers } = require("../controllers");
const { productReviewValidator, headerValidator } = require("../validators");

const product_reviews_routes = [
  {
    method: "GET",
    path: "/get-reviews-by-customer-on-products",
    options: {
      description: "Getting all the reviews by customer on product.",
      tags,
      validate: {
        query: productReviewValidator.check_review_status_query,
      },
      handler: product_review_controllers.fetchProductReviewsByCustomer,
    },
  },
  {
    method: "GET",
    path: "/get-reviews-by-admin-on-products",
    options: {
      description: "Getting all the reviews by customer on product.",
      tags,
      handler: product_review_controllers.fetchProductReviewsByAdmin,
    },
  },
  {
    method: "POST",
    path: "/add-product-review",
    options: {
      description: "Adding product review.",
      payload: {
        maxBytes: 100 * 1024 * 1024,
        output: "file",
        parse: true,
        multipart: true,
      },
      tags,
      validate: {
        headers: headerValidator,
        payload: productReviewValidator.add_product_review_payload,
      },
      handler: product_review_controllers.addProductsReviewByCustomer,
    },
  },
  {
    method: "POST",
    path: "/accept-review-admin",
    options: {
      description: "Accepting a review only for admin.",
      tags,
      validate: {
        headers: headerValidator,
        payload: productReviewValidator.accept_product_review_admin_payload,
      },
      handler: product_review_controllers.acceptProductReviewByAdmin,
    },
  },
  {
    method: "POST",
    path: "/decline-review-admin",
    options: {
      description: "Decline any review only for admin.",
      tags,
      validate: {
        headers: headerValidator,
        payload: productReviewValidator.decline_product_review_admin_payload,
      },
      handler: product_review_controllers.declineProductReviewByAdmin,
    },
  },
  {
    method: "GET",
    path: "/check-review-status",
    options: {
      description: "Checking the status of a review for a product.",
      tags,
      validate: {
        headers: headerValidator,
        query: productReviewValidator.check_review_status_query,
      },
      handler: product_review_controllers.checkReviewStatus,
    },
  },
];

module.exports = product_reviews_routes;
