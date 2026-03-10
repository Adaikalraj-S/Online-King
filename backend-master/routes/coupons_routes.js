// describe routes here by creating objects inside the user_routes array
const tags = ["api", "Coupons"];

const { banners_controllers, coupons_controllers } = require("../controllers");
const { BannerValidator, headerValidator, bannerValidators, couponsValidators } = require("../validators");

const coupon_routes = [
    {
        method: "GET",
        path: "/get-all-coupons-admin",
        options: {
            description: "Getting Coupons for admin.",
            tags,
            validate: {
                // headers: headerValidator,
                // query: BannerValidator.banner_fetch_query
            },
            handler: coupons_controllers.fetchAllCouponsAdmin,
        },
    },
    {
        method: "GET",
        path: "/get-coupons",
        options: {
            description: "Getting Coupons for Customers and vendors.",
            tags,
            validate: {
                headers: headerValidator,
                // query: BannerValidator.banner_fetch_query
            },
            handler: coupons_controllers.getCoupon,
        },
    },
    {
        method: "POST",
        path: "/add-coupons",
        options: {
            description: "Adding Coupons for kardify.",
            tags,
            validate: {
                // headers: headerValidator,
                payload: couponsValidators.createCouponValidator
            },
            handler: coupons_controllers.createCoupon,
        },
    },
    {
        method: "POST",
        path: "/check-coupons-applicable",
        options: {
            description: "Checking Coupons for Online Kings.",
            tags,
            validate: {
                headers: headerValidator,
                payload: couponsValidators.is_applicablePayload
            },
            handler: coupons_controllers.isCouponApplicable,
        },
    },
    {
        method: "POST",
        path: "/edit-coupons",
        options: {
            description: "Edit Coupons for kardify.",
            tags,
            validate: {
                // headers: headerValidator,
                payload: couponsValidators.editCouponPayload
            },
            handler: coupons_controllers.editCoupon,
        },
    },
    {
        method: "POST",
        path: "/update-coupon-status",
        options: {
            description: "update status of Coupons for kardify.",
            tags,
            validate: {
                // headers: headerValidator,
                query: couponsValidators.statusUpdatePayload
            },
            handler: coupons_controllers.toggleCouponStatus,
        },
    },
    {
        method: "POST",
        path: "/delete-coupon",
        options: {
            description: "Delete Coupons for kardify.",
            tags,
            validate: {
                // headers: headerValidator,
                query: couponsValidators.deleteCouponPayload
            },
            handler: coupons_controllers.deleteCoupon,
        },
    },
]

module.exports = coupon_routes