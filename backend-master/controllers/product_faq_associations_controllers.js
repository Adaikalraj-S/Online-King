const axios = require("axios");
const crypto = require("crypto");

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
    SHIPROCKET_TOKEN_API_URL,
    SHIPROCKET_SHIPPING_PRICE_API_URL,
    SHIPROCKET_CREATE_ORDER_API_URL,
    SHIPROCKET_TRACK_ORDER_API_URL,
    PHONE_PAY_LIVE_URL,
    PHONE_PAY_STATUS_LIVE_KEY,
    PHONE_PAY_STATUS_TEST_KEY,
    PHONE_PAY_TEST_URL,
  },
  sequelize,
} = require("../config");

const {
  shiprocketTokenValidator,
  shiprockeShippingValidator,
  shiprocketCreateOrderValidationPayload,
  shiprocketCreateOrderValidationQuery,
  shiprocketTrackOrderValidationQuery,
} = require("../validators/shiprocket_validators");
const { ProductFaq, Products, ProductImages } = require("../models");

const fetchFaqProductAdmin = async (req, res) => {
  try {
    const user = await checkToken(
      req.headers["Authorization"]
        ? req.headers["Authorization"]
        : req.headers.authorization
    );

    if (user.role === "ADMIN" && user.application === "kardify") {
      const { type } = req.query;

      if (type === "question") {
        console.log("sdfd");
        const faqList = await ProductFaq.findAll({
          logging: console.log,
          where: {
            status: false,
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
              ],
            },
          ],
          raw: false,
        });

        return res
          .response({
            code: 200,
            status: "success",
            message: "Product FAQ fetched successfully",
            faq: faqList,
          })
          .code(200);
      }

      const product = await ProductFaq.findAll();

      return res
        .response({
          code: 200,
          status: "success",
          message: "Product FAQ fetched successfully",
          faq: product,
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
        code: 503,
        status: "error",
        message: "Something went wrong",
      })
      .code(200);
  }
};

const fetchFaqProductCustomer = async (req, res) => {
  try {
    const { product_id } = req.query;

    const isProductAvailable = await Products.findOne({
      where: {
        id: Number(product_id),
        status: true,
      },
    });

    if (!isProductAvailable) {
      return res
        .response({
          code: 404,
          status: "error",
          message: "Product not found",
        })
        .code(200);
    }

    const product = await ProductFaq.findAll({
      where: {
        product_id: product_id,
        status: true,
      },
      raw: true,
    });

    return res
      .response({
        code: 200,
        status: "success",
        message: "Product FAQ fetched successfully",
        faq: product,
      })
      .code(200);
  } catch (error) {
    console.log(error);
    return res
      .response({
        code: 503,
        status: "error",
        message: "Something went wrong",
      })
      .code(200);
  }
};

