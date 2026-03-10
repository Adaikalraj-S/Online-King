const { Model } = require("sequelize");
const {
  sequelize,
  databases: { product_attributes_associations },
  dataTypes: {
    model_data_types: { INTEGER, STRING, DATETIME, BOOLEAN, DOUBLE },
  },
} = require("../config");

const Products = require("./product_model");

class Combinations extends Model {}

Combinations.init(
  {
    id: {
      type: INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    combination: {
      type: STRING,
      allowNull: false,
    },
    price: {
      type: DOUBLE,
      allowNull: false,
    },
    stock: {
      type: INTEGER,
      allowNull: false,
    },
    pre_order_stock: {
      type: INTEGER,
      allowNull: false,
    },
    pre_order_limit: {
      type: STRING,
      allowNull: true,
    },
    product_id: {
      type: INTEGER,
      allowNull: false,
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
    modelName: product_attributes_associations, // We need to choose the model name
  }
);

Products.hasMany(Combinations, { foreignKey: "product_id" });

Combinations.belongsTo(Products, { foreignKey: "product_id" });

module.exports = Combinations;
