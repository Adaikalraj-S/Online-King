// "use strict";

// /** @type {import('sequelize-cli').Migration} */

// module.exports = {
//   up: async (queryInterface, Sequelize) => {
//     await queryInterface.addColumn("user_addresses", "type", {
//       type: Sequelize.STRING, // You can change this to any data type you need
//       allowNull: true, // or false if you want this field to be required
//     });
//   },

//   down: async (queryInterface, Sequelize) => {
//     await queryInterface.removeColumn("user_addresses", "type");
//   },
// };
"use strict";

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDescription = await queryInterface.describeTable("user_addresses");
    if (!tableDescription.type) {
      // Add the column if it doesn't exist
      await queryInterface.addColumn("user_addresses", "type", {
        type: Sequelize.STRING, // You can change this to any data type you need
        allowNull: true, // or false if you want this field to be required
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("user_addresses", "type");
  },
};
