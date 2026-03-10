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
    PHONE_PAY_MERCHANT_ID,
    PHONE_PAY_SALT_KEY,
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
const { Orders, OrderDetails, Combinations, Products, Carts, PreOrder } = require("../models");

const MAX_RETRIES = 1;
const INITIAL_RETRY_DELAY = 1000;

// const handlePhonePePayment = async (req, res) => {
//     try {
//         // const { error, value } = phonePayValidator.validate(req.body);
//         // if (error) {
//         //     return res.status(400).json({ error: error.details[0].message });
//         // }

//         const {
//             name,
//             amount,
//             mobileNumber,
//             phonepay_merchant_id,
//             phonepay_redirect_url,
//             phonepay_callback_url,
//             salt_key,
//             environment
//         } = req.payload;

//         const merchantTransactionId = 'MT' + new Date().valueOf();
//         const merchantUserId = 'MUID123' + new Date().valueOf();

//         const data = {
//             merchantId: phonepay_merchant_id,
//             merchantTransactionId: merchantTransactionId,
//             merchantUserId: merchantUserId,
//             name: name,
//             amount: amount,
//             redirectUrl: `${phonepay_redirect_url}?redirect_url=true&merchantId=${phonepay_merchant_id}&merchantTransactionId=${merchantTransactionId}`,
//             callbackUrl: phonepay_callback_url,
//             mobileNumber: mobileNumber,
//             paymentInstrument: {
//                 type: 'PAY_PAGE',
//             },
//         };

//         const payload = JSON.stringify(data);
//         const payloadMain = Buffer.from(payload).toString('base64');
//         const keyIndex = 1;
//         const string = payloadMain + '/pg/v1/pay' + salt_key;

//         const checksum = crypto.createHash('sha256').update(string, 'utf-8').digest('hex');

//         const prod_URL = environment === 'production' ? PHONE_PAY_LIVE_URL : PHONE_PAY_TEST_URL;

//         const response = await axios.post(prod_URL, {
//             request: payloadMain,
//         }, {
//             headers: {
//                 'Accept': 'application/json',
//                 'Content-Type': 'application/json',
//                 'X-VERIFY': checksum + '###' + keyIndex,
//             },
//         });

//         const responseData = response.data;
//         console.log(responseData)
//         return res
//             .response({
//                 code: 200,
//                 status: 'success',
//                 message: 'phonepay url initiated',
//                 merchantTransactionId: merchantTransactionId,
//                 merchantUserId: merchantUserId,
//                 data: responseData.data
//             })
//             .code(200);

//     } catch (error) {
//         // console.log(error)
//         return res
//             .response({
//                 code: 200,
//                 status: 'error',
//                 message: error.response.data.message
//             })
//             .code(200);
//     }
// }

const handlePhonePePayment = async (req, res) => {
  try {
    const {
      name,
      amount,
      mobileNumber,
      phonepay_merchant_payment_id,
      phonepay_redirect_url,
      phonepay_callback_url,
      salt_key,
      environment,
    } = req.payload;

    const merchantTransactionId = "MT" + new Date().valueOf();
    const merchantUserId = "MUID123" + new Date().valueOf();

    //create callback url and redirect url

    const redirectUrl =
      ENVIRONMENT !== "development"
        ? `http://localhost:3000/profile/myaccount`
        : ``;

    const serverCallbackUrl =
      ENVIRONMENT !== "development"
        ? `http://0.0.0.0:4000/api/phonepe-server-callback`
        : "";

    const data = {
      merchantId: PHONE_PAY_MERCHANT_ID,
      merchantTransactionId: phonepay_merchant_payment_id,
      merchantUserId: merchantUserId,
      //name: name,
      amount: amount,
      // redirectUrl: `${phonepay_redirect_url}?redirect_url=true&merchantId=${phonepay_merchant_id}&merchantTransactionId=${merchantTransactionId}`,
      redirectUrl: phonepay_redirect_url,
      redirectMode: "REDIRECT",
      callbackUrl: phonepay_callback_url,
      // callbackUrl: serverCallbackUrl,
      mobileNumber: mobileNumber,
      paymentInstrument: {
        type: "PAY_PAGE",
      },
    };

    const payload = JSON.stringify(data);
    const payloadMain = Buffer.from(payload).toString("base64");
    const keyIndex = 1;
    const string = payloadMain + "/pg/v1/pay" + PHONE_PAY_SALT_KEY;

    const checksum = crypto
      .createHash("sha256")
      .update(string, "utf-8")
      .digest("hex");

    const prod_URL =
      environment == "development" ? PHONE_PAY_TEST_URL : PHONE_PAY_LIVE_URL;

    const makeRequest = async (retryCount = 0) => {
      try {
        const response = await axios.post(
          prod_URL,
          {
            request: payloadMain,
          },
          {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              "X-VERIFY": checksum + "###" + keyIndex,
            },
          }
        );

        return response.data;
      } catch (error) {
        if (
          retryCount < MAX_RETRIES &&
          error.response &&
          error.response.status === 429
        ) {
          // Too many requests, retry after a delay
          const delay = INITIAL_RETRY_DELAY * Math.pow(2, retryCount); // Exponential backoff
          await new Promise((resolve) => setTimeout(resolve, delay));
          return makeRequest(retryCount + 1);
        }
        throw error;
      }
    };

    const responseData = await makeRequest();
    console.dir(responseData, {
      depth: null
    });

    return res
      .response({
        code: 200,
        status: "success",
        message: "PhonePe URL initiated",
        merchantTransactionId: merchantTransactionId,
        merchantUserId: merchantUserId,
        data: responseData.data,
      })
      .code(200);
  } catch (error) {
    console.log(error);
    return res
      .response({
        code: 503,
        status: "error",
        message: error.response ? error.response.data.message : error.message,
      })
      .code(200);
  }
};

