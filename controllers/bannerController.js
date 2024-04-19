const mongoose = require("mongoose");
const Model = require("../models/index");
const HTTPError = require("../utils/CustomError");
const BannerHelper = require("../helper/banner.helper");
const Status = require("../status");
const catchAsync = require("../utils/catchAsync");
const cloudUpload = require("../cloudinary");
module.exports = {
  // Retrieve Banner user by bannerId
  getBanner: catchAsync(async (req, res, next) => {
    console.log("findBannerById is called");
    try {
      var bannerId = req.params.id;
      var result = await BannerHelper.findBannerById(bannerId);

      var message = "bannerId found successfully";
      if (result == null) {
        message = "bannerId does not exist.";
      }
      res.ok(message, result);
    } catch (error) {
      throw new HTTPError(Status.INTERNAL_SERVER_ERROR, error);
    }
  }),

  createBanner: catchAsync(async (req, res, next) => {
    console.log("createBanner is called");
    try {
      var BannerData = req.body; 
    //   BannerData.images = [];
      BannerData.videos = [];
  
      // Upload description images
      const imageFiles = req.files.images;
      if (imageFiles && Array.isArray(imageFiles)) {
        for (const imageFile of imageFiles) {
          const { path } = imageFile;
          const newPath = await cloudUpload.cloudinaryUpload(path);
          BannerData.images.push(newPath);
        }
      }
  
      // Upload description videos
      const videoFiles = req.files.videos;
      if (videoFiles && Array.isArray(videoFiles)) {
        for (const videoFile of videoFiles) {
          const { path } = videoFile;
          const newPath = await cloudUpload.cloudinaryUpload(path);
          BannerData.videos.push(newPath);
        }
      }
  
      var result = await BannerHelper.createBanner(BannerData);
  
      var message = "Banner created successfully";
      if (result == null) {
        message = "Banner does not exist.";
      }
  
      res.ok(message, BannerData);
    } catch (error) {
      throw new HTTPError(Status.INTERNAL_SERVER_ERROR, error.message);
    }
  }),
  
  // Get all Banner users with full details
  getAllBanner: catchAsync(async (req, res, next) => {
    console.log("Bannerdetails is called");
    try {
      // var BannerData = req.body;

      // var result = await BannerHelper.getBannerWithFullDetails(BannerData.sortproperty, BannerData.sortorder, BannerData.offset, BannerData.limit, BannerData.query);
      const pageNumber = parseInt(req.query.pageNumber) || 0;
      const limit = parseInt(req.query.limit) || 10;
      var message = "Bannerdetails found successfully";
      var Banners = await Model.Banner.find()
        .skip(pageNumber * limit - limit)
        .limit(limit)
        .sort("-_id");
      const BannerSize = Banners.length;
      const result = {
        Banner: Banners,
        count: BannerSize,
        limit: limit,
      };
      if (result == null) {
        message = "Bannerdetails does not exist.";
      }
      var message = "Banner  details find successfully";
      res.ok(message, result);
    } catch (error) {
      throw new HTTPError(Status.INTERNAL_SERVER_ERROR, error);
    }
  }),

  // Update a Banner user
  updateBanner: catchAsync(async (req, res, next) => {
    // Get the Banner user data from the request body
    var BannerUserData = req.body;
    try {
      // Update the Banner user with the updated data
      var result = await Model.Banner.findOneAndUpdate(
        { _id: BannerUserData.bannerId },
        BannerUserData,
        {
          new: true,
        }
      );
      var message = "Banner  status updated successfully";
      res.ok(message, result);
    } catch (err) {
      throw new HTTPError(Status.INTERNAL_SERVER_ERROR, err);
    }
  }),

  // Delete a Banner user
  declineBanner: catchAsync(async (req, res, next) => {
    var bannerId = req.params.id;
    try {
      const BannerUser = await Model.Banner.findOneAndDelete(bannerId);
      if (!BannerUser)
        return res.badRequest("Banner  Not Found in our records");
      var message = "Banner user deleted successfully";
      res.ok(message, BannerUser);
    } catch (err) {
      throw new HTTPError(Status.INTERNAL_SERVER_ERROR, err);
    }
  }),
};
