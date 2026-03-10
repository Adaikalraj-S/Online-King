const jwt = require("jsonwebtoken");
const ejs = require("ejs");
const { uploadFile } = require("../helpers");
const { uploadMultipleFiles } = require("../helpers");
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
const { QueryTypes } = require("sequelize");

const {
  Products,
  Categories,
  SubCategories,
  SuperSubCategories,
  CarBrands,
  ProductImages,
  Combinations,
  ProductAttributes,
  AttributeCombinatios,
  VariantAttributes,
  ProductDiscounts,
  CarModel,
  FeaturesAssociations,
  Features,
  CustomerReview,
  CustomerReviewImage,
} = require("../models");
const { Op } = require("sequelize");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const AttributeCombinations = require("../models/attribute_comination_model");
const Joi = require("joi");
const ProductBrand = require("../models/product_brand_model");

// const fetchProducts = async (req, res) => {
//   try {
//     const {
//       category_id,
//       sub_category_id,
//       super_sub_category_id,
//       car_brand_id,
//       product_name,
//       product_id,
//       product_brand_id,
//     } = req.query;

//     let whereCondition = {};

//     if (category_id) {
//       whereCondition.category_id = category_id;
//     }

//     if (sub_category_id) {
//       whereCondition.sub_category_id = sub_category_id;
//     }

//     if (super_sub_category_id) {
//       whereCondition.super_sub_category_id = super_sub_category_id;
//     }

//     if (car_brand_id) {
//       whereCondition.car_brand_id = car_brand_id;
//     }

//     if (product_name) {
//       whereCondition.product_name = product_name;
//     }

//     if (product_brand_id) {
//       whereCondition.product_brand_id = product_brand_id;
//     }

//     if (product_id) {
//       whereCondition.id = product_id;
//     }

//     // if (year) {
//     //   whereCondition = {
//     //     ...whereCondition,
//     //     start_year: {
//     //       [Op.lte]: year,
//     //     },
//     //     end_year: {
//     //       [Op.gte]: year,
//     //     },
//     //   };
//     // }

//     const user = await checkToken(
//       req.headers["Authorization"]
//         ? req.headers["authorization"]
//         : req.headers.authorization
//     );

//     if (user.role === "ADMIN" && user.application === "kardify") {
//       const products = await Products.findAll({
//         where: whereCondition,

//         include: [
//           {
//             model: Categories,
//             required: true,
//           },
//           {
//             model: SubCategories,
//             required: false,
//           },
//           {
//             model: SuperSubCategories,
//             required: false,
//           },
//           // {
//           //   model: CarBrands,
//           //   required: false,
//           // },
//           {
//             model: ProductBrand,
//             required: false,
//           },
//           {
//             model: Combinations,
//             include: [
//               {
//                 model: AttributeCombinatios,
//                 required: true,
//                 include: [
//                   {
//                     model: ProductAttributes,
//                     required: true,
//                   },
//                 ],
//               },
//             ],
//             required: false,
//           },
//         ],
//         raw: true,
//         nest: true,
//         mapToModel: true,
//         order: [["createdAt", "DESC"]],
//       });

//       const productDiscountAssociations = await ProductDiscounts.findAll({
//         where: {
//           product_id: products.map((product) => product.id),
//         },
//         raw: true,
//       });

//       const images = await ProductImages.findAll({
//         where: {
//           product_id: products.map((product) => product.id),
//           status: 1,
//         },
//         attributes: ["id", "product_id", "image_url"],
//         raw: true,
//       });

//       const imagesMap = images.reduce((acc, image) => {
//         const { product_id } = image;
//         if (!acc[product_id]) {
//           acc[product_id] = [];
//         }
//         acc[product_id].push(image);
//         return acc;
//       }, {});

//       const attributes = await Combinations.findAll({
//         where: {
//           product_id: products.map((product) => product.id),
//         },
//         include: [
//           {
//             model: AttributeCombinations,
//             // include: [
//             //   {
//             //     model: ProductAttributes,
//             //   },
//             // ],
//             //required: false,
//           },
//         ],

//         //raw: true,
//       });

//       // console.log(attributes, "attributes----");

//       const attributesMap = attributes.reduce((acc, atttr) => {
//         const { product_id } = atttr;
//         if (!acc[product_id]) {
//           acc[product_id] = [];
//         }
//         acc[product_id].push(atttr);
//         return acc;
//       }, {});

//       const discountAssociationsMap = productDiscountAssociations.reduce(
//         (acc, association) => {
//           const { product_id } = association;
//           if (!acc[product_id]) {
//             acc[product_id] = [];
//           }
//           acc[product_id].push(association);
//           return acc;
//         },
//         {}
//       );

//       products.forEach((product) => {
//         const productId = product.id;
//         product.atributes = attributesMap[productId] || [];
//         product.images = imagesMap[productId] || [];
//         product.product_discount_associations =
//           discountAssociationsMap[productId] || [];
//       });

//       return res
//         .response({
//           code: 200,
//           status: "success",
//           message: "Products fetched successfully",
//           products,
//         })
//         .code(200);
//     } else if (user == "Session expired") {
//       return res
//         .response({
//           code: 401,
//           status: "error",
//           message: user,
//         })
//         .code(200);
//     } else {
//       return res
//         .response({
//           code: 403,
//           status: "error",
//           message: "You dont have permission for this action.",
//         })
//         .code(200);
//     }
//   } catch (error) {
//     console.log(error);
//     return res
//       .response({
//         code: 500,
//         status: "error",
//         message: "Something went wrong",
//       })
//       .code(200);
//   }
// };

