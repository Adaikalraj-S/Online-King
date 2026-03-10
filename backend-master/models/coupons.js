const { Model, DOUBLE } = require("sequelize");
const {
    sequelize,
    databases: { coupons },
    dataTypes: {
        model_data_types: { INTEGER, STRING, DATETIME, BOOLEAN, FLOAT },
    },
} = require("../config");

class Coupons extends Model { }

Coupons.init(
    {
        coupon_type: {
            type: STRING,
            allowNull: false,
          },
          coupon_title: {
            type: STRING,
            allowNull: false,
          },
          coupon_name: {
            type: STRING,
            allowNull: false,
          },
          status: {
            type: BOOLEAN,
            allowNull: false,
            defaultValue: true,
          },
          min_order_amount: {
            type: DOUBLE,
            allowNull: false,
          },
          max_discount: {
            type: DOUBLE,
            allowNull: true,
          },
          discount_type: {
            type: STRING,
            allowNull: false,
          },
          discount: {
            type: DOUBLE,
            allowNull: false,
          },
          max_use_per_user: {
            type: INTEGER,
            allowNull: true,
          },
          user_id: {
            type: INTEGER,
            allowNull: true,
          },
          dealer_id: {
            type: INTEGER,
            allowNull: true,
          },
          max_use: {
            type: INTEGER,
            allowNull: true,
          },
          start_date: {
            type: DATETIME,
            allowNull: true,
          },
          expiry_date: {
            type: DATETIME,
            allowNull: true,
          },
    },
    {
        // Other model options go here
        sequelize, // We need to pass the connection instance
        paranoid: true,
        modelName: coupons, // We need to choose the model name
    }
);


module.exports = Coupons;
