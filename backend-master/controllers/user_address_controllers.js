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
  ProductAttributes,
  Installers,
  Testimonials,
  Customers,
  AddressModel,
} = require("../models");
const { Op } = require("sequelize");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

const getAllShippingAddress = async (req, res) => {
  try {
    const user = await checkToken(
      req.headers["Authorization"]
        ? req.headers["Authorization"]
        : req.headers.authorization
    );

    const allowed_user = ["CUSTOMER"];
    if (allowed_user.includes(user.role) && user.application === "kardify") {
      const { address_id } = req.query;

      let whereCondition = {
        user_id: user.id,
        type: "Shipping",
      };

      if (address_id) {
        whereCondition.id = address_id;
      }

      const addresses = await AddressModel.findAll({
        where: whereCondition,
        include: [
          {
            model: Customers,
            attributes: {
              exclude: ["password", "accessToken", "refreshToken"],
            },
          },
        ],
        nest: true,
        mapToModel: true,
        raw: true,
        order: [["createdAt", "DESC"]],
      });

      return res
        .response({
          code: 200,
          status: "success",
          message: "Addresses fetched successfully",
          addresses,
        })
        .code(200);
    } else if (user === "Session expired") {
      return res
        .response({
          code: 401,
          status: "error",
          message: user,
        })
        .code(401);
    } else {
      return res
        .response({
          code: 403,
          status: "error",
          message: "You don't have permission for this action.",
        })
        .code(403);
    }
  } catch (error) {
    console.log(error);
    return res
      .response({
        code: 401,
        status: "error",
        message: "Something Wrong",
      })
      .code(200);
  }
};

const getAllBillingAddress = async (req, res) => {
  try {
    const user = await checkToken(
      req.headers["Authorization"]
        ? req.headers["Authorization"]
        : req.headers.authorization
    );

    const allowed_user = ["CUSTOMER"];
    if (allowed_user.includes(user.role) && user.application === "kardify") {
      const { address_id } = req.query;

      let whereCondition = {
        user_id: user.id,
        type: "Billing",
      };

      if (address_id) {
        whereCondition.id = address_id;
      }

      const addresses = await AddressModel.findAll({
        where: whereCondition,
        include: [
          {
            model: Customers,
            attributes: {
              exclude: ["password", "accessToken", "refreshToken"],
            },
          },
        ],
        nest: true,
        mapToModel: true,
        raw: true,
        order: [["createdAt", "DESC"]],
      });

      return res
        .response({
          code: 200,
          status: "success",
          message: "Addresses fetched successfully",
          addresses,
        })
        .code(200);
    } else if (user === "Session expired") {
      return res
        .response({
          code: 401,
          status: "error",
          message: user,
        })
        .code(401);
    } else {
      return res
        .response({
          code: 403,
          status: "error",
          message: "You don't have permission for this action.",
        })
        .code(403);
    }
  } catch (error) {
    console.log(error);
    return res
      .response({
        code: 401,
        status: "error",
        message: "Something Wrong",
      })
      .code(200);
  }
};

const addAddressForCustomer = async (req, res) => {
  try {
    if (req.query.user_id) {
      const createdAddress = await addAddressOnRegistration(
        req.query.user_id,
        req.payload
      );
      if (createdAddress.success) {
        console.log(createdAddress, "ca");

        return res.response({
          code: 200,
          status: "success",
          message: "Address created Successfully",
          data: createdAddress.data,
        });
      } else {
        return res.response({
          code: 200,
          status: "error",
          message: createdAddress.message,
          data: createdAddress.data,
        });
      }
    }
    const user = await checkToken(
      req.headers["Authorization"]
        ? req.headers["Authorization"]
        : req.headers.authorization
    );
    if (user.role == "CUSTOMER" && user.application == "kardify") {
      const {
        fullname,
        mobile,
        email,
        add_type,
        add1,
        add2,
        city,
        state,
        country,
        pincode,
        area,
        landmark,
        type,
        gst_no,
      } = req.payload;

      const created_address = await AddressModel.create({
        user_id: user.id,
        fullname,
        mobile,
        email,
        add_type,
        add1,
        add2,
        city,
        state,
        country,
        zipcode: pincode,
        area,
        landmark,
        type,
        gst_no: gst_no ? gst_no : null,
      });
      return res
        .response({
          code: 200,
          status: "success",
          message: "Address created successfully.",
          created_address,
        })
        .code(200);
    } else if (user == "Session expired") {
      return res
        .response({
          code: 401,
          status: "error",
          message: user,
        })
        .code(200);
    } else {
      return res
        .response({
          code: 403,
          status: "error",
          message: "You dont have permission for this action.",
        })
        .code(200);
    }
  } catch (error) {
    console.log(error);
    return res
      .response({
        code: 400,
        status: "error",
        message: error.message,
      })
      .code(200);
  }
};

