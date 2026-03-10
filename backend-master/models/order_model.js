const { Model, DOUBLE } = require("sequelize");
const {
  sequelize,
  databases: { orders },
  dataTypes: {
    model_data_types: { INTEGER, STRING, DATETIME, BOOLEAN },
  },
} = require("../config");
const AddressModel = require("./address_model");
const Customers = require("./customers");
const Categories = require("./categories");
const OrderDetails = require("./order_details_model");
const DeliveryTypes = require("./delivery_type_model");
const OrderStatuses = require("./order_status");

class Orders extends Model {}

Orders.init(
  {
    id: {
      type: INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    order_id: {
      type: STRING,
      allowNull: true,
    },
    pre_order: {
      type: BOOLEAN,
      allowNull: false,
    },
    user_id: {
      type: INTEGER,
      allowNull: true,
    },
    user_type: {
      type: STRING,
      allowNull: true,
    },
    dealer_id: {
      type: INTEGER,
      allowNull: true,
    },
    user_address_id: {
      type: INTEGER,
      allowNull: true,
    },
    is_billing_same_as_shipping: {
        type: BOOLEAN,
        allowNull: false,
    },
    billing_address_id: {
        type: INTEGER,
        allowNull: true,
    },
    delivery_type_id: {
      type: INTEGER,
      allowNull: true,
    },
    order_status_id: {
      type: INTEGER,
      allowNull: true,
    },
    order_date: {
      type: DATETIME,
      allowNull: true,
    },
    order_accepted_date: {
      type: DATETIME,
      allowNull: true,
    },
    accepted: {
      type: BOOLEAN,
      allowNull: true,
    },
    rejected_reason: {
      type: STRING,
      allowNull: true,
    },
    payment_via: {
      type: STRING,
      allowNull: true,
    },
    payment_ref_id: {
      type: STRING,
      allowNull: true,
    },
    payment_order_id: {
      type: STRING,
      allowNull: true,
    },
    payment_signature: {
      type: STRING,
      allowNull: true,
    },
    shipping_link: {
      type: STRING,
      allowNull: true,
    },
    shipping_id: {
      type: INTEGER,
      allowNull: true,
    },
    coupon_id: {
      type: INTEGER,
      allowNull: true,
    },
    total_discount_amount: {
      type: DOUBLE,
      allowNull: true,
    },
    total_paid_amount: {
      type: DOUBLE,
      allowNull: true,
    },
    total_gst_amount: {
      type: DOUBLE,
      allowNull: true,
    },
    total_shipping_amount: {
      type: DOUBLE,
      allowNull: true,
    },
    total_product_amount: {
      type: DOUBLE,
      allowNull: true,
    },
    createdAt: {
      type: DATETIME,
      allowNull: true,
    },
    updatedAt: {
      type: DATETIME,
      allowNull: true,
    },
    deletedAt: {
      type: DATETIME,
      allowNull: true,
    },
  },
  {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    paranoid: true,
    modelName: orders, // We need to choose the model name
  }
);

AddressModel.hasMany(Orders, {
  foreignKey: "user_address_id",
  as: "shipping_address",
});

Orders.belongsTo(AddressModel, {
  foreignKey: "user_address_id",
  as: "shipping_address",
});
AddressModel.hasMany(Orders, {
  foreignKey: "billing_address_id",
  as: "billing_address",
});

Orders.belongsTo(AddressModel, {
  foreignKey: "billing_address_id",
  as: "billing_address",
});

Customers.hasMany(Orders, {
  foreignKey: "user_id",
});

Orders.belongsTo(Customers, {
  foreignKey: "user_id",
});

Orders.hasMany(OrderDetails, {
  foreignKey: "order_id",
});

OrderDetails.belongsTo(Orders, {
  foreignKey: "order_id",
});

Orders.belongsTo(DeliveryTypes, {
  foreignKey: "delivery_type_id",
});

DeliveryTypes.hasMany(Orders, {
  foreignKey: "delivery_type_id",
});

Orders.belongsTo(OrderStatuses, {
  foreignKey: "order_status_id",
  as: "order_status",
});

module.exports = Orders;
