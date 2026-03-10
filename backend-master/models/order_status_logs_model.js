const { Model } = require("sequelize");
const {
  sequelize,
  databases: { order_status_logs },
  dataTypes: {
    model_data_types: { INTEGER, STRING, DATETIME },
  },
} = require("../config");
const OrderDetails = require("./order_model");
const OrderStatuses = require("./order_status");

class OrderStatusLogs extends Model {}

OrderStatusLogs.init(
  {
    id: {
      type: INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    order_id: {
      type: INTEGER,
      allowNull: true,
    },
    order_status_id: {
      type: INTEGER,
      allowNull: true,
    },
    order_status_message: {
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
    modelName: order_status_logs, // We need to choose the model name
  }
);

OrderDetails.hasMany(OrderStatusLogs, {
  foreignKey: "order_id",
});

OrderStatusLogs.belongsTo(OrderDetails, {
  foreignKey: "order_id",
});

OrderStatuses.hasMany(OrderStatusLogs, {
  foreignKey: "order_status_id",
});

OrderStatusLogs.belongsTo(OrderStatuses, {
  foreignKey: "order_status_id",
});

module.exports = OrderStatusLogs;
