const { Model, DOUBLE, TEXT, DECIMAL } = require("sequelize");
const {
  sequelize,
  databases: { order_details },
  dataTypes: {
    model_data_types: { INTEGER, STRING, DATETIME, BOOLEAN },
  },
} = require("../config");
const Orders = require("./order_model");
const Products = require("./product_model");
const Categories = require("./categories");
const SubCategories = require("./sub_categories");
const SuperSubCategories = require("./super_sub_categories_model");
const CarBrands = require("./car_brands_model");
const CarModel = require("./car_model_model");
const OrderStatuses = require("./order_status");
const ProductImages = require("./product_images_model");

class OrderDetails extends Model {}

OrderDetails.init(
  {
    id: {
      type: INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    order_id: {
      type: INTEGER,
      allowNull: true,
    },
    product_id: {
      type: INTEGER,
      allowNull: true,
    },
    combination_id: {
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
      type: DATETIME,
      allowNull: true,
    },
    product_type: {
      type: STRING,
      allowNull: true,
    },
    product_description: {
      type: TEXT,
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
    unit_price: {
      type: DOUBLE,
      allowNull: true,
    },
    discount: {
      type: DECIMAL,
      allowNull: true,
    },
    quantity: {
      type: INTEGER,
      allowNull: true,
    },
    sub_total: {
      type: DOUBLE,
      allowNull: true,
    },
    gst: {
      type: DOUBLE,
      allowNull: true,
    },
    igst: {
      type: DECIMAL,
      allowNull: true,
    },
    cgst: {
      type: DECIMAL,
      allowNull: true,
    },
    sgst: {
      type: DECIMAL,
      allowNull: true,
    },
    total_amount: {
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
    modelName: order_details, // We need to choose the model name
  }
);

Categories.hasMany(OrderDetails, {
  foreignKey: "category_id",
});

OrderDetails.belongsTo(Categories, {
  foreignKey: "category_id",
});

SubCategories.hasMany(OrderDetails, {
  foreignKey: "sub_category_id",
});

OrderDetails.belongsTo(SubCategories, {
  foreignKey: "sub_category_id",
});

SuperSubCategories.hasMany(OrderDetails, {
  foreignKey: "super_sub_category_id",
});

OrderDetails.belongsTo(SuperSubCategories, {
  foreignKey: "super_sub_category_id",
});

Products.hasMany(OrderDetails, {
  foreignKey: "product_id",
});

OrderDetails.belongsTo(Products, {
  foreignKey: "product_id",
});

OrderDetails.hasMany(ProductImages, {
  foreignKey: "product_id",
  as: "product_images",
});

ProductImages.belongsTo(OrderDetails, {
  foreignKey: "product_id",
  as: "product_images",
});

// delivery_types.hasMany(Order_details, {
//     foreignKey: 'delivery_type_id'
// })

// Order_details.belongsTo(delivery_types, {
//     foreignKey: 'delivery_type_id'
// })

module.exports = OrderDetails;
