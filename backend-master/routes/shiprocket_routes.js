const tags = ["api", "Shiprocket Setup"];

const { product_attributes_controlllers, installers_controllers, stories_controllers, shiprocket_controllers } = require("../controllers");

const {
    usersValidation,
    headerValidator,
    productAttributesValidators,
    InstallersValidator,
    StoriesValidator,
    ShiprocketValidators
} = require("../validators");

const shiprocket_routes = [
    {
        method: "GET",
        path: "/get-token",
        options: {
            description: "Get Token for Shiprocket.", 
            validate: {
                // headers: headerValidator,
                query: ShiprocketValidators.shiprocketTokenValidator
            },
            tags,
            handler: shiprocket_controllers.getToken,
        },
    },

    {
        method: "POST",
        path: "/get-shipping-price",
        options: {
            description: "Get Shipping Price from Shiprocket.", 
            validate: {
                // headers: headerValidator,
                payload: ShiprocketValidators.shiprockeShippingValidator
            },
            tags,
            handler: shiprocket_controllers.getShippingPrice,
        },
    },

    {
        method: "POST",
        path: "/create-order",
        options: {
            description: "Create Order to Shiprocket.", 
            validate: {
                headers: headerValidator,
                query: ShiprocketValidators.shiprocketCreateOrderValidationQuery,
                payload: ShiprocketValidators.shiprocketCreateOrderValidationPayload
            },
            tags,
            handler: shiprocket_controllers.createOrder,
        },
    },
   
]

module.exports = shiprocket_routes;