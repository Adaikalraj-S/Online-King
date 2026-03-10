require("dotenv").config();
// importing the database names
const databases = require("./databases");
const dataTypes = require("./datatypes");
const sequelize = require("./sequelize");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const make_hash = (text) => {
  var hash = crypto.createHash("md5").update(text).digest("hex");
  return hash;
};

const check_hash = (text, hash) => {
  var texthash = crypto.createHash("md5").update(text).digest("hex");
  return texthash == hash;
};
// importing from dot env files and exporting it
module.exports = {
  env: {
    HOST: process.env.HOST,
    PORT: process.env.PORT,
    DB_USER: process.env.DB_USER,
    DB_PASS: process.env.DB_PASS,
    DATABASE: process.env.DATABASE,
    DB_DRIVER: process.env.DB_DRIVER,
    DB_MULST: process.env.DB_MULST,
    JWT_SECRET: process.env.JWT_SECRET,
    ENVIRONMENT: process.env.ENVIRONMENT,
    LOCAL_URL: process.env.LOCAL_URL,
    LIVE_URL: process.env.LIVE_URL,
    LIVE_URL: process.env.LIVE_URL,
    OTP_SEND_URL: process.env.OTP_SEND_URL,
    MSG91_AUTH_KEY: process.env.MSG91_AUTH_KEY,
    MSG91_OTP_TEMP_ID: process.env.MSG91_OTP_TEMP_ID,
    SHIPROCKET_TOKEN_API_URL: process.env.SHIPROCKET_TOKEN_API_URL,
    SHIPROCKET_SHIPPING_PRICE_API_URL:
      process.env.SHIPROCKET_SHIPPING_PRICE_API_URL,
    SHIPROCKET_CREATE_ORDER_API_URL:
      process.env.SHIPROCKET_CREATE_ORDER_API_URL,
    SHIPROCKET_TRACK_ORDER_API_URL: process.env.SHIPROCKET_TRACK_ORDER_API_URL,
    PHONE_PAY_MERCHANT_ID: process.env.PHONE_PAY_MERCHANT_ID,
    PHONE_PAY_LIVE_URL: process.env.PHONE_PAY_LIVE_URL,
    PHONE_PAY_STATUS_LIVE_KEY: process.env.PHONE_PAY_STATUS_LIVE_KEY,
    PHONE_PAY_STATUS_TEST_KEY: process.env.PHONE_PAY_STATUS_TEST_KEY,
    PHONE_PAY_TEST_URL: process.env.PHONE_PAY_TEST_URL,
    PHONE_PAY_SALT_KEY: process.env.PHONE_PAY_SALT_KEY,
    REDIRECT_LOCAL_URL: process.env.REDIRECT_LOCAL_URL,
    LOCAL_CALLBACK_URL: process.env.LOCAL_CALLBACK_URL,
    REDIRECT_LIVE_URL: process.env.REDIRECT_LIVE_URL,
    LIVE_CALLBACK_URL: process.env.LIVE_CALLBACK_URL,
  },

  databases,
  dataTypes,
  sequelize,

  makeHash: make_hash,
  checkHash: check_hash,

  makeToken(data) {
    const token = jwt.sign(data, process.env.JWTSECRET, {
      expiresIn: "4h",
    });
    return token;
  },

  makeRefreshToken(data) {
    const token = jwt.sign(data, process.env.JWTSECRET, {
      expiresIn: "1y",
    });
    return token;
  },

  checkToken(token) {
    try {
      const verifier = jwt.verify(token, process.env.JWTSECRET);
      return verifier;
    } catch (error) {
      return "Session expired";
    }
  },
  mailer: require("./mail"),
};