const fetchProducts = async (req, res) => {
  try {
    const {
      category_id,
      sub_category_id,
      super_sub_category_id,
      car_brand_id,
      year,
      product_name,
      product_id,
      product_brand_id,
      status,
      q,
    } = req.query;

    let whereCondition = {};

    if (category_id) {
      whereCondition.category_id = category_id;
    }

    if (sub_category_id) {
      whereCondition.sub_category_id = sub_category_id;
    }

    if (super_sub_category_id) {
      whereCondition.super_sub_category_id = super_sub_category_id;
    }

    if (car_brand_id) {
      whereCondition.car_brand_id = car_brand_id;
    }

    if (product_name) {
      whereCondition.product_name = product_name;
    }

    if (product_brand_id) {
      whereCondition.product_brand_id = product_brand_id;
    }

    if (product_id) {
      whereCondition.id = product_id;
    }

    if (year) {
      whereCondition = {
        ...whereCondition,
        start_year: {
          [Op.lte]: year,
        },
        end_year: {
          [Op.gte]: year,
        },
      };
    }

    if (q) {
      whereCondition = {
        ...whereCondition,
        [Op.or]: [{ product_name: { [Op.like]: `%${q}%` } }],
      };
    }

    const products = await Products.findAll({
      where: whereCondition,
      order: [["createdAt", "DESC"]],
      attributes: {
        include: [
          // Subquery to calculate average rating
          [
            sequelize.literal(`(
              SELECT ROUND(AVG(rating), 1)
              FROM customer_review
              WHERE customer_review.product_id = products.id
            )`),
            "average_rating",
          ],
          // Subquery to count the total number of ratings
          [
            sequelize.literal(`(
              SELECT COUNT(*)
              FROM customer_review
              WHERE customer_review.product_id = products.id
            )`),
            "total_ratings",
          ],
        ],
      },
      include: [
        {
          model: Categories,
          required: true,
        },
        {
          model: SubCategories,
          required: false,
        },
        {
          model: SuperSubCategories,
          required: false,
        },
        {
          model: CarBrands,
          required: false,
        },
        {
          model: CarModel,
          required: false,
        },
        {
          model: ProductBrand,
          required: false,
        },
        {
          model: ProductImages,
          required: false,
          as: "images", // Ensure this alias matches your model association
        },
        {
          model: Combinations,
          required: false,
          include: [
            {
              model: AttributeCombinations, // Corrected typo
              required: true,
              include: [
                {
                  model: ProductAttributes,
                  required: true,
                },
              ],
            },
          ],
        },
        {
          model: FeaturesAssociations,
          required: false,
          include: [
            {
              model: Features,
              required: false,
            },
          ],
        },
        {
          model: CustomerReview,
          required: false, // Add required option if needed
          include: [
            {
              model: CustomerReviewImage,
              required: false,
            },
          ],
        },
      ],
    });

    const newCurrentData = new Date(new Date().setHours(0, 0, 0, 0));
    const currentDate = new Date(newCurrentData);

    console.log(currentDate, "date");

    products.forEach((product) => {
      if (
        product.offer_start_date &&
        product.is_offer_avl &&
        new Date(product.offer_start_date) <= currentDate &&
        (!product.offer_end_date ||
          new Date(product.offer_end_date) >= currentDate)
      ) {
        product.discount = product.offer_discount;
        product.discount_type = product.offer_discount_type;
      }
    });

    return res
      .response({
        code: 200,
        status: "success",
        message: "Products fetched successfully",
        products,
      })
      .code(200);
  } catch (error) {
    console.log(error);
    return res
      .response({
        code: 500,
        status: "error",
        message: "Something went wrong",
      })
      .code(200);
  }
};

// const fetchProductCustomer = async (req, res) => {
//   try {
//     const {
//       category_id,
//       sub_category_id,
//       super_sub_category_id,
//       car_brand_id,
//       year,
//       product_name,
//       product_id,
//       product_brand_id,
//       status,
//       q,
//     } = req.query;

//     let whereCondition = {};

//     if (category_id) {
//       whereCondition.category_id = category_id;
//     }

//     if (sub_category_id) {
//       whereCondition.sub_category_id = sub_category_id;
//     }

//     if (super_sub_category_id) {
//       whereCondition.super_sub_category_id = super_sub_category_id;
//     }

//     if (car_brand_id) {
//       whereCondition.car_brand_id = car_brand_id;
//     }

//     if (product_name) {
//       whereCondition.product_name = product_name;
//     }

//     if (product_brand_id) {
//       whereCondition.product_brand_id = product_brand_id;
//     }

//     if (product_id) {
//       whereCondition.id = product_id;
//     }

//     if (year) {
//       whereCondition = {
//         ...whereCondition,
//         start_year: {
//           [Op.lte]: year,
//         },
//         end_year: {
//           [Op.gte]: year,
//         },
//       };
//     }

//     if (q) {
//       whereCondition = {
//         ...whereCondition,
//         [Op.or]: [{ product_name: { [Op.like]: `%${q}%` } }],
//       };
//     }

//     const products = await Products.findAll({
//       where: whereCondition,
//       order: [["createdAt", "DESC"]],
//       attributes: {
//         include: [
//           // Subquery to calculate average rating
//           [
//             sequelize.literal(`(
//               SELECT ROUND(AVG(rating), 1)
//               FROM customer_review
//               WHERE customer_review.product_id = Products.id
//             )`),
//             "average_rating",
//           ],
//           // Subquery to count the total number of ratings
//           [
//             sequelize.literal(`(
//               SELECT COUNT(*)
//               FROM customer_review
//               WHERE customer_review.product_id = Products.id
//             )`),
//             "total_ratings",
//           ],
//         ],
//       },
//       include: [
//         {
//           model: Categories,
//           required: true,
//         },
//         {
//           model: SubCategories,
//           required: false,
//         },
//         {
//           model: SuperSubCategories,
//           required: false,
//         },
//         {
//           model: CarBrands,
//           required: false,
//         },
//         {
//           model: CarModel,
//           required: false,
//         },
//         {
//           model: ProductBrand,
//           required: false,
//         },
//         {
//           model: ProductImages,
//           required: false,
//           as: "images", // Ensure this alias matches your model association
//         },
//         {
//           model: Combinations,
//           required: false,
//           include: [
//             {
//               model: AttributeCombinations, // Corrected typo
//               required: true,
//               include: [
//                 {
//                   model: ProductAttributes,
//                   required: true,
//                 },
//               ],
//             },
//           ],
//         },
//         {
//           model: FeaturesAssociations,
//           required: false,
//           include: [
//             {
//               model: Features,
//               required: false,
//             },
//           ],
//         },
//         {
//           model: CustomerReview,
//           required: false, // Add required option if needed
//           include: [
//             {
//               model: CustomerReviewImage,
//               required: false,
//             },
//           ],
//         },
//       ],
//     });

//     const newCurrentData = new Date(new Date().setHours(0, 0, 0, 0));
//     const currentDate = new Date(newCurrentData);

