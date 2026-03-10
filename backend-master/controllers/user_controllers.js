const jwt = require("jsonwebtoken");
const ejs = require("ejs");
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
    JWT_SECRET,
  },
  sequelize,
} = require("../config");
const {
  Users,
  Admins,
  Customers,
  Dealers,
  AddressModel,
  Otp,
  Orders,
  OrderStatuses,
  OrderStatusLogs,
  OrderDetails,
  Categories,
  SubCategories,
  SuperSubCategories,
  Products,
  ProductImages,
} = require("../models");
const { Op } = require("sequelize");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const { uploadFile } = require("../helpers");

const verifyToken = async (req, res) => {
  const token = req.headers["authorization"] || req.headers["Authorization"];

  if (!token) {
    return res.status(401).json({ message: "Authorization header missing" });
  }

  const verifier = checkToken(token);

  const user = await Customers.findOne({
    where: {
      username: verifier.username,
    },
    attributes: {
      exclude: ["password", "createdAt", "updatedAt", "deletedAt"],
    },
  });

  // console.log(user, "user");

  if (verifier) {
    return res
      .response({
        code: 200,
        status: "success",
        verifier,
        user,
      })
      .code(200);
  } else {
    return res
      .response({
        code: 401,
        status: "error",
        message: "session expired",
      })
      .code(200);
  }
};

