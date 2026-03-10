const { Model } = require("sequelize");
const {
    sequelize,
    databases: { variants },
    dataTypes: {
        model_data_types: { INTEGER, STRING, DATETIME, BOOLEAN, DOUBLE },
    },
} = require("../config");


class Variants extends Model { }

Variants.init(
    {
        id: {
            type: INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        variant_name: {
            type: STRING,
            allowNull: true,
        },
        product_id: {
            type: INTEGER,
            allowNull: true,
        },
        price: {
            type: DOUBLE,
            allowNull: true,
        },
        stock: {
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
        modelName: variants, // We need to choose the model name
    }
);

module.exports = Variants;
