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
    SubCategories, Categories
} = require("../models");
const { Op } = require("sequelize");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

const fetchSubCategories = async (req, res) => {
    try {
        const { sub_category_name, id, category_id } = req.query;
        const user = await checkToken(req.headers['Authorization'] ? req.headers['Authorization'] : req.headers.authorization)



        if (user.role === "ADMIN" && user.application === 'kardify') {
            const whereCondition = {};

            if (sub_category_name) {
                whereCondition.sub_category_name = sub_category_name;
            }

            if (id) {
                whereCondition.id = id;
            }

            if (category_id) {
                whereCondition.category_id = category_id;
            }

            const subcategories = await SubCategories.findAll({
                include: [{
                    model: Categories,
                    as: 'category',
                    attributes: { exclude: [] },
                }],
                nest: true,
                mapToModel: true,
                where: whereCondition,
                raw: true,
                order: [['createdAt', 'DESC']]
            });

            return res
                .response({
                    code: 200,
                    message: "Subcategories fetched successfully",
                    subcategories,
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

const fetchSubCategoriesCustomer = async (req, res) => {
    try {
        const { sub_category_name, id, category_id } = req.query;
        const whereCondition = {
            status: true
        };

        if (sub_category_name) {
            whereCondition.sub_category_name = sub_category_name;
        }

        if (id) {
            whereCondition.id = id;
        }

        if (category_id) {
            whereCondition.category_id = category_id;
        }

        const subcategories = await SubCategories.findAll({
            include: [{
                model: Categories,
                as: 'category',
                attributes: { exclude: [] },
            }],
            nest: true,
            mapToModel: true,
            where: whereCondition,
            raw: true,
            order: [['sub_category_name', 'ASC']]
        });

        return res
            .response({
                code: 200,
                message: "Subcategories fetched successfully",
                subcategories,
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

const createSubcategories = async (req, res) => {
    try {
        const { category_id, sub_category_name, image } = req.payload;

        const user = await checkToken(req.headers['Authorization'] ? req.headers['Authorization'] : req.headers.authorization)

        if (user.role === "ADMIN" && user.application === 'kardify') {
            const existingCategory = await Categories.findOne({
                where: {
                    id: category_id,
                },
            });

            if (!existingCategory) {
                return res
                    .response({
                        code: 404,
                        status: "error",
                        message: "Category not found",
                    })
                    .code(200);
            }

            const existingSubcategory = await SubCategories.findOne({
                where: {
                    category_id,
                    sub_category_name,
                },
            });

            if (existingSubcategory) {
                return res
                    .response({
                        code: 409,
                        status: "error",
                        message: `${sub_category_name} subcategory with the same name already exists in the ${existingCategory.category_name} category`,
                    })
                    .code(200);
            }

            if (image) {
                const { file_url } = await uploadFile(req, image, 'uploads/subcategories/')
                const newSubcategory = await SubCategories.create({
                    category_id,
                    sub_category_name,
                    image_url: file_url,
                    status: true
                });

                return res
                    .response({
                        code: 201,
                        status: 'success',
                        message: "Subcategory created successfully",
                        subcategory: newSubcategory,
                    })
                    .code(200);
            } else {
                const file_url = '/uploads/default/default.png'
                const newSubcategory = await SubCategories.create({
                    category_id,
                    sub_category_name,
                    image_url: file_url,
                    status: true
                });

                return res
                    .response({
                        code: 201,
                        status: 'success',
                        message: "Subcategory created successfully",
                        subcategory: newSubcategory,
                    })
                    .code(200);
            }


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

const updateSubcategories = async (req, res) => {
    try {
        const { category_id, sub_category_id, sub_category_name, image } = req.payload;

        const user = await checkToken(req.headers['Authorization'] ? req.headers['Authorization'] : req.headers.authorization)

        if (user.role === "ADMIN" && user.application === 'kardify') {
            const existingSubcategory = await SubCategories.findOne({
                where: {
                    id: sub_category_id,
                },
            });

            if (!existingSubcategory) {
                return res
                    .response({
                        code: 404,
                        status: "error",
                        message: "Subcategory not found",
                    })
                    .code(200);
            }

            // Check if the updated name is the same as the existing name
            //  if (sub_category_name === existingSubcategory.sub_category_name) {
            //     return res
            //         .response({
            //             code: 400,
            //             status: "error",
            //             message: "No changes detected in subcategory name",
            //         })
            //         .code(200);
            // }

            if (sub_category_name) {
                const sameNameSubcategory = await SubCategories.findOne({
                    where: {
                        category_id: category_id,
                        sub_category_name,
                        id: {
                            [Op.not]: sub_category_id,
                        },
                    },
                });

                if (sameNameSubcategory) {
                    return res
                        .response({
                            code: 409,
                            status: "error",
                            message: "Subcategory with the same name already exists in the category",
                        })
                        .code(200);
                }
            }

            // Update subcategory fields
            if (sub_category_name) {
                existingSubcategory.sub_category_name = sub_category_name;
            }
            if (category_id) {
                existingSubcategory.category_id = category_id;
            }
            if (image) {
                const { file_url } = await uploadFile(req, image, 'uploads/subcategories/')
                existingSubcategory.image_url = file_url;
            } else {
                existingSubcategory.image_url = existingSubcategory.image_url;
            }


            await existingSubcategory.save();

            return res
                .response({
                    code: 200,
                    status: 'success',
                    message: "Subcategory updated successfully",
                    subcategory: existingSubcategory,
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

const deleteSubcategory = async (req, res) => {
    try {
        const { sub_category_id } = req.query;

        const user = await checkToken(req.headers['Authorization'] ? req.headers['Authorization'] : req.headers.authorization)

        if (user.role === "ADMIN" && user.application === 'kardify') {
            const existingSubcategory = await SubCategories.findOne({
                where: {
                    id: sub_category_id,
                },
            });

            if (!existingSubcategory) {
                return res
                    .response({
                        code: 404,
                        status: "error",
                        message: "Subcategory not found",
                    })
                    .code(200);
            }

            await existingSubcategory.destroy();

            return res
                .response({
                    code: 200,
                    status: "success",
                    message: "Subcategory deleted successfully",
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

const toggleSubCategoryStatus = async (req, res) => {
    try {
        const { sub_category_id } = req.query;

        const user = await checkToken(req.headers['Authorization'] ? req.headers['Authorization'] : req.headers.authorization)

        if (user.role === "ADMIN" && user.application === 'kardify') {
            if (!Number.isInteger(sub_category_id) || sub_category_id <= 0) {
                return res
                    .response({
                        code: 400,
                        status: "error",
                        message: "Invalid sub_category id",
                    })
                    .code(200);
            }

            const existingSubCategory = await SubCategories.findOne({
                where: {
                    id: sub_category_id,
                },
            });

            if (!existingSubCategory) {
                return res
                    .response({
                        code: 404,
                        status: "error",
                        message: "Category not found",
                    })
                    .code(200);
            }

            // Toggle the category status (assuming you have a boolean 'status' field)
            existingSubCategory.status = !existingSubCategory.status;

            // Save the updated category to the database
            await existingSubCategory.save();

            return res
                .response({
                    code: 200,
                    status: 'success',
                    message: "Category status toggled successfully",
                    category: existingSubCategory,
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


module.exports = {
    fetchSubCategories,
    fetchSubCategoriesCustomer,
    createSubcategories,
    updateSubcategories,
    deleteSubcategory,
    toggleSubCategoryStatus
}