const getRole = async (req, res) => {
  try {
    const user = await checkToken(
      req.headers["Authorization"]
        ? req.headers["Authorization"]
        : req.headers.authorization
    );

    if (user.role === "CUSTOMER" && user.application === "kardify") {
      return res
        .response({
          code: 200,
          status: "success",
          message: "Users fetched successfully",
          role: user.role,
        })
        .code(200);
    }
    if (user.role === "DEALER" && user.application === "kardify") {
      return res
        .response({
          code: 200,
          status: "success",
          message: "Dealers fetched successfully",
          role: user.role,
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
    return res
      .response({
        code: 401,
        status: "error",
        message: "Session expired",
      })
      .code(200);
  }
};

const getUser = async (req, res) => {
  try {
    const user = await checkToken(
      req.headers["Authorization"]
        ? req.headers["Authorization"]
        : req.headers.authorization
    );

    const allowed_users = ["ADMIN"];
    if (allowed_users.includes(user.role) && user.application === "kardify") {
      const users = await Customers.findAll({
        where: {
          verified: true,
        },
        include: [
          {
            model: AddressModel,
          },
          {
            model: Orders,

            include: [
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
          },
        ],
        attributes: {
          exclude: ["password", "accessToken", "refreshToken", "device_token"],
        },
      });
      return res
        .response({
          code: 200,
          status: "success",
          message: "Users fetched successfully",
          customers: users,
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
        code: 401,
        status: "error",
        message: "Session expired",
      })
      .code(200);
  }
};

const getDealers = async (req, res) => {
  try {
    const user = await checkToken(
      req.headers["Authorization"]
        ? req.headers["Authorization"]
        : req.headers.authorization
    );

    if (user.role === "ADMIN" && user.application === "kardify") {
      let filter = {
        verified: true,
      };

      const users = await Dealers.findAll({
        where: filter,
        attributes: {
          exclude: ["password", "accessToken", "refreshToken", "device_token"],
        },
      });
      return res
        .response({
          code: 200,
          status: "success",
          message: "Dealers fetched successfully",
          dealers: users,
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
    return res
      .response({
        code: 401,
        status: "error",
        message: "Session expired",
      })
      .code(200);
  }
};

const addNewAdmin = async (req, res) => {
  try {
    const user = await checkToken(
      req.headers["Authorization"]
        ? req.headers["Authorization"]
        : req.headers.authorization
    );
    const { fullname, email, password } = req.payload;
    if (user.role?.toLowerCase() == "admin" && user.application == "kardify") {
      const available_email = await Admins.findOne({
        where: {
          email,
        },
        raw: true,
      });
      if (!available_email) {
        const created_admin = await Admins.create({
          fullname: fullname,
          email: email,
          password: await makeHash(password),
        });
        return res
          .response({
            code: 200,
            status: "success",
            message: "Admin created successfully.",
            created_admin,
          })
          .code(200);
      } else {
        return res
          .response({
            code: 409,
            status: "error",
            message: "Email already registered.",
          })
          .code(200);
      }
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
          message: "You dont have the permission for this operation.",
        })
        .code(200);
    }
  } catch (error) {
    console.log(error);
    return res
      .response({
        code: 400,
        status: "error",
        message: error.message,
      })
      .code(200);
  }
};

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.payload;
    const user = await Admins.findOne({
      where: {
        email,
      },
      raw: true,
    });
    if (user) {
      const checkedPassword = await checkHash(password, user.password);
      if (checkedPassword) {
        const user_details = {
          id: user.id,
          fullname: user.fullname,
          email: user.email,
          role: "ADMIN",
          application: "kardify",
        };
        const token = await makeToken(user_details);
        const refToken = await makeRefreshToken(user_details);
        await Admins.update(
          {
            accessToken: token,
            refreshToken: refToken,
          },
          {
            where: {
              id: user.id,
            },
          }
        );
        return res
          .response({
            code: 200,
            status: "success",
            message: "Login successful.",
            token,
            refreshToken: refToken,
          })
          .code(200);
      } else {
        return res
          .response({
            code: 203,
            status: "error",
            message: "Incorrect password. Check your password and try again.",
          })
          .code(200);
      }
    } else {
      return res
        .response({
          code: 404,
          status: "error",
          message: "Email not registered. Check your email and try again.",
        })
        .code(200);
    }
  } catch (error) {
    console.log(error);
    return res
      .response({
        code: 400,
        status: "error",
        message: error.message,
      })
      .code(200);
  }
};

const validateOtpCustomer = async (req, res) => {
  try {
    const { type } = req.query;
    const { user_id, otp } = req.payload;
    let userData = null;
    if (type == "CUSTOMER") {
      userData = await Customers.findOne({
        where: {
          id: user_id,
        },
        raw: true,
      });
    }
    if (type == "DEALER") {
      userData = await Dealers.findOne({
        where: {
          id: user_id,
        },
        raw: true,
      });
    }
    if (!userData) {
      return res
        .response({
          code: 404,
          status: "error",
          message: "User is not valid.",
        })
        .code(200);
    } else if (userData.verified) {
      return res
        .response({
          code: 409,
          status: "error",
          message: "User is already valid.",
        })
        .code(200);
    } else {
      if (otp == "1111") {
        if (type == "CUSTOMER") {
          const updateData = await Customers.update(
            {
              verified: true,
            },
            {
              where: {
                id: user_id,
              },
            }
          );
          // const deletedOtp = await Otps.destroy({
          //   where: {
          //     id: users_otp.id
          //   }
          // })
          return res
            .response({
              code: 200,
              status: "success",
              message: "OTP verified.",
            })
            .code(200);
        }
        if (type == "DEALER") {
          const updateData = await Dealers.update(
            {
              verified: true,
            },
            {
              where: {
                id: user_id,
              },
            }
          );
          // const deletedOtp = await Otps.destroy({
          //   where: {
          //     id: users_otp.id
          //   }
          // })
          return res
            .response({
              code: 200,
              status: "success",
              message: "OTP verified.",
            })
            .code(200);
        }
      }
      const users_otp = await Otp.findOne({
        where: {
          [type == "CUSTOMER" ? "user_id" : "dealer_id"]: user_id,
        },
        raw: true,
        order: [["id", "DESC"]],
      });
      if (!users_otp) {
        return res
          .response({
            code: 400,
            status: "error",
            message: "Otp has expired.",
          })
          .code(200);
      } else {
        if (users_otp.otp != otp) {
          return res
            .response({
              code: 400,
              status: "error",
              message: "Enter a valid otp.",
            })
            .code(200);
        } else {
          await Otp.destroy({
            where: {
              id: users_otp.id,
            },
          });
          if (type == "CUSTOMER") {
            const updateData = await Customers.update(
              {
                verified: true,
              },
              {
                where: {
                  id: user_id,
                },
              }
            );
            const deletedOtp = await Otp.destroy({
              where: {
                id: users_otp.id,
              },
            });
            return res
              .response({
                code: 200,
                status: "success",
                message: "OTP verified.",
              })
              .code(200);
          }
          if (type == "DEALER") {
            const updateData = await Dealers.update(
              {
                verified: true,
              },
              {
                where: {
                  id: user_id,
                },
              }
            );
            const deletedOtp = await Otp.destroy({
              where: {
                id: users_otp.id,
              },
            });
            return res
              .response({
                code: 200,
                status: "success",
                message: "OTP verified.",
              })
              .code(200);
          }
        }
      }
    }
  } catch (error) {
    console.log(error);
    return res
      .response({
        code: 400,
        status: "error",
        message: error.message,
      })
      .code(200);
  }
};

function isValid(text) {
  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  const validEmail = emailRegex.test(text);
  const phoneRegex = /^91[1-9]\d{9}$/;
  const validPhone = phoneRegex.test(text);
  return {
    validEmail,
    validPhone,
  };
}

const sendOtpSMS = async (number, username, otp, purpose) => {
  try {
    const options = {
      method: "POST",
      url: `${OTP_SEND_URL}?template_id=${MSG91_OTP_TEMP_ID}&mobile=${number}&otp=${otp}`,
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        authkey: MSG91_AUTH_KEY,
      },
      data: { user: username, purpose: purpose },
    };
    const response = await axios.request(options);
    if (response.data.type == "success") {
      return true;
    } else {
      false;
    }
  } catch (error) {
    console.log(error);
  }
};

const sendOtp = async (user_details, type) => {
  try {
    const otp = Math.floor(Math.random() * (9999 - 1000 + 1) + 1000);
    const otpdata = {
      [type == "CUSTOMER" ? "user_id" : "dealer_id"]: user_details.id,
      otp,
    };
    const newOtp = await Otp.create(otpdata);
    const { validEmail, validPhone } = isValid(user_details.username);
    if (newOtp.id > 0 && validPhone) {
      const resp = await sendOtpSMS(
        user_details.username,
        user_details.fullname,
        otp,
        "registration"
      );
      return {
        code: resp ? 200 : 400,
        status: resp ? "success" : "error",
        message: resp
          ? `Otp created and sent to you on (${user_details.username}).`
          : "Something is wrong.",
      };
    }
    if (newOtp.id > 0 && validEmail) {
      const template = await ejs.renderFile(
        __dirname + "/templates/mail_template.ejs",
        {
          application_name: "Online King",
          about_what: "OTP Verification",
          user_name: user_details.fullname,
          otp: newOtp.otp,
        }
      );
      const mailOptions = {
        from: '"OnlineKing" <support@onlineking.in>',
        to: user_details.username,
        subject: "OTP Verification For Online King App",
        html: template,
      };
      await mailer.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
          return;
        }
        console.log("Message sent: %s", info);
      });
      const MILISECONDS_TO_WAIT = 120000;
      setTimeout(async () => {
        const available_otp = await Otp.findOne({
          where: {
            id: newOtp.id,
          },
        });
        if (available_otp) {
          await Otp.destroy({
            where: {
              id: newOtp.id,
            },
          });
        }
      }, MILISECONDS_TO_WAIT);
      return {
        code: 200,
        status: "success",
        message: `Otp created and sent to you on (${user_details.username}).`,
      };
    } else {
      return {
        code: 400,
        status: "error",
        message: "Otp is not created.",
      };
    }
  } catch (error) {
    console.log(error);
  }
};

