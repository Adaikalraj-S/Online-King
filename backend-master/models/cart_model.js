const { Model } = require("sequelize");
const {
  sequelize,
  databases: { carts },
  dataTypes: {
    model_data_types: { INTEGER, STRING, DATETIME, BOOLEAN },
  },
} = require("../config");
const Products = require("./product_model");
const Combinations = require("./product_comination_model");

// const CarBrands = require("./car_brands_model");

class Carts extends Model {}

Carts.init(
  {
    id: {
      type: INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: INTEGER,
      allowNull: true,
    },
    dealer_id: {
      type: INTEGER,
      allowNull: true,
    },
    product_id: {
      type: INTEGER,
      allowNull: true,
    },
    combination_id: {
      type: INTEGER,
      allowNull: true,
    },
    quantity: {
      type: INTEGER,
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
    modelName: carts, // We need to choose the model name
  }
);

// CarModel.belongsTo(CarBrands, { foreignKey: 'brand_id', as: 'carbrand' });

Carts.belongsTo(Products, { foreignKey: "product_id" });
Carts.belongsTo(Combinations, { foreignKey: "combination_id" });



module.exports = Carts;
