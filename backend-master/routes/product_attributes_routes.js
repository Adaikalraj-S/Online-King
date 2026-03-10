const tags = ["api", "Attributes"];

const { product_attributes_controlllers } = require("../controllers");

const {
  usersValidation,
  headerValidator,
  productAttributesValidators,
} = require("../validators");

const product_attributes_routes = [
  {
    method: "GET",
    path: "/fetch-all-attributes",
    options: {
      description: "Fetch all Categories.",
      validate: {
        //headers: headerValidator,
        query: productAttributesValidators.fetch_all_attributes_validator,
      },
      tags,
      handler: product_attributes_controlllers.getAttributes,
    },
  },
  {
    method: "GET",
    path: "/fetch-all-attributes-combination",
    options: {
      description: "Fetch all Product Attributes Combination.",
      validate: {
        //headers: headerValidator,
        //query: productAttributesValidators.fetch_all_attributes_validator,
      },
      tags,
      handler: product_attributes_controlllers.getProductAttributesCombination,
    },
  },
  {
    method: "POST",
    path: "/add-attributes",
    options: {
      description: "Add New Attributes.",
      validate: {
        headers: headerValidator,
        payload: productAttributesValidators.add_attributes_validator,
      },
      tags,
      handler: product_attributes_controlllers.addAttributes,
    },
  },
  {
    method: "POST",
    path: "/edit-attributes",
    options: {
      description: "Edit Attributes.",
      validate: {
        headers: headerValidator,
        payload: productAttributesValidators.updateAttributesValidator,
      },
      tags,
      handler: product_attributes_controlllers.editAttributes,
    },
  },
  {
    method: "POST",
    path: "/delete-attributes",
    options: {
      description: "Delete Attributes.",
      validate: {
        headers: headerValidator,
        query: productAttributesValidators.deleteAttributesValidator,
      },
      tags,
      handler: product_attributes_controlllers.deleteAttribute,
    },
  },
  {
    method: "POST",
    path: "/update-attribute-status",
    options: {
      description: "Status change Attributes.",
      validate: {
        headers: headerValidator,
        query: productAttributesValidators.statusChangeAttributesValidator,
      },
      tags,
      handler: product_attributes_controlllers.toggleAttributeStatus,
    },
  },
];

module.exports = product_attributes_routes;