// const registerCustomer = async (req, res) => {
//   try {
//     const { type } = req.query;
//     const { fullname, username, password, email, confirm_password } = req.payload;
//     let available = null;
//     if (type == "CUSTOMER") {
//       if (!email) {
//         return res
//           .response({
//             code: 409,
//             status: "error",
//             message: "Email is mandatory for users.",
//           })
//           .code(200);
//       }
//       available = await Customers.findOne({
//         where: {
//           username,
//         },
//         raw: true,
//       });
//     }
//     if (type == "DEALER") {
//       available = await Dealers.findOne({
//         where: {
//           username,
//         },
//         raw: true,
//       });
//     }
//     const { validEmail, validPhone } = isValid(username);
//     if (!validEmail && !validPhone) {
//       return res
//         .response({
//           code: 400,
//           status: "error",
//           message: "Please enter valid email or phone.",
//         })
//         .code(200);
//     }
//     console.log(available);
//     if (available && !available.verified) {
//       if (type == "CUSTOMER") {
//         await Customers.destroy({
//           where: {
//             id: available.id,
//           },
//         });
//       } else if (type == "DEALER") {
//         await Dealers.destroy({
//           where: {
//             id: available.id,
//           },
//         });
//       }
//       if (password === confirm_password) {
//         let created_user = null;
//         if (type == "CUSTOMER") {
//           created_user = await Customers.create({
//             fullname,
//             username,
//             email,
//             password: await makeHash(password),
//             verified: false,
//           });
//         }
//         if (type == "DEALER") {
//           created_user = await Dealers.create({
//             fullname,
//             username,
//             password: await makeHash(password),
//             verified: false,
//             approved: false,
//           });
//         }
//         const otpResp = await sendOtp(created_user, type);
//         return res
//           .response({
//             ...otpResp,
//             created_user,
//           })
//           .code(200);
//       } else {
//         return res
//           .response({
//             code: 400,
//             status: "error",
//             message: "Password and confirm password has to be same.",
//           })
//           .code(200);
//       }
//     } else if (!available) {
//       if (password === confirm_password) {
//         let created_user = null;
//         if (type == "CUSTOMER") {
//           created_user = await Customers.create({
//             fullname,
//             username,
//             email,
//             password: await makeHash(password),
//             verified: false,
//           });
//         }
//         if (type == "DEALER") {
//           created_user = await Dealers.create({
//             fullname,
//             username,
//             password: await makeHash(password),
//             verified: false,
//             approved: false,
//           });
//         }
//         const otpResp = await sendOtp(created_user, type);
//         return res
//           .response({
//             ...otpResp,
//             created_user,
//           })
//           .code(200);
//       } else {
//         return res
//           .response({
//             code: 400,
//             status: "error",
//             message: "Password and confirm password has to be same.",
//           })
//           .code(200);
//       }
//     } else {
//       return res
//         .response({
//           code: 409,
//           status: "error",
//           message: "Username already registered. Try loggin in.",
//         })
//         .code(200);
//     }
//   } catch (error) {
//     console.log(error);
//     return res
//       .response({
//         code: 400,
//         status: "error",
//         message: error.message,
//       })
//       .code(200);
//   }
// };

