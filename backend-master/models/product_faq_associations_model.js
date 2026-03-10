const { Model, DOUBLE } = require("sequelize");
const {
    sequelize,
    databases: { product_faq_associations },
    dataTypes: {
        model_data_types: { INTEGER, STRING, DATETIME, BOOLEAN, FLOAT },
    },
} = require("../config");

class ProductFaq extends Model { }

ProductFaq.init(
    {
        id: {
            type: INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        product_id: {
            type: INTEGER,
            allowNull: true,
        },
        faq_heading: {
            type: STRING,
            allowNull: true,
        },
        faq_content: {
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
        modelName: product_faq_associations, // We need to choose the model name
    }
);



module.exports = ProductFaq;
