"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDescription = await queryInterface.describeTable("features");

    // Check if 'product_id' exists before renaming
    if (tableDescription.product_id) {
      await queryInterface.renameColumn("features", "product_id", "image_url");
    }

    // Check if 'image_url' now exists before changing its type
    if (tableDescription.image_url || tableDescription.product_id) {
      await queryInterface.changeColumn("features", "image_url", {
        type: Sequelize.STRING, // Changing the type to STRING
        allowNull: true, // Optional: allowing null values
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableDescription = await queryInterface.describeTable("features");

    // Check if 'image_url' exists before changing its type
    if (tableDescription.image_url) {
      await queryInterface.changeColumn("features", "image_url", {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }

    // Check if 'image_url' exists before renaming back to 'product_id'
    if (tableDescription.image_url) {
      await queryInterface.renameColumn("features", "image_url", "product_id");
    }
  },
};
