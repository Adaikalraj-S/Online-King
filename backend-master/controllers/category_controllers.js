const jwt = require("jsonwebtoken");
const ejs = require("ejs");
const { uploadFile } = require("../helpers");
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
const { Categories, SubCategories, SuperSubCategories } = require("../models");
const { Op } = require("sequelize");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

const getCategories = async (req, res) => {
  try {
    const { id, category_name } = req.query;
    let filter = {};
    if (id)
      filter = {
        ...filter,
        id,
      };
    if (category_name)
      filter = {
        ...filter,
        category_name,
      };

    const user = await checkToken(
      req.headers["Authorization"]
        ? req.headers["Authorization"]
        : req.headers.authorization
    );
    if (user.role === "ADMIN" && user.application === "kardify") {
      const categories = await Categories.findAll({
        where: filter,
        raw: true,
        order: [["createdAt", "DESC"]],
      });
      return res
        .response({
          code: 200,
          message: "Categories fetched successfully",
          categories,
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
    return res
      .response({
        code: 401,
        status: "error",
        message: error.message,
      })
      .code(200);
  }
};

const getCategoriesCustomers = async (req, res) => {
  try {
    const { id, category_name } = req.query;
    let filter = {
      status: true,
    };
    if (id)
      filter = {
        ...filter,
        id,
      };
    if (category_name)
      filter = {
        ...filter,
        category_name,
      };

    const categories = await Categories.findAll({
      where: filter,
      include: [
        {
          model: SubCategories,
          required: false,
          include: [
            {
              model: SuperSubCategories,
              required: false,
            },
          ],
        },
      ],
      order: [["id", "DESC"]],
    });
    return res
      .response({
        code: 200,
        message: "Categories fetched successfully",
        categories,
      })
      .code(200);
  } catch (error) {
    return res
      .response({
        code: 401,
        status: "error",
        message: error.message,
      })
      .code(200);
  }
};

const addCategories = async (req, res) => {
  try {
    const { category_name, image } = req.payload;
    const user = await checkToken(
      req.headers["Authorization"]
        ? req.headers["Authorization"]
        : req.headers.authorization
    );

    if (user.role === "ADMIN" && user.application === "kardify") {
      const existingCategory = await Categories.findOne({
        where: {
          category_name,
        },
        raw: true,
      });

      if (existingCategory) {
        return res
          .response({
            code: 409,
            status: "error",
            message: `${category_name} already exists`,
          })
          .code(200);
      }

      if (image) {
        const { file_url } = await uploadFile(
          req,
          image,
          "uploads/categories/"
        );

        const newCategory = await Categories.create({
          category_name,
          image_url: file_url,
          status: true,
        });

        return res
          .response({
            code: 201,
            status: "success",
            message: "Category created successfully",
            category: newCategory,
          })
          .code(200);
      } else {
        const file_url = "/uploads/default/default.png";
        const newCategory = await Categories.create({
          category_name,
          image_url: file_url,
          status: true,
        });
        return res.response({
          code: 201,
          status: "success",
          message: "Category created successfully",
          category: newCategory,
        });
      }
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

const editCategories = async (req, res) => {
  try {
    const { category_id, category_name, image } = req.payload;
    const user = await checkToken(
      req.headers["Authorization"]
        ? req.headers["Authorization"]
        : req.headers.authorization
    );

    if (user.role === "ADMIN" && user.application === "kardify") {
      const existingCategory = await Categories.findOne({
        where: {
          id: category_id,
        },
      });

      if (!existingCategory) {
        return res
          .response({
            code: 404,
            status: "error",
            message: "Category not found",
          })
          .code(200);
      }

      const categoryWithSameName = await Categories.findOne({
        where: {
          category_name,
          id: {
            [Op.not]: category_id,
          },
        },
      });

      if (categoryWithSameName) {
        return res
          .response({
            code: 409,
            status: "error",
            message: `${category_name} already exists`,
          })
          .code(200);
      }

      existingCategory.category_name = category_name;
      if (image) {
        const { file_url } = await uploadFile(
          req,
          image,
          "uploads/categories/"
        );
        existingCategory.image_url = file_url;
      } else {
        existingCategory.image_url = existingCategory.image_url;
      }

      await existingCategory.save();
      console.log(res);
      return res
        .response({
          code: 200,
          status: "success",
          message: "Category updated successfully",
          category: existingCategory,
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

const deleteCategories = async (req, res) => {
  try {
    const { category_id } = req.query;

    const user = await checkToken(
      req.headers["Authorization"]
        ? req.headers["Authorization"]
        : req.headers.authorization
    );

    if (user.role === "ADMIN" && user.application === "kardify") {
      if (!Number.isInteger(category_id) || category_id <= 0) {
        return res
          .response({
            code: 400,
            status: "error",
            message: "Invalid category_id",
          })
          .code(200);
      }

      // Check if the category to delete exists
      const existingCategory = await Categories.findOne({
        where: {
          id: category_id,
        },
      });

      if (!existingCategory) {
        return res
          .response({
            code: 404,
            status: "error",
            message: "Category not found",
          })
          .code(200);
      }

      // Delete the category from the database
      await existingCategory.destroy();

      return res
        .response({
          code: 200,
          message: "Category deleted successfully",
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

const toggleCategoryStatus = async (req, res) => {
  try {
    const { category_id } = req.query;

    const user = await checkToken(
      req.headers["Authorization"]
        ? req.headers["Authorization"]
        : req.headers.authorization
    );
    if (user.role === "ADMIN" && user.application === "kardify") {
      if (!Number.isInteger(category_id) || category_id <= 0) {
        return res
          .response({
            code: 400,
            status: "error",
            message: "Invalid category_id",
          })
          .code(200);
      }

      const existingCategory = await Categories.findOne({
        where: {
          id: category_id,
        },
      });

      if (!existingCategory) {
        return res
          .response({
            code: 404,
            status: "error",
            message: "Category not found",
          })
          .code(200);
      }

      // Toggle the category status (assuming you have a boolean 'status' field)
      existingCategory.status = !existingCategory.status;

      // Save the updated category to the database
      await existingCategory.save();

      return res
        .response({
          code: 200,
          status: "success",
          message: "Category status toggled successfully",
          category: existingCategory,
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

module.exports = {
  getCategories,
  getCategoriesCustomers,
  addCategories,
  editCategories,
  deleteCategories,
  toggleCategoryStatus,
};
