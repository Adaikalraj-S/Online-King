const { Model } = require("sequelize");
const {
  sequelize,
  databases: { otps },
  dataTypes: {
    model_data_types: { INTEGER, STRING, DATETIME },
  },
} = require("../config");

class OtpsModel extends Model {}

OtpsModel.init(
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
    otp: {
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
    // Other model options go here
    sequelize, // We need to pass the connection instance
    paranoid: true,
    modelName: 'OtpsModel', // We need to choose the model name
    tableName: 'otps'
  }
);

module.exports = OtpsModel;
