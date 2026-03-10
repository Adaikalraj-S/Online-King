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
    ProductAttributes, Installers, Testimonials, Customers
} = require("../models");
const { Op } = require("sequelize");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

const getAllTestimonials = async (req, res) => {
    try {

        const user = await checkToken(req.headers['Authorization'] ? req.headers['Authorization'] : req.headers.authorization);

        if (user.role === "ADMIN" && user.application === 'kardify') {
            const testimonials = await Testimonials.findAll({
                include: [{
                    model: Customers,
                    attributes: { exclude: ['password', 'accessToken', 'refreshToken'] },
                }],
                nest:true,
                mapToModel: true,
                raw: true,
                order: [['createdAt', 'DESC']]
            })
            return res
                .response({
                    code: 200,
                    status: 'success',
                    message: "Testimonials fetched successfully",
                    testimonials
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

const getAllTestimonialsCustomers = async (req, res) => {
    try {

        // const user = await checkToken(req.headers['Authorization'] ? req.headers['Authorization'] : req.headers.authorization);

        // if (user.role === "CUSTOMER" || user.role === "DEALER"  && user.application === 'kardify') {
            const testimonials = await Testimonials.findAll({
                where: {
                    status: true
                },
                include: [{
                    model: Customers,
                    attributes: { exclude: ['password', 'accessToken', 'refreshToken'] },
                }],
                nest:true,
                mapToModel: true,
                raw: true,
                order: [['createdAt', 'DESC']]
            })
            return res
                .response({
                    code: 200,
                    status: 'success',
                    message: "Testimonials fetched successfully",
                    testimonials
                })
                .code(200);
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

const addTestimonial = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const {
            customer_id,
            rating,
            heading,
            description
        } = req.payload;

        // Check authorization
        const user = await checkToken(req.headers['Authorization'] ? req.headers['Authorization'] : req.headers.authorization);

        if (user.role === "ADMIN" && user.application === 'kardify') {

            const existingTestimonials = await Testimonials.findOne({
                where: { heading },
                transaction: t
            });

            if (existingTestimonials) {
                await t.rollback();
                return res.response({
                    code: 400,
                    status: 'error',
                    message: `${heading} already exists`
                }).code(400);
            }

            const testimonials = await Testimonials.create({
                customer_id,
                rating,
                heading,
                description,
                status: true
            }, { transaction: t });

            await t.commit();

            return res.response({
                code: 200,
                status: 'success',
                message: 'Testimonial added successfully',
                testimonials
            }).code(200);
        } else if (user === 'Session expired') {
            await t.rollback();
            return res.response({
                code: 401,
                status: 'error',
                message: user
            }).code(401);
        } else {
            await t.rollback();
            return res.response({
                code: 403,
                status: 'error',
                message: "You don't have permission for this action."
            }).code(403);
        }

    } catch (error) {
        console.log(error)
        await t.rollback();
        return res.response({
            code: 500,
            status: 'error',
            message: 'Failed to add installer',
            error: error.message
        }).code(500);
    }
};


const editTestimonial = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const {
            testimonial_id,
            customer_id,
            rating,
            heading,
            description
        } = req.payload;

        const user = await checkToken(req.headers['Authorization'] ? req.headers['Authorization'] : req.headers.authorization);

        if (user.role === "ADMIN" && user.application === 'kardify') {
            const testimonial = await Testimonials.findOne({
                where: { id: testimonial_id },
                transaction: t
            });

            if (!testimonial) {
                await t.rollback();
                return res.response({
                    code: 404,
                    status: 'error',
                    message: `Testimonial not found`
                }).code(404);
            }

            const existingTestimonial = await Testimonials.findOne({
                where: {
                    heading,
                    id: {
                        [Op.not]: testimonial.id,
                    },
                },
                transaction: t
            });

            if (existingTestimonial && existingTestimonial.id !== testimonial_id) {
                await t.rollback();
                return res.response({
                    code: 400,
                    status: 'error',
                    message: `Testimonial already exists`
                }).code(400);
            }

            testimonial.customer_id = customer_id;
            testimonial.rating = rating;
            testimonial.heading = heading;
            testimonial.description = description;

            await testimonial.save({ transaction: t });

            await t.commit();

            return res.response({
                code: 200,
                status: 'success',
                message: 'Testimonial updated successfully',
                testimonial
            }).code(200);
        } else if (user === 'Session expired') {
            await t.rollback();
            return res.response({
                code: 401,
                status: 'error',
                message: user
            }).code(401);
        } else {
            await t.rollback();
            return res.response({
                code: 403,
                status: 'error',
                message: "You don't have permission for this action."
            }).code(403);
        }

    } catch (error) {
        console.log(error)
        await t.rollback();
        return res.response({
            code: 500,
            status: 'error',
            message: 'Failed to update installer',
            error: error.message
        }).code(500);
    }
};


const deleteTestimonial = async (req, res) => {
    try {
        const { testimonial_id } = req.query;

        const user = await checkToken(req.headers['Authorization'] ? req.headers['Authorization'] : req.headers.authorization);

        if (user.role === "ADMIN" && user.application === 'kardify') {
            if (!Number.isInteger(testimonial_id) || testimonial_id <= 0) {
                return res
                    .response({
                        code: 400,
                        status: "error",
                        message: "Invalid testimonial_id",
                    })
                    .code(200);
            }

            const existingTestimonial = await Testimonials.findOne({
                where: {
                    id: testimonial_id,
                },
            });

            if (!existingTestimonial) {
                return res
                    .response({
                        code: 404,
                        status: "error",
                        message: "Testimonial not found",
                    })
                    .code(200);
            }
            await existingTestimonial.destroy();

            return res
                .response({
                    code: 200,
                    status: "success",
                    message: "Testimonial deleted successfully",
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

const toggleTestimonialStatus = async (req, res) => {
    try {
        const { testimonial_id } = req.query;

        const user = await checkToken(req.headers['Authorization'] ? req.headers['Authorization'] : req.headers.authorization);

        if (user.role === "ADMIN" && user.application === 'kardify') {
            if (!Number.isInteger(testimonial_id) || testimonial_id <= 0) {
                return res
                    .response({
                        code: 400,
                        status: "error",
                        message: "Invalid testimonial_id",
                    })
                    .code(200);
            }

            const existingTestimonial = await Testimonials.findOne({
                where: {
                    id: testimonial_id,
                },
            });

            if (!existingTestimonial) {
                return res
                    .response({
                        code: 404,
                        status: "error",
                        message: "Testimonial not found",
                    })
                    .code(200);
            }

            existingTestimonial.status = !existingTestimonial.status;

            await existingTestimonial.save();

            return res
                .response({
                    code: 200,
                    status: 'success',
                    message: "Status toggled successfully"
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
    getAllTestimonials,
    getAllTestimonialsCustomers,
    addTestimonial,
    editTestimonial,
    deleteTestimonial,
    toggleTestimonialStatus
}