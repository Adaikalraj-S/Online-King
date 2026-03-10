"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Check if the table already exists
    const tableExists = await queryInterface.showAllTables();
    if (!tableExists.includes("customer_review_images")) {
      await queryInterface.createTable("customer_review_images", {
        id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
        },
        review_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: "customer_review", // Name of the table this references
            key: "id",
          },
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
        },
        image_url: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false, // Ensure this field is always populated
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false, // Ensure this field is always populated
          defaultValue: Sequelize.literal(
            "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
          ),
        },
        deletedAt: {
          type: Sequelize.DATE,
          allowNull: true,
        },
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableExists = await queryInterface.showAllTables();
    if (tableExists.includes("customer_review_images")) {
      await queryInterface.dropTable("customer_review_images");
    }
  },
};
