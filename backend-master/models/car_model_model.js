const { Model } = require("sequelize");
const {
    sequelize,
    databases: { car_models },
    dataTypes: {
        model_data_types: { INTEGER, STRING, DATETIME, BOOLEAN },
    },
} = require("../config");
const CarBrands = require("./car_brands_model");

// const CarBrands = require("./car_brands_model");

class CarModel extends Model {}

CarModel.init(
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
    status: {
      type: BOOLEAN,
      allowNull: true,
    },
    image_url: {
      type: STRING,
      allowNull: true,
    },
    model_name: {
      type: STRING,
      allowNull: true,
    },
    start_year: {
      type: STRING,
      allowNull: true,
    },
    end_year: {
      type: STRING,
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
    modelName: car_models, // We need to choose the model name
  }
);

CarModel.belongsTo(CarBrands, {
  foreignKey: "brand_id",
  as: "car_brand",
});

// CarBrands.belongsTo(CarModel, {
//   foreignKey: "model_id",
//   as: "car_model",
// });

module.exports = CarModel;
