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
    SubCategories, Categories, SuperSubCategories
} = require("../models");
const { Op } = require("sequelize");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

const fetchSuperSubcategories = async (req, res) => {
    try {
        const { id, category_id, sub_category_id, super_sub_category_name } = req.query;

        const user = await checkToken(req.headers['Authorization'] ? req.headers['Authorization'] : req.headers.authorization)
        if (user.role === "ADMIN" && user.application === 'kardify') {

        const filter = {};
        if (id) filter.id = id;
        if (category_id) filter.category_id = category_id;
        if (sub_category_id) filter.sub_category_id = sub_category_id;
        if (super_sub_category_name) filter.super_sub_category_name = super_sub_category_name;

            const superSubcategories = await SuperSubCategories.findAll({
                include: [
                    {
                        model: Categories,
                        as: 'category',
                        attributes: { exclude: [] },
                    },
                    {
                        model: SubCategories,
                        as: 'subCategory',
                        attributes: { exclude: [] },
                    }
                ],
                where: filter,
                nest: true,
                mapToModel: true,
                order: [['id', 'DESC']],
            });

            return res
                .response({
                    code: 200,
                    status: "success",
                    message: "Super Subcategories fetched successfully",
                    superSubcategories,
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

const fetchSuperSubcategoriesCustomer = async (req, res) => {
    try {
        const { id, category_id, sub_category_id, super_sub_category_name } = req.query;


        const filter = {
            status : true
        };
        if (id) filter.id = id;
        if (category_id) filter.category_id = category_id;
        if (sub_category_id) filter.sub_category_id = sub_category_id;
        if (super_sub_category_name) filter.super_sub_category_name = super_sub_category_name;

            const superSubcategories = await SuperSubCategories.findAll({
                include: [
                    {
                        model: Categories,
                        as: 'category',
                        attributes: { exclude: [] },
                    },
                    {
                        model: SubCategories,
                        as: 'subCategory',
                        attributes: { exclude: [] },
                    }
                ],
                where: filter,
                nest: true,
                mapToModel: true,
                order: [['super_sub_category_name', 'ASC']]
            });

            return res
                .response({
                    code: 200,
                    status: "success",
                    message: "Super Subcategories fetched successfully",
                    superSubcategories,
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

const addSuperSubcategory = async (req, res) => {
    try {
        const { super_sub_category_name, sub_category_id, category_id, image } = req.payload;

        const existingSuperSubcategory = await SuperSubCategories.findOne({
            where: {
                super_sub_category_name,
                sub_category_id,
            },
        });

        if (existingSuperSubcategory) {
            return res
                .response({
                    code: 409,
                    status: "error",
                    message: "Super Subcategory with the same name already exists in the subcategory",
                })
                .code(200);
        }

        if(image) {
            const { file_url } = await uploadFile(req, image, 'uploads/supersubcategories/');
            const newSuperSubcategory = await SuperSubCategories.create({
                super_sub_category_name,
                sub_category_id,
                category_id,
                image_url: file_url,
                status: true,
            });
            return res
                .response({
                    code: 201,
                    status: "success",
                    message: "Super Subcategory created successfully",
                    superSubcategory: newSuperSubcategory,
                })
                .code(200);
        }else{
            const file_url =  '/uploads/default/default.png';
            const newSuperSubcategory = await SuperSubCategories.create({
                super_sub_category_name,
                image_url: file_url,
                sub_category_id,
                category_id,
                status: true,
            });
            return res
                .response({
                    code: 201,
                    status: "success",
                    message: "Super Subcategory created successfully",
                    superSubcategory: newSuperSubcategory,
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

// const editSuperSubcategory = async (req, res) => {
//     try {
//         const { super_sub_category_id, super_sub_category_name, image } = req.payload;

//         const existingSuperSubcategory = await SuperSubCategories.findOne({
//             where: {
//                 id: super_sub_category_id,
//             },
//         });

//         if (!existingSuperSubcategory) {
//             return res
//                 .response({
//                     code: 404,
//                     status: "error",
//                     message: "Super Subcategory not found",
//                 })
//                 .code(200);
//         }


//         const existingNameInSubcategory = await SuperSubCategories.findOne({
//             where: {
//                 super_sub_category_name,
//             },
//         });


//         if (existingNameInSubcategory) {
//             return res
//                 .response({
//                     code: 409,
//                     status: "error",
//                     message: "Super Subcategory with the same name already exists in the subcategory",
//                 })
//                 .code(200);
//         }

//         if (super_sub_category_name) {
//             existingSuperSubcategory.super_sub_category_name = super_sub_category_name;
//         }
//         if (image) {
//             const { file_url } = await uploadFile(req, image, 'uploads/supersubcategories/');
//             existingSuperSubcategory.image = file_url;
//         }

//         await existingSuperSubcategory.save();

//         return res
//             .response({
//                 code: 200,
//                 status: "success",
//                 message: "Super Subcategory updated successfully",
//                 superSubcategory: existingSuperSubcategory,
//             })
//             .code(200);
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
// };


const editSuperSubcategory = async (req, res) => {
    try {
        const { 
            super_sub_category_id, 
            super_sub_category_name, 
            image, 
            sub_category_id, 
            category_id 
        } = req.payload;

        console.log(req.payload)

        const existingSuperSubcategory = await SuperSubCategories.findOne({
            where: {
                id: super_sub_category_id,
            },
        });

        if (!existingSuperSubcategory) {
            return res
                .response({
                    code: 404,
                    status: "error",
                    message: "Super Subcategory not found",
                })
                .code(200);
        }

        const existingNameInSubcategory = await SuperSubCategories.findOne({
            where: {
                super_sub_category_name,
            },
        });

        if (existingNameInSubcategory && existingNameInSubcategory.id !== super_sub_category_id) {
            return res
                .response({
                    code: 409,
                    status: "error",
                    message: "Super Subcategory with the same name already exists in the subcategory",
                })
                .code(200);
        }

        if (super_sub_category_name) {
            existingSuperSubcategory.super_sub_category_name = super_sub_category_name;
        }
        if (image) {
            const { file_url } = await uploadFile(req, image, 'uploads/supersubcategories/');
            existingSuperSubcategory.image = file_url;
        }
        if (sub_category_id) {
            existingSuperSubcategory.sub_category_id = sub_category_id;
        }
        if (category_id) {
            existingSuperSubcategory.category_id = category_id;
        }

        await existingSuperSubcategory.save();

        return res
            .response({
                code: 200,
                status: "success",
                message: "Super Subcategory updated successfully",
                superSubcategory: existingSuperSubcategory,
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


const deleteSuperSubcategory = async (req, res) => {
    try {
        const { super_sub_category_id } = req.query;

        const existingSuperSubcategory = await SuperSubCategories.findOne({
            where: {
                id: super_sub_category_id,
            },
        });

        if (!existingSuperSubcategory) {
            return res
                .response({
                    code: 404,
                    status: "error",
                    message: "Subcategory not found",
                })
                .code(200);
        }

        await existingSuperSubcategory.destroy();

        return res
            .response({
                code: 200,
                status: "success",
                message: "Subcategory deleted successfully",
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

const toggleSuperSubCategoryStatus = async (req, res) => {
    try {
        const { super_sub_category_id } = req.query;

        if (!Number.isInteger(super_sub_category_id) || super_sub_category_id <= 0) {
            return res
                .response({
                    code: 400,
                    status: "error",
                    message: "Invalid super_sub_category id",
                })
                .code(200);
        }

        const existingSuperSubCategory = await SuperSubCategories.findOne({
            where: {
                id: super_sub_category_id,
            },
        });

        if (!existingSuperSubCategory) {
            return res
                .response({
                    code: 404,
                    status: "error",
                    message: "Super SubCategory not found",
                })
                .code(200);
        }

        existingSuperSubCategory.status = !existingSuperSubCategory.status;

        await existingSuperSubCategory.save();

        return res
            .response({
                code: 200,
                status: 'success',
                message: "status toggled successfully",
                category: existingSuperSubCategory,
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


module.exports = {
    fetchSuperSubcategories,
    fetchSuperSubcategoriesCustomer,
    addSuperSubcategory,
    editSuperSubcategory,
    deleteSuperSubcategory,
    toggleSuperSubCategoryStatus
}