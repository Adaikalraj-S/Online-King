"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableInfo = await queryInterface.describeTable("user_addresses");

    if (!tableInfo.gst_no) {
      await queryInterface.addColumn("user_addresses", "gst_no", {
        type: Sequelize.STRING(15),
        allowNull: true, // Set to `false` if GST number is mandatory
        after: "email",
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableInfo = await queryInterface.describeTable("user_addresses");

    if (tableInfo.gst_no) {
      await queryInterface.removeColumn("user_addresses", "gst_no");
    }
  },
};
