const tags = ["api", "Carts"];

const { category_controllers, carts_controllers } = require("../controllers");

const {
    categoriesValidators,
    usersValidation,
    headerValidator,
    CartValidators
} = require("../validators");

const carts_routes = [
    {
        method: "GET",
        path: "/get-carts",
        options: {
            description: "Fetch all Carts Items.",
            validate: {
                headers: headerValidator
            },
            tags,
            handler: carts_controllers.getCart,
        },
    },
    {
        method: "POST",
        path: "/add-to-cart",
        options: {
            description: "Add to cart for customers",
            validate: {
                headers: headerValidator,
                payload: CartValidators.add_to_cart_payload
            },
            tags,
            handler: carts_controllers.addToCart,
        },
    },

    {
        method: "POST",
        path: "/cart-increament",
        options: {
            description: "Increament for procuct in cart for customers",
            validate: {
                headers: headerValidator,
                payload: CartValidators.handle_increament_payload
            },
            tags,
            handler: carts_controllers.handleIncrement,
        },
    },

    {
        method: "POST",
        path: "/cart-decreament",
        options: {
            description: "Decreament for procuct in cart for customers",
            validate: {
                headers: headerValidator,
                payload: CartValidators.handle_decrement_payload
            },
            tags,
            handler: carts_controllers.handleDecrement,
        },
    },

    {
        method: "POST",
        path: "/remove-from-cart",
        options: {
            description: "Remove product from cart for customers",
            validate: {
                headers: headerValidator,
                payload: CartValidators.remove_from_cart_payload
            },
            tags,
            handler: carts_controllers.removeFromCart,
        },
    }
    
];

module.exports = carts_routes;