const checkStatus = async (req, res) => {
  try {
    // const data = await paymentStatusValidators.validateAsync(req.body);

    const {
      //phonepay_merchant_id,
      order_id,
      // salt_key,
      // environment,
    } = req.payload;

    const order_details = await Orders.findOne({
      where: {
        id: order_id,
      },
    })
    return res
      .response({
        code: 200,
        status: "success",
        message: "Data verified",
        data: order_details,
      })
      .code(200);
  } catch (error) {
    console.log(error);
    return res
      .response({
        code: 500,
        status: "error",
        message: error.message,
      })
      .code(200);
  }
};



const handlePhonePeServerCallback = async (req, res) => {
  try {
    const salt_key = process.env.PHONE_PAY_SALT_KEY;
    // Extract the X-VERIFY header and the payload
    const xVerifyHeader = req.headers["x-verify"];
    const encodedPayload = req.payload.response;

    const [receivedChecksum, saltIndex] = xVerifyHeader.split("###");

    // Decode the base64 encoded payload
    const decodedPayload = Buffer.from(encodedPayload, "base64").toString(
      "utf-8"
    );
    const phonePePayload = JSON.parse(decodedPayload);

    // Construct the string to hash for verification
    const stringToHash = encodedPayload + salt_key;

    // Generate the checksum using SHA256
    const calculatedChecksum = crypto
      .createHash("sha256")
      .update(stringToHash, "utf-8")
      .digest("hex");

    // Verify the checksum
    if (calculatedChecksum !== receivedChecksum) {
      return res
        .response({
          code: 400,
          status: "error",
          message: "Invalid checksum in X-VERIFY header",
        })
        .code(400);
    }

    // Process the payment status from the decoded payload
    if (phonePePayload.data) {
      const { 
        transactionId, 
        merchantTransactionId 
      } = phonePePayload?.data;
      const order = await Orders.findOne({
        where: {
          id: Number(merchantTransactionId.split('-').pop())
        },
        paranoid: false
      })
      const products = await OrderDetails.findAll({
        where: {
          order_id: order.id
        },
        raw: true
      })
      for (const product of products) {
        if (product.combination_id) {
          await Combinations.update(
            order.pre_order ? {
              pre_order_stock: sequelize.literal(
                `GREATEST(pre_order_stock - ${product.quantity}, 0)`
              ),
            } : {
              stock: sequelize.literal(
                `GREATEST(stock - ${product.quantity}, 0)`
              ),
            },
            {
              where: { id: product.combination_id },
            }
          );
        } else {
          await Products.update(
            order.pre_order ? {
              pre_order_stock: sequelize.literal(
                `GREATEST(pre_order_stock - ${product.quantity}, 0)`
              ),
            } : {
              stock: sequelize.literal(
                `GREATEST(stock - ${product.quantity}, 0)`
              ),
            },
            {
              where: { id: product.product_id },
            }
          );
        }
      }
      // Update your order status or perform necessary actions here
      await Orders.update({
        payment_ref_id: transactionId,
        payment_order_id: merchantTransactionId,
        payment_signature: transactionId,
        deletedAt: null
      }, {
        where: {
          id: Number(merchantTransactionId.split('-').pop())
        },
        paranoid: false
      })
      if (!order.pre_order) {
        await Carts.destroy(
          {
            where: {
              user_id: order.user_id,
            },
          },
        );
      } else if (order.pre_order) {
        await PreOrder.update(
          {
            pre_order_status: true,
          },
          {
            where: {
              user_id: order.user_id,
            },
          },
        );
      }
    }

    // Update your order status or perform necessary actions here
    //await updateOrderStatus(transactionId, state, amount);

    // console.log('phonepe_controllers.js @ Line 335:', phonePePayload);
    // {
    //   success: true,
    //   code: 'PAYMENT_SUCCESS',
    //   message: 'Your payment is successful.',
    //   data: {
    //     merchantId: 'MADHUUAT',
    //     merchantTransactionId: '1735210137356-40',
    //     transactionId: 'T2412261618576894045572',
    //     amount: 100,
    //     state: 'COMPLETED',
    //     responseCode: 'SUCCESS',
    //     paymentInstrument: {
    //       type: 'NETBANKING',
    //       pgTransactionId: '1995464773',
    //       pgServiceTransactionId: 'PG2212291607083344934300',
    //       bankTransactionId: null,
    //       bankId: null
    //     }
    //   }
    // }
    


    return res
      .response({
        code: 200,
        status: "success",
        message: "Callback processed successfully",
      })
      .code(200);
  } catch (error) {
    console.error("Error processing PhonePe server callback:", error);
    return res
      .response({
        code: 503,
        status: "error",
        message: error.message,
      })
      .code(503);
  }
};

module.exports = {
  handlePhonePePayment,
  checkStatus,
  handlePhonePeServerCallback,
};
