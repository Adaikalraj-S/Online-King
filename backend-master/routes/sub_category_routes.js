const tags = ["api", "Sub Categories"];

const { sub_category_controllers } = require("../controllers");

const {
    usersValidation,
    headerValidator,
    subCategoriesValidators
} = require("../validators");

const sub_category_routes = [
    {
        method: "GET",
        path: "/fetch-subcategories",
        options: {
            description: "Fetch All Categories.",
            validate: {
                headers: headerValidator,
                query: subCategoriesValidators.fetch_sub_categories_payload
            },
            tags,
            handler: sub_category_controllers.fetchSubCategories,
        },
    },
    {
        method: "GET",
        path: "/fetch-subcategories-customers",
        options: {
            description: "Fetch All Categories.",
            validate: {
                query: subCategoriesValidators.fetch_sub_categories_payload
            },
            tags,
            handler: sub_category_controllers.fetchSubCategoriesCustomer,
        },
    },
    {
        method: "POST",
        path: "/add-subcategories",
        options: {
            description: "Add Subcategories.",
            payload: {
                maxBytes: 20 * 1024 * 1024,
                output: 'file',
                parse: true,
                multipart: true     // <-- this fixed the media type error
            },
            validate: {
                headers: headerValidator,
                payload: subCategoriesValidators.add_sub_categories_payload
            },
            tags,
            handler: sub_category_controllers.createSubcategories,
        },
    },

    {
        method: "POST",
        path: "/update-subcategories",
        options: {
            description: "Update Subcategories.",
            payload: {
                maxBytes: 20 * 1024 * 1024,
                output: 'file',
                parse: true,
                multipart: true     // <-- this fixed the media type error
            },
            validate: {
                headers: headerValidator,
                payload: subCategoriesValidators.update_sub_categories_payload
            },
            tags,
            handler: sub_category_controllers.updateSubcategories,
        },
    },

    {
        method: "POST",
        path: "/delete-subcategories",
        options: {
            description: "Delete Subcategories.",
            validate: {
                headers: headerValidator,
                query: subCategoriesValidators.delete_sub_categories_payload
            },
            tags,
            handler: sub_category_controllers.deleteSubcategory,
        },
    },
    {
        method: "POST",
        path: "/update-subcategory-status",
        options: {
            description: "Toggle Category Status (Activate/Deactivate).",
            validate: {
                headers: headerValidator,
                query: subCategoriesValidators.change_status_subcategory_validator
            },
            tags,
            handler: sub_category_controllers.toggleSubCategoryStatus,
        },
    }


]

module.exports = sub_category_routes;