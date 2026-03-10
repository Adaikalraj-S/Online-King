const { Model, BOOLEAN } = require("sequelize");
const {
    sequelize,
    databases: { subscribed_customers },
    dataTypes: {
        model_data_types: { INTEGER, STRING, DATETIME },
    },
} = require("../config");



class Subscribers extends Model { }

Subscribers.init(
    {
        id: {
            type: INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        email: {
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
        modelName: subscribed_customers, // We need to choose the model name
    }
);
module.exports = Subscribers;
