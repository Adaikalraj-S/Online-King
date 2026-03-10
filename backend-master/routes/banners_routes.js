// describe routes here by creating objects inside the user_routes array
const tags = ["api", "Banner"];

const { banners_controllers } = require("../controllers");
const { BannerValidator, headerValidator, bannerValidators } = require("../validators");

const banner_routes = [
    {
        method: "GET",
        path: "/get-banners-admin",
        options: {
            description: "Getting Banners created by Admin for admin.",
            tags,
            validate: {
                headers: headerValidator,
                // query: BannerValidator.banner_fetch_query
            },
            handler: banners_controllers.getAllBanners,
        },
    },
    {
        method: "GET",
        path: "/get-banners-customer",
        options: {
            description: "Getting Banners created by Admin for Customers.",
            tags,
            validate: {
                // headers: headerValidator,
                query: bannerValidators.fetch_banners
            },
            handler: banners_controllers.getAllBannersCustomers,
        },
    },
    {
        method: "POST",
        path: "/add-banner",
        options: {
            description: "Adding banner.",
            tags,
            payload: {
                maxBytes: 20 * 1024 * 1024 ,
                output: 'file',
                parse: true,
                multipart: true     // <-- this fixed the media type error
            },
            validate: {
                // headers: headerValidator,
                payload: bannerValidators.bannerCreationValidator
            },
            handler: banners_controllers.addBanners,
        },
    },
    {
        method: "POST",
        path: "/delete-banner",
        options: {
            description: "Deleting banner.",
            tags,
            validate: {
                headers: headerValidator,
                query: bannerValidators.banner_toggle_delete
            },
            handler: banners_controllers.deleteBanner,
        },
    },
    {
        method: "POST",
        path: "/toggle-banner-status",
        options: {
            description: "Toggling banner status.",
            tags,
            validate: {
                headers: headerValidator,
                query: bannerValidators.banner_toggle_delete
            },
            handler: banners_controllers.toggleBannerStatus,
        },
    },
]

module.exports = banner_routes