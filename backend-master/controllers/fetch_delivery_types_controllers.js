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
     DeliveryTypes
} = require("../models");
const { Op, Model } = require("sequelize");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

const fetchDeliveryTypes = async (req, res) => {
    try {
        const delivery_types = await DeliveryTypes.findAll({
            raw: true
        })
        return res
            .response({
                code: 200,
                status: "success",
                message: 'All the delivery types fetched successfully.',
                delivery_types,
            })
            .code(200);
    } catch (error) {
        console.log(error);
        return res
            .response({
                code: 400,
                status: "error",
                message: error.message,
            })
            .code(200);
    }
}





module.exports = {
    fetchDeliveryTypes
}