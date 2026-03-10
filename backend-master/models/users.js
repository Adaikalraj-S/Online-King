const { Model } = require("sequelize");
const {
    sequelize,
    databases: { users },
    dataTypes: {
        model_data_types: { INTEGER, STRING, DATETIME },
    },
} = require("../config");



class Users extends Model { }

Users.init(
    {
        id: {
            type: INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        username: {
            type: STRING,
            allowNull: true,
        },
        password: {
            type: STRING,
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
        modelName: users, // We need to choose the model name
    }
);
module.exports = Users;
