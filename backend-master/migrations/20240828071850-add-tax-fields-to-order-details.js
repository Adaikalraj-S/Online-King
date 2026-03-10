"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDescription = await queryInterface.describeTable(
      "order_details"
    );

    // Check and add 'cgst' column if it doesn't already exist
    if (!tableDescription.cgst) {
      await queryInterface.addColumn("order_details", "cgst", {
        type: Sequelize.DECIMAL(10, 2),
        after: "gst", // Positioning the column after the 'gst' field
      });
    }

    // Check and add 'igst' column if it doesn't already exist
    if (!tableDescription.igst) {
      await queryInterface.addColumn("order_details", "igst", {
        type: Sequelize.DECIMAL(10, 2),
        after: "cgst", // Positioning the column after the 'cgst' field
      });
    }

    // Check and add 'sgst' column if it doesn't already exist
    if (!tableDescription.sgst) {
      await queryInterface.addColumn("order_details", "sgst", {
        type: Sequelize.DECIMAL(10, 2),
        after: "igst", // Positioning the column after the 'igst' field
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableDescription = await queryInterface.describeTable(
      "order_details"
    );

    // Check and remove 'cgst' column if it exists
    if (tableDescription.cgst) {
      await queryInterface.removeColumn("order_details", "cgst");
    }

    // Check and remove 'igst' column if it exists
    if (tableDescription.igst) {
      await queryInterface.removeColumn("order_details", "igst");
    }

    // Check and remove 'sgst' column if it exists
    if (tableDescription.sgst) {
      await queryInterface.removeColumn("order_details", "sgst");
    }
  },
};
