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
  CarBrands,
  OrderDetails,
  Orders,
  Categories,
  SubCategories,
  SuperSubCategories,
  Products,
  DeliveryTypes,
  OrderStatusLogs,
  OrderStatuses,
  ProductImages,
  Carts,
} = require("../models");
const { Op, Model } = require("sequelize");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

const getAllTransactionsAdmin = async (req, res) => {
  try {
    const user = await checkToken(
      req.headers["Authorization"]
        ? req.headers["Authorization"]
        : req.headers.authorization
    );

    const allowed_user = ["ADMIN"];
    if (allowed_user.includes(user.role) && user.application === "kardify") {
      const { payment_type } = req.query;

      const allOrders = await Orders.findAll({
        where: {
          payment_via: payment_type,
        },
        include: [
          DeliveryTypes,
          {
            model: OrderStatuses,
            as: "order_status",
            attributes: ["id", "status_name", "createdAt", "updatedAt"],
          },
          {
            model: OrderStatusLogs,
            attributes: ["id", "order_status_id", "createdAt", "updatedAt"],
            include: [
              {
                model: OrderStatuses,
                required: true,
              },
            ],
          },
          {
            model: OrderDetails,
          },
        ],
        order: [["createdAt", "DESC"]], // Order by createdAt in descending order
      });

      return res
        .response({
          code: 200,
          status: "success",
          message: "All orders fetched successfully",
          orders: allOrders,
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
  getAllTransactionsAdmin,
};
