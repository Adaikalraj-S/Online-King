const axios = require("axios");
const crypto = require("crypto");
const Razorpay = require("razorpay");
require("dotenv").config();

const {
  makeHash,
  checkHash,
  mailer,
  makeToken,
  checkToken,
  makeRefreshToken,
  sequelize,
} = require("../config");

const {
  ENVIRONMENT,
  RAZORPAY_TEST_KEY_ID,
  RAZOR_TEST_KEY_SECRET,
  RAZORPAY_KEY_ID,
  RAZOR_KEY_SECRET,
} = process.env;

//helper function for razor pay controller

const razorpay = new Razorpay({
  key_id: ENVIRONMENT !== "local" ? RAZORPAY_KEY_ID : RAZORPAY_TEST_KEY_ID,
  key_secret:
    ENVIRONMENT !== "local" ? RAZOR_KEY_SECRET : RAZOR_TEST_KEY_SECRET,
});

const generate_razor_pay_signature = (
  order_id,
  payment_ref_id,
  razorSecretKey
) => {
  if (!order_id || !payment_ref_id || !razorSecretKey) {
    throw new Error("Missing parameters for generating Razorpay signature.");
  }

  console.log("Generating signature with:", {
    order_id,
    payment_ref_id,
    razorSecretKey,
  });

  const hmac = crypto.createHmac("sha256", razorSecretKey);
  hmac.update(`${order_id}|${payment_ref_id}`);
  return hmac.digest("hex");
};

// Validate Razorpay payment
const validateRazorPayPayment = (
  razorpayOrderId,
  razorpayPaymentId,
  signature,
  secret
) => {
  const generatedSignature = generate_razor_pay_signature(
    razorpayOrderId,
    razorpayPaymentId,
    secret
  );
  return generatedSignature === signature;
};

//fetch payment details

const fetchPaymentDetails = async ({ pay_id, order_id }) => {
  try {
    if (pay_id) {
      const paymentDetails = await razorpay.payments.fetch(pay_id);
      return paymentDetails;
    } else if (order_id) {
      const paymentsByOrder = await razorpay.orders.fetchPayments(order_id);
      return paymentsByOrder;
    } else {
      const allPayments = await razorpay.payments.all();
      return allPayments;
    }
  } catch (error) {
    console.error("Error fetching payment details:", error);
    throw error;
  }
};

const refundPayment = async (
  pay_id,
  amount,
  instant = false,
  notes = {},
  receipt = ""
) => {
  try {
    const refundOptions = {
      amount,
      speed: instant ? "optimum" : "normal",
      notes,
      receipt,
    };

    const refund = await razorpay.payments.refund(pay_id, refundOptions);
    return refund;
  } catch (error) {
    console.error("Error processing refund:", error);
    throw new Error("Failed to process refund");
  }
};

