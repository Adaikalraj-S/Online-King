"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const tableDescription = await queryInterface.describeTable("orders");

    // Check if 'payment_order_id' already exists
    if (!tableDescription.payment_order_id) {
      await queryInterface.addColumn("orders", "payment_order_id", {
        type: Sequelize.STRING,
        allowNull: true,
        after: "payment_via", // place the new column after 'payment_via'
      });
    }

    // Check if 'payment_signature' already exists
    if (!tableDescription.payment_signature) {
      await queryInterface.addColumn("orders", "payment_signature", {
        type: Sequelize.STRING,
        allowNull: true,
        after: "payment_ref_id", // place the new column after 'payment_ref_id'
      });
    }
  },

  async down(queryInterface, Sequelize) {
    const tableDescription = await queryInterface.describeTable("orders");

    // Check if 'payment_order_id' exists before removing
    if (tableDescription.payment_order_id) {
      await queryInterface.removeColumn("orders", "payment_order_id");
    }

    // Check if 'payment_signature' exists before removing
    if (tableDescription.payment_signature) {
      await queryInterface.removeColumn("orders", "payment_signature");
    }
  },
};
