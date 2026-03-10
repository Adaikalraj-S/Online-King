const Joi = require("joi");

// const fetch_all_product = Joi.object({
//   category_id: Joi.number().integer().positive().allow(""),
//   sub_category_id: Joi.number().integer().positive().allow(""),
//   super_sub_category_id: Joi.number().integer().positive().allow(""),
//   // car_brand_id: Joi.number().integer().positive().allow(""),
//   // car_model_id: Joi.number().integer().positive().allow(""),
//   // year: Joi.number().integer().allow(""),
//   product_name: Joi.string().max(255).allow(""),
//   status: Joi.string().max(255).allow(""),
//   // is_features: Joi.string().max(255).allow(""),
//   // is_topDeals: Joi.string().max(255).allow(""),
//   // is_bestSelling: Joi.string().max(255).allow(""),
//   // is_latest: Joi.string().max(255).allow(""),
//   product_id: Joi.number().integer().positive().allow(""),
//   product_brand_id: Joi.number().integer().positive().allow(""),
//   q: Joi.string().allow(""),
//   price_min: Joi.number().integer().allow(null),
//   price_max: Joi.number().integer().allow(null),
// });

const fetch_all_product = Joi.object({
  category_id: Joi.alternatives()
    .try(
      Joi.number().integer().positive(),
      Joi.array().items(Joi.number().integer().positive())
    )
    .allow(""),

  sub_category_id: Joi.alternatives()
    .try(
      Joi.number().integer().positive(),
      Joi.array().items(Joi.number().integer().positive())
    )
    .allow(""),

  super_sub_category_id: Joi.alternatives()
    .try(
      Joi.number().integer().positive(),
      Joi.array().items(Joi.number().integer().positive())
    )
    .allow(""),

  product_name: Joi.string().max(255).allow(""),

  product_id: Joi.alternatives()
    .try(
      Joi.number().integer().positive(),
      Joi.array().items(Joi.number().integer().positive())
    )
    .allow(""),

  product_brand_id: Joi.alternatives()
    .try(
      Joi.number().integer().positive(),
      Joi.array().items(Joi.number().integer().positive())
    )
    .allow(""),

  status: Joi.string().max(255).allow(""),

  q: Joi.string().allow(""),

  price_min: Joi.number().allow(null),

  price_max: Joi.number().allow(null),
});

const combinationSchema = Joi.object({
  combinations: Joi.array()
    .items(
      Joi.object({
        attribute_id: Joi.number().integer().required(),
        attribute_value: Joi.string().required(),
      })
    )
    .required(),
  price: Joi.number().required(),
  stock: Joi.number().integer().required(),
});

const addProductValidation = Joi.object({
  product_name: Joi.string().required().messages({
    "any.required": "Product Name is required",
  }),
  product_desc: Joi.string().allow(""),
  product_brand_id: Joi.number().integer().required().messages({
    "any.required": "Product brand Name is required",
  }),
  category_id: Joi.number().integer().required(),
  sub_category_id: Joi.number().integer().allow(null).optional(),
  super_sub_category_id: Joi.number().integer().allow(null).optional(),
  minimum_order: Joi.number().integer().allow(null),
  default_price: Joi.number().required(),
  stock: Joi.number().integer(),
  pre_order_stock: Joi.number().integer().allow(null).allow(''),
  discount_type: Joi.string().allow(""),
  discount: Joi.number(),
  tax_type: Joi.string().allow(""),
  tax_rate: Joi.number().allow(""),
  weight: Joi.number().allow(""),
  product_type: Joi.string().allow(""),
  car_brand_id: Joi.number().integer().allow(null),
  car_model_id: Joi.number().integer().allow(null),
  start_year: Joi.number().integer().allow(null),
  end_year: Joi.number().integer().allow(null),
  has_exchange_policy: Joi.boolean(),
  exchange_policy: Joi.string().allow(""),
  has_cancellation_policy: Joi.boolean(),
  cancellation_policy: Joi.string().allow(""),
  quantity: Joi.number().integer(),
  has_warranty: Joi.boolean(),
  warranty: Joi.string().allow(""),
  image_count: Joi.number().integer().allow(null),
  combinations: Joi.string().allow(""),
  features_associations: Joi.string().allow(""),
  // Joi.object({
  //     combination: Joi.array().items(
  //         Joi.object({
  //             attribute_id: Joi.number().integer().required(),
  //             attribute_value: Joi.string().required()
  //         })),
  //     price: Joi.number().required(),
  //     stock: Joi.number().integer().required(),
  // })
  // )

  // combination: Joi.array().items(Joi.object({
  //     combinations: Joi.array().items(Joi.object({
  //         attribute_id: Joi.number().integer().required(),
  //         attribute_value: Joi.string().required()
  //     })).required(),
  //     combination_name: Joi.string().required(),
  //     price: Joi.number().required(),
  //     stock: Joi.number().required(),
  // })).required(),
}).unknown();

