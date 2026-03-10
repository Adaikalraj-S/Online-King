const Joi = require("joi");

const add_about_us_data = Joi.object({
    image: Joi.any().allow(''),
    about_us: Joi.string().required()
})

const add_contact_us_data = Joi.object({
    contact_us: Joi.string().required(),
})

const add_privacy_policy_data = Joi.object({
    privacy_policy: Joi.string().required(),
})

const add_cancellation_policy_data = Joi.object({
    cancellation_policy: Joi.string().required(),
})

const add_refund_policy_data = Joi.object({
    refund_policy: Joi.string().required(),
})

const add_return_policy_data = Joi.object({
    return_policy: Joi.string().required(),
})

const add_shipping_policy_data = Joi.object({
    shipping_policy: Joi.string().required(),
})


const statusChangeStaticValidator = Joi.object({
    static_type: Joi.string().valid("ABOUT", "CONTACT", "PRIVACY", "CANCELLATION", "REFUND", "RETURN", "SHIPPING").required(),
});

module.exports = {
    add_about_us_data,
    add_contact_us_data,
    add_privacy_policy_data,
    add_cancellation_policy_data,
    add_refund_policy_data,
    add_return_policy_data,
    add_shipping_policy_data,
    statusChangeStaticValidator
    // add_installers_payload,
    // updateInstallersValidator,
    // deleteInstallerValidator,
    // statusChangeInstallerValidator
};