const Joi = require("joi");

const offer_image_validator = Joi.object({
  image: Joi.any().required(),
})

const offer_image_delte_validator = Joi.object({
  id: Joi.number().integer().required(),
})

const bannerCreationValidator = Joi.object({
  banner_name: Joi.string().required(),
  banner_type: Joi.string().valid("product", "category").required(),
  category_id: Joi.when("banner_type", {
    is: "category",
    then: Joi.number().integer().positive().required(),
    otherwise: Joi.optional(),
  }),
  sub_category_id: Joi.when("banner_type", {
    is: "category",
    then: Joi.number().integer().positive(),
    otherwise: Joi.optional(),
  }),
  super_sub_category_id: Joi.when("banner_type", {
    is: "category",
    then: Joi.number().integer().positive(),
    otherwise: Joi.optional(),
  }),
  product_ids: Joi.string().allow(null).allow(""),
  web_image_url: Joi.any().required(),
  // mob_image_url: Joi.any().required()
});

const product_id_for_banner = Joi.array().items(
  Joi.number().positive().required()
);

const fetch_banners = Joi.object({
  banner_id: Joi.number().integer().positive().allow(null),
});

const banner_toggle_delete = Joi.object({
  banner_id: Joi.number().integer().positive().required(),
});

module.exports = {
  bannerCreationValidator,
  product_id_for_banner,
  fetch_banners,
  banner_toggle_delete,
  offer_image_validator,
  offer_image_delte_validator
};
