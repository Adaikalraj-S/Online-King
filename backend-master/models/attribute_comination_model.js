const { Model } = require("sequelize");
const {
    sequelize,
    databases: { attributes_combinations },
    dataTypes: {
        model_data_types: { INTEGER, STRING, DATETIME, BOOLEAN, DOUBLE },
    },
} = require("../config");


const ProductAttributes = require("./product_attributes");
const Combinations = require("./product_comination_model");


class AttributeCombinations extends Model { }

AttributeCombinations.init(
    {
        id: {
            type: INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        combination_id: {
            type: INTEGER,
            allowNull: false,
        },
        attribute_id: {
            type: INTEGER,
            allowNull: false,
        },
        attribute_value: {
            type: STRING,
            allowNull: false,
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
        modelName: attributes_combinations, // We need to choose the model name
    }
);

ProductAttributes.hasMany(AttributeCombinations, {
    foreignKey: 'attribute_id',
  });
  
  AttributeCombinations.belongsTo(ProductAttributes, {
    foreignKey: 'attribute_id',
  });

Combinations.hasMany(AttributeCombinations, {
    foreignKey: 'combination_id'
})

AttributeCombinations.belongsTo(Combinations, {
    foreignKey: 'combination_id'
})



module.exports = AttributeCombinations;
