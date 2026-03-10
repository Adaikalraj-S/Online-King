const tags = ["api", "Products"];

const { category_controllers, product_controllers } = require("../controllers");

const {
  productValidators,
  usersValidation,
  headerValidator,
} = require("../validators");

const product_routes = [
  {
    method: "GET",
    path: "/get-products",
    options: {
      description:
        "Get all products according to car brand, product name, category.",
      validate: {
        headers: headerValidator,
        query: productValidators.fetch_all_product,
      },
      tags,
      handler: product_controllers.fetchProducts,
    },
  },

  {
    method: "GET",
    path: "/get-products-customer",
    options: {
      description:
        "Get all products according to car brand, product name, category for customers.",
      validate: {
        query: productValidators.fetch_all_product,
      },
      tags,
      handler: product_controllers.fetchProductCustomer,
    },
  },

  {
    method: "POST",
    path: "/add-products",
    options: {
      description: "Add products ",
      payload: {
        maxBytes: 100 * 1024 * 1024,
        output: "file",
        parse: true,
        multipart: true,
      },
      validate: {
        headers: headerValidator,
        payload: productValidators.addProductValidation,
      },
      tags,
      handler: product_controllers.addProduct,
    },
  },

  {
    method: "POST",
    path: "/edit-product",
    options: {
      description: "Edit products",
      payload: {
        maxBytes: 20 * 1024 * 1024,
        output: "file",
        parse: true,
        multipart: true, // <-- this fixed the media type error
      },
      validate: {
        headers: headerValidator,
        payload: productValidators.editProductValidation,
      },
      tags,
      handler: product_controllers.editProduct,
    },
  },

  {
    method: "POST",
    path: "/add-bulk-product",
    options: {
      description: "Upload Bulk products for admin.",
      validate: {
        headers: headerValidator,
        payload: productValidators.csvDataSchema,
      },
      tags,
      handler: product_controllers.addBulkProduct,
    },
  },
  {
    method: "POST",
    path: "/upload-images",
    options: {
      description: "Upload images to the server",
      validate: {
        headers: headerValidator,
      },
      payload: {
        output: "stream",
        parse: true,
        allow: "multipart/form-data",
        maxBytes: 104857600, // 100MB maximum payload size
        multipart: true,
      },
      handler: product_controllers.uploadImagesHandler,
    },
  },
  {
    method: "POST",
    path: "/delete-product",
    options: {
      description: "Delete product",
      validate: {
        headers: headerValidator,
        query: productValidators.delete_product_validator,
      },
      tags,
      handler: product_controllers.deleteProduct,
    },
  },

  {
    method: "POST",
    path: "/status-change-product",
    options: {
      description: "change status product",
      validate: {
        headers: headerValidator,
        payload: productValidators.change_status_product_validator,
      },
      tags,
      handler: product_controllers.toggleProductStatus,
    },
  },
  {
    method: "GET",
    path: "/fetch-product-by-status",
    options: {
      description: "change status product",
      validate: {
        // headers: headerValidator,
        query: productValidators.fetch_products_status_validator,
      },
      tags,
      handler: product_controllers.fetchProductsByStatus,
    },
  },

  {
    method: "GET",
    path: "/fetch-recommended-products",
    options: {
      description: "Recommended products",
      validate: {
        // headers: headerValidator,
        query: productValidators.fetch_product,
      },
      tags,
      handler: product_controllers.fetchRecommendedProducts,
    },
  },
];

module.exports = product_routes;
