const { Model } = require("sequelize");
const {
    sequelize,
    databases: { testimonials },
    dataTypes: {
        model_data_types: { INTEGER, STRING, DATETIME, BOOLEAN },
    },
} = require("../config");
const Customers = require("./customers");



class Testimonials extends Model {}

Testimonials.init(
  {
    id: {
      type: INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    customer_id: {
      type: INTEGER,
      allowNull: true,
    },
    rating: {
      type: INTEGER,
      allowNull: true,
    },
    heading: {
      type: STRING,
      allowNull: true,
    },
    description: {
      type: STRING,
      allowNull: true,
    },
    status: {
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
    modelName: testimonials, // We need to choose the model name
  }
);


Testimonials.belongsTo(Customers, { foreignKey: 'customer_id' });
Customers.hasMany(Testimonials, { foreignKey: 'customer_id' });


module.exports = Testimonials;
