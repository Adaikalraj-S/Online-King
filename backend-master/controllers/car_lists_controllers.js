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
 CarBrands, CarLists, CarModel
} = require("../models");
const { Op } = require("sequelize");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

const fetchCarList = async (req, res) => {
    try {

        const {
            id,
            brand_id,
            model_id
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
        if (model_id) filter = {
            ...filter,
            model_id
        }
        const carLists = await CarLists.findAll({
            include: [
                {
                    model: CarBrands,
                    as: 'car_brand', 
                    attributes: { exclude: [] }, 
                },
                {
                    model: CarModel, 
                    as: 'car_model',
                    attributes: { exclude: [] }, 
                }
            ],
            where: filter,
            nest:true,
            mapToModel:true,
            raw: true
        })
        return res
            .response({
                code: 200,
                status:'success',
                message: "Car Lists fetched successfully",
                carLists
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

const addCarList = async (req, res) => {
    try {
        const { brand_id, model_id } = req.payload;

        const existingCarList = await CarLists.findOne({
            where: {
                brand_id,
                model_id,
            },
        });

        if (existingCarList) {
            return res
                .response({
                    code: 409,
                    status: "error",
                    message: "Car list entry with the same brand and model already exists",
                })
                .code(200);
        }

        // Check if the specified car brand and car model exist
        const existingCarBrand = await CarBrands.findOne({
            where: {
                id: brand_id,
            },
        });

        const existingCarModel = await CarModel.findOne({
            where: {
                id: model_id,
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

        if (!existingCarModel) {
            return res
                .response({
                    code: 404,
                    status: "error",
                    message: "Car model not found",
                })
                .code(200);
        }

        const newCarList = await CarLists.create({
            brand_id,
            model_id,
            status: true
        });

        return res
            .response({
                code: 201,
                status: 'success',
                message: "Car list entry created successfully",
                carList: newCarList,
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

const editCarList = async (req, res) => {
    try {
        const { car_lists_id, brand_id, model_id } = req.payload;

        const existingCarList = await CarLists.findOne({
            where: {
                id: car_lists_id,
            },
        });

        if (!existingCarList) {
            return res
                .response({
                    code: 404,
                    status: "error",
                    message: "Car list entry not found",
                })
                .code(200);
        }

        // Check if the specified car brand and car model exist
        const existingCarBrand = await CarBrands.findOne({
            where: {
                id: brand_id,
            },
        });

        const existingCarModel = await CarModel.findOne({
            where: {
                id: model_id,
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

        if (!existingCarModel) {
            return res
                .response({
                    code: 404,
                    status: "error",
                    message: "Car model not found",
                })
                .code(200);
        }

        const duplicateCarList = await CarLists.findOne({
            where: {
                model_id,
                brand_id,
                id: { [Op.not]: car_lists_id }, // Exclude the current entry from the check
            },
        });

        if (duplicateCarList) {
            return res
                .response({
                    code: 409,
                    status: "error",
                    message: "Car list entry with the same brand and model already exists",
                })
                .code(200);
        }

        // Update the car list entry
        existingCarList.brand_id = brand_id;
        existingCarList.model_id = model_id;

        await existingCarList.save();

        return res
            .response({
                code: 200,
                status: 'success',
                message: "Car list entry updated successfully",
                carList: existingCarList,
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

const deleteCarList = async (req, res) => {
    try {
        const {car_lists_id} = req.query;

        const existingCarList = await CarLists.findOne({
            where: {
                id: car_lists_id,
            },
        });

        if (!existingCarList) {
            return res
                .response({
                    code: 404,
                    status: "error",
                    message: "Car list entry not found",
                })
                .code(200);
        }

        await existingCarList.destroy();

        return res
            .response({
                code: 200,
                status: 'success',
                message: "Car list entry deleted successfully",
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

const toggleCarListStatus = async (req, res) => {
    try {
        const { car_lists_id } = req.query;

        if (!Number.isInteger(car_lists_id) || car_lists_id <= 0) {
            return res
                .response({
                    code: 400,
                    status: "error",
                    message: "Invalid car_lists_id",
                })
                .code(200);
        }

        const existingCarList = await CarLists.findOne({
            where: {
                id: car_lists_id,
            },
        });

        if (!existingCarList) {
            return res
                .response({
                    code: 404,
                    status: "error",
                    message: "Car List not found",
                })
                .code(200);
        }

        // Toggle the category status (assuming you have a boolean 'status' field)
        existingCarList.status = !existingCarList.status;

        // Save the updated category to the database
        await existingCarList.save();

        return res
            .response({
                code: 200,
                status:'success',
                message: "Status toggled successfully",
                carlist: existingCarList,
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
    fetchCarList,
    addCarList,
    editCarList,
    deleteCarList,
    toggleCarListStatus
};
