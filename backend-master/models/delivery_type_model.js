const { Model, BOOLEAN } = require("sequelize");
const {
    sequelize,
    databases: { delivery_types },
    dataTypes: {
        model_data_types: { INTEGER, STRING, DATETIME },
    },
} = require("../config");


class Delivery_types extends Model { }

Delivery_types.init(
    {
        id: {
            type: INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        delivery_type_name: {
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
        modelName: delivery_types, // We need to choose the model name
    }
);

module.exports = Delivery_types;
