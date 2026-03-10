const tags = ["api", "Pre Order"];

const {
  category_controllers,
  pre_order_controller,
} = require("../controllers");

const {
  categoriesValidators,
  usersValidation,
  headerValidator,
  CartValidators,
} = require("../validators");

const carts_routes = [
  {
    method: "GET",
    path: "/get-pre-order-carts",
    options: {
      description: "Fetch all Pre order Carts Items.",
      validate: {
        headers: headerValidator,
      },
      tags,
      handler: pre_order_controller.getPreOrderCart,
    },
  },
  {
    method: "POST",
    path: "/add-to-pre-order",
    options: {
      description: "Add to Pre Order for customers",
      validate: {
        headers: headerValidator,
        payload: CartValidators.add_to_cart_payload,
      },
      tags,
      handler: pre_order_controller.addToPreOrder,
    },
  },

  {
    method: "POST",
    path: "/pre-order-cart-increament",
    options: {
      description: "Increament for procuct in Pre order cart for customers",
      validate: {
        headers: headerValidator,
        payload: CartValidators.handle_increament_payload,
      },
      tags,
      handler: pre_order_controller.handleIncrement,
    },
  },

  {
    method: "POST",
    path: "/pre-order-cart-decreament",
    options: {
      description: "Decreament for procuct in pre order cart for customers",
      validate: {
        headers: headerValidator,
        payload: CartValidators.handle_decrement_payload,
      },
      tags,
      handler: pre_order_controller.handleDecrement,
    },
  },

  {
    method: "POST",
    path: "/remove-from-pre-order-cart",
    options: {
      description: "Remove product from cart for customers",
      validate: {
        headers: headerValidator,
        payload: CartValidators.remove_from_cart_payload,
      },
      tags,
      handler: pre_order_controller.removeFromPreOrderCart,
    },
  },
];

module.exports = carts_routes;
