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
    BannerProductAssociation,
    Categories,
    SubCategories,
    SuperSubCategories,
    Products,
    ProductImages,
    OfferImages,
} = require("../models");
const { Op } = require("sequelize");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

const { product_id_for_banner } = require("../validators/banners_validators");
const { error } = require("console");

const getAllOfferImages = async (req, res) => {

    try {
        const images = await OfferImages.findAll({
            order: [["id", "DESC"]],
        });

        return res
            .response({
                code: 200,
                status: "success",
                message: "Offer images retrieved successfully",
                offer_images: images,
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

const addOfferImage = async (req, res) => {
    const t = await sequelize.transaction()
    try {
        const {
            image,
        } = req.payload;


        const user = await checkToken(
            req.headers["Authorization"] || req.headers.authorization
        );

        // Check user role and application
        if (user.role === "ADMIN" && user.application === "kardify") {
            const file_url_web = await uploadFile(
                req,
                image,
                "uploads/offer_images/"
            );

            const createdBanner = await OfferImages.create(
                {
                    image_url: file_url_web.file_url,
                },
                { transaction: t }
            );


            // Commit transaction and return success response
            await t.commit();
            return res
                .response({
                    code: 201,
                    status: "success",
                    message: "Offer image added successfully",
                    banner: createdBanner,
                })
                .code(200);
        }

        // Handle session expired
        if (user === "Session expired") {
            await t.rollback();
            return res
                .response({
                    code: 401,
                    status: "error",
                    message: user,
                })
                .code(200);
        }
        await t.rollback();

        // Handle unauthorized access
        return res
            .response({
                code: 403,
                status: "error",
                message: "You don't have permission for this action.",
            })
            .code(200);
    } catch (error) {
        // Rollback transaction on error
        await t.rollback();
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

const deleteOfferImage = async (req, res) => {
    try {
        const user = await checkToken(
            req.headers["Authorization"]
                ? req.headers["Authorization"]
                : req.headers.authorization
        );

        if (user.role === "ADMIN" && user.application === "kardify") {
            const { id } = req.payload;

            const existingOfferImage = await OfferImages.findOne({
                where: {
                    id,
                },
            });

            if (!existingOfferImage) {
                return res
                    .response({
                        code: 404,
                        status: "error",
                        message: "Offer Image not found",
                    })
                    .code(200);
            }

            await existingOfferImage.destroy();

            return res
                .response({
                    code: 200,
                    status: "success",
                    message: `Offer images deleted successfully`,
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

module.exports = {
    getAllOfferImages,
    addOfferImage,
    deleteOfferImage
};
