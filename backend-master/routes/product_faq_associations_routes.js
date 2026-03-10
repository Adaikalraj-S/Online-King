const tags = ["api", "Faq Service"];

const {
  product_attributes_controlllers,
  installers_controllers,
  stories_controllers,
  shiprocket_controllers,
  phonepe_controllers,
  product_faq_controller,
} = require("../controllers");

const {
  usersValidation,
  headerValidator,
  productAttributesValidators,
  InstallersValidator,
  StoriesValidator,
  ShiprocketValidators,
  PhonePeValidators,
  productFaqValidators,
} = require("../validators");

const product_faq_routes = [
  {
    method: "GET",
    path: "/get-product-faq-admin",
    options: {
      description: "Fetch the product Faq Admin",
      validate: {
        query: productFaqValidators.fetch_faq_query,
        headers: headerValidator,
      },
      tags,
      handler: product_faq_controller.fetchFaqProductAdmin,
    },
  },

  {
    method: "GET",
    path: "/get-product-faq",
    options: {
      description: "Fetch the product Faq Admin",
      validate: {
        // headers: headerValidator,
        query: productFaqValidators.fetch_faq_of_product,
      },
      tags,
      handler: product_faq_controller.fetchFaqProductCustomer,
    },
  },

  {
    method: "POST",
    path: "/create-product-faq",
    options: {
      description: "Fetch the product Faq Admin",
      validate: {
        headers: headerValidator,
        payload: productFaqValidators.create_faq_of_product,
      },
      tags,
      handler: product_faq_controller.addFaqProduct,
    },
  },
  {
    method: "POST",
    path: "/create-product-faq-admin",
    options: {
      description: "Create the product Faq Admin",
      validate: {
        headers: headerValidator,
        payload: productFaqValidators.create_faq_of_product_admin,
      },
      tags,
      handler: product_faq_controller.addFaqProductAdmin,
    },
  },
];

module.exports = product_faq_routes;
