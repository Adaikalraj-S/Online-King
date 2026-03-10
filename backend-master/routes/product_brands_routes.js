const tags = ["api", "Product Brands setup"];

const { category_controllers, car_brands_controllers, product_brands_controllers } = require("../controllers");

const {
    categoriesValidators,
    usersValidation,
    headerValidator,
    carBrandsValidators,
    productBrandValidator
} = require("../validators");

const product_brands_routes = [
    {
        method: "GET",
        path: "/fetch-product-brands-admin",
        options: {
            description: "Fetch all Product Brands for admin.",
            validate: {
                headers: headerValidator,
                query: productBrandValidator.fetch_product_brands_payload
            },
            tags,
            handler: product_brands_controllers.getProductBrands,
        },
    },

    {
        method: "GET",
        path: "/fetch-product-brands-customer",
        options: {
            description: "Fetch all Product Brands for Customer.",
            validate: {
                // headers: headerValidator,
                query: productBrandValidator.fetch_product_brands_payload
            },
            tags,
            handler: product_brands_controllers.getProductBrandsCustomer,
        },
    },

    {
        method: "POST",
        path: "/add-product-brands",
        options: {
            description: "Add Product Brands for admin.",
            payload: {
                maxBytes: 20 * 1024 * 1024,
                output: 'file',
                parse: true,
                multipart: true  
            },
            validate: {
                headers: headerValidator,
                payload: productBrandValidator.add_product_brand_payload
            },
            tags,
            handler: product_brands_controllers.addProductBrands,
        },
    },

    {
        method: "POST",
        path: "/edit-product-brands",
        options: {
            description: "Edit Product Brands for admin.",
            payload: {
                maxBytes: 20 * 1024 * 1024,
                output: 'file',
                parse: true,
                multipart: true  
            },
            validate: {
                headers: headerValidator,
                payload: productBrandValidator.update_product_brand_payload
            },
            tags,
            handler: product_brands_controllers.editProductBrands,
        },
    },

    {
        method: "POST",
        path: "/delete-product-brand",
        options: {
            description: "Delete Product Brands for admin.",
            validate: {
                headers: headerValidator,
                query: productBrandValidator.delete_product_brand_validator
            },
            tags,
            handler: product_brands_controllers.deleteProductBrand
        },
    },

    {
        method: "POST",
        path: "/update-product-brand-status",
        options: {
            description: "Toggle Category Status (Activate/Deactivate) for admin.",
            validate: {
                headers: headerValidator,
                query: productBrandValidator.change_status_product_brand_validator
            },
            tags,
            handler: product_brands_controllers.toggleProductBrandStatus,
        },
    }
    
];

module.exports = product_brands_routes;