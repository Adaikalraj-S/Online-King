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
} = require("../models");
const { Op } = require("sequelize");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

const addToCart = async (req, res) => {
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

      const existingProduct = await Carts.findOne({
        where: {
          [ownerId]: user.id,
          product_id,
        },
      });

      const existingCombination = await Carts.findOne({
        where: {
          [ownerId]: user.id,
          combination_id,
        },
      });

      const cartQuantity = quantity ? quantity : 1;

      if (existingProduct && existingCombination) {
        return res
          .response({
            code: 400,
            status: "error",
            message: existingProduct
              ? "Product is already in the cart"
              : "combination is already in the cart",
          })
          .code(200);
      } else {
        await Carts.create({
          [ownerId]: user.id,
          product_id,
          combination_id,
          quantity: cartQuantity,
        });
      }

      return res
        .response({
          code: 201,
          status: "success",
          message: "Added to cart successfully",
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

// const getCart = async (req, res) => {
//   try {
//     const user = await checkToken(
//       req.headers["Authorization"]
//         ? req.headers["Authorization"]
//         : req.headers.authorization
//     );

//     const allowed_user = ["DEALER", "CUSTOMER"];
//     if (allowed_user.includes(user.role) && user.application === "kardify") {
//       let model;
//       let ownerId;
//       if (user.role === "DEALER") {
//         model = Dealers;
//         ownerId = "dealer_id";
//       } else if (user.role === "CUSTOMER") {
//         model = Customers;
//         ownerId = "user_id";
//       } else {
//         return res
//           .response({
//             code: 403,
//             status: "error",
//             message: "You don't have permission for this action.",
//           })
//           .code(200);
//       }

//       let totalPrice = 0;
//       let unitPrice = 0;

//       const cartItems = await Carts.findAll({
//         where: {
//           [ownerId]: user.id,
//         },
//         include: [
//           {
//             model: Products,
//             where: {
//               status: true,
//             },
//             include: [
//               {
//                 model: ProductImages,
//                 as: "images",
//               },
//             ],
//           },
//           {
//             model: Combinations
//           },
//         ],
//       });

//       for (const cartItem of cartItems) {
//         const product = await Products.findOne({
//           where: {
//             id: cartItem.product.id,
//             status: true,
//           },
//         });

//         const combination = await Combinations.findOne({
//           where: {
//             id: cartItem.combination_id,
//           },
//         });

//         if (combination) {
//           let itemPrice = combination.price;

//           if (product.discount_type === "amount") {
//             itemPrice -= product.discount;
//           } else if (product.discount_type === "percent") {
//             itemPrice -= itemPrice * (product.discount / 100);
//           }

//           totalPrice += itemPrice * cartItem.quantity;
//         } else if (product) {
//           let itemPrice = product.default_price;

//           if (product.discount_type === "amount") {
//             itemPrice -= product.discount;
//           } else if (product.discount_type === "percent") {
//             itemPrice -= product.default_price * (product.discount / 100);
//           }

//           totalPrice += itemPrice * cartItem.quantity;
//         }
//       }

//       return res
//         .response({
//           code: 200,
//           status: "success",
//           totalPrice,
//           cartItems,
//         })
//         .code(200);
//     } else if (user == "Session expired") {
//       return res
//         .response({
//           code: 401,
//           status: "error",
//           message: user,
//         })
//         .code(200);
//     } else {
//       return res
//         .response({
//           code: 403,
//           status: "error",
//           message: "You don't have permission for this action.",
//         })
//         .code(200);
//     }
//   } catch (error) {
//     console.error(error);
//     return res
//       .response({
//         code: 500,
//         status: "error",
//         message: "Something went wrong",
//       })
//       .code(200);
//   }
// };

const getCart = async (req, res) => {
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

      const cartItems = await Carts.findAll({
        where: {
          [ownerId]: user.id,
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
        let main_discount = {}
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

// const handleIncrement = async (req, res) => {
//   try {
//     const user = await checkToken(
//       req.headers["Authorization"]
//         ? req.headers["Authorization"]
//         : req.headers.authorization
//     );

//     const allowed_user = ["DEALER", "CUSTOMER"];
//     if (allowed_user.includes(user.role) && user.application === "kardify") {
//       const { product_id, combination_id } = req.payload;

//       let ownerId;
//       if (user.role === "DEALER") {
//         ownerId = "dealer_id";
//       } else if (user.role === "CUSTOMER") {
//         ownerId = "user_id";
//       }

//       // const existingProduct = await Carts.findOne({
//       //   where: {
//       //     [ownerId]: user.id,
//       //     product_id,
//       //   },
//       // });
//       // if (!existingProduct) {
//       //   return res
//       //     .response({
//       //       code: 400,
//       //       status: "error",
//       //       message: "Product not found in the cart",
//       //     })
//       //     .code(200);
//       // }

//       const availableProduct = await Products.findOne({
//         where: {
//           id: product_id,
//           status: true,
//         },
//         raw: true,
//       });

//       if (!availableProduct) {
//         return res
//           .response({
//             code: 400,
//             status: "error",
//             message: "Product details not found",
//           })
//           .code(200);
//       }

//       // ADD for variant logic-------------

//       if (combination_id) {
//         console.log(combination_id, "combination_id");

//         const availableCombination = await Combinations.findOne({
//           where: {
//             id: combination_id,
//           },
//           raw: true,
//         });

//         const existingCombination = await Carts.findOne({
//           where: {
//             [ownerId]: user.id,
//             combination_id,
//           },
//         });

//         if (!existingCombination) {
//           return res
//             .response({
//               code: 400,
//               status: "error",
//               message: "Varaint not found in the cart",
//             })
//             .code(200);
//         }

//         const totalVariantInCart = existingCombination.quantity;

//         const remainingVaraintStock =
//           availableCombination.stock - totalVariantInCart;

//         if (remainingVaraintStock <= 0) {
//           return res.response({
//             code: 400,
//             status: "error",
//             messages: "Maximum quantity reached",
//           });
//         }

//         existingCombination.quantity += 1;
//         await existingCombination.save();

//         return res
//           .response({
//             code: 200,
//             status: "success",
//             message: "Quantity  variant incremented successfully",
//           })
//           .code(200);
//       } else {
//         console.log(combination_id, "combination-idKL--------");

//         const existingProduct = await Carts.findOne({
//           where: {
//             [ownerId]: user.id,
//             product_id,
//             combination_id: null,
//           },
//         });
//         if (!existingProduct) {
//           return res
//             .response({
//               code: 400,
//               status: "error",
//               message: "Product not found in the cart",
//             })
//             .code(200);
//         }

//         const totalQuantityInCart = existingProduct.quantity;

//         const remainingStock = availableProduct.stock - totalQuantityInCart;

//         if (remainingStock <= 0) {
//           return res
//             .response({
//               code: 400,
//               status: "error",
//               message: "Maximum quantity reached",
//             })
//             .code(200);
//         }

//         existingProduct.quantity += 1;
//         await existingProduct.save();

//         return res
//           .response({
//             code: 200,
//             status: "success",
//             message: "Quantity incremented successfully",
//           })
//           .code(200);
//       }
//     } else if (user == "Session expired") {
//       return res
//         .response({
//           code: 401,
//           status: "error",
//           message: user,
//         })
//         .code(200);
//     } else {
//       return res
//         .response({
//           code: 403,
//           status: "error",
//           message: "You don't have permission for this action.",
//         })
//         .code(200);
//     }
//   } catch (error) {
//     console.error(error);
//     return res
//       .response({
//         code: 500,
//         status: "error",
//         message: "Something went wrong",
//       })
//       .code(200);
//   }
// };

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

      let availableStock = product.stock;

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

        availableStock = combination.stock;
      }

      // Find the cart item
      const cartItem = await Carts.findOne({
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

      // Check if incrementing will exceed available stock
      if (cartItem.quantity + 1 > availableStock) {
        return res
          .response({
            code: 400,
            status: "error",
            message: `Cannot increment quantity. Stock limit exceeded.`,
          })
          .code(200);
      }

      // Increment the quantity
      const newQuantity = cartItem.quantity + 1;
      await Carts.update(
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

// const handleDecrement = async (req, res) => {
//   try {
//     const user = await checkToken(
//       req.headers["Authorization"]
//         ? req.headers["Authorization"]
//         : req.headers.authorization
//     );

//     const allowed_user = ["DEALER", "CUSTOMER"];
//     if (allowed_user.includes(user.role) && user.application === "kardify") {
//       const { product_id, combination_id } = req.payload;

//       let ownerId;
//       if (user.role === "DEALER") {
//         ownerId = "dealer_id";
//       } else if (user.role === "CUSTOMER") {
//         ownerId = "user_id";
//       }

//       const existingProduct = await Carts.findOne({
//         where: {
//           [ownerId]: user.id,
//           product_id,
//           combination_id: null,
//         },
//       });

//       if (combination_id) {
//         const existingCombination = await Carts.findOne({
//           where: {
//             [ownerId]: user.id,
//             combination_id,
//           },
//         });

//         if (!existingCombination) {
//           return res
//             .response({
//               code: 400,
//               status: "error",
//               message: "Varaint not found in the cart",
//             })
//             .code(200);
//         }

//         if (existingCombination.quantity > 1) {
//           existingCombination.quantity -= 1;
//           await existingCombination.save();

//           return res
//             .response({
//               code: 200,
//               status: "success",
//               message: "Quantity decremented successfully",
//             })
//             .code(200);
//         } else {
//           return res.response({
//             code: 400,
//             status: "error",
//             messages: "Mainimum quantity reached",
//           });
//         }
//       } else if (existingProduct) {
//         if (existingProduct.quantity > 1) {
//           existingProduct.quantity -= 1;
//           await existingProduct.save();
//         }
//         return res
//           .response({
//             code: 200,
//             status: "success",
//             message: "Quantity decremented successfully",
//           })
//           .code(200);
//       }
//     } else if (user == "Session expired") {
//       return res
//         .response({
//           code: 401,
//           status: "error",
//           message: user,
//         })
//         .code(200);
//     } else {
//       return res
//         .response({
//           code: 403,
//           status: "error",
//           message: "You don't have permission for this action.",
//         })
//         .code(200);
//     }
//   } catch (error) {
//     console.error(error);
//     return res
//       .response({
//         code: 500,
//         status: "error",
//         message: "Something went wrong",
//       })
//       .code(200);
//   }
// };

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
      const cartItem = await Carts.findOne({
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
      await Carts.update(
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

// const removeFromCart = async (req, res) => {
//   try {
//     const user = await checkToken(
//       req.headers["Authorization"]
//         ? req.headers["Authorization"]
//         : req.headers.authorization
//     );

//     const allowed_user = ["DEALER", "CUSTOMER"];
//     if (allowed_user.includes(user.role) && user.application === "kardify") {
//       const { product_id, combination_id } = req.payload;
//       let model, ownerId;
//       if (user.role === "DEALER") {
//         model = Dealers;
//         ownerId = "dealer_id";
//       } else if (user.role === "CUSTOMER") {
//         model = Customers;
//         ownerId = "user_id";
//       } else {
//         return res
//           .response({
//             code: 403,
//             status: "error",
//             message: "You don't have permission for this action.",
//           })
//           .code(200);
//       }

//       const existingProduct = await Products.findOne({
//         where: {
//           id: product_id,
//         },
//       });

//       const existingCombination = await Carts.findOne({
//         where: {
//           combination_id: combination_id,
//         },
//       });

//       if (!existingProduct) {
//         return res
//           .response({
//             code: 400,
//             status: "error",
//             message: `Product not found`,
//           })
//           .code(200);
//       }

//       if (existingCombination) {
//         await Carts.destroy({
//           where: {
//             [ownerId]: user.id,
//             combination_id: combination_id,
//           },
//         });
//       } else {
//         await Carts.destroy({
//           where: {
//             [ownerId]: user.id,
//             product_id: product_id,
//           },
//         });
//       }

//       // await Carts.destroy({
//       //   where: {
//       //     [ownerId]: user.id,
//       //     product_id: product_id,
//       //   },
//       // });

//       return res
//         .response({
//           code: 200,
//           status: "success",
//           message: "Item removed from cart successfully.",
//         })
//         .code(200);
//     } else if (user === "Session expired") {
//       return res
//         .response({
//           code: 401,
//           status: "error",
//           message: user,
//         })
//         .code(200);
//     } else {
//       return res
//         .response({
//           code: 403,
//           status: "error",
//           message: "You don't have permission for this action.",
//         })
//         .code(200);
//     }
//   } catch (error) {
//     console.error(error);
//     return res
//       .response({
//         code: 500,
//         status: "error",
//         message: "Something went wrong",
//       })
//       .code(200);
//   }
// };

const removeFromCart = async (req, res) => {
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
      const cartItem = await Carts.findOne({
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
      await Carts.destroy({
        where: {
          id: cartItem.id,
        },
      });

      return res
        .response({
          code: 200,
          status: "success",
          message: "Item removed from cart successfully",
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
  addToCart,
  getCart,
  handleIncrement,
  handleDecrement,
  removeFromCart,
};