const registerCustomer = async (req, res) => {
  try {
    const { type } = req.query;
    const { fullname, username, password, confirm_password } = req.payload;

    // if (type === "CUSTOMER" && !email) {
    //   return res
    //     .response({
    //       code: 400,
    //       status: "error",
    //       message: "Email is mandatory for customers.",
    //     })
    //     .code(400);
    // }

    const { validEmail, validPhone } = isValid(username);
    if (!validEmail && !validPhone) {
      return res
        .response({
          code: 400,
          status: "error",
          message: "Please enter a valid email or phone number.",
        })
        .code(400);
    }

    let available = null;
    if (type === "CUSTOMER") {
      available = await Customers.findOne({ where: { username }, raw: true });
    } else if (type === "DEALER") {
      available = await Dealers.findOne({ where: { username }, raw: true });
    }

    if (available && !available.verified) {
      await deleteUnverifiedUser(available, type);

      const created_user = await createUserIfPasswordMatches({
        type,
        fullname,
        username,
        password,
        confirm_password,
      });

      const otpResp = await sendOtp(created_user, type);

      return res
        .response({
          ...otpResp,
          created_user,
        })
        .code(200);
    } else if (!available) {
      const created_user = await createUserIfPasswordMatches({
        type,
        fullname,
        username,
        password,
        confirm_password,
      });

      const otpResp = await sendOtp(created_user, type);

      return res
        .response({
          ...otpResp,
          created_user,
        })
        .code(200);
    } else {
      return res
        .response({
          code: 409,
          status: "error",
          message: "Username already registered. Try logging in.",
        })
        .code(409);
    }
  } catch (error) {
    console.error(error);
    return res
      .response({
        code: 500,
        status: "error",
        message: "An internal server error occurred.",
      })
      .code(500);
  }
};

async function deleteUnverifiedUser(user, type) {
  try {
    if (type === "CUSTOMER") {
      await Customers.destroy({ where: { id: user.id } });
    } else if (type === "DEALER") {
      await Dealers.destroy({ where: { id: user.id } });
    }
  } catch (error) {
    throw new Error("Error occurred while deleting unverified user.");
  }
}

async function createUserIfPasswordMatches({
  type,
  fullname,
  username,
  password,
  confirm_password,
}) {
  try {
    if (password === confirm_password) {
      let created_user = null;
      const isEmail = isValid(username);
      const isPhone = isValid(username);
      if (type === "CUSTOMER") {
        if (isEmail) {
          created_user = await Customers.create({
            fullname,
            username,
            email: username,
            password: await makeHash(password),
            verified: false,
          });
        } else if (isPhone) {
          created_user = await Customers.create({
            fullname,
            username,
            phone: username,
            password: await makeHash(password),
            verified: false,
          });
        }
      } else if (type === "DEALER") {
        if (isEmail) {
          created_user = await Dealers.create({
            fullname,
            username,
            email: username,
            password: await makeHash(password),
            verified: false,
            approved: null,
          });
        } else if (isPhone) {
          created_user = await Dealers.create({
            fullname,
            username,
            phone: username,
            password: await makeHash(password),
            verified: false,
            approved: null,
          });
        }
      }
      return created_user;
    } else {
      throw new Error("Password and confirm password must be the same.");
    }
  } catch (error) {
    throw new Error("Error occurred while creating user.");
  }
}

