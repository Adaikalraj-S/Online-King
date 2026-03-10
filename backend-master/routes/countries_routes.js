// describe routes here by creating objects inside the user_routes array
const tags = ["api", "Countries"];
const Joi = require('joi')
const fs = require('fs')
const readJsonFile = (filePath) => {
    try {
      const data = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading the file:', error);
      return null;
    }
};
const data = readJsonFile('dataFormatted.json')
  
const banner_routes = [
    {
        method: "GET",
        path: "/get-countries",
        options: {
            description: "Getting Banners created by Admin for admin.",
            tags,
            handler: async (req, res) => {
                try {
                    return res
                        .response({
                            code: 200,
                            status: "success",
                            message: "All countries fetched successfully",
                            countries: data.map(e => ({
                                id: e.id,
                                name: e.name
                            })),
                        })
                        .code(200);
                } catch (error) {
                    return res
                        .response({
                            code: 500,
                            status: "error",
                            message: error.message,
                        })
                        .code(500);
                }
            },
        },
    },
    {
        method: "GET",
        path: "/get-states",
        options: {
            description: "Getting Banners created by Admin for admin.",
            tags,
            validate: {
                query: Joi.object({
                    country_id: Joi.number().integer().required(),
                })
            },
            handler: async (req, res) => {
                try {
                    const selected_country = data.find(e => e.id == req.query.country_id)
                    if (!selected_country) {
                        throw new Error('Country not found')
                    }
                    const states = selected_country.states.map(e => ({
                        id: e.id,
                        name: e.name,
                        latitude: e.latitude,
                        longitude: e.longitude,
                    }))
                    return res
                        .response({
                            code: 200,
                            status: "success",
                            message: `All states fetched for ${selected_country.name} successfully`,
                            countries: states,
                        })
                        .code(200);
                } catch (error) {
                    return res
                        .response({
                            code: 500,
                            status: "error",
                            message: error.message,
                        })
                        .code(500);
                }
            },
        },
    },
    {
        method: "GET",
        path: "/get-cities",
        options: {
            description: "Getting Banners created by Admin for admin.",
            tags,
            validate: {
                query: Joi.object({
                    country_id: Joi.number().integer().required(),
                    state_id: Joi.number().integer().required(),
                })
            },
            handler: async (req, res) => {
                try {
                    const selected_country = data.find(e => e.id == req.query.country_id)
                    if (!selected_country) {
                        throw new Error('Country not found')
                    }
                    const selected_state = selected_country.states.find(e => e.id == req.query.state_id)
                    if (!selected_state) {
                        throw new Error('State not found')
                    }
                    const cities = selected_state.cities.map(e => ({
                        id: e.id,
                        name: e.name,
                        latitude: e.latitude,
                        longitude: e.longitude,
                    }))

                    return res
                        .response({
                            code: 200,
                            status: "success",
                            message: `All cities fetched for ${selected_country.name} ${selected_state.name} successfully`,
                            countries: cities,
                        })
                        .code(200);
                } catch (error) {
                    return res
                        .response({
                            code: 500,
                            status: "error",
                            message: error.message,
                        })
                        .code(500);
                }
            },
        },
    },
]

module.exports = banner_routes