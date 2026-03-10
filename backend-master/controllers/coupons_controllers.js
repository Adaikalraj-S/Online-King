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
  Banners,
  BannerProductAssociations,
  Categories,
  SubCategories,
  SuperSubCategories,
  Customers,
  Dealers,
  Coupons,
  Orders,
  SubscribedCustomers,
} = require("../models");
const { Op } = require("sequelize");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

const fetchAllCouponsAdmin = async (req, res) => {
  try {
    const allCoupons = await Coupons.findAll({
      attributes: { exclude: ["createdAt", "updatedAt", "deletedAt"] },
      order: [["createdAt", "DESC"]],
    });

    const currentDate = new Date();
    for (const coupon of allCoupons) {
      if (
        new Date(coupon.expiry_date) < currentDate &&
        coupon.status === true
      ) {
        coupon.status = false;
        await coupon.save();
      }
    }

    return res
      .response({
        code: 200,
        status: "success",
        message: "All coupons fetched successfully",
        coupons: allCoupons,
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
      .code(500);
  }
};

const createCoupon = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const {
      coupon_type,
      coupon_title,
      coupon_name,
      min_order_amount,
      max_discount,
      discount_type,
      discount,
      max_use_per_user,
      max_use,
      user_id,
      dealer_id,
      start_date,
      expiry_date,
    } = req.payload;

    //Modify the start date and expiry_data according to local time zone.

    localStartDate = new Date(start_date);
    localExpireDate = new Date(expiry_date);

    console.log(
      localStartDate,
      localExpireDate,
      "check-local",
      start_date,
      expiry_date
    );

    const couponPayload = {
      coupon_type,
      coupon_title,
      coupon_name,
      status: true,
      min_order_amount,
      max_discount,
      discount_type,
      discount,
      max_use_per_user,
      max_use,
      user_id,
      dealer_id,
      start_date: localStartDate,
      expiry_date: localExpireDate,
    };

    const existingCoupon = await Coupons.findOne({
      where: { coupon_name },
      transaction: t,
    });

    if (existingCoupon) {
      await t.rollback();
      return res
        .response({
          code: 400,
          status: "error",
          message: "Coupon with the same name already exists",
        })
        .code(400);
    }

    const createdCoupon = await Coupons.create(couponPayload, {
      transaction: t,
    });

    await t.commit();

    return res
      .response({
        code: 201,
        status: "success",
        message: "Coupon created successfully",
        coupon: createdCoupon,
      })
      .code(201);
  } catch (error) {
    await t.rollback();

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

const getCoupon = async (req, res) => {
  try {
    const user = await checkToken(
      req.headers["Authorization"]
        ? req.headers["Authorization"]
        : req.headers.authorization
    );

    const allowed_user = ["CUSTOMER"];
    if (allowed_user.includes(user.role) && user.application === "kardify") {
      const currentDate = new Date();

      console.log(currentDate, "current-date");

      const coupons = await Coupons.findAll({
        where: {
          status: true,
          expiry_date: {
            [Op.gte]: currentDate,
          },
        },
        logging: console.log,
      });

      return res
        .response({
          code: 200,
          status: "success",
          message: "Coupons fetched successfully",
          coupons,
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
      .code(500);
  }
};

const isCouponApplicable = async (req, res) => {
  try {
    const user = await checkToken(
      req.headers["Authorization"]
        ? req.headers["Authorization"]
        : req.headers.authorization
    );

    const allowed_user = ["CUSTOMER"];
    if (allowed_user.includes(user.role) && user.application === "kardify") {
      const { coupon_id, totalprice } = req.payload;
      const coupon = await Coupons.findOne({
        raw: true,
        where: {
          id: coupon_id
        }
      });
      if (!coupon) {
        return res
          .response({
            code: 404,
            status: "error",
            message: "Coupon not found",
          })
          .code(200);
      }
      if (new Date(coupon.expiry_date) < new Date()) {
        return res
          .response({
            code: 400,
            status: "error",
            message: "Coupon has expired",
          })
          .code(200);
      }

      if (Number(totalprice) < Number(coupon.min_order_amount)) {
        return res
          .response({
            code: 400,
            status: "error",
            message: "Coupon minimum order amount not met",
          })
          .code(200);
      }

      const userCouponUses = await Orders.count({
        where: {
          user_id: user.id,
          coupon_id: coupon_id,
        },
      });

      if (userCouponUses >= coupon.max_use_per_user) {
        return res
          .response({
            code: 400,
            status: "error",
            message: "Coupon usage limit for this user has been reached",
          })
          .code(200);
      }

      let discount = 0;
      if (coupon.discount_type === "Percent") {
        discount = (totalprice * coupon.discount) / 100;
      } else if (coupon.discount_type === "Fixed") {
        discount = coupon.discount;
      }

      discount = Math.min(discount, coupon.max_discount);

      const discountPrice = totalprice - discount;

      const finalPrice = Math.max(discountPrice, 0);

      return res
        .response({
          code: 200,
          status: "success",
          message: "Coupon Applied successfully",
          discountPrice: finalPrice,
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
      .code(500);
  }
};

const editCoupon = async (req, res) => {
  try {
    const {
      coupon_id,
      coupon_name,
      min_order_amount,
      max_discount,
      discount_type,
      discount,
      max_use_per_user,
      //max_use,
      start_date,
      coupon_title,
      expiry_date,
    } = req.payload;

    const existingCoupon = await Coupons.findByPk(coupon_id);
    if (!existingCoupon) {
      return res
        .response({
          code: 404,
          status: "error",
          message: "Coupon not found",
        })
        .code(404);
    }

    await existingCoupon.update({
      coupon_name,
      min_order_amount,
      max_discount,
      discount_type,
      discount,
      max_use_per_user,
      start_date,
      expiry_date,
      coupon_title,
    });

    return res
      .response({
        code: 200,
        status: "success",
        message: "Coupon updated successfully",
        coupon: existingCoupon,
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
      .code(500);
  }
};

const toggleCouponStatus = async (req, res) => {
  try {
    const { coupon_id } = req.query;

    if (!Number.isInteger(coupon_id) || coupon_id <= 0) {
      return res
        .response({
          code: 400,
          status: "error",
          message: "Invalid coupon_id",
        })
        .code(200);
    }

    const existingCoupon = await Coupons.findOne({
      where: {
        id: coupon_id,
      },
    });

    if (!existingCoupon) {
      return res
        .response({
          code: 404,
          status: "error",
          message: "Coupon not found",
        })
        .code(200);
    }

    existingCoupon.status = !existingCoupon.status;

    await existingCoupon.save();

    return res
      .response({
        code: 200,
        status: "success",
        message: "Status toggled successfully",
        coupon: existingCoupon,
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

const deleteCoupon = async (req, res) => {
  try {
    const { coupon_id } = req.query;

    const existingCoupon = await Coupons.findOne({
      where: {
        id: coupon_id,
      },
    });

    if (!existingCoupon) {
      return res
        .response({
          code: 404,
          status: "error",
          message: "coupon not found",
        })
        .code(200);
    }

    await existingCoupon.destroy();

    return res
      .response({
        code: 200,
        status: "success",
        message: `${existingCoupon.coupon_name} deleted successfully`,
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

module.exports = {
  fetchAllCouponsAdmin,
  createCoupon,
  isCouponApplicable,
  getCoupon,
  editCoupon,
  toggleCouponStatus,
  deleteCoupon,
};