const editProductValidation = Joi.object({
  product_id: Joi.number().integer().required().messages({
    "any.required": "Product ID is required",
  }),
  product_name: Joi.string().required().messages({
    "any.required": "Product Name is required",
  }),
  product_desc: Joi.string().allow("").label("Product Description"),
  product_brand: Joi.string().allow("").label("Product Brand"),
  category_id: Joi.number().integer().label("Category ID"),
  sub_category_id: Joi.number().integer().allow(null).label("Sub-Category ID"),
  super_sub_category_id: Joi.number()
    .integer()
    .allow(null)
    .label("Super Sub-Category ID"),
  minimum_order: Joi.number().integer().label("Minimum Order"),
  default_price: Joi.number().required().label("Default Price"),
  stock: Joi.number().integer().label("Stock"),
  pre_order_stock: Joi.number().integer().allow(null),
  product_brand_id: Joi.number().allow(null),
  discount_type: Joi.string().allow("").label("Discount Type"),
  discount: Joi.number().label("Discount"),
  tax_type: Joi.string().allow("").label("Tax Type"),
  tax_rate: Joi.number().allow("").label("Tax Rate"),
  features_associations: Joi.string().allow(""),
  has_exchange_policy: Joi.boolean().label("Has Exchange Policy"),
  exchange_policy: Joi.string().allow("").label("Exchange Policy"),
  has_cancellation_policy: Joi.boolean().label("Has Cancellation Policy"),
  cancellation_policy: Joi.string().allow("").label("Cancellation Policy"),
  quantity: Joi.number().integer().label("Quantity"),
  has_warranty: Joi.boolean().label("Has Warranty"),
  warranty: Joi.string().allow("").label("Warranty"),
  image_count: Joi.number().integer().allow(null),
  removeData: Joi.string().allow(null),
  weight: Joi.string().optional().allow(null),
}).unknown();

const csvDataSchema = Joi.object({
  product_data: Joi.array().items(
    Joi.object({
      product_name: Joi.string().required().messages({
        "any.required": "Product Name is required",
      }),
      product_desc: Joi.string().allow(""),
      product_brand: Joi.string().allow(""),
      product_brand_id: Joi.string().allow(""),
      category_id: Joi.number().integer().required(),
      sub_category_id: Joi.number().integer(),
      super_sub_category_id: Joi.number().integer(),
      minimum_order: Joi.number().integer(),
      default_price: Joi.number().required(),
      stock: Joi.number().integer(),
      discount_type: Joi.string().allow(""),
      discount: Joi.number(),
      tax_type: Joi.string().allow(""),
      tax_rate: Joi.number().allow(""),
      //product_type: Joi.string().allow(""),
      // car_brand_id: Joi.number().integer().allow(null),
      // car_model_id: Joi.number().integer().allow(null),
      // start_year: Joi.number().allow(null),
      // end_year: Joi.number().allow(null),
      has_exchange_policy: Joi.boolean().allow(null),
      exchange_policy: Joi.string().allow(""),
      has_cancellation_policy: Joi.boolean(),
      cancellation_policy: Joi.string().allow(""),
      quantity: Joi.number().integer().allow(null),
      has_warranty: Joi.boolean().allow(null),
      warranty: Joi.string().allow(""),
      weight: Joi.number().required(),
      images: Joi.string().allow(""),
    })
  ),
});

const delete_product_validator = Joi.object({
  product_id: Joi.number().integer().required().messages({
    "any.required": "Product ID is required",
  }),
});
const change_status_product_validator = Joi.object({
  product_id: Joi.number().integer().required().messages({
    "any.required": "Product ID is required",
  }),
  status: Joi.string().required(),
});

const fetch_products_status_validator = Joi.object({
  status: Joi.string()
    .valid(
      "TopSelling",
      "Latest",
      "Popular",
      "Featured",
      "Bestselling",
      "Deals"
    )
    .required()
    .messages({
      "any.required": "Status is required",
      "any.only": "Invalid status value",
    }),
});

const fetch_product = Joi.object({
  product_id: Joi.number().integer().required().messages({
    "any.required": "Product ID is required",
  }),
});

module.exports = {
  fetch_all_product,
  addProductValidation,
  editProductValidation,
  csvDataSchema,
  delete_product_validator,
  change_status_product_validator,
  fetch_products_status_validator,
  fetch_product,
};
