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
const { CarBrands } = require("../models");
const { Op } = require("sequelize");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const ProductBrand = require("../models/product_brand_model");

const getProductBrands = async (req, res) => {
  try {
    const { id, product_brand_name } = req.query;
    let filter = {};

    if (id) filter.id = id;
    if (product_brand_name) filter.brand_name = product_brand_name;

    const user = await checkToken(
      req.headers["Authorization"]
        ? req.headers["Authorization"]
        : req.headers.authorization
    );

    if (user.role === "ADMIN" && user.application === "kardify") {
      const brandNames = await ProductBrand.findAll({
        where: filter,
        raw: true,
        order: [["createdAt", "DESC"]],
      });

      return res
        .response({
          code: 200,
          status: "success",
          message: "Product Brands fetched successfully",
          brandNames,
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
    console.error("Error in getProductBrands function:", error);
    return res
      .response({
        code: 500,
        status: "error",
        message: "Internal server error",
      })
      .code(500);
  }
};

const getProductBrandsCustomer = async (req, res) => {
  try {
    const { id, product_brand_name } = req.query;
    let filter = {};

    if (id) filter.id = id;
    if (product_brand_name) filter.brand_name = product_brand_name;

    const brandNames = await ProductBrand.findAll({ where: filter, raw: true });

    if (brandNames.length > 0) {
      return res
        .response({
          code: 200,
          status: "success",
          message: "Product Brands fetched successfully",
          brandNames,
        })
        .code(200);
    } else {
      return res
        .response({
          code: 404,
          status: "error",
          message: "No product brands found with the given criteria.",
        })
        .code(404);
    }
  } catch (error) {
    console.error("Error in getProductBrands function:", error);
    return res
      .response({
        code: 500,
        status: "error",
        message: "Internal server error",
      })
      .code(500);
  }
};

const addProductBrands = async (req, res) => {
  try {
    const { product_brand_name, image } = req.payload;

    const existingProductBrands = await ProductBrand.findOne({
      where: {
        brand_name: product_brand_name,
      },
      raw: true,
    });

    if (existingProductBrands) {
      return res
        .response({
          code: 409,
          status: "error",
          message: `${product_brand_name} already exists`,
        })
        .code(200);
    }

    const user = await checkToken(
      req.headers["Authorization"]
        ? req.headers["Authorization"]
        : req.headers.authorization
    );

    if (user.role === "ADMIN" && user.application === "kardify") {
      const { file_url } = await uploadFile(
        req,
        image,
        "uploads/productbrands/"
      );
      const newProductBrand = await ProductBrand.create({
        brand_name: product_brand_name,
        image_url: file_url,
        status: true,
      });

      return res
        .response({
          code: 201,
          status: "success",
          message: "product brand created successfully",
          product_brand: newProductBrand,
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

const editProductBrands = async (req, res) => {
  try {
    const { product_brand_id, product_brand_name, image } = req.payload;

    const user = await checkToken(
      req.headers["Authorization"]
        ? req.headers["Authorization"]
        : req.headers.authorization
    );

    if (user.role === "ADMIN" && user.application === "kardify") {
      const existingProductBrand = await ProductBrand.findOne({
        where: {
          id: product_brand_id,
        },
      });

      if (!existingProductBrand) {
        return res
          .response({
            code: 404,
            status: "error",
            message: "Product brand not found",
          })
          .code(200);
      }

      const brandNameConflict = await ProductBrand.findOne({
        where: {
          brand_name: product_brand_name,
        },
      });

      if (brandNameConflict && brandNameConflict.id !== product_brand_id) {
        return res
          .response({
            code: 409,
            status: "error",
            message: `${product_brand_name} already exists`,
          })
          .code(200);
      }

      if (product_brand_name) {
        existingProductBrand.brand_name = product_brand_name;
      }

      if (image) {
        const { file_url } = await uploadFile(
          req,
          image,
          "uploads/productbrands/"
        );
        existingProductBrand.image_url = file_url;
      } else {
        existingProductBrand.image_url = existingProductBrand.image_url;
      }

      await existingProductBrand.save();

      return res
        .response({
          code: 200,
          status: "success",
          message: "Product brand updated successfully",
          category: existingProductBrand,
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

const deleteProductBrand = async (req, res) => {
  try {
    const { product_brand_id } = req.query;

    const user = await checkToken(
      req.headers["Authorization"]
        ? req.headers["Authorization"]
        : req.headers.authorization
    );
    if (user.role === "ADMIN" && user.application === "kardify") {
      const existingProductBrand = await ProductBrand.findOne({
        where: {
          id: product_brand_id,
        },
      });

      if (!existingProductBrand) {
        return res
          .response({
            code: 404,
            status: "error",
            message: "Product brand not found",
          })
          .code(200);
      }

      await existingProductBrand.destroy();

      return res
        .response({
          code: 200,
          status: "success",
          message: `${existingProductBrand.brand_name} deleted successfully`,
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

const toggleProductBrandStatus = async (req, res) => {
  try {
    const { product_brand_id } = req.query;

    const user = await checkToken(
      req.headers["Authorization"]
        ? req.headers["Authorization"]
        : req.headers.authorization
    );
    if (user.role === "ADMIN" && user.application === "kardify") {
      if (!Number.isInteger(product_brand_id) || product_brand_id <= 0) {
        return res
          .response({
            code: 400,
            status: "error",
            message: "Invalid product_brand_id",
          })
          .code(200);
      }

      const existingproductBrand = await ProductBrand.findOne({
        where: {
          id: product_brand_id,
        },
      });

      if (!existingproductBrand) {
        return res
          .response({
            code: 404,
            status: "error",
            message: "Car Brand not found",
          })
          .code(200);
      }

      existingproductBrand.status = !existingproductBrand.status;

      await existingproductBrand.save();

      return res
        .response({
          code: 200,
          status: "success",
          message: "Status toggled successfully",
          carbrand: existingproductBrand,
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

module.exports = {
  getProductBrands,
  getProductBrandsCustomer,
  addProductBrands,
  editProductBrands,
  deleteProductBrand,
  toggleProductBrandStatus,
};
