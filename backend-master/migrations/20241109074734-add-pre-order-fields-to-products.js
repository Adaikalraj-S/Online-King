"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Adding `pre_order_availability` column
    await queryInterface.addColumn("products", "pre_order_availability", {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false, // Set default to false
      after: "status", // Replace with the actual field name after which you want to place this column
    });

    // Adding `pre_order_limit` column
    await queryInterface.addColumn("products", "pre_order_limit", {
      type: Sequelize.INTEGER,
      allowNull: true, // Set to false if you want to make it required
      after: "pre_order_availability", // Positioning after `pre_order_availability`
    });

    // Adding `estd_pre_order_processing_time` column
    await queryInterface.addColumn(
      "products",
      "estd_pre_order_processing_time",
      {
        type: Sequelize.STRING,
        allowNull: true, // Optional field; adjust as needed
        after: "pre_order_limit", // Positioning after `pre_order_limit`
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    // Removing `pre_order_availability` column
    await queryInterface.removeColumn("products", "pre_order_availability");

    // Removing `pre_order_limit` column
    await queryInterface.removeColumn("products", "pre_order_limit");

    // Removing `estd_pre_order_processing_time` column
    await queryInterface.removeColumn(
      "products",
      "estd_pre_order_processing_time"
    );
  },
};
