const { Model } = require("sequelize");
const {
    sequelize,
    databases: { product_images },
    dataTypes: {
        model_data_types: { INTEGER, STRING, DATETIME, BOOLEAN, DOUBLE },
    },
} = require("../config");

const Products = require('./product_model')

class ProductImages extends Model { }

ProductImages.init(
    {
        id: {
            type: INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        product_id: {
            type: INTEGER,
            allowNull: true,
        },
        image_url: {
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
        modelName: product_images, // We need to choose the model name
    }
);

Products.hasMany(ProductImages, {
    foreignKey: 'product_id',
    as:'images'
})

ProductImages.belongsTo(Products, {
    foreignKey: 'product_id',
    as:'images'
})

module.exports = ProductImages;
