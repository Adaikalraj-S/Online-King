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
    StaticPages
} = require("../models");
const { Op } = require("sequelize");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

const getAllStaticData = async (req, res) => {
    try {
        const staticData = await StaticPages.findOne({
            raw: true
        });

        return res
            .response({
                code: 200,
                status: 'success',
                message: "Static Pages data fetched successfully",
                data: staticData
            })
            .code(200);
    } catch (error) {
        console.log(error);
        return res
            .response({
                code: 500,
                status: "error",
                message: "Internal server error",
            })
            .code(500);
    }
};

const addAboutUs = async (req, res) => {
    try {
        const { image, about_us } = req.payload;

        const user = await checkToken(req.headers['Authorization'] ? req.headers['Authorization'] : req.headers.authorization)
        if (user.role === "ADMIN" && user.application === 'kardify') {
            let file_url = null;

            if (image) {
                const uploadResponse = await uploadFile(req, image, 'uploads/staticpage/');
                file_url = uploadResponse.file_url;
            }

            const staticData = await StaticPages.findByPk(1);

            if (!staticData) {
                return res.response({
                    code: 404,
                    status: 'error',
                    message: "Static page not found.",
                }).code(404);
            }

            staticData.about_us = about_us;

            if (image) {
                staticData.image_url = file_url;
            }

            await staticData.save();

            return res.response({
                code: 200,
                status: 'success',
                message: "About Us Updated successfully",
            }).code(200);
        } else if (user == 'Session expired') {
            return res
                .response({
                    code: 401,
                    status: 'error',
                    message: user,
                })
                .code(200);
        } else {
            return res
                .response({
                    code: 403,
                    status: 'error',
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

const addContactUs = async (req, res) => {
    try {
        const { contact_us } = req.payload;

        const user = await checkToken(req.headers['Authorization'] ? req.headers['Authorization'] : req.headers.authorization)
        if (user.role === "ADMIN" && user.application === 'kardify') {

            await StaticPages.update(
                {
                    contact_us
                },
                {
                    where: { id: 1 }
                }
            );

            return res
                .response({
                    code: 201,
                    status: 'success',
                    message: "Contact Us Updated successfully",
                })
                .code(200);
        } else if (user == 'Session expired') {
            return res
                .response({
                    code: 401,
                    status: 'error',
                    message: user,
                })
                .code(200);
        } else {
            return res
                .response({
                    code: 403,
                    status: 'error',
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

const addPrivacyPolicy = async (req, res) => {
    try {
        const { privacy_policy } = req.payload;

        const user = await checkToken(req.headers['Authorization'] ? req.headers['Authorization'] : req.headers.authorization)
        if (user.role === "ADMIN" && user.application === 'kardify') {

            await StaticPages.update(
                {
                    privacy_policy
                },
                {
                    where: { id: 1 }
                }
            );

            return res
                .response({
                    code: 201,
                    status: 'success',
                    message: "privacy policy Updated successfully",
                })
                .code(200);
        } else if (user == 'Session expired') {
            return res
                .response({
                    code: 401,
                    status: 'error',
                    message: user,
                })
                .code(200);
        } else {
            return res
                .response({
                    code: 403,
                    status: 'error',
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

const addCancellationPolicy = async (req, res) => {
    try {
        const { cancellation_policy } = req.payload;

        const user = await checkToken(req.headers['Authorization'] ? req.headers['Authorization'] : req.headers.authorization)
        if (user.role === "ADMIN" && user.application === 'kardify') {

            await StaticPages.update(
                {
                    cancellation_policy
                },
                {
                    where: { id: 1 }
                }
            );

            return res
                .response({
                    code: 201,
                    status: 'success',
                    message: "cancellation policy Updated successfully",
                })
                .code(200);
        } else if (user == 'Session expired') {
            return res
                .response({
                    code: 401,
                    status: 'error',
                    message: user,
                })
                .code(200);
        } else {
            return res
                .response({
                    code: 403,
                    status: 'error',
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

const addRefundPolicy = async (req, res) => {
    try {
        const { refund_policy } = req.payload;

        const user = await checkToken(req.headers['Authorization'] ? req.headers['Authorization'] : req.headers.authorization)
        if (user.role === "ADMIN" && user.application === 'kardify') {

            await StaticPages.update(
                {
                    refund_policy
                },
                {
                    where: { id: 1 }
                }
            );

            return res
                .response({
                    code: 201,
                    status: 'success',
                    message: "Refund policy Updated successfully",
                })
                .code(200);
        } else if (user == 'Session expired') {
            return res
                .response({
                    code: 401,
                    status: 'error',
                    message: user,
                })
                .code(200);
        } else {
            return res
                .response({
                    code: 403,
                    status: 'error',
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

const addReturnPolicy = async (req, res) => {
    try {
        const { return_policy } = req.payload;

        const user = await checkToken(req.headers['Authorization'] ? req.headers['Authorization'] : req.headers.authorization)
        if (user.role === "ADMIN" && user.application === 'kardify') {

            await StaticPages.update(
                {
                    return_policy
                },
                {
                    where: { id: 1 }
                }
            );

            return res
                .response({
                    code: 201,
                    status: 'success',
                    message: "Return policy Updated successfully",
                })
                .code(200);
        } else if (user == 'Session expired') {
            return res
                .response({
                    code: 401,
                    status: 'error',
                    message: user,
                })
                .code(200);
        } else {
            return res
                .response({
                    code: 403,
                    status: 'error',
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

const addShippingPolicy = async (req, res) => {
    try {
        const { shipping_policy } = req.payload;

        const user = await checkToken(req.headers['Authorization'] ? req.headers['Authorization'] : req.headers.authorization)
        if (user.role === "ADMIN" && user.application === 'kardify') {

            await StaticPages.update(
                {
                    shipping_policy
                },
                {
                    where: { id: 1 }
                }
            );

            return res
                .response({
                    code: 201,
                    status: 'success',
                    message: "Shipping policy Updated successfully",
                })
                .code(200);
        } else if (user == 'Session expired') {
            return res
                .response({
                    code: 401,
                    status: 'error',
                    message: user,
                })
                .code(200);
        } else {
            return res
                .response({
                    code: 403,
                    status: 'error',
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



const toggleStaticStatus = async (req, res) => {
    try {
        const { static_type } = req.query;

        const existingStaticPage = await StaticPages.findByPk(1);

        if (!existingStaticPage) {
            return res.status(404).json({
                code: 404,
                status: "error",
                message: "Static Page not found",
            });
        }

        const statusField = `${static_type.toLowerCase()}_status`;
        existingStaticPage[statusField] = !existingStaticPage[statusField];

        await existingStaticPage.save();

        return res.response({
            code: 200,
            status: 'success',
            message: `${static_type} status toggled successfully`,
            static_page: existingStaticPage,
        }).code(200);

    } catch (error) {
        console.error(error);
        return res.response({
            code: 500,
            status: "error",
            message: "Something went wrong",
        }).code(200);
    }
};




module.exports = {
    getAllStaticData,
    addAboutUs,
    addContactUs,
    addPrivacyPolicy,
    addCancellationPolicy,
    addRefundPolicy,
    addReturnPolicy,
    addShippingPolicy,
    toggleStaticStatus
}