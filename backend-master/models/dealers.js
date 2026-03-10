const { Model } = require("sequelize");
const {
  sequelize,
  databases: { dealers },
  dataTypes: {
    model_data_types: { INTEGER, STRING, DATETIME, BOOLEAN, FLOAT },
  },
} = require("../config");

class DealerModel extends Model { }

DealerModel.init(
  {
    id: {
      type: INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    verified: {
        type: BOOLEAN,
        allowNull: true,
        defaultValue: false
    },
    approved: {
        type: BOOLEAN,
        allowNull: true,
        defaultValue: false
    },
    is_active: {
        type: BOOLEAN,
        allowNull: true,
        defaultValue: true
    },
    fullname: {
      type: STRING,
      allowNull: false,
    },
    first_name: {
      type: STRING,
      allowNull: true,
    },
    last_name: {
      type: STRING,
      allowNull: true,
    },
    dob: {
      type: STRING,
      allowNull: true,
    },
    gender: {
        type: STRING,
        allowNull: true,
    },
    password: {
        type: STRING,
        allowNull: false,
    },
    language: {
        type: STRING,
        allowNull: true,
    },
    username: {
        type: STRING,
        allowNull: true,
    },
    personal_email: {
        type: STRING,
        allowNull: true,
    },
    personal_mobile: {
      type: STRING,
      allowNull: true,
    },
    personal_alt_mobile: {
        type: STRING,
        allowNull: true,
    },
    add1: {
      type: STRING,
      allowNull: true,
    },
    add2: {
      type: STRING,
      allowNull: true,
    },
    area: {
      type: STRING,
      allowNull: true,
    },
    city: {
      type: STRING,
      allowNull: true,
    },
    state: {
      type: STRING,
      allowNull: true,
    },
    country: {
      type: STRING,
      allowNull: true,
    },
    pincode: {
      type: STRING,
      allowNull: true,
    },
    landmark: {
      type: STRING,
      allowNull: true,
    },
    lat: {
        type: FLOAT,
        allowNull: true,
    },
    lng: {
        type: FLOAT,
        allowNull: true,
    },
    rejected_reason:{
      type: STRING,
      allowNull: true
    },
    identity_proof_name: {
        type: STRING,
        allowNull: true,
    },
    identity_proof_file_url: {
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
    modelName: dealers, // We need to choose the model name
  }
);

module.exports = DealerModel;
