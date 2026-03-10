const { Model } = require("sequelize");
const {
  sequelize,
  databases: { super_sub_categories },
  dataTypes: {
    model_data_types: { INTEGER, STRING, DATETIME, BOOLEAN },
  },
} = require("../config");
const Categories = require("./categories");
const SubCategories = require("./sub_categories");

class SuperSubCategories extends Model {}

SuperSubCategories.init(
  {
    id: {
      type: INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    category_id: {
      type: INTEGER,
      allowNull: true,
    },
    sub_category_id: {
      type: INTEGER,
      allowNull: true,
    },
    super_sub_category_name: {
      type: STRING,
      allowNull: true,
    },
    status: {
      type: BOOLEAN,
      allowNull: true,
    },
    image_url: {
      type: STRING,
      allowNull: true,
    },
    banner_id: {
      type: INTEGER,
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
    modelName: super_sub_categories, // We need to choose the model name
  }
);

SuperSubCategories.belongsTo(Categories, {
  foreignKey: "category_id",
  as: "category",
});

SuperSubCategories.belongsTo(SubCategories, {
  foreignKey: "sub_category_id",
  as: "subCategory",
});

SubCategories.hasMany(SuperSubCategories, { foreignKey: "sub_category_id" });

module.exports = SuperSubCategories;
