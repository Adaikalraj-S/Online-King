"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDescription = await queryInterface.describeTable("features");

    // Check if 'feature_description' column already exists
    if (!tableDescription.feature_description) {
      await queryInterface.addColumn("features", "feature_description", {
        type: Sequelize.TEXT,
        allowNull: true,
        after: "feature_name", // Place the column after the 'feature_name' column
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableDescription = await queryInterface.describeTable("features");

    // Check if 'feature_description' column exists before removing
    if (tableDescription.feature_description) {
      await queryInterface.removeColumn("features", "feature_description");
    }
  },
};
