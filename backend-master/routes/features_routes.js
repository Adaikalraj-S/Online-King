const { features_validators, headerValidator } = require("../validators");
const { features_controller } = require("../controllers");

const tags = ["api", "Features CRUD"];

const features_routes = [
  {
    method: "GET",
    path: "/fetch-features",
    options: {
      description: "create feature for product",
      tags,
      validate: {
        //headers: headerValidator,
        query: features_validators.getFeatureQuery,
      },
      handler: features_controller.getFeatures,
    },
  },
  {
    method: "POST",
    path: "/create-products-features",
    options: {
      description: "create feature for product",
      tags,
      payload: {
        maxBytes: 20 * 1024 * 1024,
        output: "file",
        parse: true,
        multipart: true, // <-- this fixed the media type error
      },
      validate: {
        headers: headerValidator,
        payload: features_validators.createFeatureValidator,
      },
      handler: features_controller.createFeatures,
    },
  },
  {
    method: "POST",
    path: "/edit-products-features",
    options: {
      description: "Edit features of products",
      tags,
      payload: {
        maxBytes: 20 * 1024 * 1024,
        output: "file",
        parse: true,
        multipart: true, // <-- this fixed the media type error
      },
      validate: {
        headers: headerValidator,
        payload: features_validators.updateFeatureValidator,
      },
      handler: features_controller.editFeatures,
    },
  },
  {
    method: "POST",
    path: "/delete-products-features",
    options: {
      description: "Delete Feature.",
      tags,
      validate: {
        headers: headerValidator,
        payload: features_validators.deleteFeatureValidator,
      },
      handler: features_controller.deleteFeatures,
    },
  },
  {
    method: "POST",
    path: "/toggle-status-products-features",
    options: {
      description: "Change the status of feature.",
      tags,
      validate: {
        headers: headerValidator,
        payload: features_validators.toggelFeatureStatusValidator,
      },
      handler: features_controller.toggleFeaturesStatus,
    },
  },
];

module.exports = features_routes;