const verifyUser = async (req, res) => {
  try {
    const { type } = req.query;
    const { user_id, otp } = req.payload;

    const model = type === "CUSTOMER" ? Customers : Dealers;

    const user = await model.findOne({
      where: {
        id: user_id,
      },
      raw: true,
    });

    if (!user) {
      return res
        .response({
          code: 404,
          status: "error",
          message: "User not found or not verified.",
        })
        .code(404);
    }

    const userOtp = await Otp.findOne({
      where: {
        [type === "CUSTOMER" ? "user_id" : "dealer_id"]: user.id,
      },
      raw: true,
      order: [["id", "DESC"]],
    });

    if (!userOtp || userOtp.otp !== otp) {
      return res
        .response({
          code: 404,
          status: "error",
          message: "Incorrect OTP or OTP expired.",
        })
        .code(404);
    }

    await Otp.destroy({
      where: {
        id: userOtp.id,
      },
    });

    await model.update(
      {
        verified: true,
      },
      {
        where: {
          id: user.id,
        },
      }
    );

    if (type === "DEALER") {
      await Dealers.update(
        {
          approved: null,
        },
        {
          where: {
            id: user.id,
          },
        }
      );
    }

    return res
      .response({
        code: 200,
        status: "success",
        message: "OTP verification successful.",
      })
      .code(200);
  } catch (error) {
    console.error(error);
    return res
      .response({
        code: 500,
        status: "error",
        message: "An internal server error occurred.",
      })
      .code(500);
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { type } = req.query;
    const { username } = req.payload;

    const model = type === "CUSTOMER" ? Customers : Dealers;

    const user = await model.findOne({
      where: {
        username,
        verified: true,
      },
      raw: true,
    });

    if (!user) {
      return res
        .response({
          code: 404,
          status: "error",
          message: "User not found.",
        })
        .code(404);
    }

    const otpResponse = await sendOtp(user, type);

    if (otpResponse.code === 200) {
      return res
        .response({
          code: 200,
          status: "success",
          message: "OTP sent for password reset.",
          user_id: user.id,
        })
        .code(200);
    } else {
      return res
        .response({
          code: 400,
          status: "error",
          message: "Failed to send OTP for password reset.",
        })
        .code(400);
    }
  } catch (error) {
    console.error(error);
    return res
      .response({
        code: 500,
        status: "error",
        message: "An internal server error occurred.",
      })
      .code(500);
  }
};

const verifyOtpAndUpdatePassword = async (req, res) => {
  try {
    const { type } = req.query;
    const { user_id, otp, new_password, confirm_password } = req.payload;

    const model = type === "CUSTOMER" ? Customers : Dealers;
    const user = await model.findOne({
      where: {
        id: user_id,
      },
      raw: true,
    });

    if (!user) {
      return res
        .response({
          code: 404,
          status: "error",
          message: "User not found or not verified.",
        })
        .code(404);
    }

    const userOtp = await Otp.findOne({
      where: {
        [type === "CUSTOMER" ? "user_id" : "dealer_id"]: user.id,
      },
      raw: true,
      order: [["id", "DESC"]],
    });

    if (!userOtp || userOtp.otp !== otp) {
      return res
        .response({
          code: 404,
          status: "error",
          message: "Incorrect OTP or OTP expired.",
        })
        .code(404);
    }

    if (new_password !== confirm_password) {
      return res
        .response({
          code: 400,
          status: "error",
          message: "New password and confirm password do not match.",
        })
        .code(400);
    }

    await model.update(
      {
        password: await makeHash(new_password),
      },
      {
        where: {
          id: user.id,
        },
      }
    );

    await Otp.destroy({
      where: {
        id: userOtp.id,
      },
    });

    return res
      .response({
        code: 200,
        status: "success",
        message: "Password updated successfully.",
      })
      .code(200);
  } catch (error) {
    console.error(error);
    return res
      .response({
        code: 500,
        status: "error",
        message: "An internal server error occurred.",
      })
      .code(500);
  }
};

