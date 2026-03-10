const tags = ["api", "Car Brands Setup"];

const { category_controllers, car_brands_controllers, car_models_controllers } = require("../controllers");

const {
    categoriesValidators,
    usersValidation,
    headerValidator,
    carBrandsValidators,
    carModelsValidators
} = require("../validators");

const car_model_routes = [
    {
        method: "GET",
        path: "/fetch-car-models",
        options: {
            description: "Fetch all Car Models.",
            validate: {
                query: carModelsValidators.fetch_car_model_payload
            },
            tags,
            handler: car_models_controllers.getCarModels,
        },
    },

    {
        method: "GET",
        path: "/fetch-car-models-customers",
        options: {
            description: "Fetch all Car Models.",
            validate: {
                query: carModelsValidators.fetch_car_model_payload
            },
            tags,
            handler: car_models_controllers.getCarModelsCustomers,
        },
    },

    {
        method: "POST",
        path: "/add-car-models",
        options: {
            description: "Add Car Models.",
            payload: {
                maxBytes: 20 * 1024 * 1024,
                output: 'file',
                parse: true,
                multipart: true     // <-- this fixed the media type error
            },
            validate: {
                payload: carModelsValidators.add_car_model_payload
            },
            tags,
            handler: car_models_controllers.addCarModels,
        },
    },

    {
        method: "POST",
        path: "/update-car-models",
        options: {
            description: "Update Car Models.",
            payload: {
                maxBytes: 20 * 1024 * 1024,
                output: 'file',
                parse: true,
                multipart: true     // <-- this fixed the media type error
            },
            validate: {
                payload: carModelsValidators.update_car_model_payload
            },
            tags,
            handler: car_models_controllers.editCarModel,
        },
    },

    {
        method: "POST",
        path: "/delete-car-model",
        options: {
            description: "Delete Car Model.",
            validate: {
                query: carModelsValidators.delete_car_model_validator
            },
            tags,
            handler: car_models_controllers.deleteCarModel
        },
    },

    {
        method: "POST",
        path: "/update-car-model-status",
        options: {
            description: "Toggle Category Status (Activate/Deactivate).",
            validate: {
                query: carModelsValidators.change_status_car_model_validator
            },
            tags,
            handler: car_models_controllers.toggleCarModelStatus,
        },
    }
    
];

module.exports = car_model_routes;