const { Model, DataTypes } = require("sequelize");
const {
  sequelize,
  databases: { features },
} = require("../config"); // Adjust the path as necessary

class Feature extends Model {}

Feature.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    feature_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    feature_description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    image_url: {
      type: DataTypes.STRING,
      allowNull: true,
      //   references: {
      //     model: "products", // Name of the products table
      //     key: "id",
      //   },
      //   onDelete: "SET NULL",
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "features",
    tableName: features,
    timestamps: true,
    paranoid: true, // Enables soft deletion
    deletedAt: "deleted_at", // Name of the deleted timestamp column
    createdAt: "created_at", // Name of the created timestamp column
    updatedAt: "updated_at", // Name of the updated timestamp column
  }
);

module.exports = Feature;
