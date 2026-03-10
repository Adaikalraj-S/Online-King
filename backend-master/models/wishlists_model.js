const { Model } = require("sequelize");
const {
    sequelize,
    databases: { wishlists },
    dataTypes: {
        model_data_types: { INTEGER, STRING, DATETIME, BOOLEAN },
    },
} = require("../config");
const Products = require("./product_model");
const Users = require("./users");
const CustomerModel = require("./customers");

// const CarBrands = require("./car_brands_model");

class Wishlists extends Model {}

Wishlists.init(
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
    modelName: wishlists, // We need to choose the model name
  }
);

// CarModel.belongsTo(CarBrands, { foreignKey: 'brand_id', as: 'carbrand' }); 

Wishlists.belongsTo(Products, { foreignKey: 'product_id' });

module.exports = Wishlists;
