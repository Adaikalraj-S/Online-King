const tags = ["api", "PhonePe Setup"];

const {
  product_attributes_controlllers,
  installers_controllers,
  stories_controllers,
  shiprocket_controllers,
  phonepe_controllers,
} = require("../controllers");

const {
  usersValidation,
  headerValidator,
  productAttributesValidators,
  InstallersValidator,
  StoriesValidator,
  ShiprocketValidators,
  PhonePeValidators,
} = require("../validators");

const phonepe_routes = [
  {
    method: "POST",
    path: "/payment",
    options: {
      description: "Handle Payment in phonepe.",
      validate: {
        // headers: headerValidator,
        payload: PhonePeValidators.phonePayValidator,
      },
      tags,
      handler: phonepe_controllers.handlePhonePePayment,
    },
  },

  {
    method: "POST",
    path: "/payment-status",
    options: {
      description: "Checking the phonepe status",
      validate: {
        // headers: headerValidator,
        payload: PhonePeValidators.paymentStatusValidators,
      },
      tags,
      handler: phonepe_controllers.checkStatus,
    },
  },

  {
    method: "POST",
    path: "/phonepe-server-callback",
    options: {
      description: "Server to server response from PhonePe",
      // validate: {
      //   headers: PhonePeValidators.phonePayHeaderValidator,
      //   payload: PhonePeValidators.serverCallbackPayload, // Expecting a base64 encoded string in the payload
      // },
      tags,
      handler: phonepe_controllers.handlePhonePeServerCallback,
    },
  },
];

module.exports = phonepe_routes;
