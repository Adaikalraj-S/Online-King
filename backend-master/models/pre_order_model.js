const { Model, BOOLEAN } = require("sequelize");
const {
  sequelize,
  dataTypes: {
    model_data_types: { INTEGER, DATETIME },
  },
} = require("../config");
const Users = require("./users");
const Products = require("./product_model");
const Combinations = require("./product_comination_model");

class PreOrder extends Model {}

PreOrder.init(
  {
    id: {
      type: INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: INTEGER,
      allowNull: false,
    },
    product_id: {
      type: INTEGER,
      allowNull: false,
    },
    combination_id: {
      type: INTEGER,
      allowNull: true,
    },
    quantity: {
      type: INTEGER,
      allowNull: false,
    },
    pre_order_status: {
      type: BOOLEAN,
      allowNull: false,
    },
    createdAt: {
      type: DATETIME,
      allowNull: false,
      //defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
    },
    updatedAt: {
      type: DATETIME,
      allowNull: false,
      //   defaultValue: sequelize.literal(
      //     "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
      //   ),
    },
    deletedAt: {
      type: DATETIME,
      allowNull: true,
    },
  },
  {
    sequelize, // We need to pass the connection instance
    paranoid: true, // Enables soft deletes
    modelName: "pre_order", // The model name
  }
);

// Associations
PreOrder.belongsTo(Users, { foreignKey: "user_id" });
PreOrder.belongsTo(Products, { foreignKey: "product_id" });
PreOrder.belongsTo(Combinations, { foreignKey: "combination_id" });

module.exports = PreOrder;
