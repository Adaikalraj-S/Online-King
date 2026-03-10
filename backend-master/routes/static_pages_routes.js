const tags = ["api", "Static Pages"];

const { product_attributes_controlllers, installers_controllers, static_controllers } = require("../controllers");

const {
    usersValidation,
    headerValidator,
    productAttributesValidators,
    InstallersValidator,
    StaticPagesValidators
} = require("../validators");

const static_routes = [
    {
        method: "GET",
        path: "/fetch-static-data",
        options: {
            description: "Fetch all privacy policy,  for customer.",
            validate: {
                // headers: headerValidator,
                // query: InstallersValidator.fetch_all_installers_admin_validator
            },
            tags,
            handler: static_controllers.getAllStaticData,
        },
    },
    {
        method: "POST",
        path: "/add-aboutus",
        options: {
            description: "Add About Us Data for admins.",
            payload: {
                maxBytes: 20 * 1024 * 1024,
                output: 'file',
                parse: true,
                multipart: true     // <-- this fixed the media type error
            },
            validate: {
                headers: headerValidator,
                payload: StaticPagesValidators.add_about_us_data
            },
            tags,
            handler: static_controllers.addAboutUs,
        },
    },
    {
        method: "POST",
        path: "/add-contact-us",
        options: {
            description: "Add/Edit Contact us for admin.",
            validate: {
                headers: headerValidator,
                payload: StaticPagesValidators.add_contact_us_data
            },
            tags,
            handler: static_controllers.addContactUs,
        },
    },
    {
        method: "POST",
        path: "/add-privacy-policy",
        options: {
            description: "Add/Edit privacy-policy for admin.",
            validate: {
                headers: headerValidator,
                payload: StaticPagesValidators.add_privacy_policy_data
            },
            tags,
            handler: static_controllers.addPrivacyPolicy,
        },
    },
    {
        method: "POST",
        path: "/add-cancellation-policy",
        options: {
            description: "Add/Edit cancellation-policy for admin.",
            validate: {
                headers: headerValidator,
                payload: StaticPagesValidators.add_cancellation_policy_data
            },
            tags,
            handler: static_controllers.addCancellationPolicy,
        },
    },
    {
        method: "POST",
        path: "/add-refund-policy",
        options: {
            description: "Add/Edit refund policy for admin.",
            validate: {
                headers: headerValidator,
                payload: StaticPagesValidators.add_refund_policy_data
            },
            tags,
            handler: static_controllers.addRefundPolicy,
        },
    },
    {
        method: "POST",
        path: "/add-return-policy",
        options: {
            description: "Add/Edit return policy for admin.",
            validate: {
                headers: headerValidator,
                payload: StaticPagesValidators.add_return_policy_data
            },
            tags,
            handler: static_controllers.addReturnPolicy,
        },
    },
    {
        method: "POST",
        path: "/add-shipping-policy",
        options: {
            description: "Add/Edit shipping policy for admin.",
            validate: {
                headers: headerValidator,
                payload: StaticPagesValidators.add_shipping_policy_data
            },
            tags,
            handler: static_controllers.addShippingPolicy,
        },
    },
    {
        method: "POST",
        path: "/update-static-status",
        options: {
            description: "Status change Static page admin.",
            validate: {
                headers: headerValidator,
                query: StaticPagesValidators.statusChangeStaticValidator
            },
            tags,
            handler: static_controllers.toggleStaticStatus,
        },
    },
]

module.exports = static_routes;