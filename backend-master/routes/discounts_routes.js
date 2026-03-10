// describe routes here by creating objects inside the user_routes array
const tags = ["api", "Discounts"];

const {
  banners_controllers,
  coupons_controllers,
  discount_controllers,
} = require("../controllers");
const {
  BannerValidator,
  headerValidator,
  bannerValidators,
  couponsValidators,
  discountValidators,
} = require("../validators");

const discount_routes = [
  {
    method: "GET",
    path: "/get-all-discounts-admin",
    options: {
      description: "Getting Discounts for admin.",
      tags,
      validate: {
        // headers: headerValidator,
        // query: discountValidators.banner_fetch_query
      },
      handler: discount_controllers.fetchAllDiscounts,
    },
  },
  {
    method: "GET",
    path: "/get-all-discounts-like-offer",
    options: {
      description:
        "Getting Discounts like offer to show in website for customers.",
      tags,
      validate: {
        // headers: headerValidator,
        query: discountValidators.show_discount_in_web,
      },
      handler: discount_controllers.fetchAllDiscountsToShowLikeBanner,
    },
  },
  {
    method: "POST",
    path: "/add-discounts",
    options: {
      description: "Adding Discounts for kardify.",
      tags,
      payload: {
        maxBytes: 20 * 1024 * 1024,
        output: "file",
        parse: true,
        multipart: true,
      },
      validate: {
        // headers: headerValidator,
        payload: discountValidators.createDiscountValidator,
      },
      handler: discount_controllers.createDiscount,
    },
  },
  {
    method: "POST",
    path: "/edit-discounts",
    options: {
      description: "Edit Discounts for kardify.",
      tags,
      payload: {
        maxBytes: 20 * 1024 * 1024,
        output: "file",
        parse: true,
        multipart: true,
      },
      validate: {
        // headers: headerValidator,
        payload: discountValidators.editDiscountValidator,
      },
      handler: discount_controllers.editDiscount,
    },
  },
  {
    method: "POST",
    path: "/update-discount-status",
    options: {
      description: "update status of Discount for kardify.",
      tags,
      validate: {
        // headers: headerValidator,
        query: discountValidators.statusUpdatePayload,
      },
      handler: discount_controllers.toggleDiscountStatus,
    },
  },
  {
    method: "POST",
    path: "/delete-discount",
    options: {
      description: "Delete Discount for kardify.",
      tags,
      validate: {
        // headers: headerValidator,
        query: discountValidators.deleteDiscountPayload,
      },
      handler: discount_controllers.deleteDiscount,
    },
  },
];

module.exports = discount_routes;
