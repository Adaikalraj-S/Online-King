const {
    Admins,
    Customers,
} = require('../models')
require('dotenv/config')
const fs = require("fs");
const path = require("path");
const { verify, sign } = require('jsonwebtoken')


const checkToken = async (token, refresh = false) => {
    try {
        const verifier = await verify(token, process.env.JWTSECRET);
        console.log(verifier);
        
        let userModel = null
        switch (verifier.role) {
            case 'ADMIN':
                userModel = Admins
                break;
            case 'CUSTOMER':
                userModel = Customers
                break;
        }
        const avl_user = await userModel.findOne({
            where: refresh ?  {
                id: verifier.id,
                refreshToken: token
            } : {
                id: verifier.id,
                accessToken: token
            },
            attributes: {
                exclude: ['password', 'accessToken', 'refreshToken']
            },
            raw: true
        })
        if (!avl_user) {
            return "Session expired";
        }
        return {...avl_user, ...verifier} ;
    } catch (error) {
        return "Session expired";
    }
}

const makeToken = (data) => {
    const token = sign(data, process.env.JWTSECRET, {
        expiresIn: "4h",
    });
    return token;
}
const makeRefreshToken = (data) => {
    const token = sign(data, process.env.JWTSECRET, {
        expiresIn: "1y",
    });
    return token;
}

const uploadFile = async (req, file, store_path) => {
    try {
        // console.log(file)
        let file_url = null
        const file_name = `${store_path}${Date.now().valueOf()}.${(file.filename || 'unknown').split('.')[file.filename.split('.').length - 1]}`
        await fs.promises.copyFile(file.path, file_name)
        console.log(`success: ${file_name} file created`);
        file_url = `/${file_name}`

        return {
            file_url
        }
    } catch (error) {
        console.log(error);
    }
}

const uploadMultipleFiles = async (req, files, store_path) => {
    try {
        const fileUrls = [];

        await Promise.all(files.map(async (file) => {
            const file_name = `${store_path}${Date.now().valueOf()}.${file.filename.split('.')[file.filename.split('.').length - 1]}`;
            await fs.copyFile(file.path, file_name);
            console.log(`Success: ${file_name} file created`);
            fileUrls.push(`/${file_name}`);
        }));
        console.log(fileUrls)
        return {
            fileUrls
        };
    } catch (error) {
        console.error(error);
        throw error;
    }
};



module.exports = {
    checkToken,
    makeToken,
    makeRefreshToken,
    uploadFile,
    uploadMultipleFiles
}