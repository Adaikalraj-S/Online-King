const { Model } = require("sequelize");
const {
  sequelize,
  databases: { customers },
  dataTypes: {
    model_data_types: { INTEGER, STRING, DATETIME, BOOLEAN },
  },
} = require("../config");

class CustomerModel extends Model {}

CustomerModel.init(
  {
    id: {
      type: INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    fullname: {
      type: STRING,
      allowNull: false,
    },
    username: {
      type: STRING,
      allowNull: false,
    },
    phone: {
      type: STRING,
      allowNull: true,
    },
    email: {
      type: STRING,
      allowNull: true,
    },
    password: {
      type: STRING,
      allowNull: false,
    },
    dob: {
      type: STRING,
      allowNull: true,
    },
    language: {
      type: STRING,
      allowNull: true,
    },
    accessToken: {
      type: STRING,
      allowNull: true,
    },
    refreshToken: {
      type: STRING,
      allowNull: true,
    },
    device_token: {
      type: STRING,
      allowNull: true,
    },
    profile_img: {
      type: STRING,
      allowNull: true,
    },
    verified: {
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
    modelName: customers, // We need to choose the model name
  }
);

module.exports = CustomerModel;
