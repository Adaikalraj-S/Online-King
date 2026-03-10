"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDescription = await queryInterface.describeTable(
      "order_details"
    );

    // Check if 'product_description' column already exists
    if (!tableDescription.product_description) {
      await queryInterface.addColumn("order_details", "product_description", {
        type: Sequelize.TEXT, // Choose the appropriate type for your use case
        allowNull: true, // You can set this to false if you require this field
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableDescription = await queryInterface.describeTable(
      "order_details"
    );

    // Check if 'product_description' column exists before removing
    if (tableDescription.product_description) {
      await queryInterface.removeColumn("order_details", "product_description");
    }
  },
};
