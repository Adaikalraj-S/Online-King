'use strict';
const {
  sequelize,
} = require("../config"); // Adjust the path as necessary

const {
  Model,
  DataTypes
} = require('sequelize');
class OfferImages extends Model {}
OfferImages.init({
  image_url: DataTypes.STRING
}, {
  sequelize,
  modelName: 'offer_images',
});
module.exports = OfferImages;