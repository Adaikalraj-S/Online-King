"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDescription = await queryInterface.describeTable(
      "order_details"
    );

    // Check if 'discount' column already exists
    if (!tableDescription.discount) {
      await queryInterface.addColumn(
        "order_details",
        "discount",
        {
          type: Sequelize.DECIMAL(10, 2), // or choose a different type if needed
          allowNull: true, // Set to false if you want to make it required
        },
        {
          after: "unit_price", // This positions the column after `unit_price`
        }
      );
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableDescription = await queryInterface.describeTable(
      "order_details"
    );

    // Check if 'discount' column exists before removing
    if (tableDescription.discount) {
      await queryInterface.removeColumn("order_details", "discount");
    }
  },
};
