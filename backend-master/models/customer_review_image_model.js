const { Model } = require("sequelize");
const {
  sequelize,
  dataTypes: {
    model_data_types: { INTEGER, STRING, DATETIME },
  },
} = require("../config");

class CustomerReviewImage extends Model {}

CustomerReviewImage.init(
  {
    id: {
      type: INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    review_id: {
      type: INTEGER,
      allowNull: false,
    },
    image_url: {
      type: STRING,
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
    sequelize,
    modelName: "CustomerReviewImage",
    paranoid: true,
    tableName: "customer_review_images",
  }
);

// Associations for CustomerReviewImage are defined in customer_review_model.js

module.exports = CustomerReviewImage;
