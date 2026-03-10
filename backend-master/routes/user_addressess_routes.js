const tags = ["api", "User Address"];

const {
  category_controllers,
  carts_controllers,
  user_address_controllers,
} = require("../controllers");

const {
  categoriesValidators,
  usersValidation,
  headerValidator,
  CartValidators,
  usersAddressValidation,
} = require("../validators");

const user_address_routes = [
  {
    method: "GET",
    path: "/get-all-addresses",
    options: {
      description: "Fetch all Address for Customer.",
      validate: {
        headers: headerValidator,
        query: usersAddressValidation.fetchAllAddress,
      },
      tags,
      handler: user_address_controllers.getAllShippingAddress,
    },
  },

  {
    method: "GET",
    path: "/get-all-billing-addresses",
    options: {
      description: "Fetch all Address for Customer.",
      validate: {
        headers: headerValidator,
        query: usersAddressValidation.fetchAllAddress,
      },
      tags,
      handler: user_address_controllers.getAllBillingAddress,
    },
  },

  {
    method: "POST",
    path: "/add-addresses",
    options: {
      description: "Add Address for Customer.",
      validate: {
        //headers: headerValidator,
        payload: usersAddressValidation.add_address_payload,
      },
      tags,
      handler: user_address_controllers.addAddressForCustomer,
    },
  },

  {
    method: "POST",
    path: "/delete-addresses",
    options: {
      description: "Delete Address for Customer.",
      validate: {
        headers: headerValidator,
        // payload: usersAddressValidation.add_address_payload
      },
      tags,
      handler: user_address_controllers.deleteAddress,
    },
  },
  {
    method: "POST",
    path: "/edit-addresses",
    options: {
      description: "Edit Address for Customer.",
      validate: {
        headers: headerValidator, // Optional if token validation is needed
        payload: usersAddressValidation.edit_address_payload, // Ensure payload validation schema includes 'address_id'
      },
      tags,
      handler: user_address_controllers.editAddressForCustomer, // Connects to the edit controller
    },
  }
];

module.exports = user_address_routes;
