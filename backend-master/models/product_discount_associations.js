const { Model, DOUBLE } = require("sequelize");
const {
    sequelize,
    databases: { product_discount_associations },
    dataTypes: {
        model_data_types: { INTEGER, STRING, DATETIME, BOOLEAN, FLOAT },
    },
} = require("../config");

class ProductDiscounts extends Model { }

ProductDiscounts.init(
    {
        id: {
            type: INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        discount_id: {
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
        modelName: product_discount_associations, // We need to choose the model name
    }
);



module.exports = ProductDiscounts;
