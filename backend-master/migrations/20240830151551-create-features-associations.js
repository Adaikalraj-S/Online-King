"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Check if the table already exists
    const tableExists = await queryInterface.showAllTables();
    if (!tableExists.includes("features_associations")) {
      await queryInterface.createTable("features_associations", {
        id: {
          type: Sequelize.INTEGER,

          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
        },
        product_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: "products", // Name of the target model
            key: "id", // Key in the target model that we're referencing
          },
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
        },
        feature_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: "features", // Name of the target model
            key: "id", // Key in the target model that we're referencing
          },
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal(
            "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
          ),
        },
        deletedAt: {
          type: Sequelize.DATE,
          allowNull: true, // Allow NULL for soft deletes
        },
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("features_associations");
  },
};
