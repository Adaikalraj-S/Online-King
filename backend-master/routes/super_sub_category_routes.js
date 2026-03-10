const tags = ["api", "Super Sub Categories"];

const { super_sub_category_controllers } = require("../controllers");

const {
    usersValidation,
    headerValidator,
    superSubCategoriesValidators
} = require("../validators");

const super_sub_category_routes = [
    {
        method: "GET",
        path: "/fetch-supersubcategories",
        options: {
            description: "Fetch All super sub categories.",
            validate: {
                headers: headerValidator,
                query: superSubCategoriesValidators.fetch_super_sub_categories_payload
            },
            tags,
            handler: super_sub_category_controllers.fetchSuperSubcategories,
        },
    },

    {
        method: "GET",
        path: "/fetch-supersubcategories-customers",
        options: {
            description: "Fetch All super sub categories for customers.",
            validate: {
                // headers: headerValidator,
                query: superSubCategoriesValidators.fetch_super_sub_categories_payload
            },
            tags,
            handler: super_sub_category_controllers.fetchSuperSubcategoriesCustomer,
        },
    },

    {
        method: "POST",
        path: "/add-supersubcategory",
        options: {
            description: "Add Super Subcategory.",
            payload: {
                maxBytes: 20 * 1024 * 1024, // Maximum payload size (20 MB)
                output: 'file',
                parse: true,
                multipart: true,
            },
            validate: {
                headers: headerValidator,
                payload: superSubCategoriesValidators.add_super_sub_categories_payload,
            },
            tags,
            handler: super_sub_category_controllers.addSuperSubcategory,
        },
    },

    {
        method: "POST",
        path: "/edit-super-subcategory",
        options: {
            description: "Edit Super Subcategory.",
            payload: {
                maxBytes: 20 * 1024 * 1024, // Maximum payload size (20 MB)
                output: 'file',
                parse: true,
                multipart: true,
            },
            validate: {
                headers: headerValidator,
                payload: superSubCategoriesValidators.update_super_sub_categories_payload,
            },
            tags,
            handler: super_sub_category_controllers.editSuperSubcategory,
        },
    },
    {
        method: "POST",
        path: "/delete-supersubcategories",
        options: {
            description: "Delete SuperSubcategories.",
            validate: {
                headers: headerValidator,
                query: superSubCategoriesValidators.delete_super_sub_categories_payload
            },
            tags,
            handler: super_sub_category_controllers.deleteSuperSubcategory,
        },
    },
    {
        method: "POST",
        path: "/update-supersubcategory-status",
        options: {
            description: "Toggle Category Status (Activate/Deactivate).",
            validate: {
                headers: headerValidator,
                query: superSubCategoriesValidators.change_status_supersubcategory_validator
            },
            tags,
            handler: super_sub_category_controllers.toggleSuperSubCategoryStatus,
        },
    }


]

module.exports = super_sub_category_routes;