const { Model } = require("sequelize");
const {
  sequelize,
  databases: { admins },
  dataTypes: {
    model_data_types: { INTEGER, STRING, DATETIME, BOOLEAN },
  },
} = require("../config");

class Admins extends Model {}

Admins.init(
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
    email: {
      type: STRING,
      allowNull: false,
    },
    password: {
      type: STRING,
      allowNull: false,
    },
    accessToken: {
      type: STRING,
      allowNull: true,
    },
    refreshToken: {
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
    modelName: admins, // We need to choose the model name
  }
);

module.exports = Admins;