//     console.log(currentDate, "date");

//     products.forEach((product) => {
//       if (
//         product.offer_start_date &&
//         product.is_offer_avl &&
//         new Date(product.offer_start_date) <= currentDate &&
//         (!product.offer_end_date ||
//           new Date(product.offer_end_date) >= currentDate)
//       ) {
//         product.discount = product.offer_discount;
//         product.discount_type = product.offer_discount_type;
//       }
//     });

//     return res
//       .response({
//         code: 200,
//         status: "success",
//         message: "Products fetched successfully",
//         products,
//       })
//       .code(200);
//   } catch (error) {
//     console.log(error);
//     return res
//       .response({
//         code: 500,
//         status: "error",
//         message: "Something went wrong",
//       })
//       .code(200);
//   }
// };

const fetchProductCustomer = async (req, res) => {
  try {
    const {
      category_id,
      sub_category_id,
      super_sub_category_id,
      product_name,
      product_id,
      product_brand_id,
      status,
      q,
      price_min,
      price_max,
    } = req.query;

    let whereCondition = { status: true }; // Assuming you want to filter by status

    // Handle filtering for various parameters
    if (category_id) {
      whereCondition.category_id = Array.isArray(category_id)
        ? { [Op.in]: category_id }
        : category_id;
    }

    if (sub_category_id) {
      whereCondition.sub_category_id = Array.isArray(sub_category_id)
        ? { [Op.in]: sub_category_id }
        : sub_category_id;
    }

    if (super_sub_category_id) {
      whereCondition.super_sub_category_id = Array.isArray(
        super_sub_category_id
      )
        ? { [Op.in]: super_sub_category_id }
        : super_sub_category_id;
    }

    if (product_name) {
      whereCondition.product_name = { [Op.like]: `%${product_name}%` };
    }

    if (product_id) {
      whereCondition.id = product_id;
    }

    if (product_brand_id) {
      whereCondition.product_brand_id = Array.isArray(product_brand_id)
        ? { [Op.in]: product_brand_id }
        : product_brand_id;
    }

    // Handle search query
    if (q) {
      whereCondition = {
        ...whereCondition,
        [Op.or]: [{ product_name: { [Op.like]: `%${q}%` } }],
      };
    }

    // Fetch products from the database
    const products = await Products.findAll({
      where: whereCondition,
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: Categories,
          required: true,
        },
        {
          model: SubCategories,
          required: false,
        },
        {
          model: SuperSubCategories,
          required: false,
        },
        {
          model: ProductBrand,
          required: false,
        },
        {
          model: CustomerReview,
          where: {
            status: "approved",
          },
          required: false,
        },
        {
          model: ProductImages,
          required: false,
          as: "images",
        },
        {
          model: Combinations,
          required: false,
          include: [
            {
              model: AttributeCombinatios,
              required: true,
              include: [
                {
                  model: ProductAttributes,
                  required: true,
                },
              ],
            },
          ],
        },
        {
          model: FeaturesAssociations, // Add this to fetch the features associations
          required: false,
          include: [
            {
              model: Features, // Assuming there's a `Features` model to get the feature details
              required: true,
            },
          ],
        },
        // Add any additional includes as needed
      ],
    });

    // Calculate effective prices
    products.forEach((product) => {
      let effectivePrice = product.default_price;

      if (product.discount) {
        if (
          product.discount_type.toLowerCase() === "percent" ||
          product.discount_type.toLowerCase() === "percentage"
        ) {
          effectivePrice -= (product.discount / 100) * effectivePrice;
        } else if (product.discount_type.toLowerCase() === "amount") {
          effectivePrice -= parseFloat(product.discount);
        }
      }
      product.effectivePrice = effectivePrice; // Store effective price on product
    });

    // Filter based on effective price
    let filteredProducts = products;
    //console.log(products[0].effectivePrice, "efp");

    if (price_min || price_max) {
      filteredProducts = products.filter((product) => {
        const minCondition = price_min
          ? product.effectivePrice >= parseFloat(price_min)
          : true;
        const maxCondition = price_max
          ? product.effectivePrice <= parseFloat(price_max)
          : true;

        return minCondition && maxCondition;
      });
    }

    console.log(products.length, "pd", filteredProducts.length, "dpfr");

    // Step 2: Fetch Global MIN and MAX Prices for default_price
    const priceStats = await Products.findAll({
      attributes: [
        [sequelize.fn("MAX", sequelize.col("default_price")), "max_price"],
        [sequelize.fn("MIN", sequelize.col("default_price")), "min_price"],
      ],
      raw: true,
    });

    return res
      .response({
        code: 200,
        status: "success",
        message: "Products fetched successfully",
        products: filteredProducts,
        max_price: priceStats[0].max_price,
        min_price: priceStats[0].min_price,
      })
      .code(200);
  } catch (error) {
    console.error(error);
    return res
      .response({
        code: 500,
        status: "error",
        message: "Something went wrong",
      })
      .code(500);
  }
};

