const { Model } = require("sequelize");
const {
    sequelize,
    databases: { variants_attribute },
    dataTypes: {
        model_data_types: { INTEGER, STRING, DATETIME, BOOLEAN, DOUBLE },
    },
} = require("../config");
const Combinations = require("./product_comination_model");


class VariantAttribute extends Model { }

VariantAttribute.init(
    {
        id: {
            type: INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        variant_id: {
            type: INTEGER,
            allowNull: true,
        },
        attribute_name: {
            type: STRING,
            allowNull: true,
        },
        attribute_value: {
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
        modelName: variants_attribute, // We need to choose the model name
    }
);

Combinations.hasMany(VariantAttribute, {
    foreignKey: 'variant_id'
})

VariantAttribute.belongsTo(Combinations, {
    foreignKey: 'variant_id'
})

module.exports = VariantAttribute;
