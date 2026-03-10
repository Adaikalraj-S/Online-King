const Joi = require("joi");

const fetch_all_installers_admin_validator = Joi.object({
    id: Joi.number().integer().allow(null),
    installer_name: Joi.string().allow(null),
    company_name: Joi.string().allow(null),
    city: Joi.string().allow(null),
})

const add_installers_payload = Joi.object({
    installer_name: Joi.string().required(),
    installer_phone: Joi.number().integer().required(),
    installer_email: Joi.string().email().required(),
    company_name: Joi.string().required(),
    add1: Joi.string().required(),
    add2: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    country: Joi.string().required(),
    pincode: Joi.number().integer().required(),
})

const updateInstallersValidator = Joi.object({
    installer_id: Joi.number().integer().positive().required(),
    installer_name: Joi.string().required(),
    installer_phone: Joi.number().integer().required(),
    installer_email: Joi.string().email().required(),
    company_name: Joi.string().required(),
    add1: Joi.string().required(),
    add2: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    country: Joi.string().required(),
    pincode: Joi.number().integer().required(),
});

const deleteInstallerValidator = Joi.object({
    installer_id: Joi.number().integer().positive().required()
});

const statusChangeInstallerValidator = Joi.object({
    installer_id: Joi.number().integer().positive().required()
});

module.exports = {
    fetch_all_installers_admin_validator,
    add_installers_payload,
    updateInstallersValidator,
    deleteInstallerValidator,
    statusChangeInstallerValidator
};