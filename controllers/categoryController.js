const mongoose = require("mongoose");
const Model = require("../models/index");
const HTTPError = require("../utils/CustomError");
const CategoryHelper = require("../helper/category.helper");
const Status = require("../status");
const catchAsync = require("../utils/catchAsync");
const cloudUpload = require("../cloudinary");
module.exports = {
  // Retrieve Category user by CategoryId
  getCategory: catchAsync(async (req, res, next) => {
    console.log("findCategoryById is called");
    try {
      var CategoryId = req.params.id;
      var result = await CategoryHelper.findCategoryById(CategoryId);

      var message = "CategoryId found successfully";
      if (result == null) {
        message = "CategoryId does not exist.";
      }
      res.ok(message, result);
    } catch (error) {
      throw new HTTPError(Status.INTERNAL_SERVER_ERROR, error);
    }
  }),

  // Create a new Category
  createCategory: catchAsync(async (req, res, next) => {
    console.log("createCategory is called");
    try {
      const { categoryName, parentId } = req.body;
  
      let parentCategory = null;
  
      if (parentId) {
        parentCategory = await Model.Category.findById(parentId);
  
        if (!parentCategory) {
          return res.status(404).json({ message: "Parent category not found" });
        }
      }
  
      const newCategory = new Model.Category({
        categoryName,
        parentCategory: parentId || null,
      });
  
      const savedCategory = await newCategory.save();
  
  
      res.json(savedCategory);
    } catch (error) {
      console.error(error);
      res.status(500).send(error?.message, "Server Error");
    }
  }),

  // Get all Category users with full details
  getAllCategory: catchAsync(async (req, res, next) => {
    console.log("Categorydetails is called");
    try {
      // Fetch all categories without pagination and populate parentCategory
      if(req.query){
        
        let parentCategory = req.query.parentCategory
        let subcategories = await Model.Category.find({ isDeleted: false ,parentCategory:parentCategory }).select("_id categoryName parentCategory")
        .populate({
          path: "parentCategory",
          select: "_id categoryName",
        })
        .sort("-_id")
        const CategorySize = subcategories.length;

      const result = {
        Category: subcategories,
        count: CategorySize,
      };

      // Check if no categories are found
    
      if (CategorySize === 0) {
        // Return an empty array as the result
        return res.ok(
          "No subcategories found",
          []
        );
      }
      // Return a success response with the result
      return res.ok(
        "subCategorydetails found successfully",
        result,
      );
      }

      const parentCategories = await Model.Category.find({ isDeleted: false,parentCategory:null })
        .sort("-_id")
        .select("_id categoryName ")
      const CategorySize = parentCategories.length;

      const result = {
        Category: parentCategories,
        count: CategorySize,
      };

      // Check if no categories are found
    

      // Return a success response with the result
      return res.ok(
        "Categorydetails found successfully",
        result
      );
    } catch (error) {
      throw new HTTPError(Status.INTERNAL_SERVER_ERROR, error);
    }
  }),

  // Update a Category user
  updateCategory: catchAsync(async (req, res, next) => {
    // Get the Category user data from the request body
    var CategoryUserData = req.body;
    try {
      // Update the Category user with the updated data
      var result = await Model.Category.findOneAndUpdate(
        { _id: CategoryUserData.categoryId },
        CategoryUserData,
        {
          new: true,
        }
      );
      var message = "Category  status updated successfully";
      res.ok(message, result);
    } catch (err) {
      throw new HTTPError(Status.INTERNAL_SERVER_ERROR, err);
    }
  }),

  // Delete a Category user
  declineCategory: catchAsync(async (req, res, next) => {
    var categoryId = req.params.id;
    try {
      const CategoryUser = await Model.Category.findOneAndDelete(categoryId);
      if (!CategoryUser)
        return res.badRequest("Category  Not Found in our records");
      var message = "Category user deleted successfully";
      res.ok(message, CategoryUser);
    } catch (err) {
      throw new HTTPError(Status.INTERNAL_SERVER_ERROR, err);
    }
  }),
};
