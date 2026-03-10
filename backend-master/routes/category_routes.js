const tags = ["api", "Categories"];

const { category_controllers } = require("../controllers");

const {
    categoriesValidators,
    usersValidation,
    headerValidator
} = require("../validators");

const category_routes = [
    {
        method: "GET",
        path: "/fetch-categories",
        options: {
            description: "Fetch all Categories.",
            validate: {
                headers: headerValidator,
                query: categoriesValidators.fetch_categories_payload
            },
            tags,
            handler: category_controllers.getCategories,
        },
    },
    {
        method: "GET",
        path: "/fetch-categories-customer",
        options: {
            description: "Fetch all Categories.",
            validate: {
                // headers: headerValidator,
                query: categoriesValidators.fetch_categories_payload
            },
            tags,
            handler: category_controllers.getCategoriesCustomers,
        },
    },
    {
        method: "POST",
        path: "/add-categories",
        options: {
            description: "Add Categories.",
            payload: {
                maxBytes: 20 * 1024 * 1024,
                output: 'file',
                parse: true,
                multipart: true     // <-- this fixed the media type error
            },
            validate: {
                headers: headerValidator,
                payload: categoriesValidators.add_categories_payload
            },
            tags,
            handler: category_controllers.addCategories,
        },
    },
    {
        method: "POST",
        path: "/update-categories",
        options: {
            description: "Edit Categories.",
            payload: {
                maxBytes: 20 * 1024 * 1024,
                output: 'file',
                parse: true,
                multipart: true     // <-- this fixed the media type error
            },
            validate: {
                headers: headerValidator,
                payload: categoriesValidators.update_categories_payload
            },
            tags,
            handler: category_controllers.editCategories,
        },
    },
    {
        method: "POST",
        path: "/delete-categories",
        options: {
            description: "Delete a Category.",
            validate: {
                headers: headerValidator,
                query: categoriesValidators.delete_category_validator
            },
            tags,
            handler: category_controllers.deleteCategories,
        },
    },
    {
        method: "POST",
        path: "/update-category-status",
        options: {
            description: "Toggle Category Status (Activate/Deactivate).",
            validate: {
                headers: headerValidator,
                query: categoriesValidators.change_status_category_validator
            },
            tags,
            handler: category_controllers.toggleCategoryStatus,
        },
    }
    
];

module.exports = category_routes;