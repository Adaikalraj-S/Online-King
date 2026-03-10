const { Model, BOOLEAN } = require("sequelize");
const {
    sequelize,
    databases: { order_statuses },
    dataTypes: {
        model_data_types: { INTEGER, STRING, DATETIME },
    },
} = require("../config");


class Order_statuses extends Model { }

Order_statuses.init(
    {
        id: {
            type: INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        status_name: {
            type: STRING,
            allowNull: true,
        },
        active: {
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
        modelName: order_statuses, // We need to choose the model name
    }
);

module.exports = Order_statuses;
