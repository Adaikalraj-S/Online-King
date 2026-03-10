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
  ProductImages,
  Combinations,
  AttributeCombinatios,
  ProductAttributes,
  PreOrder,
} = require("../models");
const { Op } = require("sequelize");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

const addToPreOrder = async (req, res) => {
  try {
    const user = await checkToken(
      req.headers["Authorization"]
        ? req.headers["Authorization"]
        : req.headers.authorization
    );

    const allowed_user = ["DEALER", "CUSTOMER"];
    if (allowed_user.includes(user.role) && user.application === "kardify") {
      const { product_id, quantity, combination_id } = req.payload;

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
      if (Number(available_product.pre_order_limit) < quantity) {
        return res
          .response({
            code: 400,
            status: "error",
            message: `Pre order limit is ${available_product.pre_order_limit}`,
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

      const existingProduct = await PreOrder.findOne({
        where: {
          [ownerId]: user.id,
          product_id,
          pre_order_status: false
        },
      });
      
      const existingCombination = await PreOrder.findOne({
        where: {
          [ownerId]: user.id,
          combination_id,
          pre_order_status: false
        },
      });

      const cartQuantity = quantity ? quantity : 1;

      if (existingProduct && existingCombination) {
        return res
          .response({
            code: 400,
            status: "error",
            message: existingProduct
              ? "Product is already in the Pre order cart"
              : "combination is already in the Pre order cart",
          })
          .code(200);
      } else {
        await PreOrder.create({
          [ownerId]: user.id,
          product_id,
          combination_id,
          pre_order_status: false,
          quantity: cartQuantity,
        });
      }

      return res
        .response({
          code: 201,
          status: "success",
          message: "Added to Pre order cart successfully",
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

const getPreOrderCart = async (req, res) => {
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
            message: "You don't have permission for this action.",
          })
          .code(200);
      }

      const cartItems = await PreOrder.findAll({
        where: {
          [ownerId]: user.id,
          pre_order_status: false,
        },
        include: [
          {
            model: Products,
            where: {
              status: true,
            },
            include: [
              {
                model: ProductImages,
                as: "images",
              },
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
            ],
          },
          {
            model: Combinations,
          },
        ],
      });

      let totalPrice = 0;
      let totalProductPrice = 0;

      for (const cartItem of cartItems) {
        const product = await Products.findOne({
          where: {
            id: cartItem.product.id,
            status: true,
          },
        });

        //modify discount for applying offer

        const newCurrentData = new Date(new Date().setHours(0, 0, 0, 0));
        const currentDate = new Date(newCurrentData);

        if (
          product.offer_start_date &&
          product.is_offer_avl &&
          new Date(product.offer_start_date) <= currentDate &&
          (!product.offer_end_date ||
            new Date(product.offer_end_date) >= currentDate)
        ) {
          product.discount = product.offer_discount;
          product.discount_type = product.offer_discount_type;
        }

        //end of logic for modifying discount for applying offer

        const combination = await Combinations.findOne({
          where: {
            id: cartItem.combination_id,
          },
        });

        let unitPrice = 0;
        if (combination) {
          unitPrice = combination.price;

          totalProductPrice += unitPrice * cartItem.quantity;

          if (product.discount_type === "amount") {
            unitPrice -= product.discount;
          } else if (product.discount_type === "percent") {
            unitPrice -= unitPrice * (product.discount / 100);
          }
        } else if (product) {
          unitPrice = product.default_price;

          totalProductPrice += unitPrice * cartItem.quantity;

          if (product.discount_type === "amount") {
            unitPrice -= product.discount;
          } else if (product.discount_type === "percent") {
            unitPrice -= product.default_price * (product.discount / 100);
          }
        }

        const itemTotal = unitPrice * cartItem.quantity;
        totalPrice += itemTotal;
        cartItem.dataValues.unitPrice = parseFloat(unitPrice.toFixed(2));
        cartItem.dataValues.itemTotal = parseFloat(itemTotal.toFixed(2)); // Add this line
      }

      totalPrice = parseFloat(totalPrice.toFixed(2));
      totalMrp = parseFloat(totalProductPrice.toFixed(2));

      cartItems.totalMrp = totalMrp;
      cartItems.totalPrice = totalPrice;
      console.log("totalPrice", totalPrice);
      console.log("totalMrp", totalMrp);

      return res
        .response({
          code: 200,
          status: "success",
          totalPrice,
          totalMrp,
          cartItems,
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

const handleIncrement = async (req, res) => {
  try {
    const user = await checkToken(
      req.headers["Authorization"]
        ? req.headers["Authorization"]
        : req.headers.authorization
    );

    const allowed_user = ["DEALER", "CUSTOMER"];
    if (allowed_user.includes(user.role) && user.application === "kardify") {
      const { product_id, combination_id } = req.payload;

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
            message: "You don't have permission for this action.",
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

      // Find the product and check stock availability
      const product = await Products.findOne({
        where: {
          id: product_id,
          status: true,
        },
      });

      if (!product) {
        return res
          .response({
            code: 404,
            status: "error",
            message: `Product not found or not available`,
          })
          .code(200);
      }

      let availableStock = Math.max(product.pre_order_limit, product.pre_order_stock);

      if (combination_id) {
        // If combination is specified, check stock up to combination stock
        const combination = await Combinations.findOne({
          where: {
            id: combination_id,
            product_id,
          },
        });

        if (!combination) {
          return res
            .response({
              code: 404,
              status: "error",
              message: `Combination not found for product`,
            })
            .code(200);
        }

        availableStock = Math.max(combination.pre_order_limit, combination.pre_order_status);
      }

      // Find the cart item
      const cartItem = await PreOrder.findOne({
        where: {
          [ownerId]: user.id,
          product_id,
          combination_id,
          pre_order_status: false,
        },
      });

      if (!cartItem) {
        return res
          .response({
            code: 404,
            status: "error",
            message: `Cart item not found`,
          })
          .code(200);
      }

      // Check if incrementing will exceed available stock
      if ((Number(cartItem.quantity) + 1) > availableStock) {
        return res
          .response({
            code: 400,
            status: "error",
            message: `Cannot increment quantity. Pre order limit exceeded.`,
          })
          .code(200);
      }

      // Increment the quantity
      const newQuantity = Number(cartItem.quantity) + 1;
      await PreOrder.update(
        { quantity: newQuantity },
        {
          where: {
            id: cartItem.id,
          },
        }
      );

      return res
        .response({
          code: 200,
          status: "success",
          message: "Quantity incremented successfully",
          newQuantity,
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

const handleDecrement = async (req, res) => {
  try {
    const user = await checkToken(
      req.headers["Authorization"]
        ? req.headers["Authorization"]
        : req.headers.authorization
    );

    const allowed_user = ["DEALER", "CUSTOMER"];
    if (allowed_user.includes(user.role) && user.application === "kardify") {
      const { product_id, combination_id } = req.payload;

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
            message: "You don't have permission for this action.",
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

      // Find the cart item
      const cartItem = await PreOrder.findOne({
        where: {
          [ownerId]: user.id,
          product_id,
          combination_id,
        },
      });

      if (!cartItem) {
        return res
          .response({
            code: 404,
            status: "error",
            message: `Cart item not found`,
          })
          .code(200);
      }

      // Check if quantity is already 1
      if (cartItem.quantity === 1) {
        return res
          .response({
            code: 400,
            status: "error",
            message: `Cannot decrement quantity. Minimum quantity reached.`,
          })
          .code(200);
      }

      // Decrement the quantity
      const newQuantity = cartItem.quantity - 1;
      await PreOrder.update(
        { quantity: newQuantity },
        {
          where: {
            id: cartItem.id,
          },
        }
      );

      return res
        .response({
          code: 200,
          status: "success",
          message: "Quantity decremented successfully",
          newQuantity,
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

const removeFromPreOrderCart = async (req, res) => {
  try {
    const user = await checkToken(
      req.headers["Authorization"]
        ? req.headers["Authorization"]
        : req.headers.authorization
    );

    const allowed_user = ["DEALER", "CUSTOMER"];
    if (allowed_user.includes(user.role) && user.application === "kardify") {
      const { product_id, combination_id } = req.payload;

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
            message: "You don't have permission for this action.",
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

      // Find the cart item
      const cartItem = await PreOrder.findOne({
        where: {
          [ownerId]: user.id,
          product_id,
          combination_id,
        },
      });

      if (!cartItem) {
        return res
          .response({
            code: 404,
            status: "error",
            message: `Cart item not found`,
          })
          .code(200);
      }

      // Delete the cart item
      await PreOrder.destroy({
        where: {
          id: cartItem.id,
        },
      });

      return res
        .response({
          code: 200,
          status: "success",
          message: "Item removed from Pre Order cart successfully",
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
  addToPreOrder,
  getPreOrderCart,
  handleIncrement,
  handleDecrement,
  removeFromPreOrderCart,
};