const addProduct = async (req, res) => {
  // console.log("req.payload", req.payload);
  const transact = await sequelize.transaction();
  try {
    const user = await checkToken(
      req.headers["Authorization"]
        ? req.headers["Authorization"]
        : req.headers.authorization
    );

    if (user.role === "ADMIN" && user.application === "kardify") {
      const {
        product_name,
        product_desc,
        product_brand_id,
        category_id,
        sub_category_id,
        super_sub_category_id,
        minimum_order,
        default_price,
        stock,
        pre_order_stock,
        discount_type,
        discount,
        tax_type,
        tax_rate,
        product_type,
        car_brand_id,
        car_model_id,
        start_year,
        end_year,
        has_exchange_policy,
        exchange_policy,
        has_cancellation_policy,
        cancellation_policy,
        quantity,
        has_warranty,
        warranty,
        weight,
        image_count,
        features_associations,
        pre_order_limit,
        estd_pre_order_processing_time,
        pre_order_availability,
      } = req.payload;

      const combinations = JSON.parse(req.payload.combinations);
      // console.log("combinations: ", combinations);

      const existingProduct = await Products.findOne({
        where: {
          product_name,
        },
        raw: true,
        order: [["createdAt", "DESC"]],
      });

      if (existingProduct) {
        await transact.rollback();
        return res
          .response({
            code: 409,
            status: "error",
            message: "Product with the same name already exists",
          })
          .code(200);
      }

      let image_url_list = [];
      if (image_count) {
        for (let i = 1; i <= image_count; i++) {
          try {
            const { file_url } = await uploadFile(
              req,
              req.payload[`image_${i}`],
              "uploads/products/"
            );
            await new Promise((resolve) => setTimeout(resolve, 10));
            image_url_list.push({ image_url: file_url });
          } catch (error) {
            console.error(`Error uploading image ${i}:`, error);
          }
        }
      }

      const newProduct = await Products.create(
        {
          status: true,
          pre_order_availability,
          product_name,
          estd_pre_order_processing_time,
          pre_order_limit,
          product_desc,
          product_brand_id,
          category_id,
          sub_category_id: sub_category_id ? sub_category_id : null,
          super_sub_category_id: super_sub_category_id
            ? super_sub_category_id
            : null,
          minimum_order,
          weight,
          pre_order_stock,
          default_price,
          stock,
          discount_type,
          discount,
          tax_type,
          tax_rate,
          product_type,
          car_brand_id,
          car_model_id,
          start_year,
          end_year,
          has_exchange_policy,
          exchange_policy,
          has_cancellation_policy,
          cancellation_policy,
          quantity,
          has_warranty,
          warranty,
          // images: fileUrls,
        },
        {
          transaction: transact,
        }
      );

      for (const combination of combinations) {
        const createdCombination = await Combinations.create(
          {
            price: combination.price,
            stock: combination.stock,
            pre_order_stock: combination.pre_order_stock,
            product_id: newProduct.id,
            combination: combination.combination_name,
            pre_order_limit: combination?.pre_order_limit
              ? combination.pre_order_limit
              : null,
            pre_order_stock: combination.pre_order_stock || 0,
          },
          { transaction: transact }
        );

        for (const attributeCombination of combination.combinations) {
          await AttributeCombinations.create(
            {
              combination_id: createdCombination.id,
              attribute_id: attributeCombination.attribute_id,
              attribute_value: attributeCombination.attribute_value,
            },
            { transaction: transact }
          );
        }
      }

      try {
        if (features_associations.length > 0) {
          const features_combination = JSON.parse(
            req.payload.features_associations
          );

          for (const feature of features_combination) {
            await FeaturesAssociations.create(
              {
                product_id: newProduct.id,
                feature_id: feature.id,
              },
              { transaction: transact }
            );
          }

          // const data = features_combination.map(async (feature) => {
          //   return await FeaturesAssociations.create({
          //     product_id: newProduct.id,
          //     feature_id: feature.id,
          //   });
          // });

          // await Promise.all(data);
        }
      } catch (error) {
        console.error("Error adding feature associations:", error);
        // Handle the error (e.g., send a response or throw an error)
      }

      const image_url_data = image_url_list.map((e) => {
        return {
          ...e,
          product_id: newProduct.id,
        };
      });

      const image_data = await Promise.all(image_url_data);
      await ProductImages.bulkCreate(image_data, {
        transaction: transact,
      });

      await transact.commit();

      return res
        .response({
          code: 201,
          status: "success",
          message: "Product created successfully",
          product: newProduct,
        })
        .code(200);
    } else if (user == "Session expired") {
      await transact.rollback();
      return res
        .response({
          code: 401,
          status: "error",
          message: user,
        })
        .code(200);
    } else {
      await transact.rollback();
      return res
        .response({
          code: 403,
          status: "error",
          message: "You dont have permission for this action.",
        })
        .code(200);
    }
  } catch (error) {
    await transact.rollback();
    console.error(error);
    return res
      .response({
        code: 500,
        status: "error",
        message: "Something went wrong",
      })
      .code(200);
  }
};

const uploadImagesHandler = async (req, h) => {
  try {
    // Check if the user is authenticated and authorized
    const user = await checkToken(
      req.headers["Authorization"]
        ? req.headers["Authorization"]
        : req.headers.authorization
    );

    if (!(user.role === "ADMIN" && user.application === "kardify")) {
      return h
        .response({
          code: 403,
          status: "error",
          message: "You don't have permission for this action.",
        })
        .code(403);
    }

    // Ensure the uploads/products directory exists
    const uploadsDir = "uploads/products/";
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Function to upload file
    const uploadImageFiles = async (req, file, uploadsDir) => {
      try {
        let file_url = null;
        const file_name = `${uploadsDir}${file.hapi.filename}`;
        await fs.promises.writeFile(file_name, file._data);
        console.log(`Success: ${file_name} file created`);
        file_url = `/${file_name}`;
        return {
          file_url,
        };
      } catch (error) {
        console.log(error);
      }
    };

    let files = req.payload.files;

    // Check if files is an array or a single file
    if (!Array.isArray(files)) {
      files = [files];
    }

    // Loop through each file in the payload and upload it
    for (const file of files) {
      await uploadImageFiles(req, file, uploadsDir);
    }
    return h
      .response({
        code: 200,
        status: "success",
        message: "Images uploaded successfully",
      })
      .code(200);
  } catch (error) {
    console.error(error);
    return h
      .response({
        code: 500,
        status: "error",
        message: "Something went wrong",
        error: error.message,
      })
      .code(500);
  }
};

