const jwt = require("jsonwebtoken");
const ejs = require("ejs");
const { uploadFile } = require('../helpers')
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
    ProductAttributes, SubscribedCustomers
} = require("../models");
const { Op } = require("sequelize");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

const getSubscribers = async (req, res) => {
    try {
        const {
            id,
            email
        } = req.query
        let filter = {}
        if (id) filter = {
            ...filter,
            id
        }
        if (email) filter = {
            ...filter,
            email
        }

        const user = await checkToken(req.headers['Authorization'] ? req.headers['Authorization'] : req.headers.authorization);

        if (user.role === "ADMIN" && user.application === 'kardify') {
            const subscribers = await SubscribedCustomers.findAll({
                where: filter,
                raw: true,
                order: [['createdAt', 'DESC']]
            })
            return res
                .response({
                    code: 200,
                    status: 'success',
                    message: "Subscribers fetched successfully",
                    subscribers
                })
                .code(200);
        } else if (user === 'Session expired') {
            return res.response({
                code: 401,
                status: 'error',
                message: user
            }).code(401);
        } else {
            return res.response({
                code: 403,
                status: 'error',
                message: "You don't have permission for this action."
            }).code(403);
        }
    } catch (error) {
        return res
            .response({
                code: 401,
                status: "error",
                message: "Something Wrong",
            })
            .code(200);
    }
};

const addSubscribers = async (req, res) => {
    try {
        const { email } = req.payload;

        const existingSubscriber = await SubscribedCustomers.findOne({
            where: {
                email,
            },
            raw: true
        });

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res
                .response({
                    code: 400,
                    status: "error",
                    message: "Invalid email format",
                })
                .code(200);
        }

        if (existingSubscriber) {
            return res
                .response({
                    code: 409,
                    status: "error",
                    message: `${email} already exists`,
                })
                .code(200);
        }

        const newSubscriber = await SubscribedCustomers.create({
            email,
            status: true
        });

        return res
            .response({
                code: 201,
                status: 'success',
                message: "Subscribed successfully",
                atrribute: newSubscriber,
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

// const editAttributes = async (req, res) => {
//     try {
//         const { attribute_id, attribute_name } = req.payload;

//         const user = await checkToken(req.headers['Authorization'] ? req.headers['Authorization'] : req.headers.authorization);

//         if (user.role === "ADMIN" && user.application === 'kardify') {
//             const existingAttribute = await ProductAttributes.findOne({
//                 where: {
//                     id: attribute_id,
//                 },
//             });

//             if (!existingAttribute) {
//                 return res
//                     .response({
//                         code: 404,
//                         status: "error",
//                         message: "Attribute not found",
//                     })
//                     .code(200);
//             }

//             const existingNameAttribute = await ProductAttributes.findOne({
//                 where: {
//                     attribute_name
//                 },
//             });

//             if (existingNameAttribute) {
//                 return res
//                     .response({
//                         code: 409,
//                         status: "error",
//                         message: "Attribute with the same name already exists",
//                     })
//                     .code(200);
//             }

//             if (attribute_name) {
//                 existingAttribute.attribute_name = attribute_name;
//             }

//             await existingAttribute.save();

//             return res
//                 .response({
//                     code: 200,
//                     status: "success",
//                     message: "Attribute updated successfully",
//                     attribute: existingAttribute,
//                 })
//                 .code(200);
//         } else if (user === 'Session expired') {
//             return res.response({
//                 code: 401,
//                 status: 'error',
//                 message: user
//             }).code(401);
//         } else {
//             return res.response({
//                 code: 403,
//                 status: 'error',
//                 message: "You don't have permission for this action."
//             }).code(403);
//         }
//     } catch (error) {
//         console.error(error);
//         return res
//             .response({
//                 code: 500,
//                 status: "error",
//                 message: "Something went wrong",
//             })
//             .code(200);
//     }
// }

const deleteSubscriber = async (req, res) => {
    try {
        const { subscriber_id } = req.query;

        const user = await checkToken(req.headers['Authorization'] ? req.headers['Authorization'] : req.headers.authorization);

        if (user.role === "ADMIN" && user.application === 'kardify') {
            if (!Number.isInteger(subscriber_id) || subscriber_id <= 0) {
                return res
                    .response({
                        code: 400,
                        status: "error",
                        message: "Invalid subscriber_id",
                    })
                    .code(200);
            }

            const existingSubscriber = await SubscribedCustomers.findOne({
                where: {
                    id: subscriber_id,
                },
            });

            if (!existingSubscriber) {
                return res
                    .response({
                        code: 404,
                        status: "error",
                        message: "Subscriber not found",
                    })
                    .code(200);
            }
            await existingSubscriber.destroy();

            return res
                .response({
                    code: 200,
                    status: "success",
                    message: "Subscriber deleted successfully",
                })
                .code(200);
        } else if (user === 'Session expired') {
            return res.response({
                code: 401,
                status: 'error',
                message: user
            }).code(401);
        } else {
            return res.response({
                code: 403,
                status: 'error',
                message: "You don't have permission for this action."
            }).code(403);
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

const toggleSubscriberStatus = async (req, res) => {
    try {
        const { subscriber_id } = req.query;

        const user = await checkToken(req.headers['Authorization'] ? req.headers['Authorization'] : req.headers.authorization);

        if (user.role === "ADMIN" && user.application === 'kardify') {
            if (!Number.isInteger(subscriber_id) || subscriber_id <= 0) {
                return res
                    .response({
                        code: 400,
                        status: "error",
                        message: "Invalid subscriber_id",
                    })
                    .code(200);
            }

            const existingSubscriber = await SubscribedCustomers.findOne({
                where: {
                    id: subscriber_id,
                },
            });

            if (!existingSubscriber) {
                return res
                    .response({
                        code: 404,
                        status: "error",
                        message: "Subscriber not found",
                    })
                    .code(200);
            }

            existingSubscriber.status = !existingSubscriber.status;

            await existingSubscriber.save();

            return res
                .response({
                    code: 200,
                    status: 'success',
                    message: "status toggled successfully",
                    subscribers: existingSubscriber,
                })
                .code(200);
        } else if (user === 'Session expired') {
            return res.response({
                code: 401,
                status: 'error',
                message: user
            }).code(401);
        } else {
            return res.response({
                code: 403,
                status: 'error',
                message: "You don't have permission for this action."
            }).code(403);
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
    getSubscribers,
    addSubscribers,
    deleteSubscriber,
    toggleSubscriberStatus
}