const approveDealerIds = async (req, res) => {
  try {
    const { dealer_id } = req.query;
    const verifier = await checkToken(
      req.headers["Authorization"]
        ? req.headers["Authorization"]
        : req.headers.authorization
    );
    if (verifier.role == "ADMIN" && verifier.application == "kardify") {
      const dealer = await Dealers.findOne({
        where: {
          id: dealer_id,
        },
        raw: true,
      });
      if (!dealer) {
        return res
          .response({
            code: 404,
            status: "error",
            message: "Dealer not found.",
          })
          .code(200);
      } else {
        await Dealers.update(
          {
            approved: true,
            is_active: true,
          },
          {
            where: {
              id: dealer_id,
            },
          }
        );
        const template = await ejs.renderFile(
          __dirname + "/templates/approve_dealer_notification.ejs",
          {
            dealerName: dealer.fullname,
            dealerPhone: dealer.personal_mobile,
            dealerEmail: dealer.personal_email,
          }
        );
        const mailOptions = {
          from: '"OnlineKing" <support@onlineking.in>',
          to: dealer.personal_email,
          subject: "Dealer Approval Notification",
          html: template,
        };
        await mailer.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log(error);
            return;
          }
          console.log("Message sent: %s", info);
        });
        return res
          .response({
            code: 200,
            status: "success",
            message: `Dealer has been approved.`,
          })
          .code(200);
      }
    } else if (verifier == "Session expired") {
      return res
        .response({
          code: 401,
          status: "error",
          message: verifier,
        })
        .code(200);
    } else {
      return res
        .response({
          code: 403,
          status: "error",
          message: "You dont have the permission to do this operation.",
        })
        .code(200);
    }
  } catch (error) {
    console.log(error);
    return res
      .response({
        code: 400,
        status: "error",
        message: error.message,
      })
      .code(200);
  }
};

const rejectDealerIds = async (req, res) => {
  try {
    const { dealer_id, rejected_reason } = req.payload;
    const verifier = await checkToken(
      req.headers["Authorization"]
        ? req.headers["Authorization"]
        : req.headers.authorization
    );
    if (verifier.role == "ADMIN" && verifier.application == "kardify") {
      const dealer = await Dealers.findOne({
        where: {
          id: dealer_id,
        },
        raw: true,
      });
      if (!dealer) {
        return res
          .response({
            code: 404,
            status: "error",
            message: "Dealer not found.",
          })
          .code(200);
      } else if (dealer.approved == false) {
        return res
          .response({
            code: 400,
            status: "error",
            message: "Dealer has already been rejected.",
          })
          .code(200);
      } else {
        await Dealers.update(
          {
            approved: false,
            rejected_reason: rejected_reason,
            is_active: false,
          },
          {
            where: {
              id: dealer_id,
            },
          }
        );
        const template = await ejs.renderFile(
          __dirname + "/templates/rejected_dealer_notification.ejs",
          {
            dealerName: dealer.fullname,
            dealerPhone: dealer.personal_mobile,
            dealerEmail: dealer.personal_email,
            reason: rejected_reason,
          }
        );
        const mailOptions = {
          from: '"OnlineKing" <support@onlineking.in>',
          to: dealer.personal_email,
          subject: "Dealer Rejection Notification",
          html: template,
        };
        await mailer.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log(error);
            return;
          }
          console.log("Message sent: %s", info);
        });
        return res
          .response({
            code: 200,
            status: "success",
            message: `Dealer has been rejected.`,
          })
          .code(200);
      }
    } else if (verifier == "Session expired") {
      return res
        .response({
          code: 401,
          status: "error",
          message: verifier,
        })
        .code(200);
    } else {
      return res
        .response({
          code: 403,
          status: "error",
          message: "You dont have the permission to do this operation.",
        })
        .code(200);
    }
  } catch (error) {
    console.log(error);
    return res
      .response({
        code: 400,
        status: "error",
        message: error.message,
      })
      .code(200);
  }
};

const toggleDealerIsActive = async (req, res) => {
  try {
    const { dealer_id } = req.query;
    const verifier = await checkToken(
      req.headers["Authorization"]
        ? req.headers["Authorization"]
        : req.headers.authorization
    );
    if (verifier.role == "ADMIN" && verifier.application == "kardify") {
      const dealer = await Dealers.findOne({
        where: {
          id: dealer_id,
          approved: true,
        },
        raw: true,
      });
      if (!dealer) {
        return res
          .response({
            code: 404,
            status: "error",
            message: "Dealer not found or not approved.",
          })
          .code(200);
      } else {
        const updatedIsActive = !dealer.is_active;

        await Dealers.update(
          {
            is_active: updatedIsActive,
          },
          {
            where: {
              id: dealer_id,
            },
          }
        );

        const statusMessage = updatedIsActive ? "active" : "inactive";

        const template = await ejs.renderFile(
          __dirname + `/templates/dealer_${statusMessage}_notification.ejs`,
          {
            dealerName: dealer.fullname,
            dealerPhone: dealer.phone,
            dealerEmail: dealer.personal_email,
            status: statusMessage,
          }
        );
        const mailOptions = {
          from: '"OnlineKing" <support@onlineking.in>',
          to: dealer.personal_email,
          subject: `Dealer ${statusMessage} Notification`,
          html: template,
        };
        await mailer.sendMail(mailOptions);

        return res
          .response({
            code: 200,
            status: "success",
            message: `Dealer's status has been toggled to ${statusMessage}.`,
          })
          .code(200);
      }
    } else if (verifier == "Session expired") {
      return res
        .response({
          code: 401,
          status: "error",
          message: verifier,
        })
        .code(200);
    } else {
      return res
        .response({
          code: 403,
          status: "error",
          message: "You dont have the permission to do this operation.",
        })
        .code(200);
    }
  } catch (error) {
    console.log(error);
    return res
      .response({
        code: 400,
        status: "error",
        message: error.message,
      })
      .code(200);
  }
};

