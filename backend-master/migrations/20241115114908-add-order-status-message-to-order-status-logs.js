"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      "order_status_logs",
      "order_status_message",
      {
        type: Sequelize.STRING, // Use STRING for short text, or TEXT for longer messages
        allowNull: true, // Allow null values if this column is optional
        after: "order_status_id",
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
      "order_status_logs",
      "order_status_message"
    );
  },
};
