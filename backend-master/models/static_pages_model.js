const { Model } = require("sequelize");
const {
    sequelize,
    databases: { static_pages },
    dataTypes: {
        model_data_types: { INTEGER, STRING, DATETIME, BOOLEAN, FLOAT },
    },
} = require("../config");


class StaticPages extends Model { }

StaticPages.init(
    {
        id: {
            type: INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        image_url: {
            type: STRING,
            allowNull: true,
        },
        about_us: {
            type: STRING,
            allowNull: true,
        },
        contact_us: {
            type: STRING,
            allowNull: true,
        },
        privacy_policy: {
            type: STRING,
            allowNull: true,
        },
        cancellation_policy: {
            type: STRING,
            allowNull: true,
        },
        refund_policy: {
            type: STRING,
            allowNull: true,
        },
        return_policy: {
            type: STRING,
            allowNull: true,
        },
        shipping_policy: {
            type: STRING,
            allowNull: true,
        },
        about_status:{
            type: BOOLEAN,
            allowNull: true,
        },
        contact_status:{
            type: BOOLEAN,
            allowNull: true,
        },
        privacy_status:{
            type: BOOLEAN,
            allowNull: true,
        },
        cancellation_status:{
            type: BOOLEAN,
            allowNull: true,
        },
        refund_status:{
            type: BOOLEAN,
            allowNull: true,
        },
        return_status:{
            type: BOOLEAN,
            allowNull: true,
        },
        shipping_status:{
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
        modelName: static_pages, // We need to choose the model name
    }
);



module.exports = StaticPages;