const addFaqProduct = async (req, res) => {
  try {
    const { product_id, faq_heading, faq_content } = req.payload;

    // Check user authorization token
    const user = await checkToken(
      req.headers["Authorization"]
        ? req.headers["Authorization"]
        : req.headers.authorization
    );

    if (!product_id) {
      return res.response({
        code: 400,
        status: "error",
        message: "Product ID is required",
      });
    }

    // Check if the product exists and is active
    const product = await Products.findOne({
      where: {
        id: Number(product_id),
        status: true,
      },
    });

    if (!product) {
      return res.response({
        code: 404,
        status: "error",
        message: "Product not found or inactive",
      });
    }

    if (user.role !== "ADMIN") {
      // Scenario 1: Non-admin user posts a new FAQ heading
      if (!faq_heading) {
        return res
          .response({
            code: 400,
            status: "error",
            message: "FAQ heading is required",
          })
          .code(200);
      }

      // Check if the FAQ heading already exists for the product
      const existingFaq = await ProductFaq.findOne({
        where: {
          product_id: product_id,
          faq_heading: faq_heading,
        },
      });

      if (existingFaq) {
        return res
          .response({
            code: 409,
            status: "error",
            message:
              "FAQ with the same heading already exists for this product",
          })
          .code(200);
      }

      // Create a new FAQ entry with heading only
      const newFaq = await ProductFaq.create({
        product_id: product_id,
        faq_heading,
        faq_content: null, // Content is not allowed for non-admin users
        status: false, // Assuming 'false' means awaiting admin response
      });

      return res.response({
        code: 201,
        status: "success",
        message: "FAQ question posted successfully. Awaiting admin response.",
        faq: newFaq,
      });
    } else {
      // Scenario 2: Admin posts both FAQ heading and content
      if (!faq_heading || !faq_content) {
        return res.response({
          code: 400,
          status: "error",
          message: "FAQ heading and content are required for admin",
        });
      }

      // Check if the FAQ heading already exists for the product
      const existingFaq = await ProductFaq.findOne({
        where: {
          product_id: product_id,
          faq_heading: faq_heading,
        },
      });

      if (existingFaq) {
        // Update existing FAQ with content if it exists
        await existingFaq.update({
          faq_content,
          status: true, // Assuming 'true' means answered or complete
        });

        return res.response({
          code: 200,
          status: "success",
          message: "FAQ updated successfully",
          faq: existingFaq,
        });
      } else {
        // Create a new FAQ entry with both heading and content
        const newFaq = await ProductFaq.create({
          product_id: product_id,
          faq_heading,
          faq_content,
          status: true, // Assuming 'true' means answered or complete
        });

        return res
          .send({
            code: 201,
            status: "success",
            message: "FAQ created successfully with both heading and content",
            faq: newFaq,
          })
          .code(200);
      }
    }
  } catch (error) {
    console.log(error);
    return res.send({
      code: 500,
      status: "error",
      message: "Something went wrong",
    });
  }
};

const addFaqProductAdmin = async (req, res) => {
  try {
    const { faqs } = req.payload;
    const faqsList = JSON.parse(faqs);

    // Check user authorization token
    const authHeader =
      req.headers["Authorization"] || req.headers.authorization;
    const user = await checkToken(authHeader);

    if (user === "Session expired") {
      return res
        .response({
          code: 401,
          status: "error",
          message: user,
        })
        .code(401);
    }

    if (user.role !== "ADMIN" || user.application !== "kardify") {
      return res
        .response({
          code: 403,
          status: "error",
          message: "You do not have permission for this action.",
        })
        .code(403);
    }

    // Process each FAQ in the list
    const results = [];
    for (let faq of faqsList) {
      const { product_id, faq_heading, faq_content } = faq;

      // Validate that both FAQ heading and content are provided
      if (!faq_heading || !faq_content) {
        return res
          .response({
            code: 400,
            status: "error",
            message: "FAQ heading and content are required for admin.",
          })
          .code(400);
      }

      // Check if the FAQ already exists
      const existingFaq = await ProductFaq.findOne({
        where: {
          product_id,
          faq_heading,
        },
      });

      if (existingFaq) {
        // Update existing FAQ
        await existingFaq.update({
          faq_content,
          status: true, // Assuming 'true' means answered or complete
        });

        results.push({
          action: "updated",
          faq: existingFaq,
        });
      } else {
        // Create new FAQ
        const newFaq = await ProductFaq.create({
          product_id,
          faq_heading,
          faq_content,
          status: true, // Assuming 'true' means answered or complete
        });

        results.push({
          action: "created",
          faq: newFaq,
        });
      }
    }

    // Respond with success message and all processed FAQs
    return res
      .response({
        code: 201,
        status: "success",
        message: "FAQs processed successfully.",
        results,
      })
      .code(201);
  } catch (error) {
    console.error(error);
    return res
      .response({
        code: 500,
        status: "error",
        message: "Something went wrong.",
      })
      .code(500);
  }
};

module.exports = {
  fetchFaqProductAdmin,
  fetchFaqProductCustomer,
  addFaqProduct,
  addFaqProductAdmin,
};
