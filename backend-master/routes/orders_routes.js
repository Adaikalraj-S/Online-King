const tags = ["api", "Orders"];

const {
  category_controllers,
  car_brands_controllers,
  orders_controllers,
} = require("../controllers");

const {
  categoriesValidators,
  usersValidation,
  headerValidator,
  carBrandsValidators,
  ordersValidator,
} = require("../validators");

const order_routes = [
  {
    method: "GET",
    path: "/fetch-orders-admin",
    options: {
      description: "Fetch all Orders for Admins.",
      validate: {
        headers: headerValidator,
      },
      tags,
      handler: orders_controllers.getAllOrdersAdmin,
    },
  },

  {
    method: "GET",
    path: "/fetch-orders",
    options: {
      description: "Fetch all Orders for Customers.",
      validate: {
        headers: headerValidator,
      },
      tags,
      handler: orders_controllers.getOrderForCustomer,
    },
  },

  {
    method: "POST",
    path: "/place-order",
    options: {
      description: "Place Order for customers.",
      validate: {
        headers: headerValidator,
        payload: ordersValidator.createOrderSchema,
      },
      tags,
      handler: orders_controllers.createOrder,
    },
  },

  {
    method: "POST",
    path: "/approve-order",
    options: {
      description: "Approve order for Admin.",
      validate: {
        payload: ordersValidator.approveOrderValidator,
      },
      tags,
      handler: orders_controllers.approveOrderByAdmin,
    },
  },

  {
    method: "POST",
    path: "/cancel-order-by-admin",
    options: {
      description: "Cancel order for Admin.",
      validate: {
        payload: ordersValidator.cancelOrderByAdmin,
      },
      tags,
      handler: orders_controllers.cancelOrderByAdmin,
    },
  },

  {
    method: "GET",
    path: "/get-all-status",
    options: {
      description: "Fetch All status.",
      tags,
      handler: orders_controllers.getAllOrderStatuses,
    },
  },

  {
    method: "POST",
    path: "/order-status-update",
    options: {
      description: "Order Status for Admin.",
      validate: {
        payload: ordersValidator.updateOrderStatusValidator,
      },
      tags,
      handler: orders_controllers.updateOrderStatus,
    },
  },
  {
    method: "POST",
    path: "/download-invoice",
    options: {
      description: "Download invoice for order.",
      validate: {
        headers: headerValidator,
        payload: ordersValidator.invoice_payload,
      },
      tags,
      handler: orders_controllers.downloadOrderInvoice,
    },
  },
];

module.exports = order_routes;
