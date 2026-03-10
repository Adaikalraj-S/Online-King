const { Sequelize } = require("sequelize");

// database connection
const sequelize = new Sequelize(
  process.env.DATABASE,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.HOST,
    dialect: process.env.DB_DRIVER,
    logging: false,
    // pool: {
    //   max: 100,
    //   min: 0,
    //   acquire: 30000,
    //   idle: 10000,
    // },
  },
);

module.exports = sequelize;
