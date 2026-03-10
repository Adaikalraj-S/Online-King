const tags = ["api", "Delivery Types"];

const { category_controllers, car_brands_controllers, orders_controllers, delivery_controllers } = require("../controllers");

const {
    categoriesValidators,
    usersValidation,
    headerValidator,
    carBrandsValidators,
    ordersValidator
} = require("../validators");

const delivery_routes = [
    {
        method: "GET",
        path: "/get-delivery-types",
        options: {
            description: "Get All Delivery Types",
            // validate: {
            //     query: carBrandsValidators.fetch_car_brands_payload
            // },
            tags,
            handler: delivery_controllers.fetchDeliveryTypes,
        },
    },
    
];

module.exports = delivery_routes;