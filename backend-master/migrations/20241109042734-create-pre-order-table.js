"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("pre_orders", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        // references: {
        //   model: "users", // Assumes the 'users' table exists
        //   key: "id",
        // },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      product_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        // references: {
        //   model: "products", // Assumes the 'products' table exists
        //   key: "id",
        // },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      combination_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        // references: {
        //   model: "combinations", // Assumes the 'combinations' table exists
        //   key: "id",
        // },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      pre_order_status: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        // defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        // defaultValue: Sequelize.literal(
        //   "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
        // ),
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("pre_orders");
  },
};
