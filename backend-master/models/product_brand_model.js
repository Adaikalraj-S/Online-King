const { Model } = require("sequelize");
const {
    sequelize,
    databases: { product_brands },
    dataTypes: {
        model_data_types: { INTEGER, STRING, DATETIME, BOOLEAN },
    },
} = require("../config");


class ProductBrand extends Model {}

ProductBrand.init(
  {
    id: {
      type: INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    brand_name: {
      type: STRING,
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
    modelName: product_brands, // We need to choose the model name
  }
);

module.exports = ProductBrand;
