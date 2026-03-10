const { Model } = require("sequelize");
const {
    sequelize,
    databases: { car_lists },
    dataTypes: {
        model_data_types: { INTEGER, STRING, DATETIME, BOOLEAN },
    },
} = require("../config");
const CarBrands = require("./car_brands_model");
const CarModel = require("./car_model_model");


class CarLists extends Model {}

CarLists.init(
  {
    id: {
      type: INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    brand_id: {
      type: INTEGER,
      allowNull: true,
    },
    model_id: {
      type: INTEGER,
      allowNull: true,
    },
    status: {
      type: BOOLEAN,
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
    modelName: car_lists, // We need to choose the model name
  }
);

CarLists.belongsTo(CarBrands, {
    foreignKey: "brand_id",
    as: "car_brand",
});

CarLists.belongsTo(CarModel, {
    foreignKey: "model_id",
    as: "car_model",
});

module.exports = CarLists;
