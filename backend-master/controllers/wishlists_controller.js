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
  Wishlists,
  ProductImages,
  Combinations,
  ProductAttributes,
} = require("../models");
const AttributeCombinations = require("../models/attribute_comination_model");

const { Op } = require("sequelize");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

const addToWishList = async (req, res) => {
  try {
    const user = await checkToken(
      req.headers["Authorization"]
        ? req.headers["Authorization"]
        : req.headers.authorization
    );

    const allowed_user = ["DEALER", "CUSTOMER"];
    if (allowed_user.includes(user.role) && user.application === "kardify") {
      const { product_id, combination_id } = req.payload;

      const available_product = await Products.findOne({
        where: {
          id: product_id,
          status: true,
        },
        raw: true,
      });

      if (!available_product) {
        return res
          .response({
            code: 400,
            status: "error",
            message: `Product is not available`,
          })
          .code(200);
      }

      let model;
      let ownerId;
      if (user.role === "DEALER") {
        model = Dealers;
        ownerId = "dealer_id";
      } else if (user.role === "CUSTOMER") {
        model = Customers;
        ownerId = "user_id";
      } else {
        return res
          .response({
            code: 403,
            status: "error",
            message: "You dont have permission for this action.",
          })
          .code(200);
      }

      if (user.id) {
        const isAvailableUser = await model.findOne({
          where: {
            id: user.id,
          },
        });

        if (!isAvailableUser) {
          return res
            .response({
              code: 400,
              status: "error",
              message: `User not found`,
            })
            .code(200);
        }
      }

      const existingProduct = await Wishlists.findOne({
        where: {
          [ownerId]: user.id,
          product_id,
          combination_id,
        },
      });

      if (existingProduct) {
        return res
          .response({
            code: 201,
            status: "error",
            message: "Already added in Wishlist",
          })
          .code(200);
      } else {
        await Wishlists.create({
          [ownerId]: user.id,
          product_id,
          combination_id,
        });
      }

      return res
        .response({
          code: 201,
          status: "success",
          message: "Added to wishlist Successfully",
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

const getWishList = async (req, res) => {
  try {
    const user = await checkToken(
      req.headers["Authorization"]
        ? req.headers["Authorization"]
        : req.headers.authorization
    );
    const allowed_user = ["DEALER", "CUSTOMER"];
    if (allowed_user.includes(user.role) && user.application === "kardify") {
      let model;
      let ownerId;
      if (user.role === "DEALER") {
        model = Dealers;
        ownerId = "dealer_id";
      } else if (user.role === "CUSTOMER") {
        model = Customers;
        ownerId = "user_id";
      } else {
        return res
          .response({
            code: 403,
            status: "error",
            message: "You dont have permission for this action.",
          })
          .code(200);
      }
      if (user.id) {
        const isAvailableUser = await model.findOne({
          where: {
            id: user.id,
          },
        });
        if (!isAvailableUser) {
          return res
            .response({
              code: 400,
              status: "error",
              message: `User not found`,
            })
            .code(200);
        }
      }
      const wishList = await Wishlists.findAll({
        where: {
          [ownerId]: user.id,
        },
        include: [
          {
            model: Products,
            include: [
              {
                model: ProductImages,
                required: false,
                as: "images", // Ensure this alias matches your model association
              },
              {
                model: Combinations,
                required: false,
                include: [
                  {
                    model: AttributeCombinations, // Corrected typo
                    required: true,
                    include: [
                      {
                        model: ProductAttributes,
                        required: true,
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      });

      return res
        .response({
          code: 200,
          status: "success",
          data: wishList,
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

const removeFromWishlist = async (req, res) => {
  try {
    const user = await checkToken(
      req.headers["Authorization"]
        ? req.headers["Authorization"]
        : req.headers.authorization
    );
    const allowed_user = ["DEALER", "CUSTOMER"];
    if (allowed_user.includes(user.role) && user.application === "kardify") {
      let model;
      let ownerId;
      if (user.role === "DEALER") {
        model = Dealers;
        ownerId = "dealer_id";
      } else if (user.role === "CUSTOMER") {
        model = Customers;
        ownerId = "user_id";
      } else {
        return res
          .response({
            code: 403,
            status: "error",
            message: "You dont have permission for this action.",
          })
          .code(200);
      }
      if (user.id) {
        const isAvailableUser = await model.findOne({
          where: {
            id: user.id,
          },
        });
        if (!isAvailableUser) {
          return res
            .response({
              code: 400,
              status: "error",
              message: `User not found`,
            })
            .code(200);
        }
      }
      const { product_id } = req.payload;

      const existingWishlist = await Wishlists.findOne({
        where: {
          [ownerId]: user.id,
          product_id,
        },
      });

      if (!existingWishlist) {
        return res
          .response({
            code: 400,
            status: "error",
            message: `Wishlist not found`,
          })
          .code(200);
      }

      await Wishlists.destroy({
        where: {
          [ownerId]: user.id,
          product_id,
          // combination_id,
        },
      });
      return res
        .response({
          code: 200,
          status: "success",
          message: "Removed from wishlist Successfully",
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
  addToWishList,
  getWishList,
  removeFromWishlist,
};
