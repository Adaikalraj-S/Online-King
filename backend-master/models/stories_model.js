const { Model } = require("sequelize");
const {
    sequelize,
    databases: { stories },
    dataTypes: {
        model_data_types: { INTEGER, STRING, DATETIME, BOOLEAN },
    },
} = require("../config");
const Customers = require("./customers");



class Stories extends Model {}

Stories.init(
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
    image_url: {
      type: STRING,
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
    story_type: {
      type: STRING,
      allowNull: true,
    },
    is_approved: {
      type: BOOLEAN,
      allowNull: true,
    },
    rejected_reason:{
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
    modelName: stories, // We need to choose the model name
  }
);

Stories.belongsTo(Customers, { foreignKey: 'customer_id' });
Customers.hasMany(Stories, { foreignKey: 'customer_id' });


module.exports = Stories;
