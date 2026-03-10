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
 CarBrands
} = require("../models");
const { Op } = require("sequelize");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

const getCarBrands = async (req, res) => {
    try {
        const {
            id,
            brand_name
        } = req.query
        let filter = {}
        if (id) filter = {
            ...filter,
            id
        }
        if (brand_name) filter = {
            ...filter,
            brand_name
        }
        const brandName = await CarBrands.findAll({
            where: filter,
            raw: true,
            order: [['id', 'DESC']]
        })
        return res
            .response({
                code: 200,
                status:'success',
                message: "Car Brands fetched successfully",
                brandName
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

const getCarBrandsCustomers = async (req, res) => {
    try {
        const {
            id,
            brand_name
        } = req.query
        let filter = {
            status: true
        }
        if (id) filter = {
            ...filter,
            id
        }
        if (brand_name) filter = {
            ...filter,
            brand_name
        }
        const brandName = await CarBrands.findAll({
            where: filter,
            // order: [['createdAt', 'DESC']],
            order: [['brand_name', 'ASC']],
            raw: true
        })
        return res
            .response({
                code: 200,
                status:'success',
                message: "Car Brands fetched successfully",
                brandName
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

const addCarBrands = async (req, res) => {
    try {
        const { car_brand_name , image } = req.payload;
        
        const existingCarBrands = await CarBrands.findOne({
            where: {
                status: true,
                brand_name:car_brand_name,
            },
            raw: true
        });

        if (existingCarBrands) {
            return res
                .response({
                    code: 409,
                    status: "error",
                    message: `${car_brand_name} already exists`,
                })
                .code(200);
        }

        const { file_url } = await uploadFile(req, image , 'uploads/carbrands/') 

        const newCarBrand = await CarBrands.create({
            brand_name: car_brand_name,
            image_url: file_url,
            status: true
        });

        return res
            .response({
                code: 201,
                status: 'success',
                message: "Car brand created successfully",
                category: newCarBrand,
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

const editCarBrands = async (req, res) => {
    try {
        const { car_brand_id, car_brand_name, image } = req.payload;

        const existingCarBrand = await CarBrands.findOne({
            where: {
                id: car_brand_id,
            },
        });

        if (!existingCarBrand) {
            return res
                .response({
                    code: 404,
                    status: "error",
                    message: "Car brand not found",
                })
                .code(200);
        }

        const brandNameConflict = await CarBrands.findOne({
            where: {
                brand_name: car_brand_name,
            },
        });

        if (brandNameConflict && brandNameConflict.id !== car_brand_id) {
            return res
                .response({
                    code: 409,
                    status: "error",
                    message: `${car_brand_name} already exists`,
                })
                .code(200);
        }

        if (car_brand_name) {
            existingCarBrand.brand_name = car_brand_name;
        }
        
        if (image) {
            const { file_url } = await uploadFile(req, image, 'uploads/carbrands/');
            existingCarBrand.image_url = file_url;
        }else {
            existingCarBrand.image_url = existingCarBrand.image_url;
        }

        await existingCarBrand.save();

        return res
            .response({
                code: 200,
                status: 'success',
                message: "Car brand updated successfully",
                category: existingCarBrand,
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

const deleteCarBrand = async (req, res) => {
    try {
        const { car_brand_id } = req.query; 

        const existingCarBrand = await CarBrands.findOne({
            where: {
                id: car_brand_id,
            },
        });

        if (!existingCarBrand) {
            return res
                .response({
                    code: 404,
                    status: "error",
                    message: "Car brand not found",
                })
                .code(200);
        }

        await existingCarBrand.destroy();

        return res
            .response({
                code: 200,
                status: 'success',
                message: `${existingCarBrand.brand_name} deleted successfully`,
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

// const toggleCarBrandStatus = async (req, res) => {
//     try {
//         const { car_brand_id } = req.query;

//         if (!Number.isInteger(car_brand_id) || car_brand_id <= 0) {
//             return res
//                 .response({
//                     code: 400,
//                     status: "error",
//                     message: "Invalid car_brand_id",
//                 })
//                 .code(200);
//         }

//         const existingCarBrand = await CarBrands.findOne({
//             where: {
//                 id: car_brand_id,
//             },
//         });

//         if (!existingCarBrand) {
//             return res
//                 .response({
//                     code: 404,
//                     status: "error",
//                     message: "Car Brand not found",
//                 })
//                 .code(200);
//         }

//         existingCarBrand.status = !existingCarBrand.status;

//         await existingCarBrand.save();

//         return res
//             .response({
//                 code: 200,
//                 status:'success',
//                 message: "Status toggled successfully",
//                 carbrand: existingCarBrand,
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

const toggleCarBrandStatus = async (req, res) => {
    try {
        const { car_brand_id } = req.query;

            if (!Number.isInteger(car_brand_id) || car_brand_id <= 0) {
                return res
                    .response({
                        code: 400,
                        status: "error",
                        message: "Invalid car_brand_id",
                    })
                    .code(200);
            }

            const existingCarBrand = await CarBrands.findOne({
                where: {
                    id: car_brand_id,
                },
            });

            if (!existingCarBrand) {
                return res
                    .response({
                        code: 404,
                        status: "error",
                        message: "Car Brand not found",
                    })
                    .code(200);
            }

            // Toggle the category status (assuming you have a boolean 'status' field)
            existingCarBrand.status = !existingCarBrand.status;

            // Save the updated category to the database
            await existingCarBrand.save();

            return res
                .response({
                    code: 200,
                    status: 'success',
                    message: "Car Brand status toggled successfully",
                    category: existingCarBrand,
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
    getCarBrands,
    getCarBrandsCustomers,
    addCarBrands,
    editCarBrands,
    deleteCarBrand,
    toggleCarBrandStatus
}