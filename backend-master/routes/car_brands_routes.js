const tags = ["api", "Car Brands Setup"];

const { category_controllers, car_brands_controllers } = require("../controllers");

const {
    categoriesValidators,
    usersValidation,
    headerValidator,
    carBrandsValidators
} = require("../validators");

const car_brands_routes = [
    {
        method: "GET",
        path: "/fetch-car-brands",
        options: {
            description: "Fetch all Car Brands.",
            validate: {
                query: carBrandsValidators.fetch_car_brands_payload
            },
            tags,
            handler: car_brands_controllers.getCarBrands,
        },
    },

    {
        method: "GET",
        path: "/fetch-car-brands-customers",
        options: {
            description: "Fetch all Car Brands.",
            validate: {
                query: carBrandsValidators.fetch_car_brands_payload
            },
            tags,
            handler: car_brands_controllers.getCarBrandsCustomers,
        },
    },

    {
        method: "POST",
        path: "/add-car-brands",
        options: {
            description: "Add Car Brands.",
            payload: {
                maxBytes: 20 * 1024 * 1024,
                output: 'file',
                parse: true,
                multipart: true  
            },
            validate: {
                payload: carBrandsValidators.add_car_brand_payload
            },
            tags,
            handler: car_brands_controllers.addCarBrands,
        },
    },

    {
        method: "POST",
        path: "/update-car-brands",
        options: {
            description: "Update Car Brands.",
            payload: {
                maxBytes: 20 * 1024 * 1024,
                output: 'file',
                parse: true,
                multipart: true    
            },
            validate: {
                payload: carBrandsValidators.update_car_brand_payload
            },
            tags,
            handler: car_brands_controllers.editCarBrands,
        },
    },

    {
        method: "POST",
        path: "/delete-car-brand",
        options: {
            description: "Delete Car Brands.",
            validate: {
                query: carBrandsValidators.delete_car_brand_validator
            },
            tags,
            handler: car_brands_controllers.deleteCarBrand
        },
    },

    {
        method: "POST",
        path: "/update-car-brand-status",
        options: {
            description: "Toggle Category Status (Activate/Deactivate).",
            validate: {
                query: carBrandsValidators.change_status_car_brand_validator
            },
            tags,
            handler: car_brands_controllers.toggleCarBrandStatus,
        },
    }
    
];

module.exports = car_brands_routes;