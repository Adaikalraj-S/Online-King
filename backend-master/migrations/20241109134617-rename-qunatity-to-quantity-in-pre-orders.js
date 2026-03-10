"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Renaming the column `qunatity` to `quantity`
    await queryInterface.renameColumn("pre_orders", "qunatity", "quantity");
  },

  down: async (queryInterface, Sequelize) => {
    // Reverting the column name from `quantity` back to `qunatity`
    await queryInterface.renameColumn("pre_orders", "quantity", "qunatity");
  },
};
