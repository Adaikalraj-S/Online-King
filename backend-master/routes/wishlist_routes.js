const tags = ["api", "Wishlist Setup"];

const {  car_list_controllers, wishlists_controllers } = require("../controllers");

const {
    carListsValidators, WishlistValidators, headerValidator
} = require("../validators");

const wishlist_routes = [
    {
        method: "GET",
        path: "/get-all-wishlists",
        options: {
            description: "Fetch all Car Lists.",
            validate: {
                headers: headerValidator,
            },
            tags,
            handler: wishlists_controllers.getWishList,
        },
    },

    {
        method: "POST",
        path: "/add-to-wishlist",
        options: {
            description: "Add Product To wishlist.",
            validate: {
                headers: headerValidator,
                payload: WishlistValidators.add_to_wishlist_payload
            },
            tags,
            handler: wishlists_controllers.addToWishList,
        },
    },

    {
        method: "POST",
        path: "/remove-from-wishlist",
        options: {
            description: "Remove Product from wishlist.",
            validate: {
                headers: headerValidator,
                payload: WishlistValidators.remove_from_wishlist_payload
            },
            tags,
            handler: wishlists_controllers.removeFromWishlist,
        },
    },
    
];

module.exports = wishlist_routes;