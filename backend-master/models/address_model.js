const { Model } = require("sequelize");
const {
  sequelize,
  databases: { user_addresses },
  dataTypes: {
    model_data_types: { INTEGER, STRING, DATETIME, BOOLEAN, FLOAT },
  },
} = require("../config");

const customers = require("./customers");

class Address_model extends Model {}

Address_model.init(
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
    add_type: {
      type: STRING,
      allowNull: true,
    },
    type: {
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
    area: {
      type: STRING,
      allowNull: true,
    },
    landmark: {
      type: STRING,
      allowNull: true,
    },
    fullname: {
      type: STRING,
      allowNull: true,
    },
    mobile: {
      type: STRING,
      allowNull: true,
    },
    email: {
      type: STRING,
      allowNull: true,
    },
    gst_no: {
      type: STRING,
      allowNull: true,
    },
    type: {
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
    zipcode: {
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
    modelName: user_addresses, // We need to choose the model name
  }
);

customers.hasMany(Address_model, {
  foreignKey: "user_id",
});

Address_model.belongsTo(customers, {
  foreignKey: "user_id",
});

module.exports = Address_model;
