const jwt = require("jsonwebtoken");
const ejs = require("ejs");
const { uploadFile } = require('../helpers')
const {
    makeHash,
    checkHash,
    mailer,
    makeToken,
    checkToken,
    makeRefreshToken,
    env: {
        HEADER,
        ENVIRONMENT,
        LOCAL_URL,
        OTP_SEND_URL,
        MSG91_AUTH_KEY,
        MSG91_OTP_TEMP_ID,
    },
    sequelize,
} = require("../config");
const {
    ProductAttributes, Installers
} = require("../models");
const { Op } = require("sequelize");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

const getAllInstallers = async (req, res) => {
    try {
        const {
            id,
            installer_name,
            company_name,
            city
        } = req.query
        let filter = {}
        if (id) filter = {
            ...filter,
            id
        }
        if (installer_name) filter = {
            ...filter,
            attribute_name
        }
        if (company_name) filter = {
            ...filter,
            attribute_name
        }
        if (city) filter = {
            ...filter,
            attribute_name
        }

        const user = await checkToken(req.headers['Authorization'] ? req.headers['Authorization'] : req.headers.authorization);

        if (user.role === "ADMIN" && user.application === 'kardify') {
            const installers = await Installers.findAll({
                where: filter,
                raw: true,
                order: [['createdAt', 'DESC']]
            })
            return res
                .response({
                    code: 200,
                    status: 'success',
                    message: "Installers fetched successfully",
                    installers
                })
                .code(200);
        } else if (user === 'Session expired') {
            return res.response({
                code: 401,
                status: 'error',
                message: user
            }).code(401);
        } else {
            return res.response({
                code: 403,
                status: 'error',
                message: "You don't have permission for this action."
            }).code(403);
        }
    } catch (error) {
        return res
            .response({
                code: 401,
                status: "error",
                message: "Something Wrong",
            })
            .code(200);
    }
};

const addInstaller = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const {
            installer_name,
            installer_phone,
            installer_email,
            company_name,
            add1,
            add2,
            city,
            state,
            country,
            pincode
        } = req.payload;

        // Check authorization
        const user = await checkToken(req.headers['Authorization'] ? req.headers['Authorization'] : req.headers.authorization);

        if (user.role === "ADMIN" && user.application === 'kardify') {

             const existingInstallerPhone = await Installers.findOne({
                where: { installer_phone },
                transaction: t
            });

            if (existingInstallerPhone) {
                await t.rollback();
                return res.response({
                    code: 400,
                    status: 'error',
                    message: `Installer with the provided phone number ${installer_phone} already exists`
                }).code(400);
            }

            const existingInstallerEmail = await Installers.findOne({
                where: { installer_email },
                transaction: t
            });

            if (existingInstallerEmail) {
                await t.rollback();
                return res.response({
                    code: 400,
                    status: 'error',
                    message: `Installer with the provided email ${installer_email} already exists`
                }).code(400);
            }

            const installer = await Installers.create({
                installer_name,
                installer_phone,
                installer_email,
                company_name,
                add1,
                add2,
                city,
                state,
                country,
                pincode,
                status: true
            }, { transaction: t });

            console.log(installer.id)

            const formattedId = String(installer.id).padStart(3, '0');
            installer.installer_id = `INST-${formattedId}`;

            await installer.save({ transaction: t });

            await t.commit();

            return res.response({
                code: 200,
                status: 'success',
                message: 'Installer added successfully',
                installer
            }).code(200);
        } else if (user === 'Session expired') {
            await t.rollback();
            return res.response({
                code: 401,
                status: 'error',
                message: user
            }).code(401);
        } else {
            await t.rollback();
            return res.response({
                code: 403,
                status: 'error',
                message: "You don't have permission for this action."
            }).code(403);
        }

    } catch (error) {
        console.log(error)
        await t.rollback();
        return res.response({
            code: 500,
            status: 'error',
            message: 'Failed to add installer',
            error: error.message
        }).code(500);
    }
};


