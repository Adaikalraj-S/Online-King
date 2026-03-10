const { Model } = require("sequelize");
const {
    sequelize,
    databases: { installers },
    dataTypes: {
        model_data_types: { INTEGER, STRING, DATETIME, BOOLEAN, FLOAT },
    },
} = require("../config");


class Installers extends Model { }

Installers.init(
    {
        id: {
            type: INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        installer_id: {
            type: STRING,
            allowNull: true,
        },
        installer_name: {
            type: STRING,
            allowNull: true,
        },
        installer_phone: {
            type: INTEGER,
            allowNull: true,
        },
        installer_email: {
            type: STRING,
            allowNull: true,
        },
        company_name: {
            type: STRING,
            allowNull: true,
        },
        add1: {
            type: STRING,
            allowNull: true,
        },
        add2: {
            type: STRING,
            allowNull: true,
        },
        city: {
            type: STRING,
            allowNull: true,
        },
        state: {
            type: STRING,
            allowNull: true,
        },
        country: {
            type: STRING,
            allowNull: true,
        },
        pincode: {
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
        modelName: installers, // We need to choose the model name
    }
);



module.exports = Installers;
