"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Adding `pre_order_limit` column
    await queryInterface.addColumn(
      "product_attributes_associations",
      "pre_order_stock",
      {
        type: Sequelize.INTEGER,
        allowNull: true, // Set to false if you want to make it required
        after: "stock", // Replace with the actual field name after which you want to place this column
      }
    );
    await queryInterface.addColumn(
      "products",
      "pre_order_stock",
      {
        type: Sequelize.INTEGER,
        allowNull: true, // Set to false if you want to make it required
        after: "stock", // Replace with the actual field name after which you want to place this column
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    // Removing `pre_order_limit` column
    await queryInterface.removeColumn(
      "product_attributes_associations",
      "pre_order_stock",
    );
    await queryInterface.removeColumn(
      "products",
      "pre_order_stock",
    );
  },
};
