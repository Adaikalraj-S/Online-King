"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Adding `pre_order` column to the `orders` table
    await queryInterface.addColumn("orders", "pre_order", {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false, // Setting the default value to false
      after: "order_id", // Replace this with the actual field name after which you want to add the column
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Removing `pre_order` column from the `orders` table
    await queryInterface.removeColumn("orders", "pre_order");
  },
};
