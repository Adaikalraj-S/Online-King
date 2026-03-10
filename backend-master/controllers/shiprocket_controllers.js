const axios = require('axios')

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
        SHIPROCKET_TOKEN_API_URL,
        SHIPROCKET_SHIPPING_PRICE_API_URL,
        SHIPROCKET_CREATE_ORDER_API_URL,
        SHIPROCKET_TRACK_ORDER_API_URL
    },
    sequelize,
} = require("../config");

const {
    shiprocketTokenValidator,
    shiprockeShippingValidator,
    shiprocketCreateOrderValidationPayload,
    shiprocketCreateOrderValidationQuery,
    shiprocketTrackOrderValidationQuery
} = require('../validators/shiprocket_validators')

const getToken = async (req, res) => {
    try {
        // const user = await checkToken(req.headers['Authorization'] ? req.headers['Authorization'] : req.headers.authorization)

        // const allowed_user = ['ADMIN', 'CUSTOMER', 'DEALER']
        // if (allowed_user.includes(user.role) && user.application === 'kardify') {

            const { email, password } = req.query;

            const response = await axios({
                method: 'post',
                url: SHIPROCKET_TOKEN_API_URL,
                data: {
                    email: email,
                    password: password,
                }
            })
            return res.response({
                code: 200,
                status: 'success',
                message: 'Token created successfully.',
                token: response.data.token
            }).code(200);
        // } else if (user == 'Session expired') {
        //     return res
        //         .response({
        //             code: 401,
        //             status: 'error',
        //             message: user,
        //         })
        //         .code(200);
        // } else {
        //     return res
        //         .response({
        //             code: 403,
        //             status: 'error',
        //             message: "You dont have permission for this action.",
        //         })
        //         .code(200);
        // }
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
}


const getShippingPrice = async (req, res) => {
    try {
        // const user = await checkToken(req.headers['Authorization'] ? req.headers['Authorization'] : req.headers.authorization)

        // const allowed_user = ['ADMIN', 'CUSTOMER', 'DEALER']
        // if (allowed_user.includes(user.role) && user.application === 'kardify') {

            const { pickup_pincode, token, delivery_pincode, weight, COD } = req.payload
            const headers = {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
            const response = await axios({
                method: 'get',
                url: SHIPROCKET_SHIPPING_PRICE_API_URL,
                headers,
                params: {
                    pickup_postcode: Number(pickup_pincode),
                    delivery_postcode: Number(delivery_pincode),
                    cod: COD ? 1 : 0,
                    weight: weight,
                }
            })
            if (response.data.data.available_courier_companies.length > 0) {
                const currency = response.data.currency
                const mappedData = response.data.data.available_courier_companies.map(e => {
                    return {
                        city: e.city,
                        cod_charges: e.cod_charges,
                        charge: e.rate,
                        estimate_del_in_days: e.estimated_delivery_days,
                        estimate_del_day: e.etd,
                        state: e.state,
                        courier: e.courier_name,
                        currency,
                    }
                })
                const data = await Promise.all(mappedData)
                return res.response({
                    code: 200,
                    status: 'success',
                    message: 'Courier data fetched successfully.',
                    data
                }).code(200);
            } else {
                return res.response({
                    code: 401,
                    status: 'error',
                    message: 'No courier partner available.',
                    data
                }).code(200);
            }
        // } else if (user == 'Session expired') {
        //     return res
        //         .response({
        //             code: 401,
        //             status: 'error',
        //             message: user,
        //         })
        //         .code(200);
        // } else {
        //     return res
        //         .response({
        //             code: 403,
        //             status: 'error',
        //             message: "You dont have permission for this action.",
        //         })
        //         .code(200);
        // }
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
}

const createOrder = async (req, res) => {
    try {
        const user = await checkToken(req.headers['Authorization'] ? req.headers['Authorization'] : req.headers.authorization)

        const allowed_user = ['ADMIN', 'CUSTOMER', 'DEALER']
        if (allowed_user.includes(user.role) && user.application === 'kardify') {
            const query = await shiprocketCreateOrderValidationQuery.validateAsync(req.query)
            const body = await shiprocketCreateOrderValidationPayload.validateAsync(req.body)
            const headers = {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${query.token}`
            }

            const response = await axios({
                method: 'post',
                url: SHIPROCKET_CREATE_ORDER_API_URL,
                headers,
                data: { ...body }
            })
            return res.response({
                code: 200,
                status: 'success',
                message: 'Order created successfully.',
                data: response.data
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
}


const trackOrder = async (req, res) => {
    try {
        const query = await shiprocketTrackOrderValidationQuery.validateAsync(req.query)
        const headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${query.token}`
        }

        const response = await axios({
            method: 'get',
            url: SHIPROCKET_TRACK_ORDER_API_URL,
            headers,
            params: {
                order_id: query.order_id
            }
        })
        res.send(response.data)
    } catch (error) {
        res.send({
            status: "error",
            message: error.message
        })
    }
}

module.exports = {
    getToken,
    getShippingPrice,
    createOrder,
    trackOrder
}