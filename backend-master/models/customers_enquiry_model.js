const { Model } = require("sequelize");
const {
  sequelize,
  databases: { customers_enquiries },
  dataTypes: {
    model_data_types: { INTEGER, STRING, TEXT, DATETIME },
  },
} = require("../config");

class CustomerEnquiryModel extends Model {}

CustomerEnquiryModel.init(
  {
    id: {
      type: INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: STRING,
      allowNull: false,
    },
    mobile: {
      type: STRING(10), // Supports international phone formats
      allowNull: false,
    },
    email: {
      type: STRING,
      allowNull: false,
    },
    subject: {
      type: STRING,
      allowNull: true, // Optional field
    },
    message: {
      type: TEXT,
      allowNull: false,
    },
    createdAt: {
      type: DATETIME,
      allowNull: false,
    },
    updatedAt: {
      type: DATETIME,
      allowNull: false,
    },
    deletedAt: {
      type: DATETIME,
      allowNull: true,
    },
  },
  {
    sequelize, // Connection instance
    paranoid: true, // Enables soft deletion
    modelName: customers_enquiries, // Table name
  }
);

module.exports = CustomerEnquiryModel;
