const tags = ["api", "Subscribed Customers"];

const { product_attributes_controlllers, installers_controllers, subscriber_controllers } = require("../controllers");

const {
    usersValidation,
    headerValidator,
    productAttributesValidators,
    InstallersValidator,
    SubscriberValidator
} = require("../validators");

const subscribed_customers_routes = [
    {
        method: "GET",
        path: "/fetch-all-subscribers",
        options: {
            description: "Fetch all Installers for admin.",
            validate: {
                headers: headerValidator,
                query: SubscriberValidator.fetch_all_subscribers_validator
            },
            tags,
            handler: subscriber_controllers.getSubscribers,
        },
    },
    {
        method: "POST",
        path: "/add-subscribers",
        options: {
            description: "News Letter Subscribe for customers",
            validate: {
                // headers: headerValidator,
                payload: SubscriberValidator.add_subscribers_validator
            },
            tags,
            handler: subscriber_controllers.addSubscribers,
        },
    },
    // {
    //     method: "POST",
    //     path: "/edit-installer",
    //     options: {
    //         description: "Edit Installer for admin.",
    //         validate: {
    //             headers: headerValidator,
    //             payload: InstallersValidator.updateInstallersValidator
    //         },
    //         tags,
    //         handler: installers_controllers.editInstaller,
    //     },
    // },
    {
        method: "POST",
        path: "/delete-subscriber",
        options: {
            description: "Delete Subscriber for admin.",
            validate: {
                headers: headerValidator,
                query: SubscriberValidator.deleteSubscriberValidator
            },
            tags,
            handler: subscriber_controllers.deleteSubscriber,
        },
    },
    {
        method: "POST",
        path: "/update-subscriber-status",
        options: {
            description: "Status change Subscriber admin.",
            validate: {
                headers: headerValidator,
                query: SubscriberValidator.statusChangeSubscriberValidator
            },
            tags,
            handler: subscriber_controllers.toggleSubscriberStatus,
        },
    },
]

module.exports = subscribed_customers_routes;