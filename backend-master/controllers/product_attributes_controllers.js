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
const { ProductAttributes, Combinations } = require("../models");
const { Op } = require("sequelize");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

const getAttributes = async (req, res) => {
  try {
    const { id, attribute_name } = req.query;
    let filter = {};
    if (id)
      filter = {
        ...filter,
        id,
      };
    if (attribute_name)
      filter = {
        ...filter,
        attribute_name,
      };
    //---------------modify get attributes without validation-----------------------------------
    if (!id && !attribute_name) {
      const attributes = await ProductAttributes.findAll({
        where: filter,
        raw: true,
        order: [["createdAt", "DESC"]],
      });
      return res
        .response({
          code: 200,
          status: "success",
          message: "Attributes fetched successfully",
          attributes,
        })
        .code(200);
    }
    //-------------------------------------------------modify end------------------------------------------
    const user = await checkToken(
      req.headers["Authorization"]
        ? req.headers["Authorization"]
        : req.headers.authorization
    );

    if (user.role === "ADMIN" && user.application === "kardify") {
      const attributes = await ProductAttributes.findAll({
        where: filter,
        raw: true,
        order: [["createdAt", "DESC"]],
      });
      return res
        .response({
          code: 200,
          status: "success",
          message: "Attributes fetched successfully",
          attributes,
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
    return res
      .response({
        code: 401,
        status: "error",
        message: "Something Wrong",
      })
      .code(200);
  }
};

const addAttributes = async (req, res) => {
  try {
    const { attribute_name } = req.payload;

    const user = await checkToken(
      req.headers["Authorization"]
        ? req.headers["Authorization"]
        : req.headers.authorization
    );

    if (user.role === "ADMIN" && user.application === "kardify") {
      const existingAttribute = await ProductAttributes.findOne({
        where: {
          attribute_name,
        },
        raw: true,
      });

      if (existingAttribute) {
        return res
          .response({
            code: 409,
            status: "error",
            message: "Attribute with the same name already exists",
          })
          .code(200);
      }

      const newAttribute = await ProductAttributes.create({
        attribute_name,
        status: true,
      });

      return res
        .response({
          code: 201,
          status: "success",
          message: "Attribute created successfully",
          atrribute: newAttribute,
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
      .code(200);
  }
};

const editAttributes = async (req, res) => {
  try {
    const { attribute_id, attribute_name } = req.payload;

    const user = await checkToken(
      req.headers["Authorization"]
        ? req.headers["Authorization"]
        : req.headers.authorization
    );

    if (user.role === "ADMIN" && user.application === "kardify") {
      const existingAttribute = await ProductAttributes.findOne({
        where: {
          id: attribute_id,
        },
      });

      if (!existingAttribute) {
        return res
          .response({
            code: 404,
            status: "error",
            message: "Attribute not found",
          })
          .code(200);
      }

      const existingNameAttribute = await ProductAttributes.findOne({
        where: {
          attribute_name,
        },
      });

      if (existingNameAttribute) {
        return res
          .response({
            code: 409,
            status: "error",
            message: "Attribute with the same name already exists",
          })
          .code(200);
      }

      if (attribute_name) {
        existingAttribute.attribute_name = attribute_name;
      }

      await existingAttribute.save();

      return res
        .response({
          code: 200,
          status: "success",
          message: "Attribute updated successfully",
          attribute: existingAttribute,
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
      .code(200);
  }
};

const deleteAttribute = async (req, res) => {
  try {
    const { attribute_id } = req.query;

    const user = await checkToken(
      req.headers["Authorization"]
        ? req.headers["Authorization"]
        : req.headers.authorization
    );

    if (user.role === "ADMIN" && user.application === "kardify") {
      if (!Number.isInteger(attribute_id) || attribute_id <= 0) {
        return res
          .response({
            code: 400,
            status: "error",
            message: "Invalid attribute_id",
          })
          .code(200);
      }

      const existingAttribute = await ProductAttributes.findOne({
        where: {
          id: attribute_id,
        },
      });

      if (!existingAttribute) {
        return res
          .response({
            code: 404,
            status: "error",
            message: "Attribute not found",
          })
          .code(200);
      }
      await existingAttribute.destroy();

      return res
        .response({
          code: 200,
          status: "success",
          message: "Attribute deleted successfully",
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
      .code(200);
  }
};

const toggleAttributeStatus = async (req, res) => {
  try {
    const { attribute_id } = req.query;

    const user = await checkToken(
      req.headers["Authorization"]
        ? req.headers["Authorization"]
        : req.headers.authorization
    );

    if (user.role === "ADMIN" && user.application === "kardify") {
      if (!Number.isInteger(attribute_id) || attribute_id <= 0) {
        return res
          .response({
            code: 400,
            status: "error",
            message: "Invalid attribute_id",
          })
          .code(200);
      }

      const existingAttribute = await ProductAttributes.findOne({
        where: {
          id: attribute_id,
        },
      });

      if (!existingAttribute) {
        return res
          .response({
            code: 404,
            status: "error",
            message: "Attribute not found",
          })
          .code(200);
      }

      existingAttribute.status = !existingAttribute.status;

      await existingAttribute.save();

      return res
        .response({
          code: 200,
          status: "success",
          message: "status toggled successfully",
          category: existingAttribute,
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
      .code(200);
  }
};

const getProductAttributesCombination = async (req, res) => {
  try {
    const { product_id } = req.query;

    const whereCondition = product_id ? { product_id } : {};

    const attributeAssociation = await Combinations.findAll({
      where: whereCondition,
      order: [["createdAt", "DESC"]],
    });

    return res.response({
      code: 200,
      status: "success",
      message: "Products fetched successfully",
      attributeAssociation,
    });
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
  getAttributes,
  addAttributes,
  editAttributes,
  deleteAttribute,
  toggleAttributeStatus,
  getProductAttributesCombination,
};