const addBulkProduct = async (req, res) => {
  const transact = await sequelize.transaction();
  try {
    const user = await checkToken(
      req.headers["Authorization"]
        ? req.headers["Authorization"]
        : req.headers.authorization
    );

    if (user.role === "ADMIN" && user.application === "kardify") {
      const { product_data } = req.payload;

      const productsWithStatus = product_data.map((product) => ({
        ...product,
        status: true,
      }));

      const existingProducts = await Products.findAll({
        where: {
          product_name: productsWithStatus.map(
            (product) => product.product_name
          ),
        },
        include: [Categories, SubCategories, SuperSubCategories],
        nest: true,
        mapToModel: true,
        raw: true,
      });

      if (existingProducts.length > 0) {
        const nonExistingProducts = productsWithStatus.filter(
          (product) =>
            !existingProducts.some(
              (existingProduct) =>
                existingProduct.product_name === product.product_name
            )
        );

        const createdProducts = await Products.bulkCreate(nonExistingProducts, {
          transaction: transact,
        });

        const productImages = [];
        createdProducts.forEach((product, index) => {
          const images = nonExistingProducts[index].images
            .split(",")
            .map((img) => img.trim());
          images.forEach((image) => {
            productImages.push({
              product_id: product.id,
              image_url: `/uploads/products/${image}`,
            });
          });
        });

        await ProductImages.bulkCreate(productImages, {
          transaction: transact,
        });

        await transact.commit();

        return res
          .response({
            code: 409,
            status: "error",
            message: "One or more products with the same name already exist",
            existingProducts,
            createdProducts,
          })
          .code(200);
      }

      const createdProducts = await Products.bulkCreate(productsWithStatus, {
        transaction: transact,
      });

      const productImages = [];
      createdProducts.forEach((product, index) => {
        const images = productsWithStatus[index].images
          .split(",")
          .map((img) => img.trim());
        images.forEach((image) => {
          productImages.push({
            product_id: product.id,
            image_url: `/uploads/products/${image}`,
          });
        });
      });

      await ProductImages.bulkCreate(productImages, {
        transaction: transact,
      });

      await transact.commit();
      // await sequelize.close();

      return res
        .response({
          code: 201,
          status: "success",
          message: "Products created successfully",
          createdProducts,
        })
        .code(200);
    } else if (user == "Session expired") {
      await transact.rollback();
      return res
        .response({
          code: 401,
          status: "error",
          message: user,
        })
        .code(200);
    } else {
      await transact.rollback();
      return res
        .response({
          code: 403,
          status: "error",
          message: "You dont have permission for this action.",
        })
        .code(200);
    }
  } catch (error) {
    await transact.rollback();
    console.error(error);
    return res
      .response({
        code: 500,
        status: "error",
        message: "Something went wrong",
        error: error.message,
      })
      .code(200);
  }
};

// const editProduct = async (req, res) => {
//   console.log("req.headers", req.headers);
//   console.log("req.payload", req.payload);

//   try {
//     const {
//       product_name,
//       product_desc,
//       product_id,
//       product_brand_id,
//       category_id,
//       sub_category_id,
//       super_sub_category_id,
//       minimum_order,
//       default_price,
//       stock,
//       discount_type,
//       discount,
//       tax_type,
//       tax_rate,
//       product_type,
//       car_brand_id,
//       car_model_id,
//       start_year,
//       end_year,
//       has_exchange_policy,
//       exchange_policy,
//       has_cancellation_policy,
//       cancellation_policy,
//       quantity,
//       weight,
//       has_warranty,
//       warranty,
//       image_count,
//       images,
//     } = req.payload;

//     // let combinations;
//     // if (req.payload.combinations) {
//     //   combinations = JSON.parse(req.payload.combinations);
//     // } else {
//     //   combinations = [];
//     // }
//     let combinations = null;
//     if (req.payload.combinations) {
//       combinations = JSON.parse(req.payload.combinations);
//     }

//     const user = await checkToken(
//       req.headers["Authorization"]
//         ? req.headers["Authorization"]
//         : req.headers.authorization
//     );

//     // console.log(user, "user-------");

//     if (user.role === "ADMIN" && user.application === "kardify") {
//       const existingProduct = await Products.findOne({
//         where: {
//           id: product_id,
//         },
//       });

//       if (!existingProduct) {
//         return res
//           .response({
//             code: 404,
//             status: "error",
//             message: "Product not found",
//           })
//           .code(200);
//       }

//       if (existingProduct.product_name !== product_name) {
//         const productWithSameName = await Products.findOne({
//           where: {
//             product_name,
//           },
//         });

//         if (productWithSameName && productWithSameName.id !== product_id) {
//           return res
//             .response({
//               code: 409,
//               status: "error",
//               message: "Product with the same name already exists",
//             })
//             .code(200);
//         }
//       }

//       await existingProduct.update({
//         product_name,
//         product_desc,
//         product_brand_id,
//         product_id,
//         category_id,
//         sub_category_id,
//         super_sub_category_id,
//         minimum_order,
//         default_price,
//         stock,
//         discount_type,
//         discount,
//         tax_type,
//         tax_rate,
//         // product_type,
//         // car_brand_id,
//         // car_model_id,
//         // start_year,
//         // end_year,
//         has_exchange_policy,
//         exchange_policy,
//         has_cancellation_policy,
//         cancellation_policy,
//         quantity,
//         weight: typeof weight === "number" ? weight : null,

//         has_warranty,
//         warranty,
//       });

//       if (image_count) {
//         await ProductImages.destroy({ where: { product_id } });

//         const newImages = [];
//         for (let i = 1; i <= image_count; i++) {
//           const { file_url } = await uploadFile(
//             req,
//             req.payload[`image_${i}`],
//             "uploads/products/"
//           );
//           newImages.push({ image_url: file_url, product_id });
//         }
//         await ProductImages.bulkCreate(newImages);
//       }
//       // const newImages = [];
//       // for (let i = 1; i <= image_count; i++) {
//       //   const { file_url } = await uploadFile(
//       //     req,
//       //     req.payload[`image_${i}`],
//       //     "uploads/products/"
//       //   );
//       //   newImages.push({ image_url: file_url, product_id });
//       // }
//       // await ProductImages.bulkCreate(newImages);
//       // if (images) {
//       //   // Split the images string into an array of blob URLs
//       //   const imageArray = images.split(",");

//       //   // Clear existing images
//       //   await ProductImages.destroy({ where: { product_id } });

//       //   const newImages = [];
//       //   for (let i = 0; i < imageArray.length; i++) {
//       //     // Assuming uploadFile can handle blob URLs directly
//       //     const { file_url } = await uploadFile(
//       //       req,
//       //       imageArray[i], // Directly pass the blob URL
//       //       "uploads/products/"
//       //     );
//       //     newImages.push({ image_url: file_url, product_id });
//       //   }
//       //   await ProductImages.bulkCreate(newImages);
//       // }

//       if (combinations) {
//         let combinationIds = [];
//         for (const combination of combinations) {
//           const existingCombination = await Combinations.findOne({
//             where: {
//               combination: combination.combination_name,
//               product_id: product_id,
//             },
//           });
//           // store existing combination id so old records can be deleted
//           let update = null;

