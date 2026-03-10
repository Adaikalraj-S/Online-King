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
 CarModel, CarBrands
} = require("../models");
const { Op } = require("sequelize");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

const getCarModels = async (req, res) => {
    try {
        const {
            id,
            brand_id,
            model_name
        } = req.query
        let filter = {}
        if (id) filter = {
            ...filter,
            id
        }
        if (brand_id) {
            if (Array.isArray(brand_id)) {
                filter.brand_id = { [Op.in]: brand_id };
            } else {
                filter.brand_id = brand_id;
            }
        }
        if (model_name) filter = {
            ...filter,
            model_name
        }
        const modelName = await CarModel.findAll({
            where: filter,
            include: [
                {
                    model: CarBrands,
                    as: 'car_brand',
                }
            ],
            order: [['id', 'DESC']]
        })
        return res
            .response({
                code: 200,
                status:'success',
                message: "Car Models fetched successfully",
                modelName
            })
            .code(200);
    } catch (error) {
        console.log(error)
        return res
            .response({
                code: 401,
                status: "error",
                message: "Something Wrong",
            })
            .code(200);
    }
};

const getCarModelsCustomers = async (req, res) => {
    try {
        const {
            id,
            brand_id,
            model_name
        } = req.query
        let filter = {
            status: true
        }
        if (id) filter = {
            ...filter,
            id
        }
        
        if (brand_id) filter = {
            ...filter,
            brand_id
        }

        if (model_name) filter = {
            ...filter,
            model_name
        }
        const modelName = await CarModel.findAll({
            where: filter,
            include: [
                {
                    model: CarBrands,
                    as: 'car_brand',
                }
            ],
            // order: [['createdAt', 'DESC']],
            order: [['model_name', 'ASC']],
        })
        return res
            .response({
                code: 200,
                status:'success',
                message: "Car Models fetched successfully",
                modelName
            })
            .code(200);
    } catch (error) {
        console.log(error)
        return res
            .response({
                code: 401,
                status: "error",
                message: "Something Wrong",
            })
            .code(200);
    }
};

const addCarModels = async (req, res) => {
    try {
        const user = await checkToken(req.headers['Authorization'] ? req.headers['Authorization'] : req.headers.authorization)
        if (user.role === "ADMIN" && user.application === 'kardify') {
            
            const { car_brand_id, model_name , image , start_year , end_year } = req.payload;
            
            const existingCarBrands = await CarModel.findOne({
                where: {
                    model_name,
                },
                raw: true
            });
    
            if (existingCarBrands) {
                return res
                    .response({
                        code: 409,
                        status: "error",
                        message: `${model_name} already exists`,
                    })
                    .code(200);
            }
    
            const { file_url } = await uploadFile(req, image , 'uploads/carbrands/') 
    
            const newCarModel = await CarModel.create({
                brand_id: car_brand_id,
                model_name,
                start_year,
                end_year,
                image_url: file_url,
                status: true
            });
    
            return res
                .response({
                    code: 201,
                    status: 'success',
                    message: "Car Model created successfully",
                    category: newCarModel,
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

const editCarModel = async (req, res) => {
    try {
        const user = await checkToken(req.headers['Authorization'] ? req.headers['Authorization'] : req.headers.authorization)
        if (user.role === "ADMIN" && user.application === 'kardify') {
            const { car_model_id, car_brand_id, model_name, image, start_year, end_year } = req.payload;
    
            const existingCarModel = await CarModel.findOne({
                where: {
                    id: car_model_id,
                },
            });
    
            if (!existingCarModel) {
                return res
                    .response({
                        code: 404,
                        status: "error",
                        message: "Car model not found",
                    })
                    .code(200);
            }
    
            const modelConflict = await CarModel.findOne({
                where: {
                    model_name,
                    id: {
                        [Op.not]: car_model_id, 
                    },
                },
            });
    
            if (modelConflict) {
                return res
                    .response({
                        code: 409,
                        status: "error",
                        message: `${model_name} already exists`,
                    })
                    .code(200);
            }
    
            if (car_brand_id) {
                existingCarModel.brand_id = car_brand_id;
            }

            if (model_name) {
                existingCarModel.model_name = model_name;
            }
            
            if (start_year) {
                existingCarModel.start_year = start_year;
            }
            
            if (end_year) {
                existingCarModel.end_year = end_year;
            }
    
            if (image) {
                const { file_url } = await uploadFile(req, image, 'uploads/carbrands/');
                existingCarModel.image_url = file_url;
            }
    
            await existingCarModel.save();
    
            return res
                .response({
                    code: 200,
                    status: 'success',
                    message: "Car model updated successfully",
                    carModel: existingCarModel,
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


const deleteCarModel = async (req, res) => {
    try {

        const user = await checkToken(req.headers['Authorization'] ? req.headers['Authorization'] : req.headers.authorization)
        if (user.role === "ADMIN" && user.application === 'kardify') {
            
            const { car_model_id } = req.query; // Assuming car_model_id is passed as a URL parameter
    
            // Check if the specified car model exists
            const existingCarModel = await CarModel.findOne({
                where: {
                    id: car_model_id,
                },
            });
    
            if (!existingCarModel) {
                return res
                    .response({
                        code: 404,
                        status: "error",
                        message: "Car model not found",
                    })
                    .code(200);
            }
    
            // Delete the car model
            await existingCarModel.destroy();
    
            return res
                .response({
                    code: 200,
                    status: 'success',
                    message: "Car model deleted successfully",
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


const toggleCarModelStatus = async (req, res) => {
    try {

        const user = await checkToken(req.headers['Authorization'] ? req.headers['Authorization'] : req.headers.authorization)
        if (user.role === "ADMIN" && user.application === 'kardify') {
            const { car_model_id } = req.query;
    
            if (!Number.isInteger(car_model_id) || car_model_id <= 0) {
                return res
                    .response({
                        code: 400,
                        status: "error",
                        message: "Invalid car_model_id",
                    })
                    .code(200);
            }
    
            const existingCarModel = await CarModel.findOne({
                where: {
                    id: car_model_id,
                },
            });
    
            if (!existingCarModel) {
                return res
                    .response({
                        code: 404,
                        status: "error",
                        message: "Car Model not found",
                    })
                    .code(200);
            }
    
            // Toggle the category status (assuming you have a boolean 'status' field)
            existingCarModel.status = !existingCarModel.status;
    
            // Save the updated category to the database
            await existingCarModel.save();
    
            return res
                .response({
                    code: 200,
                    status:'success',
                    message: "Status toggled successfully",
                    category: existingCarModel,
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
    getCarModels,
    getCarModelsCustomers,
    addCarModels,
    editCarModel,
    deleteCarModel,
    toggleCarModelStatus
}