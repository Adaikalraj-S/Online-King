const tags = ["api", "Car Brands Setup"];

const {  car_list_controllers } = require("../controllers");

const {
    carListsValidators
} = require("../validators");

const car_lists_routes = [
    {
        method: "GET",
        path: "/fetch-car-lists",
        options: {
            description: "Fetch all Car Lists.",
            validate: {
                query: carListsValidators.fetch_car_lists_payload
            },
            tags,
            handler: car_list_controllers.fetchCarList,
        },
    },

    {
        method: "POST",
        path: "/add-car-lists",
        options: {
            description: "Add Car Lists.",
            validate: {
                payload: carListsValidators.add_car_lists_payload
            },
            tags,
            handler: car_list_controllers.addCarList,
        },
    },

    {
        method: "POST",
        path: "/edit-car-lists",
        options: {
            description: "update Car Lists.",
            validate: {
                payload: carListsValidators.update_car_lists_payload
            },
            tags,
            handler: car_list_controllers.editCarList,
        },
    },

    {
        method: "POST",
        path: "/delete-car-lists",
        options: {
            description: "Delete Car Lists.",
            validate: {
                query: carListsValidators.delete_car_lists_validator
            },
            tags,
            handler: car_list_controllers.deleteCarList,
        },
    },

    {
        method: "POST",
        path: "/status-toggle-car-lists",
        options: {
            description: "Update Status of Car Lists.",
            validate: {
                query: carListsValidators.change_status_car_lists_validator
            },
            tags,
            handler: car_list_controllers.toggleCarListStatus,
        },
    },
    
];

module.exports = car_lists_routes;