const customerLogin = async (req, res) => {
  try {
    const { type } = req.query;
    const { username, password } = req.payload;
    let user = null;
    if (type == "CUSTOMER") {
      user = await Customers.findOne({
        where: {
          username,
          verified: true,
        },
        raw: true,
      });
    }
    if (type == "DEALER") {
      user = await Dealers.findOne({
        where: {
          username,
          verified: true,
        },
        raw: true,
      });
    }
    if (user) {
      if (type == "DEALER" && user.approved == null) {
        return res
          .response({
            code: 403,
            status: "error",
            message: "Verification is in progress.",
          })
          .code(200);
      }

      if (type == "DEALER" && user.is_active == false) {
        return res
          .response({
            code: 403,
            status: "error",
            message: "Your Dealer Account is not active.",
          })
          .code(200);
      }

      if (type == "DEALER" && user.approved == false) {
        return res
          .response({
            code: 403,
            status: "error",
            message: "Dealer is not approved.",
          })
          .code(200);
      }
      const checkedPassword = await checkHash(password, user.password);
      if (checkedPassword) {
        const userDetails = {
          id: user.id,
          fullname: user.fullname,
          username: user.username,
          role: type,
          application: "kardify",
        };
        const token = await makeToken(userDetails);
        const refToken = await makeRefreshToken(userDetails);
        if (type == "CUSTOMER") {
          await Customers.update(
            {
              accessToken: token,
              refreshToken: refToken,
            },
            {
              where: {
                id: user.id,
              },
            }
          );
        }
        if (type == "DEALER") {
          await Dealers.update(
            {
              accessToken: token,
              refreshToken: refToken,
            },
            {
              where: {
                id: user.id,
              },
            }
          );
        }
        return res
          .response({
            code: 200,
            status: "success",
            message: "Login successful.",
            user_id: user.id,
            token,
            refreshToken: refToken,
          })
          .code(200);
      } else {
        return res
          .response({
            code: 404,
            status: "error",
            message: "Incorrect password. Check your password and try again.",
          })
          .code(200);
      }
    } else {
      return res
        .response({
          code: 404,
          status: "error",
          message: "Username not registered. Check your email and try again.",
        })
        .code(200);
    }
  } catch (error) {
    console.log(error);
    return res
      .response({
        code: 400,
        status: "error",
        message: error.message,
      })
      .code(200);
  }
};

const addDealerPersonalData = async (req, res) => {
  try {
    const {
      dealer_id,
      first_name,
      last_name,
      dob,
      gender,
      language,
      personal_email,
      personal_mobile,
      personal_alt_mobile,
      add1,
      add2,
      area,
      city,
      state,
      pincode,
      landmark,
      country = "India",
      // identity_proff_name,
      // identity_proff_file
    } = req.payload;
    const dealer = await Dealers.findOne({
      where: {
        id: dealer_id,
      },
      raw: true,
    });
    if (dealer) {
      let updateData = {
        first_name,
        last_name,
        dob,
        gender,
        language,
        personal_email,
        personal_mobile,
        personal_alt_mobile,
        add1,
        add2,
        area,
        city,
        state,
        country,
        pincode,
        landmark,
        // identity_proff_name
      };
      // let finalData;
      // if (!lat && !lng) {
      //   const response = await axios({
      //     method: "post",
      //     url: GOOGLE_API_GET_LOCATION_COORDINATES_URL,
      //     params: {
      //       address: add2
      //         ? `${add1}, ${add2}, ${area}, ${city}, ${state}, ${
      //             country ? country : "India"
      //           }, ${pincode}`
      //         : `${add1}, ${area}, ${city}, ${state}, ${
      //             country ? country : "India"
      //           }, ${pincode}`,
      //       key: GOOGLE_API_KEY,
      //     },
      //   });
      //   const data = response.data.results.map((address, index) => {
      //     return {
      //       address: address.formatted_address,
      //       lat: address.geometry.location.lat,
      //       lng: address.geometry.location.lng,
      //     };
      //   });
      //   finalData = await Promise.all(data);
      // } else {
      //   finalData = [{ lat, lng }];
      // }
      // const lat_lng =
      //   finalData.length > 0 ? finalData[0] : { lat: null, lng: null };

      // updateData = {
      //   ...updateData
      // };

      const updatedData = await Dealers.update(updateData, {
        where: {
          id: dealer_id,
        },
      });
      console.log("updatedData", updatedData);
      if (updatedData.length) {
        return res
          .response({
            code: 200,
            status: "success",
            message: "Dealers's personal details are saved.",
          })
          .code(200);
      }
    } else {
      return res
        .response({
          code: 404,
          status: "error",
          message: "Dealer is not found.",
          //   updatedData
        })
        .code(200);
    }
  } catch (error) {
    console.log(error);
    return res
      .response({
        code: 400,
        status: "error",
        message: error.message,
      })
      .code(200);
  }
};

