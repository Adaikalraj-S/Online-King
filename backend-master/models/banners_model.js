const { Model } = require("sequelize");
const {
    sequelize,
    databases: { banners },
    dataTypes: {
        model_data_types: { INTEGER, STRING, DATETIME, BOOLEAN, FLOAT },
    },
} = require("../config");
const Categories = require("./categories");
const SubCategories = require("./sub_categories");
const SuperSubCategories = require("./super_sub_categories_model");

class Banners extends Model { }

Banners.init(
    {
        id: {
            type: INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        banner_name: {
            type: STRING,
            allowNull: true,
        },
        banner_type: {
            type: STRING,
            allowNull: true,
        },
        web_image_url: {
            type: STRING,
            allowNull: true,
        },
        app_image_url: {
            type: STRING,
            allowNull: true,
        },
        category_id: {
            type: INTEGER,
            allowNull: true,
        },
        sub_category_id: {
            type: INTEGER,
            allowNull: true,
        },
        super_sub_category_id: {
            type: INTEGER,
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
        modelName: banners, // We need to choose the model name
    }
);

Categories.hasMany(Banners, { foreignKey: "category_id" });
Banners.belongsTo(Categories, { foreignKey: "category_id" });

SubCategories.hasMany(Banners, { foreignKey: "sub_category_id" });
Banners.belongsTo(SubCategories, { foreignKey: "sub_category_id" });

SuperSubCategories.hasMany(Banners, { foreignKey: "super_sub_category_id" });
Banners.belongsTo(SuperSubCategories, { foreignKey: "super_sub_category_id" });


module.exports = Banners;