const addAddressOnRegistration = async (userId, addressData) => {
  try {
    if (!userId) {
      return { success: false, message: "User ID is required" };
    }

    const user = await Customers.findByPk(userId);
    if (!user) {
      return {
        success: false,
        message: "User does not exist, please register",
      };
    }

    console.log(addressData, "address-data");
    const newAddress = await AddressModel.create({
      ...addressData,
      user_id: userId,
    });

    if (newAddress) {
      return { success: true, data: newAddress };
    } else {
      return { success: false, message: "Error in creating address" };
    }
  } catch (error) {
    console.error("Error in adding address on registration:", error);
    return {
      success: false,
      message: "Error in adding address on registration",
      error: error.message,
    };
  }
};

const deleteAddress = async (req, res) => {
  try {
    const user = await checkToken(
      req.headers["Authorization"]
        ? req.headers["Authorization"]
        : req.headers.authorization
    );

    console.log(user.id, "user--------");
    const allowed_user = ["CUSTOMER"];
    if (allowed_user.includes(user.role) && user.application === "kardify") {
      const { address_id } = req.payload; // Assuming the address ID is passed as a URL parameter

      const address = await AddressModel.findOne({
        where: { id: address_id, user_id: user.id },
      });

      if (!address) {
        return res
          .response({
            code: 404,
            status: "error",
            message: "Address not found",
          })
          .code(404);
      }

      await address.destroy();

      return res
        .response({
          code: 200,
          status: "success",
          message: "Address deleted successfully",
        })
        .code(200);
    } else if (user === "Session expired") {
      return res
        .response({
          code: 401,
          status: "error",
          message: user,
        })
        .code(401);
    } else {
      return res
        .response({
          code: 403,
          status: "error",
          message: "You don't have permission for this action.",
        })
        .code(403);
    }
  } catch (error) {
    console.error(error);
    return res
      .response({
        code: 500,
        status: "error",
        message: "Something went wrong",
      })
      .code(500);
  }
};

const editAddressForCustomer = async (req, res) => {
  try {
    const user = await checkToken(
      req.headers["Authorization"]
        ? req.headers["Authorization"]
        : req.headers.authorization
    );

    if (user.role === "CUSTOMER" && user.application === "kardify") {
      const {
        address_id,
        fullname,
        mobile,
        email,
        add_type,
        add1,
        add2,
        city,
        state,
        country,
        pincode,
        area,
        landmark,
        type,
        gst_no,
      } = req.payload;

      // Check if the address exists and belongs to the user
      const address = await AddressModel.findOne({
        where: {
          id: address_id,
          user_id: user.id,
        },
      });

      if (!address) {
        return res
          .response({
            code: 404,
            status: "error",
            message: "Address not found or does not belong to the user.",
          })
          .code(200);
      }

      // Update the address
      await AddressModel.update(
        {
          fullname,
          mobile,
          email,
          add_type,
          add1,
          add2,
          city,
          state,
          country,
          zipcode: pincode,
          area,
          landmark,
          type,
          gst_no: gst_no ? gst_no : null,
        },
        {
          where: {
            id: address_id,
          },
        }
      );

      return res
        .response({
          code: 200,
          status: "success",
          message: "Address updated successfully.",
        })
        .code(200);
    } else if (user === "Session expired") {
      return res
        .response({
          code: 401,
          status: "error",
          message: user,
        })
        .code(200);
    } else {
      return res
        .response({
          code: 403,
          status: "error",
          message: "You don't have permission for this action.",
        })
        .code(200);
    }
  } catch (error) {
    console.log(error);
    return res
      .response({
        code: 400,
        status: "error",
        message: error.message,
      })
      .code(200);
  }
};


module.exports = {
  getAllShippingAddress,
  getAllBillingAddress,
  addAddressForCustomer,
  deleteAddress,
  editAddressForCustomer
};
