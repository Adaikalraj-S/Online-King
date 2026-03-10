'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.addColumn(
        'orders', // Replace with your table name
        'is_billing_same_as_shipping', // First column name
        {
          type: Sequelize.STRING, // Column type
          allowNull: false, // Example constraint
        },
        { transaction }
      );

      await queryInterface.addColumn(
        'orders', // Replace with your table name
        'billing_address_id', // Second column name
        {
          type: Sequelize.INTEGER, // Column type
          allowNull: true, // Example constraint
        },
        { transaction }
      );
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.removeColumn(
        'orders', // Replace with your table name
        'is_billing_same_as_shipping', // First column name
        { transaction }
      );

      await queryInterface.removeColumn(
        'orders', // Replace with your table name
        'billing_address_id', // Second column name
        { transaction }
      );
    });
  }
};
