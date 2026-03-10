const user_controllers = require("./user_controllers");
const category_controllers = require("./category_controllers");
const sub_category_controllers = require("./sub_category_controllers");
const super_sub_category_controllers = require("./super_sub_category_controllers");
const product_attributes_controlllers = require("./product_attributes_controllers");
const product_controllers = require("./product_controllers");
const car_brands_controllers = require("./car_brands-controllers");
const car_models_controllers = require("./car_model_controllers");
const car_list_controllers = require("./car_lists_controllers");
const orders_controllers = require("./orders_controllers");
const delivery_controllers = require("./fetch_delivery_types_controllers");
const banners_controllers = require("./banner_controllers");
const coupons_controllers = require("./coupons_controllers");
const discount_controllers = require("./discounts_controllers");
const product_brands_controllers = require("./product_brand_controllers");
const installers_controllers = require("./installers_controllers");
const subscriber_controllers = require("./subscribed_customers_controllers");
const stories_controllers = require("./stories_controllers");
const static_controllers = require("./static_page_controller");
const store_info_controllers = require("./store_info_controllers");
const testimonials_controllers = require("./testimonials_controllers");
const carts_controllers = require("./carts_controllers");
const wishlists_controllers = require("./wishlists_controller");
const user_address_controllers = require("./user_address_controllers");
const shiprocket_controllers = require("./shiprocket_controllers");
const phonepe_controllers = require("./phonepe_controllers");
const transactions_controllers = require("./transactions_controllers");
const product_faq_controller = require("./product_faq_associations_controllers");
const razorPay_controllers = require("./razor_pay_controllers");
const features_controller = require("./features_controller");
const product_review_controllers = require("./product_review_controllers");
const pre_order_controller = require("./pre_order_controller");
const customers_enquiry_controller = require("./customers_enquiry_controller");
const offer_images_controller = require("./offer_image_controllers");

module.exports = {
  user_controllers,
  category_controllers,
  sub_category_controllers,
  super_sub_category_controllers,
  product_attributes_controlllers,
  product_controllers,
  car_brands_controllers,
  car_models_controllers,
  car_list_controllers,
  orders_controllers,
  delivery_controllers,
  banners_controllers,
  coupons_controllers,
  discount_controllers,
  product_brands_controllers,
  installers_controllers,
  subscriber_controllers,
  stories_controllers,
  static_controllers,
  store_info_controllers,
  testimonials_controllers,
  carts_controllers,
  wishlists_controllers,
  user_address_controllers,
  shiprocket_controllers,
  phonepe_controllers,
  transactions_controllers,
  product_faq_controller,
  razorPay_controllers,
  features_controller,
  product_review_controllers,
  pre_order_controller,
  customers_enquiry_controller,
  offer_images_controller,
};
