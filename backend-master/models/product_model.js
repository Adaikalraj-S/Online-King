const { Model } = require("sequelize");
const {
  sequelize,
  databases: { products },
  dataTypes: {
    model_data_types: { INTEGER, STRING, DATETIME, BOOLEAN, DOUBLE },
  },
} = require("../config");

const Categories = require("./categories");
const SubCategories = require("./sub_categories");
const SuperSubCategories = require("./super_sub_categories_model");
const CarBrands = require("./car_brands_model");
const Combinations = require("./product_comination_model");
const ProductBrand = require("./product_brand_model");
const CarModel = require("./car_model_model");
const ProductDiscounts = require("./product_discount_associations");
const BannerProductAssociation = require("./banner_product_associations_model");
const Features = require("./features_model");
const FeaturesAssociations = require("./features_associations_model");
const ProductFaq = require("./product_faq_associations_model");
// const SuperSubCategories = require('./super_sub_categories')

class Products extends Model {}

Products.init(
  {
    id: {
      type: INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    product_name: {
      type: STRING,
      allowNull: true,
    },
    product_desc: {
      type: STRING,
      allowNull: true,
    },
    product_brand_id: {
      type: INTEGER,
      allowNull: true,
    },
    category_id: {
      type: INTEGER,
      allowNull: true,
    },
    sub_category_id: {
      type: INTEGER,
      allowNull: true,
    },
    super_sub_category_id: {
      type: INTEGER,
      allowNull: true,
    },
    minimum_order: {
      type: INTEGER,
      allowNull: true,
    },
    default_price: {
      type: DOUBLE,
      allowNull: true,
    },
    stock: {
      type: INTEGER,
      allowNull: true,
    },
    pre_order_stock: {
      type: INTEGER,
      allowNull: true,
    },
    is_features: {
      type: BOOLEAN,
      allowNull: true,
    },
    is_topDeals: {
      type: BOOLEAN,
      allowNull: true,
    },
    is_latest: {
      type: BOOLEAN,
      allowNull: true,
    },
    is_popular: {
      type: BOOLEAN,
      allowNull: true,
    },
    is_bestSelling: {
      type: BOOLEAN,
      allowNull: true,
    },
    status: {
      type: BOOLEAN,
      allowNull: false,
    },
    pre_order_availability: {
      type: BOOLEAN,
      allowNull: false,
    },
    pre_order_limit: {
      type: STRING,
      allowNull: true,
    },
    estd_pre_order_processing_time: {
      type: STRING,
      allowNull: true,
    },
    discount_type: {
      type: STRING,
      allowNull: true,
    },
    discount: {
      type: DOUBLE,
      allowNull: true,
    },
    is_offer_avl: {
      type: BOOLEAN,
      allowNull: true,
    },
    offer_discount: {
      type: DOUBLE,
      allowNull: true,
    },
    offer_discount_type: {
      type: STRING,
      allowNull: true,
    },
    offer_start_date: {
      type: DATETIME,
      allowNull: true,
    },
    offer_end_date: {
      type: DATETIME,
      allowNull: true,
    },
    offer_end_date: {
      type: DATETIME,
      allowNull: true,
    },
    tax_type: {
      type: STRING,
      allowNull: true,
    },
    tax_rate: {
      type: INTEGER,
      allowNull: true,
    },
    product_type: {
      type: STRING,
      allowNull: true,
    },
    car_brand_id: {
      type: INTEGER,
      allowNull: true,
    },
    car_model_id: {
      type: INTEGER,
      allowNull: true,
    },
    start_year: {
      type: INTEGER,
      allowNull: true,
    },
    end_year: {
      type: INTEGER,
      allowNull: true,
    },
    has_exchange_policy: {
      type: BOOLEAN,
      allowNull: true,
    },
    exchange_policy: {
      type: STRING,
      allowNull: true,
    },
    has_cancellation_policy: {
      type: BOOLEAN,
      allowNull: true,
    },
    cancellation_policy: {
      type: STRING,
      allowNull: true,
    },
    quantity: {
      type: INTEGER,
      allowNull: true,
    },
    has_warranty: {
      type: BOOLEAN,
      allowNull: true,
    },
    warranty: {
      type: STRING,
      allowNull: true,
    },
    weight: {
      type: DOUBLE,
      allowNull: true,
    },
    createdAt: {
      type: DATETIME,
      allowNull: true,
    },
    updatedAt: {
      type: DATETIME,
      allowNull: true,
    },
    deletedAt: {
      type: DATETIME,
      allowNull: true,
    },
  },
  {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    paranoid: true,
    modelName: products, // We need to choose the model name
  }
);

Categories.hasMany(Products, {
  foreignKey: "category_id",
});

Products.belongsTo(Categories, {
  foreignKey: "category_id",
});

ProductBrand.hasMany(Products, {
  foreignKey: "product_brand_id",
});

Products.belongsTo(ProductBrand, {
  foreignKey: "product_brand_id",
});

SubCategories.hasMany(Products, {
  foreignKey: "sub_category_id",
});

Products.belongsTo(SubCategories, {
  foreignKey: "sub_category_id",
});

SuperSubCategories.hasMany(Products, {
  foreignKey: "super_sub_category_id",
});

Products.belongsTo(SuperSubCategories, {
  foreignKey: "super_sub_category_id",
});

CarBrands.hasMany(Products, {
  foreignKey: "car_brand_id",
});

Products.belongsTo(CarBrands, {
  foreignKey: "car_brand_id",
});

Products.belongsTo(CarModel, {
  foreignKey: "car_model_id",
});

// Products.hasOne(Combinations, {
//   foreignKey: "product_id",
// });

// Combinations.belongsToMany(Products, {
//   foreignKey: "product_id",
// });

// Products.hasMany(Combinations, { foreignKey: "product_id" });

// Combinations.belongsTo(Products, { foreignKey: "product_id" });

Products.hasMany(ProductDiscounts, { foreignKey: "product_id" });

ProductDiscounts.belongsTo(Products, { foreignKey: "product_id" });

Products.hasMany(FeaturesAssociations, { foreignKey: "product_id" });
FeaturesAssociations.belongsTo(Products, { foreignKey: "product_id" });
FeaturesAssociations.belongsTo(Features, { foreignKey: "feature_id" });
Features.hasMany(FeaturesAssociations, { foreignKey: "feature_id" });
//Features.belongsTo(FeaturesAssociations, { foreignKey: "feature_id" });
Products.hasMany(ProductFaq, { foreignKey: "product_id" });
ProductFaq.belongsTo(Products, { foreignKey: "product_id" });

Products.belongsToMany(BannerProductAssociation, {
  through: "BannerProductAssociation",
  foreignKey: "product_id",
});
BannerProductAssociation.belongsTo(Products, { foreignKey: "product_id" });

module.exports = Products;
