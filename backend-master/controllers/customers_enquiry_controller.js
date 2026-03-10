const jwt = require("jsonwebtoken");
const ejs = require("ejs");
const { uploadFile } = require("../helpers");
const {
  makeHash,
  checkHash,
  mailer,
  makeToken,
  checkToken,
  makeRefreshToken,
  env: {
    HEADER,
    ENVIRONMENT,
    LOCAL_URL,
    OTP_SEND_URL,
    MSG91_AUTH_KEY,
    MSG91_OTP_TEMP_ID,
  },
  sequelize,
} = require("../config");
const {
  Categories,
  Carts,
  Products,
  Customers,
  Dealers,
  ProductImages,
  Combinations,
  AttributeCombinatios,
  ProductAttributes,
  PreOrder,
} = require("../models");
const { Op } = require("sequelize");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const CustomerEnquiryModel = require("../models/customers_enquiry_model");

const createCustomerEnquiry = async (req, h) => {
  try {
    const { name, mobile, email, subject, message } = req.payload; // Accessing payload in Hapi

    // Input validation
    if (!name || !mobile || !email || !subject || !message) {
      return h
        .response({
          code: 400,
          status: "error",
          message: "All fields are required.",
        })
        .code(400);
    }

    // Create a new enquiry
    const newEnquiry = await CustomerEnquiryModel.create({
      name,
      mobile,
      email,
      subject,
      message,
    });

    // Return success response
    return h
      .response({
        code: 201,
        status: "success",
        message: "Request submitted successfully.",
        data: newEnquiry,
      })
      .code(201);
  } catch (error) {
    console.error("Error creating customer enquiry:", error);

    // Return error response
    return h
      .response({
        code: 500,
        status: "error",
        message: "Internal Server Error",
      })
      .code(500);
  }
};

const fetchCustomerEnquiries = async (req, h) => {
  try {
    // const { page = 1, limit = 10 } = req.query; // Pagination parameters with defaults

    // Validate pagination inputs
    // if (page < 1 || limit < 1) {
    //   return h
    //     .response({
    //       code: 400,
    //       status: "error",
    //       message: "Page and limit must be positive integers.",
    //     })
    //     .code(400);
    // }

    // Calculate offset and limit for pagination
    // const offset = (page - 1) * limit;

    // Fetch enquiries from the database
    const enquiries = await CustomerEnquiryModel.findAll({
      // offset,
      // limit,
      order: [["createdAt", "DESC"]], // Sort by creation date (newest first)
    });

    // Return success response with data and pagination info
    return h
      .response({
        code: 200,
        status: "success",
        message: "Customer enquiries fetched successfully.",
        data: enquiries,
        // meta: {
        //   total: enquiries.count,
        //   page,
        //   limit,
        //   totalPages: Math.ceil(enquiries.count / limit),
        // },
      })
      .code(200);
  } catch (error) {
    console.error("Error fetching customer enquiries:", error);

    // Return error response
    return h
      .response({
        code: 500,
        status: "error",
        message: "Internal Server Error",
      })
      .code(500);
  }
};

module.exports = {
  createCustomerEnquiry,
  fetchCustomerEnquiries,
};
