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
    CarBrands, Customers, Orders, OrderStatuses, OrderStatusLogs, OrderDetails, Categories, SubCategories, SuperSubCategories, Products, ProductImages, StoryProducts
} = require("../models");
const { Op } = require("sequelize");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const ProductBrand = require("../models/product_brand_model");
const Stories = require("../models/stories_model");

const getStories = async (req, res) => {
    try {
        const user = await checkToken(req.headers['Authorization'] ? req.headers['Authorization'] : req.headers.authorization);

        if (user.role === "ADMIN" && user.application === 'kardify') {
            const allStories = await Stories.findAll({

                include: [
                    {
                        model: Customers,
                        as: "customer",
                        attributes: { exclude: ['password', 'accessToken', 'refreshToken'] },
                        include: {
                            model: Orders,
                            include: [
                                {
                                    model: OrderStatuses,
                                    as: 'order_status',
                                    attributes: ['id', 'status_name', 'createdAt', 'updatedAt'],
                                },
                                // {
                                //     model: OrderStatusLogs,
                                //     attributes: ['id', 'order_status_id', 'createdAt', 'updatedAt'],
                                //     include: [
                                //         {
                                //             model: OrderStatuses,
                                //             required: true
                                //         }
                                //     ]
                                // },
                                {
                                    model: OrderDetails,
                                    include: [
                                        Categories,
                                        SubCategories,
                                        SuperSubCategories,
                                        Products,
                                        {
                                            model: ProductImages,
                                            as: 'product_images',
                                            where: {
                                                status: 1,
                                            },
                                            attributes: ['id', 'image_url'],
                                            required: false,
                                            raw: true,
                                        },
                                    ],
                                },
                            ]
                        }
                    }
                ],
                order: [['createdAt', 'DESC']],
            });

            return res.response({
                code: 200,
                status: 'success',
                message: "Stories fetched successfully",
                allStories
            }).code(200);
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
        console.log(error)
        console.error("Error in getProductBrands function:", error);
        return res.response({
            code: 500,
            status: "error",
            message: "Internal server error"
        }).code(500);
    }
};

const getStoriesCustomer = async (req, res) => {
    try {

        // const user = await checkToken(req.headers['Authorization'] ? req.headers['Authorization'] : req.headers.authorization);

        // if (user.role === "ADMIN" && user.application === 'kardify') {
        const { story_id } = req.query

        let filter = {
            status: true,
            is_approved: true
        }
        if (story_id) filter = {
            ...filter,
            id: story_id
        }

        const allStories = await Stories.findAll({
            where: filter,
            include: [
                {
                    model: Customers,
                    as: "customer",
                    attributes: { exclude: ['password', 'accessToken', 'refreshToken'] },
                    include: {
                        model: Orders,
                        include: [
                            {
                                model: OrderStatuses,
                                as: 'order_status',
                                attributes: ['id', 'status_name', 'createdAt', 'updatedAt'],
                            },
                            // {
                            //     model: OrderStatusLogs,
                            //     attributes: ['id', 'order_status_id', 'createdAt', 'updatedAt'],
                            //     include: [
                            //         {
                            //             model: OrderStatuses,
                            //             required: true
                            //         }
                            //     ]
                            // },
                            {
                                model: OrderDetails,
                                include: [
                                    Categories,
                                    SubCategories,
                                    SuperSubCategories,
                                    Products,
                                    {
                                        model: ProductImages,
                                        as: 'product_images',
                                        where: {
                                            status: 1,
                                        },
                                        attributes: ['id', 'image_url'],
                                        required: false,
                                        raw: true,
                                    },
                                ],
                            },
                        ]
                    }
                }
            ],
            order: [['createdAt', 'DESC']],
        });

        if (allStories.length > 0) {
            return res.response({
                code: 200,
                status: 'success',
                message: "Stories fetched successfully",
                allStories
            }).code(200);
        } else {
            return res.response({
                code: 404,
                status: 'error',
                message: "No stories found"
            }).code(404);
        }
        // } else if (user === 'Session expired') {
        //     return res.response({
        //         code: 401,
        //         status: 'error',
        //         message: user
        //     }).code(401);
        // } else {
        //     return res.response({
        //         code: 403,
        //         status: 'error',
        //         message: "You don't have permission for this action."
        //     }).code(403);
        // }

    } catch (error) {
        console.log(error)
        console.error("Error in getProductBrands function:", error);
        return res.response({
            code: 500,
            status: "error",
            message: "Internal server error"
        }).code(500);
    }
};


const addPhotoStories = async (req, res) => {
    try {
        const { customer_id, heading, description, image } = req.payload;

        const existingStories = await Stories.findOne({
            where: {
                heading,
            },
            raw: true
        });

        if (existingStories) {
            return res
                .response({
                    code: 409,
                    status: "error",
                    message: `${heading} already exists`,
                })
                .code(200);
        }

        const user = await checkToken(req.headers['Authorization'] ? req.headers['Authorization'] : req.headers.authorization);

        const allowed_user = ["CUSTOMER", "ADMIN"]

        if (allowed_user.includes(user.role) && user.application === 'kardify') {

            const { file_url } = await uploadFile(req, image, 'uploads/stories/')

            let is_approved = null;

            if (user.role === 'ADMIN') {
                is_approved = true;
            }

            const newStories = await Stories.create({
                customer_id,
                heading,
                description,
                story_type: 'image',
                image_url: file_url,
                is_approved,
                status: true
            });

            return res
                .response({
                    code: 201,
                    status: 'success',
                    message: "Story created successfully",
                    story: newStories,
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

const addVideoStories = async (req, res) => {
    try {
        const { customer_id, heading, description, video } = req.payload;

        const existingStories = await Stories.findOne({
            where: {
                heading,
            },
            raw: true
        });

        if (existingStories) {
            return res
                .response({
                    code: 409,
                    status: "error",
                    message: `${heading} already exists`,
                })
                .code(200);
        }

        const user = await checkToken(req.headers['Authorization'] ? req.headers['Authorization'] : req.headers.authorization);

        const allowed_user = ["CUSTOMER", "ADMIN"]
        if (allowed_user.includes(user.role) && user.application === 'kardify') {

            const { file_url } = await uploadFile(req, video, 'uploads/stories/')

            let is_approved = null;

            if (user.role === 'ADMIN') {
                is_approved = true;
            }

            const newStories = await Stories.create({
                customer_id,
                heading,
                description,
                story_type: 'video',
                image_url: file_url,
                is_approved,
                status: true
            });

            return res
                .response({
                    code: 201,
                    status: 'success',
                    message: "Story created successfully",
                    story: newStories,
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

const editStories = async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
        const { story_id, customer_id, heading, description, image, video, product_ids } = req.payload;

        const user = await checkToken(req.headers['Authorization'] ? req.headers['Authorization'] : req.headers.authorization);

        const allowed_user = ["ADMIN"]
        if (allowed_user.includes(user.role) && user.application === 'kardify') {
            const existingStory = await Stories.findByPk(story_id, { transaction });

            if (!existingStory) {
                await transaction.rollback();
                return res.response({
                    code: 404,
                    status: "error",
                    message: "Story not found",
                }).code(200);
            }

            existingStory.customer_id = customer_id;
            existingStory.heading = heading;
            existingStory.description = description;

            if (image) {
                const { file_url } = await uploadFile(req, image, 'uploads/stories/');
                existingStory.image_url = file_url;
            }
            if (video) {
                const { file_url } = await uploadFile(req, video, 'uploads/stories/');
                existingStory.image_url = file_url;
            }

            await existingStory.save({ transaction });

            await StoryProducts.destroy({
                where: { story_id },
                transaction,
            });

            const products = JSON.parse(product_ids);
            const productAssociations = products.map(product_id => ({
                story_id,
                product_id
            }));

            await StoryProducts.bulkCreate(productAssociations, { transaction });

            await transaction.commit();

            return res.response({
                code: 200,
                status: 'success',
                message: "Story updated successfully",
                story: existingStory,
            }).code(200);
        } else if (user === 'Session expired') {
            await transaction.rollback();
            return res.response({
                code: 401,
                status: 'error',
                message: user
            }).code(401);
        } else {
            await transaction.rollback();
            return res.response({
                code: 403,
                status: 'error',
                message: "You don't have permission for this action."
            }).code(403);
        }

    } catch (error) {
        console.error(error);
        await transaction.rollback();
        return res.response({
            code: 500,
            status: "error",
            message: "Something went wrong",
        }).code(200);
    }
};



const approveStory = async (req, res) => {
    try {
        const { story_id } = req.query;

        const user = await checkToken(req.headers['Authorization'] ? req.headers['Authorization'] : req.headers.authorization);
        if (user.role === "ADMIN" && user.application === 'kardify') {
            const existingStory = await Stories.findOne({
                where: {
                    id: story_id,
                },
            });

            if (!existingStory) {
                return res
                    .response({
                        code: 404,
                        status: "error",
                        message: "Story not found",
                    })
                    .code(200);
            }

            await existingStory.update({ is_approved: true });

            return res
                .response({
                    code: 200,
                    status: 'success',
                    message: `${existingStory.heading} Approved successfully`,
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

const rejectStory = async (req, res) => {
    try {

        const { story_id, rejected_reason } = req.payload;

        console.log('story_id', story_id)

        const user = await checkToken(req.headers['Authorization'] ? req.headers['Authorization'] : req.headers.authorization);
        if (user.role === "ADMIN" && user.application === 'kardify') {
            const existingStory = await Stories.findOne({
                where: {
                    id: story_id,
                },
            });

            if (!existingStory) {
                return res
                    .response({
                        code: 404,
                        status: "error",
                        message: "Story not found",
                    })
                    .code(200);
            }

            if (existingStory.is_approved === false) {
                return res
                    .response({
                        code: 400,
                        status: "error",
                        message: "Story has already been rejected",
                    })
                    .code(200);
            }

            await existingStory.update({
                is_approved: false,
                rejected_reason,
                status: false
            });

            return res
                .response({
                    code: 200,
                    status: 'success',
                    message: `${existingStory.heading} Rejected successfully with reason: ${rejected_reason}`,
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


const deleteStory = async (req, res) => {
    try {
        const { story_id } = req.query;

        const user = await checkToken(req.headers['Authorization'] ? req.headers['Authorization'] : req.headers.authorization);
        if (user.role === "ADMIN" && user.application === 'kardify') {
            const existingStory = await Stories.findOne({
                where: {
                    id: story_id,
                },
            });

            if (!existingStory) {
                return res
                    .response({
                        code: 404,
                        status: "error",
                        message: "Story not found",
                    })
                    .code(200);
            }

            await existingStory.destroy();

            return res
                .response({
                    code: 200,
                    status: 'success',
                    message: `${existingStory.heading} deleted successfully`,
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

const toggleStoryStatus = async (req, res) => {
    try {
        const { story_id } = req.query;

        const user = await checkToken(req.headers['Authorization'] ? req.headers['Authorization'] : req.headers.authorization);
        if (user.role === "ADMIN" && user.application === 'kardify') {
            if (!Number.isInteger(story_id) || story_id <= 0) {
                return res
                    .response({
                        code: 400,
                        status: "error",
                        message: "Invalid story_id",
                    })
                    .code(200);
            }

            const existingStory = await Stories.findOne({
                where: {
                    id: story_id,
                },
            });

            if (!existingStory) {
                return res
                    .response({
                        code: 404,
                        status: "error",
                        message: "Story not found",
                    })
                    .code(200);
            }

            existingStory.status = !existingStory.status;

            await existingStory.save();

            return res
                .response({
                    code: 200,
                    status: 'success',
                    message: "Status toggled successfully",
                    story: existingStory,
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
    getStories,
    getStoriesCustomer,
    addPhotoStories,
    addVideoStories,
    editStories,
    approveStory,
    rejectStory,
    deleteStory,
    toggleStoryStatus
}