const createRazorPayOrder = async (req, res) => {
  const { amount } = req.payload;

  try {
    const user = await checkToken(
      req.headers["Authorization"]
        ? req.headers["Authorization"]
        : req.headers.authorization
    );
    const allowed_user = ["CUSTOMER", "DEALER"];

    if (allowed_user.includes(user.role) && user.application === "kardify") {
      // Create order for Razorpay
      const captureOrderId = await razorpay.orders.create({
        amount: amount, // Amount in the smallest currency unit
        currency: "INR",
        receipt: "receipt#1",
        notes: {
          key1: "value3",
          key2: "value2",
        },
      });

      console.log(captureOrderId, "razorpayId");

      if (captureOrderId.status === "created") {
        return res
          .response({
            code: 200,
            status: "success",
            data: captureOrderId, // Changed from captureOrderId.order_id
          })
          .code(200);
      } else {
        return res
          .response({
            code: 200,
            status: "success",
            message: "error",
            data: captureOrderId,
          })
          .code(200);
      }
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

const verifyRazorPayment = async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    order_id,
  } = req.payload;

  try {
    const user = await checkToken(
      req.headers["Authorization"]
        ? req.headers["Authorization"]
        : req.headers.authorization
    );
    const allowed_user = ["CUSTOMER", "DEALER"];

    if (allowed_user.includes(user.role) && user.application === "kardify") {
      // const order = await Orders.findOne({
      //   where: {
      //     id: order_id,
      //   },
      //   raw: true,
      //   attributes: ["payment_signature"],
      // });

      // if (!order) {
      //   return res.response({
      //     code: 403,
      //     message: "No order found",
      //     status: "error",
      //   });
      // }

      //validate signature
      const RAZOR_SECRET_KEY = process.env.RAZOR_KEY_SECRET;

      const expected_signature = generate_razor_pay_signature(
        razorpay_order_id,
        razorpay_payment_id,
        RAZOR_SECRET_KEY
      );

      console.log(expected_signature, "razor_signature");

      // const authenticSignature = validateRazorPayPayment(
      //   razorpay_order_id,
      //   razorpay_payment_id,
      //   expected_signature,
      //   process.env.RAZOR_KEY_SECRET
      // );

      const authenticSignature = razorpay_signature === expected_signature;

      console.log(authenticSignature, "authentic-signature");
      if (authenticSignature) {
        return res
          .response({
            code: 200,
            status: "success",
            message: "Payment Verified successfully",
          })
          .code(200);
      } else {
        return res
          .response({
            code: 400,
            status: "error",
            message: "Payment Verification failed",
          })
          .code(400);
      }
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

const getRazorpayPaymentDetails = async (req, res) => {
  try {
    const user = await checkToken(
      req.headers["Authorization"] || req.headers.authorization
    );

    const allowed_user = ["ADMIN"];

    if (!allowed_user.includes(user.role) || user.application !== "kardify") {
      return res
        .response({
          code: 403,
          status: "error",
          message: "You do not have permission for this action.",
        })
        .code(403);
    }

    const { pay_id, order_id } = req.payload;

    console.log(pay_id, order_id, "cpomndk");

    const paymentDetails = await fetchPaymentDetails({ pay_id, order_id });

    return res
      .response({
        code: 200,
        status: "success",
        data: paymentDetails,
      })
      .code(200);
  } catch (error) {
    console.error("Error in getPaymentDetails:", error);
    return res
      .response({
        code: 500,
        status: "error",
        message: "Failed to fetch payment details",
      })
      .code(500);
  }
};

const refundRazorPayment = async (req, res) => {
  try {
    const user = await checkToken(req.headers.authorization);

    const allowedUsers = ["ADMIN"];
    if (!allowedUsers.includes(user.role) || user.application !== "kardify") {
      return res
        .response({
          code: 403,
          status: "error",
          message: "You do not have permission for this action.",
        })
        .code(403);
    }

    const { pay_id, amount, instant, notes, receipt } = req.payload;

    if (!pay_id) {
      return res
        .response({
          code: 400,
          status: "error",
          message: "Payment ID is required",
        })
        .code(400);
    }

    const refund = await refundPayment(pay_id, amount, instant, notes, receipt);

    // Find the related order by receipt
    const refundOrder = await Orders.findOne({ where: { order_id: receipt } });

    if (!refundOrder) {
      return res
        .response({
          code: 404,
          status: "error",
          message: "Order not found.",
        })
        .code(404);
    }

    const orderStatus = await OrderStatuses.findOne({
      where: { status_name: "Refund" },
    });

    if (!orderStatus) {
      return res
        .response({
          code: 404,
          status: "error",
          message: "Refund status not found.",
        })
        .code(404);
    }
    console.log(refund, "razor-status");
    if (refundOrder && refund) {
      refundOrder.order_status_id = orderStatus.id;

      await refundOrder.save();

      await OrderStatusLogs.create({
        order_id: refundOrder.id,
        order_status_id: orderStatus.id,
      });
    }

    return res
      .response({
        code: 200,
        status: "success",
        data: refund,
      })
      .code(200);
  } catch (error) {
    console.error("Error in refundRazorPayment:", error);
    return res
      .response({
        code: 500,
        status: "error",
        message: "Failed to process refund.",
      })
      .code(500);
  }
};

module.exports = {
  createRazorPayOrder,
  verifyRazorPayment,
  getRazorpayPaymentDetails,
  refundRazorPayment,
};
