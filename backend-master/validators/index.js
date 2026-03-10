const joi = require("joi");
module.exports = {
  usersValidation: require("./user_validators"),
  usersAddressValidation: require("./user_addressess_validators"),
  categoriesValidators: require("./categories_validators"),
  subCategoriesValidators: require("./subCategories_validators"),
  superSubCategoriesValidators: require("./superSubCategories_validators"),
  productAttributesValidators: require("./product_attributes_validators"),
  productValidators: require("./products_validators"),
  carBrandsValidators: require("./car_brands_validators"),
  carModelsValidators: require("./car_model_validators"),
  carListsValidators: require("./car_lists_validators"),
  ordersValidator: require("./orders_validators"),
  bannerValidators: require("./banners_validators"),
  couponsValidators: require("./coupons_validators"),
  discountValidators: require("./discount_validators"),
  productBrandValidator: require("./product_brand_validators"),
  InstallersValidator: require("./installers_validators"),
  SubscriberValidator: require("./subscribed_customers_validators"),
  StoriesValidator: require("./stories_validators"),
  StaticPagesValidators: require("./static_pages_validators"),
  StoreInfoValidator: require("./store_info_validators"),
  TestimonialsValidator: require("./testimonials_validators"),
  CartValidators: require("./carts_validators"),
  WishlistValidators: require("./wishlist_validators"),
  ShiprocketValidators: require("./shiprocket_validators"),
  PhonePeValidators: require("./phonepe_validators"),
  transactionsValidators: require("./transactions_validators"),
  productFaqValidators: require("./product_faq_associations_validators"),
  features_validators: require("./features_validators"),
  headerValidator: joi
    .object({
      authorization: joi.string().required(),
    })
    .options({ allowUnknown: true }),
  getAccessTokenHeaderValidator: joi
    .object({
      refreshtoken: joi.string().required(),
    })
    .options({ allowUnknown: true }),
  razorPayValidators: require("./razor_pay_validators"),
  productReviewValidator: require("./productReviewValidators"),
  customersEnquiryPayload: require("./customers_enquiry_validators"),
};
