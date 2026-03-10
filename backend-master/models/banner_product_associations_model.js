const { Model } = require("sequelize");
const {
    sequelize,
    databases: { banner_product_associations },
    dataTypes: {
        model_data_types: { INTEGER, STRING, DATETIME, BOOLEAN, FLOAT },
    },
} = require("../config");

// const banner = require('./banners');
const Banners = require("./banners_model");

class BannerProductAssociation extends Model { }

BannerProductAssociation.init(
    {
        id: {
            type: INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        banner_id: {
            type: INTEGER,
            allowNull: true,
        },
        product_id: {
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
        modelName: banner_product_associations, // We need to choose the model name
    }
);

Banners.hasMany(BannerProductAssociation, { foreignKey: 'banner_id' });
BannerProductAssociation.belongsTo(Banners, { foreignKey: 'banner_id' });




module.exports = BannerProductAssociation;
