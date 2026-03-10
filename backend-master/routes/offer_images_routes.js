// describe routes here by creating objects inside the user_routes array
const tags = ["api", "Offer-Images"];

const { offer_images_controller } = require("../controllers");
const { headerValidator, bannerValidators } = require("../validators");

const banner_routes = [
    {
        method: "GET",
        path: "/get-offer-images",
        options: {
            description: "Getting offer images created by Admin for admin.",
            tags,
            handler: offer_images_controller.getAllOfferImages,
        },
    },
    {
        method: "POST",
        path: "/add-offer-images",
        options: {
            description: "Adding offer image.",
            tags,
            payload: {
                maxBytes: 20 * 1024 * 1024 ,
                output: 'file',
                parse: true,
                multipart: true     // <-- this fixed the media type error
            },
            validate: {
                headers: headerValidator,
                payload: bannerValidators.offer_image_validator
            },
            handler: offer_images_controller.addOfferImage,
        },
    },
    {
        method: "POST",
        path: "/delete-offer-image",
        options: {
            description: "Deleting offer image.",
            tags,
            validate: {
                headers: headerValidator,
                payload: bannerValidators.offer_image_delte_validator
            },
            handler: offer_images_controller.deleteOfferImage,
        },
    },
   
]

module.exports = banner_routes