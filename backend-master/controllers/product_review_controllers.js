const {
  CustomerReview,
  CustomerReviewImage,
  Products,
  Customers,
  Dealers,
} = require("../models");
const { sequelize } = require("../config");
const { uploadFile, checkToken } = require("../helpers");

const fetchProductReviewsByCustomer = async (req, h) => {
  try {
    const { productId } = req.query;

    // Fetch product reviews by customer logic
    const reviews = await CustomerReview.findAll({
      order: [["createdAt", "DESC"]],
      where: { product_id: productId, status: 'approved' },
      include: [
        {
          model: Customers,
          as: "customer",
          attributes: ["fullname"],
          required: false, // Allows the customer to be null
        },
        {
          model: Dealers,
          as: "dealer",
          attributes: ["fullname"],
          required: false, // Allows the dealer to be null
        },
        {
          model: CustomerReviewImage,
          attributes: ["image_url"],
        },
        {
          model: Products,
          attributes: ["product_name"],
        },
      ],
    });

    // Format reviews to include product name and user name
    const formattedReviews = reviews.map((review) => ({
      id: review.id,
      review_heading: review.review_heading,
      review_text: review.review_text,
      review_stars: review.rating,
      status: review.status,
      createdAt: review.createdAt,
      user: review.customer
        ? review.customer.fullname
        : review.dealer
        ? review.dealer.fullname
        : "Unknown",
      product_id: review.product_id,
      product_name: review.product.product_name,
      images: review.CustomerReviewImages.map((image) => image.image_url),
    }));

    return h
      .response({
        code: 200,
        status: "success",
        data: formattedReviews,
      })
      .code(200);
  } catch (error) {
    console.error(error);
    return h
      .response({
        code: 500,
        status: "error",
        message: "Failed to fetch reviews",
      })
      .code(500);
  }
};

const fetchProductReviewsByAdmin = async (req, h) => {
  try {
    // Fetch product reviews by admin
    const reviews = await CustomerReview.findAll({
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: Customers,
          as: "customer",
          attributes: ["fullname"],
          required: false, // Allows the customer to be null
        },
        {
          model: Dealers,
          as: "dealer",
          attributes: ["fullname"],
          required: false, // Allows the dealer to be null
        },
        {
          model: CustomerReviewImage,
          attributes: ["image_url"],
        },
        {
          model: Products,
          attributes: ["product_name"],
        },
      ],
    });

    // Format reviews to include product name and user name
    const formattedReviews = reviews.map((review) => ({
      id: review.id,
      review_heading: review.review_heading,
      review_text: review.review_text,
      review_stars: review.rating,
      status: review.status,
      createdAt: review.createdAt,
      user: review.customer
        ? review.customer.fullname
        : review.dealer
        ? review.dealer.fullname
        : "Unknown",
      product_id: review.product_id,
      product_name: review?.product?.product_name,
      images: review.CustomerReviewImages.map((image) => image.image_url),
    }));

    return h
      .response({
        code: 200,
        status: "success",
        data: formattedReviews,
      })
      .code(200);
  } catch (error) {
    console.error(error);
    return h
      .response({
        code: 500,
        status: "error",
        message: "Failed to fetch reviews",
      })
      .code(500);
  }
};

const addProductsReviewByCustomer = async (req, h) => {
  const transact = await sequelize.transaction();
  try {
    const user = await checkToken(
      req.headers["Authorization"]
        ? req.headers["Authorization"]
        : req.headers.authorization
    );

    if (
      user.role === "CUSTOMER" ||
      (user.role === "DEALER" && user.application === "kardify")
    ) {
      const { productId, rating, reviewText, reviewHeading, image_count } =
        req.payload; // Assuming 'photos' is an array of files
      console.log(productId, "product_id");
      // Add product review logic
      const newReview = await CustomerReview.create(
        {
          product_id: productId,
          user_id: user.id,
          rating,
          review_text: reviewText,
          review_heading: reviewHeading,
          status: "pending",
        },
        { transaction: transact }
      );

      if (image_count) {
        let image_url_list = [];
        for (let i = 0; i < image_count; i++) {
          try {
            const { file_url } = await uploadFile(
              req,
              req.payload[`photos${i + 1}`],
              "uploads/reviews/"
            );
            await new Promise((resolve) => setTimeout(resolve, 10));
            image_url_list.push({
              review_id: newReview.id,
              image_url: file_url,
            });
          } catch (error) {
            console.error(`Error uploading image ${i + 1}:`, error);
          }
        }
        // Create the CustomerReviewImage entries after all images have been processed
        try {
          await CustomerReviewImage.bulkCreate(image_url_list, {
            transaction: transact,
          });
        } catch (error) {
          console.error("Error creating CustomerReviewImage entries:", error);
          throw error; // Re-throw the error to ensure the transaction is rolled back
        }
      }

      await transact.commit();

      return h
        .response({
          code: 201,
          status: "success",
          message: "Review added successfully",
        })
        .code(201);
    } else if (user == "Session expired") {
      await transact.rollback();
      return h
        .response({
          code: 401,
          status: "error",
          message: user,
        })
        .code(401);
    } else {
      await transact.rollback();
      return h
        .response({
          code: 403,
          status: "error",
          message: "You dont have permission for this action.",
        })
        .code(403);
    }
  } catch (error) {
    await transact.rollback();
    console.error(error);
    return h
      .response({
        code: 500,
        status: "error",
        message: "Failed to add review",
      })
      .code(500);
  }
};

