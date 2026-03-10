const Joi = require("joi");

const add_about_us_data = Joi.object({
    image: Joi.any().allow(''),
    about_us: Joi.string().required()
})

const add_store_info_payload = Joi.object({
    email_1:Joi.string().required(),
    email_2:Joi.string().required(),
    number_1:Joi.string().required(),
    number_2:Joi.string().required(),
    whatsapp_1:Joi.string().required(),
    whatsapp_2:Joi.string().required(),
    address_1:Joi.string().required(),
    address_2:Joi.string().required(),
    linkedin:Joi.string().required(),
    instagram:Joi.string().required(),
    facebook:Joi.string().required(),
    twitter:Joi.string().required(),
    website:Joi.string().required(),
    youtube:Joi.string().required(),
});

const update_status_store_info = Joi.object({
    store_data_type: Joi.string().valid("email_1", "email_2", "number_1", "number_2", "whatsapp_1", "whatsapp_2", "address_1", "address_2", "linkedin", "instagram", "facebook", "twitter", "website", "youtube", "amazon", "gpay" ,"mastercard" , "visa", "phonepe").required()
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




module.exports = {
    add_store_info_payload,
    update_status_store_info
    // add_about_us_data,
    // add_contact_us_data,
    // add_privacy_policy_data,
    // add_cancellation_policy_data,
    // add_refund_policy_data,
    // add_return_policy_data,
    // add_shipping_policy_data,
    // statusChangeStaticValidator
    // add_installers_payload,
    // updateInstallersValidator,
    // deleteInstallerValidator,
    // statusChangeInstallerValidator
};