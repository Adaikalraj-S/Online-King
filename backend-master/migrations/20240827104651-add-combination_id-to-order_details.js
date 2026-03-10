"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDescription = await queryInterface.describeTable(
      "order_details"
    );

    // Check if 'combination_id' column already exists
    if (!tableDescription.combination_id) {
      await queryInterface.addColumn("order_details", "combination_id", {
        type: Sequelize.INTEGER,
        allowNull: true, // Set to false if you want to make it required
        after: "product_id", // This positions the column after `product_id`
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableDescription = await queryInterface.describeTable(
      "order_details"
    );

    // Check if 'combination_id' column exists before removing
    if (tableDescription.combination_id) {
      await queryInterface.removeColumn("order_details", "combination_id");
    }
  },
};
