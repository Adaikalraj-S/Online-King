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
  AddressModel,
  Customers,
  Combinations,
  AttributeCombinatios,
  ProductAttributes,
} = require("../models");
const { Op, Model, where } = require("sequelize");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const PreOrder = require("../models/pre_order_model");

const puppeteer = require("puppeteer");
const handlebars = require("handlebars");

const getAllOrdersAdmin = async (req, res) => {
  const whereCondition = {};
  if (req.query.id) {
    whereCondition.id = req.query.id;
  }
  try {
    const user = await checkToken(
      req.headers["Authorization"]
        ? req.headers["Authorization"]
        : req.headers.authorization
    );

    const allowed_user = ["ADMIN"];
    if (allowed_user.includes(user.role) && user.application === "kardify") {
      const allOrders = await Orders.findAll({
        where: whereCondition,
        include: [
          DeliveryTypes,
          {
            model: AddressModel,
            as: 'shipping_address'
          },
          {
            model: AddressModel,
            as: 'billing_address'
          },
          Customers,

          {
            model: OrderStatuses,
            as: "order_status",
            attributes: ["id", "status_name", "createdAt", "updatedAt"],
          },
          {
            model: OrderStatusLogs,
            attributes: [
              "id",
              "order_status_id",
              "order_status_message",
              "createdAt",
              "updatedAt",
            ],
            include: [
              {
                model: OrderStatuses,
                required: true,
              },
            ],
          },
          {
            model: OrderDetails,
            include: [
              Categories,
              SubCategories,
              SuperSubCategories,
              Products,
              {
                model: Products,
                include: [
                  {
                    model: Combinations,
                    required: false,
                    include: [
                      {
                        model: AttributeCombinatios,
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
                  {
                    model: ProductImages,
                    as: "images",
                  },
                ],
              },
              {
                model: ProductImages,
                as: "product_images",
                where: {
                  status: 1,
                },
                attributes: ["id", "image_url"],
                required: false,
                raw: true,
              },
            ],
          },
        ],
        order: [["createdAt", "DESC"]], // Order by createdAt in descending order
      });

      // const images = await ProductImages.findAll({
      //     where: {
      //         product_id: allOrders.map(product => product.id),
      //         status: 1,
      //     },
      //     attributes: ['id', 'product_id' , 'image_url'],
      //     raw: true,
      // });

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

const getOrderForCustomer = async (req, res) => {
  try {
    const user = await checkToken(
      req.headers["Authorization"]
        ? req.headers["Authorization"]
        : req.headers.authorization
    );

    const allowed_user = ["CUSTOMER", "DEALER"];
    if (allowed_user.includes(user.role) && user.application === "kardify") {
      const customerId = user.id;
      let ownerId;
      let user_type;
      if (user.role === "DEALER") {
        ownerId = "dealer_id";
        user_type = "DEALER";
      } else if (user.role === "CUSTOMER") {
        ownerId = "user_id";
        user_type = "CUSTOMER";
      }

      let whereCondition = {
        [ownerId]: customerId,
        user_type,
      };

      if (req.query.id) {
        whereCondition.id = req.query.id;
      }

      const customerOrders = await Orders.findAll({
        where: whereCondition,
        include: [
          DeliveryTypes,
          {
            model: AddressModel,
            as: 'shipping_address'
          },
          {
            model: AddressModel,
            as: 'billing_address'
          },
          Customers,

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
            include: [
              Categories,
              SubCategories,
              SuperSubCategories,
              Products,
              {
                model: Products,
                include: [
                  {
                    model: Combinations,
                    required: false,
                    include: [
                      {
                        model: AttributeCombinatios,
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
                  {
                    model: ProductImages,
                    as: "images",
                  },
                ],
              },
              {
                model: ProductImages,
                as: "product_images",
                where: {
                  status: 1,
                },
                attributes: ["id", "image_url"],
                required: false,
                raw: true,
              },
            ],
          },
        ],
        order: [["createdAt", "DESC"]],
      });

      return res
        .response({
          code: 200,
          status: "success",
          message: "Orders fetched successfully",
          orders: customerOrders,
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
    // console.error(error);
    return res
      .response({
        code: 500,
        status: "error",
        message: "Something went wrong",
      })
      .code(200);
  }
};

const createOrder = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const user = await checkToken(
      req.headers["Authorization"]
        ? req.headers["Authorization"]
        : req.headers.authorization
    );
    const allowed_user = ["CUSTOMER", "DEALER"];

    if (allowed_user.includes(user.role) && user.application === "kardify") {
      const {
        address_id,
        is_billing_same_as_shipping,
        billing_address_id,
        coupon_id,
        payment_via,
        payment_id,
        payment_order_id,
        payment_signature,
        total_product_amount,
        total_discount_amount,
        products,
        total_amount,
        pre_order,
      } = req.payload;
      let ownerId;
      if (user.role === "DEALER") {
        ownerId = "dealer_id";
      } else if (user.role === "CUSTOMER") {
        ownerId = "user_id";
        if (!address_id) {
          await t.rollback();
          return res
            .response({
              code: 400,
              status: "error",
              message: "Address is required for customers.",
            })
            .code(400);
        }
      } else {
        await t.rollback();
        return res
          .response({
            code: 403,
            status: "error",
            message: "You dont have permission for this action.",
          })
          .code(200);
      }

      const isAvalibelPending = await OrderStatuses.findOne({
        where: {
          status_name: "Pending",
        },
      });
      if (!isAvalibelPending) {
        await t.rollback();
        return res
          .response({
            code: 400,
            status: "error",
            message: "Pending status not found.",
          })
          .code(400);
      }

      // const isAvailibelDeliverType = await DeliveryTypes.findOne({
      //     where:{
      //         id: delivery_type_id
      //     }
      // })
      // if(!isAvailibelDeliverType) {
      //     return res.response({
      //         code: 400,
      //         status: 'error',
      //         message: `${isAvailibelDeliverType.delivery_type_name} is not available.`,
      //     }).code(400);
      // }

      const newOrder = await Orders.create(
        {
          [ownerId]: user.id,
          user_address_id: address_id ? address_id : null,
          is_billing_same_as_shipping,
          billing_address_id: billing_address_id ? billing_address_id : is_billing_same_as_shipping ? address_id : null,
          coupon_id,
          order_status_id: isAvalibelPending.id,
          total_product_amount,
          total_discount_amount,
          payment_via,
          payment_ref_id: payment_id,
          payment_order_id: payment_via !== "PhonePe" ? payment_order_id : null,
          payment_signature:
            payment_via !== "PhonePe" ? payment_signature : null,
          total_paid_amount: total_amount,
          user_type: user.role,
          pre_order: pre_order ? pre_order : false,
          // deletedAt: payment_via !== "PhonePe" ? new Date() : null
        },
        { transaction: t }
      );

      newOrder.order_id = `OKMIJ200820-${`${newOrder.id}`.padStart(3, "0")}`;
      await newOrder.save({ transaction: t });

      for (const product of products) {
        if (product.combination_id && payment_via !== "PhonePe") {
          await Combinations.update(
            pre_order ? {
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
        } else if (payment_via !== "PhonePe") {
          await Products.update(
            pre_order ? {
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
        await OrderDetails.create(
          {
            order_id: newOrder.id,
            product_id: product.product_id,
            combination_id: product.combination_id,
            quantity: product.quantity,
            //category_id: product.category_id,
            //sub_category_id: product.sub_category_id,
            //super_sub_category_id: product.super_sub_category_id,
            // product_type: product.product_type,
            // car_brand_id: product.car_brand_id,
            // car_model_id: product.car_model_id,
            unit_price: product.unit_price,
            product_description: product.product_description,
            sub_total: product.sub_total,
            total_amount: product.total_amount,
            discount: product?.discount,
            // sub_total: parseFloat(Number(product.default_price) * Number(product.quantity)).toFixed(2),
            gst: product.gst,
            igst: product.igst,
            // total_amount: parseFloat((product.default_price * product.quantity) + (product.tax_rate * (product.default_price * product.quantity))).toFixed(2),
          },
          { transaction: t }
        );
      }

      await OrderStatusLogs.create(
        {
          order_id: newOrder.id,
          order_status_id: newOrder.order_status_id,
        },
        { transaction: t }
      );

      if (!pre_order && payment_via !== "PhonePe") {
        await Carts.destroy(
          {
            where: {
              [ownerId]: user.id,
            },
          },
          { transaction: t }
        );
      } else if (pre_order && payment_via !== "PhonePe") {
        console.log("pre-user", user.id);
        await PreOrder.update(
          {
            pre_order_status: true,
          },

          {
            where: {
              [ownerId]: user.id,
            },
          },
          { transaction: t }
        );
      }

      await t.commit();
      const createdOrder = await Orders.findByPk(newOrder.id, {
        include: [OrderDetails],
      });
      
      if (payment_via == "PhonePe") {
        await Orders.destroy({
          where: {
            id: newOrder.id,
          },
        })
      } else {
        const products = await Products.findAll({
          raw: true,
          nest:true,
          mapToModel: true,
          include: [
            {
              model: OrderDetails,
              required: true,
              where: {
                order_id: newOrder.id
              }
            }
          ]
        })
        await orderConfirmEmail(user, createdOrder, 'Confirmed', products)
      }
      return res
        .response({
          code: 201,
          status: "success",
          message: "Order placed successfully",
          order: createdOrder,
        })
        .code(201);
    } else if (user == "Session expired") {
      await t.rollback();
      return res
        .response({
          code: 401,
          status: "error",
          message: user,
        })
        .code(200);
    } else {
      await t.rollback();
      return res
        .response({
          code: 403,
          status: "error",
          message: "You dont have permission for this action.",
        })
        .code(200);
    }
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

// const approveOrderByAdmin = async (req, res) => {
//     try {
//         const { order_id } = req.payload;

//         const order = await Orders.findOne({
//             where: {
//                  id: order_id
//                 },
//             include: [OrderDetails],
//         });

//         if (!order) {
//             return res.response({
//                 code: 404,
//                 status: 'error',
//                 message: 'Order not found',
//             }).code(404);
//         }

//         if (order.accepted) {
//             return res.response({
//                 code: 400,
//                 status: 'error',
//                 message: 'Order has already been approved',
//             }).code(400);
//         }

//         order.accepted = true;
//         order.order_accepted_date = new Date();
//         await order.save();

//         return res.response({
//             code: 200,
//             status: 'success',
//             message: 'Order approved successfully',
//             order,
//         }).code(200);
//     } catch (error) {
//         console.error(error);
//         return res.response({
//             code: 500,
//             status: 'error',
//             message: 'Something went wrong',
//         }).code(200);
//     }
// }

const approveOrderByAdmin = async (req, res) => {
  try {
    const { order_id } = req.payload;

    const order = await Orders.findOne({
      where: { id: order_id },
      include: [OrderDetails],
    });

    if (!order) {
      return res
        .response({
          code: 404,
          status: "error",
          message: "Order not found",
        })
        .code(404);
    }

    if (order.accepted) {
      return res
        .response({
          code: 400,
          status: "error",
          message: "Order has already been approved",
        })
        .code(400);
    }

    const t = await sequelize.transaction();

    try {
      const confirmedStatus = await OrderStatuses.findOne({
        where: { status_name: "Confirmed" },
      });

      if (!confirmedStatus) {
        await t.rollback();
        return res
          .response({
            code: 500,
            status: "error",
            message: "Confirmed status not found",
          })
          .code(500);
      }

      order.accepted = true;
      order.order_accepted_date = new Date();
      order.order_status_id = confirmedStatus.id;
      await order.save({ transaction: t });

      await OrderStatusLogs.create(
        {
          order_id: order.id,
          order_status_id: confirmedStatus.id,
        },
        { transaction: t }
      );

      await t.commit();

      return res
        .response({
          code: 200,
          status: "success",
          message: "Order approved successfully",
          order,
        })
        .code(200);
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

const cancelOrderByAdmin = async (req, res) => {
  try {
    const { order_id, cancellation_reason } = req.payload;

    const order = await Orders.findOne({
      where: {
        id: order_id,
      },
      include: [OrderDetails],
    });

    if (!order) {
      return res
        .response({
          code: 404,
          status: "error",
          message: "Order not found",
        })
        .code(404);
    }

    // if (!order.accepted) {
    //   return res
    //     .response({
    //       code: 400,
    //       status: "error",
    //       message: "Order has already been canceled",
    //     })
    //     .code(200);
    // }

    order.accepted = false;
    order.rejected_reason = cancellation_reason;
    order.order_status_id = 10;
    await order.save();

    return res
      .response({
        code: 200,
        status: "success",
        message: "Order canceled by admin successfully",
        order,
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

const getAllOrderStatuses = async (req, res) => {
  try {
    const allStatuses = await OrderStatuses.findAll({
      where: {
        active: true
      }
    });
    return res
      .response({
        code: 200,
        status: "success",
        message: "All status fetched succefully",
        orderStatuses: allStatuses,
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

// const updateOrderStatus = async (req, res) => {
//   const { order_id, order_status_id } = req.payload;

//   try {
//     const orderToUpdate = await Orders.findOne({
//       where: {
//         id: order_id,
//       },
//     });

//     if (!orderToUpdate) {
//       return res
//         .response({
//           code: 404,
//           status: "error",
//           message: "Order not found",
//         })
//         .code(404);
//     }

//     await OrderStatusLogs.create({
//       order_id: order_id,
//       order_status_id: orderToUpdate.order_status_id,
//     });

//     orderToUpdate.order_status_id = order_status_id;
//     await orderToUpdate.save();

//     // const updatedOrder = await Orders.findByPk(order_id, {
//     //     include: [OrderStatuses, OrderDetails, DeliveryTypes],
//     // });

//     return res
//       .response({
//         code: 200,
//         status: "success",
//         message: "Order status updated successfully",
//         // order: updatedOrder,
//       })
//       .code(200);
//   } catch (error) {
//     console.error(error);
//     return res
//       .response({
//         code: 500,
//         status: "error",
//         message: "Something went wrong",
//       })
//       .code(500);
//   }
// };

const updateOrderStatus = async (req, res) => {
  const {
    order_id,
    order_status_id,
    cancellation_reason,
    pickup_datetime,
    order_status_message,
  } = req.payload;

  const t = await sequelize.transaction();

  try {
    // Fetch necessary statuses in one query
    const statuses = await OrderStatuses.findAll({
      where: {
        status_name: {
          [Op.in]: [
            "Refund",
            "Cancelled By Onlineking",
            "Confirmed",
            "Delivered",
          ],
        },
      },
    });

    // Extract individual statuses
    const refundStatus = statuses.find(
      (status) => status.status_name === "Refund"
    );
    const CancelByOnlinekingStatus = statuses.find(
      (status) => status.status_name === "Cancelled By Onlineking"
    );
    // const cancelApprovedByKardifyStatus = statuses.find(
    //   (status) => status.status_name === "Cancellation Approved By Kardify"
    // );

    const confirmedStatus = statuses.find(
      (status) => status.status_name === "Confirmed"
    );

    const deliveredStatus = statuses.find(
      (status) => status.status_name === "Delivered"
    );

    // const orderPickup = statuses.find(
    //   (status) => status.status_name === "Order Ready For Pickup"
    // );

    // Fetch the order to update
    const orderToUpdate = await Orders.findOne({
      where: { id: order_id },
      include: [
        {
          model: OrderStatuses,
          as: "order_status",
          attributes: ["id", "status_name", "createdAt", "updatedAt"],
        },
      ],
    });

    const customerInfo = await Customers.findOne({
      where: {
        id: orderToUpdate.user_id,
      },
      attributes: ["fullname", "username", "email"],
    });

    if (!orderToUpdate) {
      await t.rollback()
      return res
        .response({
          code: 404,
          status: "error",
          message: "Order not found",
        })
        .code(404);
    }
    //update status for delivery of product
    console.log('orders_controllers.js @ Line 926:', order_status_id, deliveredStatus.id);
    if (order_status_id === deliveredStatus.id) {
      //orderToUpdate.order_delivered_date = new Date();
      orderToUpdate.order_delivered_date = new Date().toLocaleString("en-US", {
        timeZone: "Asia/Kolkata",
      }); // Use your local timezone

      orderToUpdate.order_status_id = deliveredStatus.id;
      await orderToUpdate.save({ transaction: t });
      await OrderStatusLogs.create(
        {
          order_id: orderToUpdate.id,
          order_status_id: deliveredStatus.id,
          order_status_message,
        },
        { transaction: t }
        );
        
        await t.commit();
        const orderUpdatedData = await Orders.findOne({
          where: { id: order_id },
          include: [
            {
              model: OrderStatuses,
              as: "order_status",
              attributes: ["id", "status_name", "createdAt", "updatedAt"],
            },
          ]
        });
        const products = await Products.findAll({
          raw: true,
          nest:true,
          mapToModel: true,
          include: [
            {
              model: OrderDetails,
              required: true,
              where: {
                order_id
              }
            }
          ]
        })

      await orderStatusEmail(customerInfo, orderUpdatedData, order_status_message, products);

      return res
        .response({
          code: 200,
          status: "success",
          message: `Order Delivered successfully on Date ${new Date()}`,
          orderToUpdate,
        })
        .code(200);
    }

    //update status for ready for pickup

    // if (order_status_id === orderPickup.id) {
    //   orderToUpdate.order_status_id = orderPickup.id;
    //   orderToUpdate.order_pickup_datetime = pickup_datetime;

    //   await orderToUpdate.save({ transaction: t });

    //   await OrderStatusLogs.create(
    //     {
    //       order_id: orderToUpdate.id,
    //       order_status_id: orderPickup.id,
    //     },
    //     { transaction: t }
    //   );

    //   await t.commit();

    //   return res
    //     .response({
    //       code: 200,
    //       status: "success",
    //       message: `Order Ready for pick-up on Date ${pickup_datetime}`,
    //       orderToUpdate,
    //     })
    //     .code(200);
    // }

    // Check if refund status is being set and whether the order has specific logs
    // if (order_status_id === refundStatus.id) {
    //   const orderLog = await OrderStatusLogs.findOne({
    //     where: {
    //       order_id: order_id,
    //       order_status_id: {
    //         [Op.in]: [CancelByOnlinekingStatus.id],
    //       },
    //     },
    //   });

    //   // Handle the condition based on the existence of the order log
    //   if (!orderLog) {
    //     return res
    //       .response({
    //         code: 400,
    //         status: "error",
    //         message:
    //           "Refund cannot be processed as the order was not canceled by Kardify.",
    //       })
    //       .code(200);
    //   }
    // }
    //condition for confirming the order by admin----

    if (order_status_id === confirmedStatus.id) {
      if (orderToUpdate.accepted) {
        await t.rollback()
        return res
          .response({
            code: 400,
            status: "error",
            message: "Order has already been approved",
          })
          .code(400);
      }

      if (orderToUpdate.order_status.status_name === "Cancelled By Customer") {
        await t.rollback()
        return res
          .response({
            code: 400,
            status: "error",
            message: "Order has been already Cancelled By Customer",
          })
          .code(200);
      }

      orderToUpdate.accepted = true;
      //orderToUpdate.order_accepted_date = new Date();
      orderToUpdate.order_accepted_date = new Date().toLocaleString("en-US", {
        timeZone: "Asia/Kolkata",
      }); // Use your local timezone

      orderToUpdate.order_status_id = confirmedStatus.id;
      await orderToUpdate.save({ transaction: t });

      await OrderStatusLogs.create(
        {
          order_id: orderToUpdate.id,
          order_status_id: confirmedStatus.id,
          order_status_message,
        },
        { transaction: t }
      );

      await t.commit();

      const orderUpdatedData = await Orders.findOne({
        where: { id: order_id },
        include: [
          {
            model: OrderStatuses,
            as: "order_status",
            attributes: ["id", "status_name", "createdAt", "updatedAt"],
          },
        ],
      });
      const products = await Products.findAll({
        raw: true,
        nest:true,
        mapToModel: true,
        include: [
          {
            model: OrderDetails,
            required: true,
            where: {
              order_id
            }
          }
        ]
      })

      await orderStatusEmail(customerInfo, orderUpdatedData, order_status_message, products);

      return res
        .response({
          code: 200,
          status: "success",
          message: "Order approved successfully",
          orderToUpdate,
        })
        .code(200);
    }
    //condition for cancelling order by admin
    if (order_status_id === CancelByOnlinekingStatus.id) {
      //check if order if already cancelled
      if (orderToUpdate.order_status_id === CancelByOnlinekingStatus.id) {
        await t.rollback()
        return res
          .response({
            code: 400,
            status: "error",
            message: "Order has already been canceled",
          })
          .code(200);
      }

      orderToUpdate.accepted = false;
      orderToUpdate.order_status_id = order_status_id;
      orderToUpdate.rejected_reason = cancellation_reason;
      await orderToUpdate.save();

      //update the status log

      await OrderStatusLogs.create(
        {
          order_id: orderToUpdate.id,
          order_status_id: CancelByOnlinekingStatus.id,
          order_status_message,
        },
        { transaction: t }
      );

      await t.commit();
      const orderUpdatedData = await Orders.findOne({
        where: { id: order_id },
        include: [
          {
            model: OrderStatuses,
            as: "order_status",
            attributes: ["id", "status_name", "createdAt", "updatedAt"],
          },
        ],
      });
      const products = await Products.findAll({
        raw: true,
        nest:true,
        mapToModel: true,
        include: [
          {
            model: OrderDetails,
            required: true,
            where: {
              order_id
            }
          }
        ]
      })
      await orderStatusEmail(customerInfo, orderUpdatedData, order_status_message, products);

      return res
        .response({
          code: 200,
          status: "success",
          message: "Order canceled by admin successfully",
          orderToUpdate,
        })
        .code(200);
    }

    // Update the order status
    orderToUpdate.order_status_id = order_status_id;
    orderToUpdate.rejected_reason = cancellation_reason
    await orderToUpdate.save();

    // Log the new status
    await OrderStatusLogs.create({
      order_id: order_id,
      order_status_id: orderToUpdate.order_status_id,
      order_status_message,
    });
    const orderUpdatedData = await Orders.findOne({
        where: { id: order_id },
        include: [
          {
            model: OrderStatuses,
            as: "order_status",
            attributes: ["id", "status_name", "createdAt", "updatedAt"],
          },
        ],
      });

      const products = await Products.findAll({
        raw: true,
        nest:true,
        mapToModel: true,
        include: [
          {
            model: OrderDetails,
            required: true,
            where: {
              order_id
            }
          }
        ]
      })

    console.log(orderToUpdate.order_status.status_name);

    await orderStatusEmail(customerInfo, orderUpdatedData, order_status_message, products);

    return res
      .response({
        code: 200,
        status: "success",
        message: "Order status updated successfully",
      })
      .code(200);
  } catch (error) {
    await t.rollback()
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

const orderStatusEmail = async (user, order, message, products) => {
  console.log('orderStatusEmail order', products);
  const template = await ejs.renderFile(
    __dirname + "/templates/mail_order_status_tempelate.ejs",
    {
      application_name: "Online King",
      user_name: user?.fullname,
      order_id: order?.order_id,
      products: products,
      order_status: order?.order_status?.status_name,
      order_status_message: message,
    }
  );

  const mailOptions = {
    from: '"OnlineKing" <support@onlineking.in>',
    to: user.username,
    subject: "Order Status Update",
    html: template,
  };

  await mailer.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      return;
    }
    console.log("Message sent: %s", info);
  });
};
const orderConfirmEmail = async (user, order, message, products) => {
  try {
    const template = await ejs.renderFile(
      __dirname + "/templates/order_placed_template.ejs",
      {
        application_name: "Online King",
        user_name: user?.fullname,
        order_id: order?.id,
        products: products,
        order_status: 'Placed',
        order_status_message: 'Order Placed successfully',
      }
    );
  
    const mailOptions = {
      from: '"OnlineKing" <support@onlineking.in>',
      to: user?.username,
      subject: "Order Placed successfully",
      html: template,
    };
    console.log('orders_controllers.js @ Line 1318:', mailOptions);
  
    await mailer.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        return;
      }
      console.log("Message sent: %s", info);
    });
  } catch (error) {
    console.log('orders_controllers.js @ Line 1328:', error);
  }
};

const downloadOrderInvoice = async (req, res) => {
  try {
    const user = await checkToken(
      req.headers["Authorization"]
        ? req.headers["Authorization"]
        : req.headers.authorization
    );
    const { order_id } = req.payload;
    const allowed_user = ["CUSTOMER", "ADMIN"];

    //check if user is valid and permission
    if (!allowed_user.includes(user.role)) {
      return res
        .response({
          code: 403,
          status: "error",
          message: "You don not have permission.",
        })
        .code(200);
    }
    //find the order from order table
    const newOrder = await Orders.findOne({
      where: {
        id: order_id,
      },
      include: [
        AddressModel,
        Customers,
        {
          model: OrderDetails,
          // include: [
          //   {
          //     model: Products,
          //   },

          // ],
        },
      ],
    });

    if (!newOrder) {
      return res.response({
        code: 404,
        status: "error",
        message: "No order found for given order_id",
      });
    }

    const pdfRawData = await generatePdfData(newOrder);

    const pdfBuffer = await generateInvoice(pdfRawData);

    // Return the PDF as a file download
    return res
      .response({
        data: pdfBuffer,
      })
      .type("application/pdf")
      .header("Content-Disposition", "attachment; filename=invoice.pdf")
      .code(200);
  } catch (error) {
    console.log("Error in generating invoice", error);

    return res
      .response({
        code: 500,
        status: "error",
        message: "Failed to generate invoice",
      })
      .code(500);
  }
};

const generateInvoice = async (data) => {
  try {
    const templatePath = path.resolve(
      __dirname,
      "./templates/invoice_templates.html"
    );
    const templateHtml = fs.readFileSync(templatePath, "utf8");

    const template = handlebars.compile(templateHtml);

    // Replace placeholders with dynamic data
    const html = template(data);
    const debugDirPath = path.resolve(__dirname, "./debug");
    // Ensure the debug directory exists
    if (!fs.existsSync(debugDirPath)) {
      fs.mkdirSync(debugDirPath, { recursive: true });
      console.log(`Created debug directory at: ${debugDirPath}`);
    }
    const debugHtmlPath = path.resolve(__dirname, "./debug/invoice_debug.html");
    fs.writeFileSync(debugHtmlPath, html, "utf-8");

    console.log(`Generated HTML saved to: ${debugHtmlPath}`);

    // Use Puppeteer to generate the PDF
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    //await page.setContent(html, { waitUntil: "load" });
    // Navigate to the served HTML
    await page.goto("http://localhost:4002/api/invoice", { waitUntil: "load" });

    const pdfDebugPath = path.resolve(__dirname, "./debug/invoice_debug.pdf");

    // await page.screenshot({
    //   path: "./debug/invoice_debug.png",
    //   fullPage: true,
    // });
    // console.log(
    //   "Screenshot of rendered HTML saved to: ./debug/invoice_debug.png"
    // );

    // Generate the PDF in memory
    const pdfBuffer = await page.pdf({
      path: pdfDebugPath,
      format: "A4",
      printBackground: true,
    });

    await browser.close();

    console.log(`Generated PDF buffer size: ${pdfBuffer.length} bytes`);

    // Return the PDF buffer
    return pdfBuffer;
  } catch (error) {
    console.error("Error generating invoice:", error);
    throw new Error("Failed to generate invoice");
  }
};

const generatePdfData = async (orderDetails) => {
  // Fetch address data using the helper function
  console.log(orderDetails, "ok");
  const addressData = await generateUserAddress(
    orderDetails.user_id,
    orderDetails.user_address_id
  );

  // Map order details to template placeholders
  const pdfData = {
    ...addressData, // Spread billing and shipping address fields directly

    orderNumber: orderDetails.order_id,
    invoiceNumber: `INV-${orderDetails.id}`, // Example format for invoice number
    orderDate: orderDetails.order_date
      ? new Date(orderDetails.order_date).toLocaleDateString()
      : new Date(orderDetails.createdAt).toLocaleDateString(),
    invoiceDate: new Date().toLocaleDateString(), // Today's date as invoice date
    placeOfSupply: addressData.billingState, // Use billingState as place of supply
    placeOfDelivery: addressData.shippingCity, // Use shippingCity as place of delivery

    // Itemized details
    items: orderDetails.order_details.map((item, index) => ({
      serialNumber: index + 1,
      description: item.product_description || item.product.product_name,
      unitPrice: item.unit_price,
      discount: item.discount,
      quantity: item.quantity,
      netAmount: item.sub_total,
      taxRate: item.gst,
      taxType: "IGST" || "N/A",
      taxAmount: item.igst || 0,
      totalAmount: item.total_amount,
    })),

    // Summary
    totalTax: orderDetails.order_details.reduce(
      (sum, item) => sum + (item.igst || 0),
      0
    ),
    totalAmount: orderDetails.total_paid_amount || 0,
    // amountInWords: convertNumberToWords(orderDetails.total_paid_amount || 0), // Helper function to convert amount to words
  };

  return pdfData;
};

const generateUserAddress = async (userId, addressId) => {
  console.log(userId, addressId);
  try {
    // Fetch the Address by ID
    const orderAddress = await AddressModel.findOne({
      where: {
        id: addressId,
      },
    });

    if (!orderAddress) {
      throw new Error("Address not found");
    }

    // Check if the address is of type Billing
    if (orderAddress.type === "Billing") {
      const shippingAddress = await AddressModel.findOne({
        where: {
          user_id: userId,
          add_type: "Shipping",
        },
      });

      // Return formatted billing and shipping addresses with GST
      return {
        billingName: orderAddress.fullname,
        billingAddress: `${orderAddress.add1} ${
          orderAddress.add2 || ""
        }`.trim(),
        billingCity: orderAddress.city,
        billingState: orderAddress.state,
        billingPostalCode: orderAddress.zipcode,
        billingCountry: orderAddress.country,
        billingGST: orderAddress.gst_no || null, // Include GST number for Billing
        shippingName: shippingAddress
          ? shippingAddress.fullname
          : orderAddress.fullname,
        shippingAddress: shippingAddress
          ? `${shippingAddress.add1} ${shippingAddress.add2 || ""}`.trim()
          : `${orderAddress.add1} ${orderAddress.add2 || ""}`.trim(),
        shippingCity: shippingAddress
          ? shippingAddress.city
          : orderAddress.city,
        shippingState: shippingAddress
          ? shippingAddress.state
          : orderAddress.state,
        shippingPostalCode: shippingAddress
          ? shippingAddress.zipcode
          : orderAddress.zipcode,
        shippingCountry: shippingAddress
          ? shippingAddress.country
          : orderAddress.country,
        shippingGST: shippingAddress
          ? shippingAddress.gst_no || null
          : orderAddress.gst_no || null, // Include GST number for Shipping
      };
    }

    // Check if the address is of type Shipping
    if (orderAddress.type === "Shipping") {
      const billingAddress = await AddressModel.findOne({
        where: {
          user_id: userId,
          add_type: "Billing",
        },
      });

      // Return formatted billing and shipping addresses with GST
      return {
        billingName: billingAddress
          ? billingAddress.fullname
          : orderAddress.fullname,
        billingAddress: billingAddress
          ? `${billingAddress.add1} ${billingAddress.add2 || ""}`.trim()
          : `${orderAddress.add1} ${orderAddress.add2 || ""}`.trim(),
        billingCity: billingAddress ? billingAddress.city : orderAddress.city,
        billingState: billingAddress
          ? billingAddress.state
          : orderAddress.state,
        billingPostalCode: billingAddress
          ? billingAddress.zipcode
          : orderAddress.zipcode,
        billingCountry: billingAddress
          ? billingAddress.country
          : orderAddress.country,
        billingGST: billingAddress
          ? billingAddress.gst_no || null
          : orderAddress.gst_no || null, // Include GST number for Billing
        shippingName: orderAddress.fullname,
        shippingAddress: `${orderAddress.add1} ${
          orderAddress.add2 || ""
        }`.trim(),
        shippingCity: orderAddress.city,
        shippingState: orderAddress.state,
        shippingPostalCode: orderAddress.zipcode,
        shippingCountry: orderAddress.country,
        shippingGST: orderAddress.gst_no || null, // Include GST number for Shipping
      };
    }

    throw new Error("Invalid address type");
  } catch (error) {
    console.error("Error generating user address:", error);
    throw error; // Re-throw to handle further up in the stack
  }
};

const showInvoice = async (req, res) => {
  try {
    const debugHtmlPath = path.resolve(__dirname, "./debug/invoice_debug.html");
    const debugHtml = fs.readFileSync(debugHtmlPath, "utf-8");
    return res.response(debugHtml).type("text/html");
  } catch (error) {
    console.error("Error serving invoice:", error);
    return res
      .response({
        code: 500,
        status: "error",
        message: "Failed to load invoice",
      })
      .code(500);
  }
};

module.exports = {
  getAllOrdersAdmin,
  getOrderForCustomer,
  createOrder,
  approveOrderByAdmin,
  cancelOrderByAdmin,
  getAllOrderStatuses,
  updateOrderStatus,
  downloadOrderInvoice,
  showInvoice,
};