//           if (existingCombination) {
//             update = await existingCombination.update({
//               price: combination.price,
//               stock: combination.stock,
//             });
//           } else {
//             update = await Combinations.create({
//               price: combination.price,
//               stock: combination.stock,
//               product_id: product_id,
//               combination: combination.combination_name,
//             });
//           }

//           combinationIds.push(update.id);

//           for (const attributeCombination of combination.combinations) {
//             const existingCombination = await AttributeCombinations.findOne({
//               where: {
//                 combination_id: update.id,
//                 attribute_id: attributeCombination.attribute_id,
//               },
//             });
//             if (!existingCombination) {
//               await AttributeCombinations.create({
//                 combination_id: update.id,
//                 attribute_id: attributeCombination.attribute_id,
//                 attribute_value: attributeCombination.attribute_value,
//               });
//             }
//           }
//           await Combinations.destroy({
//             where: {
//               product_id: product_id,
//               id: {
//                 [Op.notIn]: combinationIds,
//               },
//             },
//           });

//           AttributeCombinations.destroy({
//             where: {
//               combination_id: {
//                 [Op.notIn]: combinationIds,
//               },
//             },
//           });
//         }
//       }

//       // console.log(existingProduct);
//       return res
//         .response({
//           code: 200,
//           status: "success",
//           message: "Product updated successfully",
//           product: existingProduct,
//         })
//         .code(200);
//     } else if (user == "Session expired") {
//       return res
//         .response({
//           code: 401,
//           status: "error",
//           message: user,
//         })
//         .code(200);
//     } else {
//       return res
//         .response({
//           code: 403,
//           status: "error",
//           message: "You dont have permission for this action.",
//         })
//         .code(200);
//     }
//   } catch (error) {
//     console.error(error);
//     return res
//       .response({
//         code: 500,
//         status: "error",
//         message: "Something went wrong",
//       })
//       .code(200);
//   }
// };

const editProduct = async (req, res) => {
  console.log("req.headers", req.headers);
  console.log("req.payload", req.payload);

  const transact = await sequelize.transaction(); // Start a transaction
  try {
    const {
      product_name,
      product_desc,
      product_id,
      product_brand_id,
      category_id,
      sub_category_id,
      super_sub_category_id,
      minimum_order,
      default_price,
      stock,
      pre_order_stock,
      discount_type,
      discount,
      tax_type,
      tax_rate,
      product_type,
      car_brand_id,
      car_model_id,
      start_year,
      end_year,
      has_exchange_policy,
      exchange_policy,
      has_cancellation_policy,
      cancellation_policy,
      quantity,
      weight,
      has_warranty,
      warranty,
      image_count,
      features_associations,
      removeData,
      pre_order_limit,
      estd_pre_order_processing_time,
      pre_order_availability,
    } = req.payload;

    let combinations = null;
    if (req.payload.combinations) {
      combinations = JSON.parse(req.payload.combinations);
    }

    const user = await checkToken(
      req.headers["Authorization"]
        ? req.headers["Authorization"]
        : req.headers.authorization
    );

    if (user.role === "ADMIN" && user.application === "kardify") {
      const existingProduct = await Products.findOne({
        where: {
          id: product_id,
        },
      });

      if (!existingProduct) {
        await transact.rollback(); // Rollback transaction
        return res
          .response({
            code: 404,
            status: "error",
            message: "Product not found",
          })
          .code(200);
      }

      if (existingProduct.product_name !== product_name) {
        const productWithSameName = await Products.findOne({
          where: {
            product_name,
          },
        });

        if (productWithSameName && productWithSameName.id !== product_id) {
          await transact.rollback(); // Rollback transaction
          return res
            .response({
              code: 409,
              status: "error",
              message: "Product with the same name already exists",
            })
            .code(200);
        }
      }

      // Update the existing product
      await Products.update(
        {
          product_name,
          product_desc,
          product_brand_id,
          category_id,
          sub_category_id,
          super_sub_category_id,
          minimum_order,
          default_price,
          stock,
          discount_type,
          discount,
          tax_type,
          tax_rate,
          product_type,
          car_brand_id,
          car_model_id,
          start_year,
          end_year,
          pre_order_stock,
          has_exchange_policy,
          exchange_policy,
          has_cancellation_policy,
          cancellation_policy,
          quantity,
          weight: typeof weight === "number" ? weight : null,
          has_warranty,
          warranty,
          pre_order_limit,
          estd_pre_order_processing_time,
          pre_order_availability,
        },
        { 
          where: {
            id: product_id
          },
          transaction: transact 
        }
      );

      if (removeData) {
        const remnove_list = JSON.parse(removeData);
        await ProductImages.destroy({
          where: {
            product_id,
            id: {
              [Op.in]: remnove_list,
            },
          },
        });
      }

      // Handle image uploads
      if (image_count) {
        const newImages = [];
        for (let i = 1; i <= image_count; i++) {
          try {
            const { file_url } = await uploadFile(
              req,
              req.payload[`image_${i}`],
              "uploads/products/"
            );
            newImages.push({ image_url: file_url, product_id });
          } catch (error) {
            console.error(`Error uploading image ${i}:`, error);
          }
        }
        await ProductImages.bulkCreate(newImages, { transaction: transact });
      }
      // Handle combinations
      if (combinations) {
        const combinationIds = [];
        const combinations_list = await Combinations.findAll({
          where: {
            product_id: product_id,
          },
          raw: true
        })
        for (const combination of combinations) {
          const filter = await Promise.all(combination.combinations.map(e => e.attribute_value))
          console.log(filter)
          let existingCombination = null
          for (let combo of combinations_list) {
            const attributes = await AttributeCombinations.findAll({
              where: {
                combination_id: combo.id,
                attribute_value: {
                  [Op.in]: filter
                }
              },
              raw: true
            })
            console.log('flag', filter, attributes);
            if (filter.length == attributes.length) {
              existingCombination = combo
              break
            }
          }
          // findOne({
          //   where: {
          //     // combination: combination.combination_name,
              // product_id: product_id,
          //   },
          //   include: [
          //     {
          //       model: AttributeCombinations,
          //       where: {
          //         attribute_value: {
          //           [Op.in]: filter
          //         }
          //       },
          //       required: true
          //     }
          //   ],
          //   // transaction: transact,
          // });
          console.log("existingCombination", existingCombination)
          
          let update = null;

          if (existingCombination) {
            await Combinations.update(
              {
                price: combination.price,
                stock: combination.stock,
                pre_order_stock: combination.pre_order_stock,
                pre_order_limit: combination.pre_order_limit
                ? combination.pre_order_limit
                : null,
              },
              { 
                where: {
                  id: existingCombination.id
                },
                transaction: transact 
              }
              );
              console.log(`Updating ${existingCombination.id}`)
              update = existingCombination
            } else {
              update = await Combinations.create(
                {
                  price: combination.price,
                  stock: combination.stock,
                  pre_order_stock: combination.pre_order_stock,
                  product_id: product_id,
                  combination: combination.combination_name,
                  pre_order_limit: combination.pre_order_limit
                  ? combination.pre_order_limit
                  : null,
                },
                { transaction: transact }
              );
              console.log(`Creating ${update.id}`)
          }
          console.log(update.id)

          combinationIds.push(update.id);

          for (const attributeCombination of combination.combinations) {
            const existingAttributeCombination =
              await AttributeCombinations.findOne({
                where: {
                  combination_id: update.id,
                  attribute_id: attributeCombination.attribute_id,
                },
                transaction: transact,
              });
            if (!existingAttributeCombination) {
              await AttributeCombinations.create(
                {
                  combination_id: update.id,
                  attribute_id: attributeCombination.attribute_id,
                  attribute_value: attributeCombination.attribute_value,
                },
                { transaction: transact }
              );
            }
          }
        }

        // Delete combinations that are not in the updated list
        // await Combinations.destroy({
        //   where: {
        //     product_id: product_id,
        //     id: {
        //       [Op.notIn]: combinationIds,
        //     },
        //   },
        //   transaction: transact,
        // });

        // await AttributeCombinations.destroy({
        //   where: {
        //     combination_id: {
        //       [Op.notIn]: combinationIds,
        //     },
        //   },
        //   transaction: transact,
        // });
      }

      // Handle features associations
      if (features_associations && features_associations.length > 0) {
        const features_combination = JSON.parse(
          req.payload.features_associations
        );
        await FeaturesAssociations.destroy({
          where: { product_id: product_id },
          transaction: transact,
        });

        const data = features_combination.map((feature) => {
          return FeaturesAssociations.create(
            {
              product_id: product_id,
              feature_id: feature.id,
            },
            { transaction: transact }
          );
        });

        await Promise.all(data);
      }
      console.log('commiting')
      await transact.commit(); // Commit the transaction

      return res
        .response({
          code: 200,
          status: "success",
          message: "Product updated successfully",
          product: existingProduct,
        })
        .code(200);
    } else if (user == "Session expired") {
      await transact.rollback();
      return res
        .response({
          code: 401,
          status: "error",
          message: user,
        })
        .code(200);
    } else {
      await transact.rollback();
      return res
        .response({
          code: 403,
          status: "error",
          message: "You dont have permission for this action.",
        })
        .code(200);
    }
  } catch (error) {
    await transact.rollback(); // Rollback transaction in case of error
    console.error(error);
    return res
      .response({
        code: 500,
        status: "error",
        message: "Something went wrong",
      })
      .code(200);
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { product_id } = req.query;

    const user = await checkToken(
      req.headers["Authorization"]
        ? req.headers["Authorization"]
        : req.headers.authorization
    );

    if (user.role === "ADMIN" && user.application === "kardify") {
      const existingProduct = await Products.findByPk(product_id);

      if (!existingProduct) {
        return res
          .response({
            code: 404,
            status: "error",
            message: "Product not found",
          })
          .code(200);
      }

      await existingProduct.destroy();

      return res
        .response({
          code: 200,
          status: "success",
          message: "Product deleted successfully",
        })
        .code(200);
    } else if (user == "Session expired") {
      return res
        .response({
          code: 401,
          status: "error",
          message: user,
        })
        .code(200);
    } else {
      return res
        .response({
          code: 403,
          status: "error",
          message: "You dont have permission for this action.",
        })
        .code(200);
    }
  } catch (error) {
    console.error(error);
    return res
      .response({
        code: 500,
        status: "error",
        message: "Something went wrong",
      })
      .code(200);
  }
};

