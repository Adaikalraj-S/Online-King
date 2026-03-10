const Joi = require('joi')

const shiprocketTokenValidator = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
})

const shiprockeShippingValidator = Joi.object({
    pickup_pincode: Joi.string().required(),
    delivery_pincode: Joi.string().required(),
    COD: Joi.boolean().default(false).required(),
    weight: Joi.string().required(),
    token: Joi.string().required()
})


const shiprocketCreateOrderValidationPayload = Joi.object({
    order_id: Joi.string().required(),
    order_date: Joi.string().required(),
    pickup_location: Joi.string().default("primary").allow(null).allow(''),
    company_name: Joi.string().required(),
    billing_customer_name: Joi.string().required(),
    billing_last_name: Joi.string().allow(null).allow(''),
    billing_address: Joi.string().allow(null).allow(''),
    billing_address_2: Joi.string().allow(null).allow(''),
    billing_city: Joi.string().required(),
    billing_pincode: Joi.number().required(),
    billing_state: Joi.string().required(),
    billing_country: Joi.string().required(),
    billing_email: Joi.string().email().required(),
    billing_phone: Joi.number().required(),
    shipping_is_billing: Joi.boolean().default(true).allow(null).allow(''),
    shipping_customer_name: Joi.string().required(),
    shipping_last_name: Joi.string().allow(null).allow(''),
    shipping_address: Joi.string().required(),
    shipping_address_2: Joi.string().allow(null).allow(''),
    shipping_city: Joi.string().required(),
    shipping_pincode: Joi.number().required(),
    shipping_country: Joi.string().required(),
    shipping_state: Joi.string().required(),
    shipping_email: Joi.string().email().required(),
    shipping_phone: Joi.number().required(),
    order_items: Joi.array().items(Joi.object({
        name: Joi.string().required(),
        sku: Joi.string().required(),
        units: Joi.number().integer().required(),
        selling_price: Joi.number().integer().required(),
        // discount: Joi.number().integer().allow(null),
        // tax: Joi.number().integer().allow(null),
        // hsn: Joi.number().integer().allow(null)
    })),
    payment_method: Joi.string().required(),
    shipping_charges: Joi.number().required(),
    giftwrap_charges: Joi.number().allow(null),
    transaction_charges: Joi.number().allow(null),
    total_discount: Joi.number().allow(null),
    sub_total: Joi.number().required(),
    length: Joi.number().required(),
    breadth: Joi.number().required(),
    height: Joi.number().required(),
    weight: Joi.number().required()
})

const shiprocketCreateOrderValidationQuery = Joi.object({
    token: Joi.string().required()
})

const shiprocketTrackOrderValidationQuery = Joi.object({
    token: Joi.string().required(),
    order_id: Joi.string().required(),
})

module.exports = {
    shiprocketTokenValidator,
    shiprockeShippingValidator,
    shiprocketCreateOrderValidationQuery,
    shiprocketCreateOrderValidationPayload,
    shiprocketTrackOrderValidationQuery
}