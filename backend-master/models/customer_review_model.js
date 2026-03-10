const { Model, ENUM } = require("sequelize"); // Correctly destructure DataTypes from Sequelize
const {
  sequelize,
  dataTypes: {
    model_data_types: { INTEGER, TEXT, DATETIME, STRING },
  },
} = require("../config");

const CustomerModel = require("./customers");
const Products = require("./product_model");
const CustomerReviewImage = require("./customer_review_image_model");
const DealerModel = require("./dealers");

class CustomerReview extends Model {}

CustomerReview.init(
  {
    id: {
      type: INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    product_id: {
      type: INTEGER,
      allowNull: false,
    },
    user_id: {
      type: INTEGER,
      allowNull: false,
    },
    review_heading: {
      type: STRING,
      allowNull: true,
    },
    review_text: {
      type: TEXT,
      allowNull: true,
    },
    rating: {
      type: INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
      },
    },
    status: {
      type: ENUM("pending", "approved", "declined"),
      allowNull: false,
      defaultValue: "pending",
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
    modelName: "CustomerReview",
    paranoid: true,
    tableName: "customer_review",
  }
);

CustomerReview.belongsTo(CustomerModel, {
  foreignKey: "user_id",
  targetKey: "id",
  as: "customer",
});

CustomerReview.belongsTo(DealerModel, {
  foreignKey: "user_id",
  targetKey: "id",
  as: "dealer",
});

CustomerReview.belongsTo(Products, {
  foreignKey: "product_id",
  targetKey: "id",
});

Products.hasMany(CustomerReview, {
  foreignKey: "product_id",
  targetKey: "id",
});

CustomerReview.hasMany(CustomerReviewImage, {
  foreignKey: "review_id",
  sourceKey: "id",
});

CustomerReviewImage.belongsTo(CustomerReview, {
  foreignKey: "review_id",
  targetKey: "id",
});

module.exports = CustomerReview;