// const toggleProductStatus = async (req, res) => {
//   try {
//     let { product_id, status } = req.payload;

//     const user = await checkToken(
//       req.headers["Authorization"]
//         ? req.headers["Authorization"]
//         : req.headers.authorization
//     );
//     if (user.role === "ADMIN" && user.application === "kardify") {
//       if (!Number.isInteger(product_id) || product_id <= 0) {
//         return res
//           .response({
//             code: 400,
//             status: "error",
//             message: "Invalid product_id",
//           })
//           .code(200);
//       }

//       const existingProduct = await Products.findOne({
//         where: {
//           id: product_id,
//         },
//       });

//       if (!existingProduct) {
//         return res
//           .response({
//             code: 404,
//             status: "error",
//             message: "Product not found",
//           })
//           .code(200);
//       }
//       console.log(existingProduct, "existing-product-------");
//       switch (status) {
//         case "popular":
//           existingProduct = { ...existingProduct, is_popular: true };
//           break;
//         case "latest":
//           existingProduct = { ...existingProduct, is_latest: true };
//           break;
//         case "topDeals":
//           existingProduct = { ...existingProduct, is_topDeals: true };
//           break;
//         case "bestSelling":
//           existingProduct = { ...existingProduct, is_bestSelling: true };
//           break;
//         // case "features":
//         //   existingProduct = { ...existingProduct, is_features: true };
//         //   break;
//         default:
//           console.log(status, "status");
//         //  return res
//         //   .response({
//         //     code: 404,
//         //     status: "error",
//         //     message: "query not found",
//         //   })
//         //   .code(200);
//       }

//       existingProduct.is_features = !existingProduct.is_features;

//       await existingProduct.save();

//       return res
//         .response({
//           code: 200,
//           status: "success",
//           message: "Status changed successfully",
//           category: existingProduct,
//         })
//         .code(200);
//     } else if (user == "Session expired") {
//       return res
//         .response({
//           code: 401,
//           status: "error",
//           message: user,
//         })
//         .code(200);
//     } else {
//       return res
//         .response({
//           code: 403,
//           status: "error",
//           message: "You dont have permission for this action.",
//         })
//         .code(200);
//     }
//   } catch (error) {
//     console.error(error);
//     return res
//       .response({
//         code: 500,
//         status: "error",
//         message: "Something went wrong",
//       })
//       .code(200);
//   }
// };\

