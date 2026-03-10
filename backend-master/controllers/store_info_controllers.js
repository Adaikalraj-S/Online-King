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
    ProductAttributes, Installers, StoreInfo
} = require("../models");
const { Op } = require("sequelize");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

const getAllStoreInfo = async (req, res) => {
    try {

        const user = await checkToken(req.headers['Authorization'] ? req.headers['Authorization'] : req.headers.authorization);

        if (user.role === "ADMIN" && user.application === 'kardify') {
            const storeInfo = await StoreInfo.findAll({
                raw: true,
                order: [['createdAt', 'DESC']]
            })
            return res
                .response({
                    code: 200,
                    status: 'success',
                    message: "Installers fetched successfully",
                    storeInfo
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

const addOrUpdateStoreInfo = async (req, res) => {
    try {

        const {
            email_1,
            email_2,
            number_1,
            number_2,
            whatsapp_1,
            whatsapp_2,
            address_1,
            address_2,
            linkedin,
            instagram,
            facebook,
            twitter,
            website,
            youtube
        } = req.payload

        const user = await checkToken(req.headers['Authorization'] ? req.headers['Authorization'] : req.headers.authorization);
        if (user.role === "ADMIN" && user.application === 'kardify') {

            const updatedRows = [];

            const fieldToContactName = {
                email_1: 'email_1',
                email_2: 'email_2',
                number_1: 'number_1',
                number_2: 'number_2',
                whatsapp_1: 'whatsapp_1',
                whatsapp_2: 'whatsapp_2',
                address_1: 'address_1',
                address_2: 'address_2',
                linkedin: 'linkedin',
                instagram: 'instagram',
                facebook: 'facebook',
                twitter: 'twitter',
                website: 'website',
                youtube: 'youtube',
            };

            for (const field in req.payload) {
                const contactName = fieldToContactName[field];
                if (contactName) {
                    const storeInfo = await StoreInfo.findOne({
                        where: { contact_name: contactName }
                    });
                    if (storeInfo) {
                        storeInfo.value = req.payload[field];
                        await storeInfo.save();
                        updatedRows.push(storeInfo);
                    }
                }
            }

            return res
                .response({
                    code: 200,
                    status: 'success',
                    message: `Store updated successfully`,
                    updatedRows: updatedRows
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
        console.error('Error adding/updating store information:', error);
        return res
            .response({
                code: 500,
                status: 'error',
                message: "Internal server error"
            })
            .code(200);
    }
};

const toggleStoreData = async (req, res) => {
    try {
        const { store_data_type } = req.query;

        const user = await checkToken(req.headers['Authorization'] ? req.headers['Authorization'] : req.headers.authorization);
        if (user.role === "ADMIN" && user.application === 'kardify') {
            
            const existingStoreInfo = await StoreInfo.findOne({
                where: { contact_name: store_data_type }
            });

            if (!existingStoreInfo) {
                return res.status(404).json({
                    code: 404,
                    status: "error",
                    message: "Store Info not found",
                });
            }

            existingStoreInfo.status = !existingStoreInfo.status;

            await existingStoreInfo.save();

            return res.response({
                code: 200,
                status: 'success',
                message: `${store_data_type} status toggled successfully`,
                store_info: existingStoreInfo,
            }).code(200);

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
        return res.response({
            code: 500,
            status: "error",
            message: "Something went wrong",
        }).code(200);
    }
};

// const editInstaller = async (req, res) => {
//     const t = await sequelize.transaction();
//     try {
//         const {
//             installer_id,
//             installer_name,
//             installer_phone,
//             installer_email,
//             company_name,
//             add1,
//             add2,
//             city,
//             state,
//             country,
//             pincode
//         } = req.payload;

//         const user = await checkToken(req.headers['Authorization'] ? req.headers['Authorization'] : req.headers.authorization);

//         if (user.role === "ADMIN" && user.application === 'kardify') {
//             const installer = await Installers.findOne({
//                 where: { id:installer_id },
//                 transaction: t
//             });

//             if (!installer) {
//                 return res.response({
//                     code: 404,
//                     status: 'error',
//                     message: `Installer not found`
//                 }).code(404);
//             }

//             const existingInstallerPhone = await Installers.findOne({
//                 where: { 
//                     installer_phone,
//                     id: {
//                         [Op.not]: installer.id,
//                     },
//                 },
//                 transaction: t
//             });

//             if (existingInstallerPhone && existingInstallerPhone.id !== installer_id) {
//                 return res.response({
//                     code: 400,
//                     status: 'error',
//                     message: `Installer with the provided phone number ${installer_phone} already exists`
//                 }).code(400);
//             }

//             const existingInstallerEmail = await Installers.findOne({
//                 where: {
//                     installer_email,
//                     id: {
//                         [Op.not]: installer.id,
//                     },
//                  },
//                 transaction: t
//             });

//             if (existingInstallerEmail && existingInstallerEmail.id !== installer_id) {
//                 return res.response({
//                     code: 400,
//                     status: 'error',
//                     message: `Installer with the provided email ${installer_email} already exists`
//                 }).code(400);
//             }

//             installer.installer_name = installer_name;
//             installer.installer_phone = installer_phone;
//             installer.installer_email = installer_email;
//             installer.company_name = company_name;
//             installer.add1 = add1;
//             installer.add2 = add2;
//             installer.city = city;
//             installer.state = state;
//             installer.country = country;
//             installer.pincode = pincode;

//             await installer.save({ transaction: t });

//             await t.commit();

//             return res.response({
//                 code: 200,
//                 status: 'success',
//                 message: 'Installer updated successfully',
//                 installer
//             }).code(200);
//         } else if (user === 'Session expired') {
//             return res.response({
//                 code: 401,
//                 status: 'error',
//                 message: user
//             }).code(401);
//         } else {
//             return res.response({
//                 code: 403,
//                 status: 'error',
//                 message: "You don't have permission for this action."
//             }).code(403);
//         }

//     } catch (error) {
//         console.log(error)
//         await t.rollback();
//         return res.response({
//             code: 500,
//             status: 'error',
//             message: 'Failed to update installer',
//             error: error.message
//         }).code(500);
//     }
// };


// const deleteInstaller = async (req, res) => {
//     try {
//         const { installer_id } = req.query;

//         const user = await checkToken(req.headers['Authorization'] ? req.headers['Authorization'] : req.headers.authorization);

//         if (user.role === "ADMIN" && user.application === 'kardify') {
//             if (!Number.isInteger(installer_id) || installer_id <= 0) {
//                 return res
//                     .response({
//                         code: 400,
//                         status: "error",
//                         message: "Invalid installer_id",
//                     })
//                     .code(200);
//             }

//             const existingInstaller = await Installers.findOne({
//                 where: {
//                     id: installer_id,
//                 },
//             });

//             if (!existingInstaller) {
//                 return res
//                     .response({
//                         code: 404,
//                         status: "error",
//                         message: "Installer not found",
//                     })
//                     .code(200);
//             }
//             await existingInstaller.destroy();

//             return res
//                 .response({
//                     code: 200,
//                     status: "success",
//                     message: "Installer deleted successfully",
//                 })
//                 .code(200);
//         } else if (user === 'Session expired') {
//             return res.response({
//                 code: 401,
//                 status: 'error',
//                 message: user
//             }).code(401);
//         } else {
//             return res.response({
//                 code: 403,
//                 status: 'error',
//                 message: "You don't have permission for this action."
//             }).code(403);
//         }

//     } catch (error) {
//         console.error(error);
//         return res
//             .response({
//                 code: 500,
//                 status: "error",
//                 message: "Something went wrong",
//             })
//             .code(200);
//     }
// };

// const toggleInstallerStatus = async (req, res) => {
//     try {
//         const { installer_id } = req.query;

//         const user = await checkToken(req.headers['Authorization'] ? req.headers['Authorization'] : req.headers.authorization);

//         if (user.role === "ADMIN" && user.application === 'kardify') {
//             if (!Number.isInteger(installer_id) || installer_id <= 0) {
//                 return res
//                     .response({
//                         code: 400,
//                         status: "error",
//                         message: "Invalid installer_id",
//                     })
//                     .code(200);
//             }

//             const existingInstaller = await Installers.findOne({
//                 where: {
//                     id: installer_id,
//                 },
//             });

//             if (!existingInstaller) {
//                 return res
//                     .response({
//                         code: 404,
//                         status: "error",
//                         message: "Attribute not found",
//                     })
//                     .code(200);
//             }

//             existingInstaller.status = !existingInstaller.status;

//             await existingInstaller.save();

//             return res
//                 .response({
//                     code: 200,
//                     status: 'success',
//                     message: "status toggled successfully"
//                 })
//                 .code(200);
//         } else if (user === 'Session expired') {
//             return res.response({
//                 code: 401,
//                 status: 'error',
//                 message: user
//             }).code(401);
//         } else {
//             return res.response({
//                 code: 403,
//                 status: 'error',
//                 message: "You don't have permission for this action."
//             }).code(403);
//         }

//     } catch (error) {
//         console.error(error);
//         return res
//             .response({
//                 code: 500,
//                 status: "error",
//                 message: "Something went wrong",
//             })
//             .code(200);
//     }
// };


module.exports = {
    getAllStoreInfo,
    addOrUpdateStoreInfo,
    toggleStoreData
    // addInstaller,
    // editInstaller,
    // deleteInstaller,
    // toggleInstallerStatus
}