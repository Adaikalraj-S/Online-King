const { Model, DataTypes } = require("sequelize");
const {
  sequelize,
  databases: { features_associations },
} = require("../config"); // Adjust the path as necessary

class FeaturesAssociations extends Model {}

FeaturesAssociations.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "products", // Name of the products table
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    feature_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "features", // Name of the features table
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "features_associations",
    tableName: features_associations,
    timestamps: true, // Automatically adds createdAt and updatedAt fields
    paranoid: true, // Enables soft deletion
    // deletedAt: "deleted_at", // Name of the deleted timestamp column
    // createdAt: "created_at", // Name of the created timestamp column
    // updatedAt: "updated_at", // Name of the updated timestamp column
  }
);

module.exports = FeaturesAssociations;