const acceptProductReviewByAdmin = async (req, h) => {
  const transact = await sequelize.transaction();
  try {
    // Authentication
    const user = await checkToken(
      req.headers["Authorization"]
        ? req.headers["Authorization"]
        : req.headers.authorization
    );
    if (user.role === "ADMIN" && user.application === "kardify") {
      // Proceed if the user is an admin for the application
      const { reviewId } = req.payload;

      // Accept product review by admin logic
      const review = await CustomerReview.findByPk(reviewId);
      if (review) {
        review.status = "approved";
        await review.save({ transaction: transact });
        await transact.commit();
        return h
          .response({
            code: 200,
            status: "success",
            data: review,
          })
          .code(200);
      } else {
        await transact.rollback();
        return h
          .response({
            code: 404,
            status: "error",
            message: "Review not found",
          })
          .code(404);
      }
    } else if (user == "Session expired") {
      await transact.rollback();
      return h
        .response({
          code: 401,
          status: "error",
          message: user,
        })
        .code(401);
    } else {
      await transact.rollback();
      return h
        .response({
          code: 403,
          status: "error",
          message: "You don't have permission for this action.",
        })
        .code(403);
    }
  } catch (error) {
    await transact.rollback();
    console.error(error);
    return h
      .response({
        code: 500,
        status: "error",
        message: "Failed to accept review",
      })
      .code(500);
  }
};

const declineProductReviewByAdmin = async (req, h) => {
  const transact = await sequelize.transaction();
  try {
    // Authentication
    const user = await checkToken(
      req.headers["Authorization"]
        ? req.headers["Authorization"]
        : req.headers.authorization
    );
    if (user.role === "ADMIN" && user.application === "kardify") {
      // Proceed if the user is an admin for the application
      const { reviewId } = req.payload;

      // Decline product review by admin logic
      const review = await CustomerReview.findByPk(reviewId);
      if (review) {
        review.status = "declined";
        await review.save({ transaction: transact });
        await transact.commit();
        return h
          .response({
            code: 200,
            status: "success",
            message: "Review declined",
          })
          .code(200);
      } else {
        await transact.rollback();
        return h
          .response({
            code: 404,
            status: "error",
            message: "Review not found",
          })
          .code(404);
      }
    } else if (user == "Session expired") {
      await transact.rollback();
      return h
        .response({
          code: 401,
          status: "error",
          message: user,
        })
        .code(401);
    } else {
      await transact.rollback();
      return h
        .response({
          code: 403,
          status: "error",
          message: "You don't have permission for this action.",
        })
        .code(403);
    }
  } catch (error) {
    await transact.rollback();
    console.error(error);
    return h
      .response({
        code: 500,
        status: "error",
        message: "Failed to delete review",
      })
      .code(500);
  }
};

const checkReviewStatus = async (req, h) => {
  try {
    const user = await checkToken(
      req.headers["Authorization"]
        ? req.headers["Authorization"]
        : req.headers.authorization
    );
    const { productId } = req.query;

    // Fetch review status logic
    const review = await CustomerReview.findOne({
      where: {
        product_id: productId,
        user_id: user.id,
      },
      order: [["createdAt", "DESC"]],
      attributes: ["status"],
    });

    if (review) {
      return h
        .response({
          code: 200,
          status: "success",
          data: { status: review.status },
        })
        .code(200);
    } else {
      return h
        .response({
          code: 404,
          status: "error",
          message: "Review not found",
        })
        .code(404);
    }
  } catch (error) {
    console.error(error);
    return h
      .response({
        code: 500,
        status: "error",
        message: "Failed to check review status",
      })
      .code(500);
  }
};

module.exports = {
  fetchProductReviewsByCustomer,
  fetchProductReviewsByAdmin,
  addProductsReviewByCustomer,
  acceptProductReviewByAdmin,
  declineProductReviewByAdmin,
  checkReviewStatus,
};