const toggleProductStatus = async (req, res) => {
  try {
    const { product_id, status } = req.payload;

    const user = await checkToken(
      req.headers["Authorization"]
        ? req.headers["Authorization"]
        : req.headers.authorization
    );

    if (user.role === "ADMIN" && user.application === "kardify") {
      const productId = parseInt(product_id, 10);
      if (!Number.isInteger(productId) || productId <= 0) {
        return res
          .response({
            code: 400,
            status: "error",
            message: "Invalid product_id",
          })
          .code(400);
      }

      const existingProduct = await Products.findOne({
        where: {
          id: productId,
        },
      });

      if (!existingProduct) {
        return res
          .response({
            code: 404,
            status: "error",
            message: "Product not found",
          })
          .code(404);
      }

      switch (status) {
        case "popular":
          existingProduct.is_popular = !existingProduct.is_popular;
          break;
        case "latest":
          existingProduct.is_latest = !existingProduct.is_latest;
          break;
        case "topDeals":
          existingProduct.is_topDeals = !existingProduct.is_topDeals;
          break;
        case "bestSelling":
          existingProduct.is_bestSelling = !existingProduct.is_bestSelling;
          break;
        case "features":
          existingProduct.is_features = !existingProduct.is_features;
          break;
        case "active":
          existingProduct.status = !existingProduct.status;
          existingProduct.is_bestSelling = false;
          existingProduct.is_features = false;
          existingProduct.is_topDeals = false;
          existingProduct.is_latest = false;
          existingProduct.is_popular = false;
          break;
        default:
          return res
            .response({
              code: 400,
              status: "error",
              message: "Invalid status query parameter",
            })
            .code(400);
      }

      await existingProduct.save();

      return res
        .response({
          code: 200,
          status: "success",
          message: "Status changed successfully",
          product: existingProduct,
        })
        .code(200);
    } else if (user === "Session expired") {
      return res
        .response({
          code: 401,
          status: "error",
          message: user,
        })
        .code(401);
    } else {
      return res
        .response({
          code: 403,
          status: "error",
          message: "You don't have permission for this action.",
        })
        .code(403);
    }
  } catch (error) {
    console.error(error);
    return res
      .response({
        code: 500,
        status: "error",
        message: "Something went wrong",
      })
      .code(500);
  }
};

const fetchProductsByStatus = async (req, res) => {
  try {
    const { status } = req.query;

    let whereClause = {};

    switch (status) {
      case "TopSelling":
        whereClause = { is_bestSelling: true };
        break;
      case "Featured":
        whereClause = { is_features: true };
        break;
      case "Latest":
        whereClause = { is_latest: true };
        break;
      case "Bestselling":
        whereClause = { is_bestSelling: true };
        break;
      case "Deals":
        whereClause = { is_topDeals: true };
        break;
      case "Popular":
        whereClause = { is_popular: true };
        break;
      default:
        return res
          .response({
            code: 400,
            status: "error",
            message: "Invalid status query parameter",
          })
          .code(400);
    }

    const products = await Products.findAll({
      where: whereClause,
      attributes: {
        include: [
          // Subquery to calculate average rating
          [
            sequelize.literal(`(
              SELECT ROUND(AVG(rating), 1)
              FROM customer_review
              WHERE customer_review.product_id = products.id
            )`),
            "average_rating",
          ],
          // Subquery to count the total number of ratings
          [
            sequelize.literal(`(
              SELECT COUNT(*)
              FROM customer_review
              WHERE customer_review.product_id = products.id
            )`),
            "total_ratings",
          ],
        ],
      },
      include: [
        {
          model: ProductImages,
          as: "images",
        },
        {
          model: CustomerReview,
          required: false,
          where: {
            status: "approved",
          }
        },
        {
          model: Combinations,
          order: [['id', 'ASC']],
          required: false,
          include: [
            {
              model: AttributeCombinatios,
              required: true,
              include: [
                {
                  model: ProductAttributes,
                  required: true,
                },
              ],
            },
          ],
        },
      ],
    });

    return res
      .response({
        code: 200,
        status: "success",
        message: "Products fetched successfully",
        products: products,
      })
      .code(200);
  } catch (error) {
    console.error(error);
    return res
      .response({
        code: 500,
        status: "error",
        message: "Something went wrong",
      })
      .code(500);
  }
};

const fetchRecommendedProducts = async (req, res) => {
  try {
    const { product_id } = req.query;

    const currentProduct = await Products.findOne({
      where: { id: product_id, status: true },
    });

    if (!currentProduct) {
      return res
        .response({
          code: 400,
          status: "error",
          message: "Product not found",
        })
        .code(200);
    }

    const whereCondition = {
      id: { [Op.ne]: product_id },
      status: true,
      [Op.or]: [
        { category_id: currentProduct.category_id },
        { sub_category_id: currentProduct.sub_category_id },
      ],
    };

    const recommendedProducts = await Products.findAll({
      where: whereCondition,
      order: [["createdAt", "DESC"]],
      include: [
        { model: Categories, required: true },
        { model: SubCategories, required: false },
        { model: SuperSubCategories, required: false },
        { model: CarBrands, required: false },
        { model: ProductBrand, required: false },
        { model: ProductImages, required: false, as: "images" },
        {
          model: Combinations,
          required: false,
          include: [{ model: AttributeCombinations, required: true }],
        },
      ],
    });

    return res
      .response({
        code: 201,
        status: "success",
        message: "Recommended products fetched successfully",
        products: recommendedProducts,
      })
      .code(200);
  } catch (error) {
    console.log(error);
    return res
      .response({
        code: 500,
        status: "error",
        message: "Something went wrong",
      })
      .code(200);
  }
};

module.exports = {
  fetchProducts,
  fetchProductCustomer,
  addProduct,
  uploadImagesHandler,
  addBulkProduct,
  editProduct,
  deleteProduct,
  toggleProductStatus,
  fetchProductsByStatus,
  fetchRecommendedProducts,
};