const fetchDealerDetails = async (req, res) => {
  try {
    const user = await checkToken(
      req.headers["Authorization"]
        ? req.headers["Authorization"]
        : req.headers.authorization
    );
    if (user.role == "DEALER" && user.application == "kardify") {
      const dealer = await Dealers.findOne({
        where: {
          id: user.id,
        },
        attributes: {
          exclude: ["password", "accessToken", "refreshToken"],
        },
        raw: true,
      });

      return res
        .response({
          code: 200,
          status: "success",
          message: "Dealer data fetched successfully.",
          dealer_data: dealer,
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
        code: 400,
        status: "error",
        message: error.message,
      })
      .code(200);
  }
};

const fetchCustomerDetails = async (req, res) => {
  try {
    const user = await checkToken(
      req.headers["Authorization"]
        ? req.headers["Authorization"]
        : req.headers.authorization
    );
    if (user.role == "CUSTOMER" && user.application == "kardify") {
      const customer = await Customers.findOne({
        where: {
          id: user.id,
        },
        attributes: {
          exclude: ["password", "accessToken", "refreshToken"],
        },
      });
      const customer_addresses = await AddressModel.findAll({
        where: {
          user_id: user.id,
        },
        raw: true,
      });
      return res
        .response({
          code: 200,
          status: "success",
          message: "Customer data fetched successfully.",
          customer_data: {
            customer,
            customer_addresses,
          },
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
        code: 400,
        status: "error",
        message: error.message,
      })
      .code(200);
  }
};

const editCustomerDetails = async (req, res) => {
  try {
    const user = await checkToken(
      req.headers["Authorization"]
        ? req.headers["Authorization"]
        : req.headers.authorization
    );

    if (user.role == "CUSTOMER" && user.application == "kardify") {
      const { fullname, email, phone, dob, gender } = req.payload; // Assuming the payload contains these fields
      const profile_img = req.payload.profile_img; // Assuming the image is sent in the payload

      const customer = await Customers.findOne({
        where: {
          id: user.id,
        },
      });

      if (!customer) {
        return res
          .response({
            code: 404,
            status: "error",
            message: "Customer not found.",
          })
          .code(404);
      }

      let profile_img_url = customer.profile_img; // Default to existing profile image URL
      if (profile_img) {
        const uploadResponse = await uploadFile(
          req,
          profile_img,
          "uploads/profile_imgs/"
        );
        profile_img_url = uploadResponse.file_url;
      }

      if (fullname) customer.fullname = fullname;
      if (email) customer.email = email;
      if (phone) customer.phone = phone;
      if (dob) customer.dob = dob;
      if (gender) customer.gender = gender;
      customer.profile_img = profile_img_url;

      await customer.save();

      return res
        .response({
          code: 200,
          status: "success",
          message: "Customer data updated successfully.",
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
    console.log(error);
    return res
      .response({
        code: 400,
        status: "error",
        message: error.message,
      })
      .code(200);
  }
};

module.exports = {
  verifyToken,
  getRole,
  getUser,
  getDealers,
  addNewAdmin,
  adminLogin,
  registerCustomer,
  verifyUser,
  forgotPassword,
  verifyOtpAndUpdatePassword,
  approveDealerIds,
  rejectDealerIds,
  toggleDealerIsActive,
  validateOtpCustomer,
  customerLogin,
  addDealerPersonalData,
  fetchDealerDetails,
  fetchCustomerDetails,
  editCustomerDetails,
};