const editInstaller = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const {
            installer_id,
            installer_name,
            installer_phone,
            installer_email,
            company_name,
            add1,
            add2,
            city,
            state,
            country,
            pincode
        } = req.payload;

        const user = await checkToken(req.headers['Authorization'] ? req.headers['Authorization'] : req.headers.authorization);

        if (user.role === "ADMIN" && user.application === 'kardify') {
            const installer = await Installers.findOne({
                where: { id:installer_id },
                transaction: t
            });

            if (!installer) {
                await t.rollback();
                return res.response({
                    code: 404,
                    status: 'error',
                    message: `Installer not found`
                }).code(404);
            }

            const existingInstallerPhone = await Installers.findOne({
                where: { 
                    installer_phone,
                    id: {
                        [Op.not]: installer.id,
                    },
                },
                transaction: t
            });

            if (existingInstallerPhone && existingInstallerPhone.id !== installer_id) {
                await t.rollback();
                return res.response({
                    code: 400,
                    status: 'error',
                    message: `Installer with the provided phone number ${installer_phone} already exists`
                }).code(400);
            }

            const existingInstallerEmail = await Installers.findOne({
                where: {
                    installer_email,
                    id: {
                        [Op.not]: installer.id,
                    },
                 },
                transaction: t
            });

            if (existingInstallerEmail && existingInstallerEmail.id !== installer_id) {
                await t.rollback();
                return res.response({
                    code: 400,
                    status: 'error',
                    message: `Installer with the provided email ${installer_email} already exists`
                }).code(400);
            }

            installer.installer_name = installer_name;
            installer.installer_phone = installer_phone;
            installer.installer_email = installer_email;
            installer.company_name = company_name;
            installer.add1 = add1;
            installer.add2 = add2;
            installer.city = city;
            installer.state = state;
            installer.country = country;
            installer.pincode = pincode;

            await installer.save({ transaction: t });

            await t.commit();

            return res.response({
                code: 200,
                status: 'success',
                message: 'Installer updated successfully',
                installer
            }).code(200);
        } else if (user === 'Session expired') {
            await t.rollback();
            return res.response({
                code: 401,
                status: 'error',
                message: user
            }).code(401);
        } else {
            await t.rollback();
            return res.response({
                code: 403,
                status: 'error',
                message: "You don't have permission for this action."
            }).code(403);
        }

    } catch (error) {
        console.log(error)
        await t.rollback();
        return res.response({
            code: 500,
            status: 'error',
            message: 'Failed to update installer',
            error: error.message
        }).code(500);
    }
};


const deleteInstaller = async (req, res) => {
    try {
        const { installer_id } = req.query;

        const user = await checkToken(req.headers['Authorization'] ? req.headers['Authorization'] : req.headers.authorization);

        if (user.role === "ADMIN" && user.application === 'kardify') {
            if (!Number.isInteger(installer_id) || installer_id <= 0) {
                return res
                    .response({
                        code: 400,
                        status: "error",
                        message: "Invalid installer_id",
                    })
                    .code(200);
            }

            const existingInstaller = await Installers.findOne({
                where: {
                    id: installer_id,
                },
            });

            if (!existingInstaller) {
                return res
                    .response({
                        code: 404,
                        status: "error",
                        message: "Installer not found",
                    })
                    .code(200);
            }
            await existingInstaller.destroy();

            return res
                .response({
                    code: 200,
                    status: "success",
                    message: "Installer deleted successfully",
                })
                .code(200);
        } else if (user === 'Session expired') {
            return res.response({
                code: 401,
                status: 'error',
                message: user
            }).code(401);
        } else {
            return res.response({
                code: 403,
                status: 'error',
                message: "You don't have permission for this action."
            }).code(403);
        }

    } catch (error) {
        console.error(error);
        return res
            .response({
                code: 500,
                status: "error",
                message: "Something went wrong",
            })
            .code(200);
    }
};

const toggleInstallerStatus = async (req, res) => {
    try {
        const { installer_id } = req.query;

        const user = await checkToken(req.headers['Authorization'] ? req.headers['Authorization'] : req.headers.authorization);

        if (user.role === "ADMIN" && user.application === 'kardify') {
            if (!Number.isInteger(installer_id) || installer_id <= 0) {
                return res
                    .response({
                        code: 400,
                        status: "error",
                        message: "Invalid installer_id",
                    })
                    .code(200);
            }

            const existingInstaller = await Installers.findOne({
                where: {
                    id: installer_id,
                },
            });

            if (!existingInstaller) {
                return res
                    .response({
                        code: 404,
                        status: "error",
                        message: "Attribute not found",
                    })
                    .code(200);
            }

            existingInstaller.status = !existingInstaller.status;

            await existingInstaller.save();

            return res
                .response({
                    code: 200,
                    status: 'success',
                    message: "status toggled successfully"
                })
                .code(200);
        } else if (user === 'Session expired') {
            return res.response({
                code: 401,
                status: 'error',
                message: user
            }).code(401);
        } else {
            return res.response({
                code: 403,
                status: 'error',
                message: "You don't have permission for this action."
            }).code(403);
        }

    } catch (error) {
        console.error(error);
        return res
            .response({
                code: 500,
                status: "error",
                message: "Something went wrong",
            })
            .code(200);
    }
};


module.exports = {
    getAllInstallers,
    addInstaller,
    editInstaller,
    deleteInstaller,
    toggleInstallerStatus
}