const { Model } = require("sequelize");
const {
    sequelize,
    databases: { stories_product_associations },
    dataTypes: {
        model_data_types: { INTEGER, STRING, DATETIME, BOOLEAN },
    },
} = require("../config");
const Customers = require("./customers");
const Stories = require("./stories_model");



class StoryProducts extends Model {}

StoryProducts.init(
  {
    id: {
      type: INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    story_id: {
      type: INTEGER,
      allowNull: true,
    },
    product_id: {
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
    modelName: stories_product_associations, // We need to choose the model name
  }
);

StoryProducts.belongsTo(Stories, { foreignKey: 'story_id' });
Stories.hasMany(StoryProducts, { foreignKey: 'story_id' });


module.exports = StoryProducts;
