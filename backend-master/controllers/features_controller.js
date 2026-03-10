const jwt = require("jsonwebtoken");
const ejs = require("ejs");
const { uploadFile } = require("../helpers");
const { uploadMultipleFiles } = require("../helpers");
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
const { Features } = require("../models");
const { QueryTypes } = require("sequelize");
const { Op } = require("sequelize");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

//fetch features

const getFeatures = async (req, res) => {
  try {
    const { id, product_id } = req.query;

    let whereConditions = {};

    // Handle id as a single value or an array
    if (id) {
      whereConditions.id = Array.isArray(id) ? { [Op.in]: id } : id;
    }

    // Handle product_id as a single value or an array
    if (product_id) {
      whereConditions.product_id = Array.isArray(product_id)
        ? { [Op.in]: product_id }
        : product_id;
    }

    const features = await Features.findAll({
      where: whereConditions,
      order: [["created_at", "DESC"]],
    });

    return res
      .response({
        code: 200,
        status: "success",
        message: "Features fetched successfully",
        features,
      })
      .code(200);
  } catch (error) {
    console.error(error);
    return res
      .response({
        code: 500,
        status: "error",
        message: "Something went wrong",
      })
      .code(200);
  }
};

//create features function
const createFeatures = async (req, res) => {
  const transact = await sequelize.transaction();

  try {
    const user = await checkToken(
      req.headers["Authorization"]
        ? req.headers["Authorization"]
        : req.headers.authorization
    );

    console.log(user, "user");

    if (user.role === "ADMIN" && user.application === "kardify") {
      const { feature_name, feature_description, image } = req.payload;

      const existingProduct = await Features.findOne({
        where: {
          feature_name,
        },
        raw: true,
        order: [["created_at", "DESC"]],
      });

      if (existingProduct) {
        await transact.rollback();
        return res
          .response({
            code: 409,
            status: "error",
            message: "Feature with the same name already exists",
          })
          .code(200);
      }

      let image_file_url = "";
      if (image) {
        const { file_url } = await uploadFile(req, image, "uploads/features/");

        image_file_url = file_url;
      }

      const newFeature = await Features.create(
        {
          status: true,
          feature_description,
          feature_name,
          image_url: image_file_url,
        },
        {
          transaction: transact,
        }
      );

      await transact.commit();

      return res
        .response({
          code: 201,
          status: "success",
          message: "Feature created successfully",
          features: newFeature,
        })
        .code(200);
    } else if (user == "Session expired") {
      await transact.rollback();
      return res
        .response({
          code: 401,
          status: "error",
          message: user,
        })
        .code(200);
    } else {
      await transact.rollback();
      return res
        .response({
          code: 403,
          status: "error",
          message: "You dont have permission for this action.",
        })
        .code(200);
    }
  } catch (error) {
    await transact.rollback();
    console.error(error);
    return res
      .response({
        code: 500,
        status: "error",
        message: "Something went wrong",
      })
      .code(200);
  }
};

// edit features function
const editFeatures = async (req, res) => {
  try {
    const { id, feature_name, feature_description, image } = req.payload;

    const user = await checkToken(
      req.headers["Authorization"]
        ? req.headers["Authorization"]
        : req.headers.authorization
    );

    if (user.role === "ADMIN" && user.application === "kardify") {
      let image_file_url = "";
      if (image) {
        const { file_url } = await uploadFile(req, image, "uploads/features/");

        image_file_url = file_url;
      }

      const updatedFeatures = await Features.update(
        {
          feature_name,
          feature_description,
          image_url: image_file_url,
        },
        {
          where: {
            id: id,
          },
        }
      );

      console.log(updatedFeatures);
      return res
        .response({
          code: 200,
          status: "success",
          message: "Features updated successfully",
          feature: updatedFeatures,
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
    console.error(error);
    return res
      .response({
        code: 500,
        status: "error",
        message: "Something went wrong",
      })
      .code(200);
  }
};

// delete features function

const deleteFeatures = async (req, res) => {
  try {
    const { features_id } = req.query;

    let whereConditions = {};

    if (features_id) {
      whereConditions.id = Array.isArray(features_id)
        ? { [Op.in]: features_id }
        : features_id;
    }

    const user = await checkToken(
      req.headers["Authorization"]
        ? req.headers["Authorization"]
        : req.headers.authorization
    );

    if (user.role === "ADMIN" && user.application === "kardify") {
      // Check if the feature to delete exists
      const existingFeature = await Features.findOne({
        where: whereConditions,
      });

      if (!existingFeature) {
        return res
          .response({
            code: 404,
            status: "error",
            message: "Feature not found",
          })
          .code(200);
      }

      // Delete the feature from the database
      await existingFeature.destroy();

      return res
        .response({
          code: 200,
          status: "success",
          message: "Feature deleted successfully",
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
          message: "You don't have permission for this action.",
        })
        .code(200);
    }
  } catch (error) {
    console.error(error);
    return res
      .response({
        code: 500,
        status: "error",
        message: "Something went wrong",
      })
      .code(200);
  }
};

// update status of features

const toggleFeaturesStatus = async (req, res) => {
  try {
    const { feature_id } = req.payload;

    let whereConditions = {};

    if (feature_id) {
      whereConditions.id = Array.isArray(feature_id)
        ? { [Op.in]: feature_id }
        : feature_id;
    }

    const user = await checkToken(
      req.headers["Authorization"]
        ? req.headers["Authorization"]
        : req.headers.authorization
    );
    if (user.role === "ADMIN" && user.application === "kardify") {
      const existingFeature = await Features.findOne({
        //logging: console.log,
        where: whereConditions,
      });

      if (!existingFeature) {
        return res
          .response({
            code: 404,
            status: "error",
            message: "Feature not found",
          })
          .code(200);
      }

      // Toggle the category status (assuming you have a boolean 'status' field)
      existingFeature.status = !existingFeature.status;

      // Save the updated category to the database
      await existingFeature.save();

      return res
        .response({
          code: 200,
          status: "success",
          message: "Feature status toggled successfully",
          features: existingFeature,
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
    console.error(error);
    return res
      .response({
        code: 500,
        status: "error",
        message: "Something went wrong",
      })
      .code(200);
  }
};
module.exports = {
  getFeatures,
  createFeatures,
  editFeatures,
  deleteFeatures,
  toggleFeaturesStatus,
};
