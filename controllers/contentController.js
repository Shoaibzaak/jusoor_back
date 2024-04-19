const mongoose = require("mongoose");
const Model = require("../models/index");
const HTTPError = require("../utils/CustomError");
const ContentHelper = require("../helper/content.helper");
const Status = require("../status");
const catchAsync = require("../utils/catchAsync");
const cloudUpload = require("../cloudinary");
module.exports = {
  // Retrieve Content user by ContentId
  getContent: catchAsync(async (req, res, next) => {
    console.log("findContentById is called");
    try {
      var ContentId = req.params.id;
      var result = await ContentHelper.findContentById(ContentId);

      var message = "ContentId found successfully";
      if (result == null) {
        message = "ContentId does not exist.";
      }
      res.ok(message, result);
    } catch (error) {
      throw new HTTPError(Status.INTERNAL_SERVER_ERROR, error);
    }
  }),

  createContent: catchAsync(async (req, res, next) => {
    console.log("createContent is called");
    try {
      var contentData = req.body; 
      contentData.descriptionImages = [];
      contentData.descriptionVideos = [];
  
      // Upload description images
      const imageFiles = req.files.descriptionImages;
      if (imageFiles && Array.isArray(imageFiles)) {
        for (const imageFile of imageFiles) {
          const { path } = imageFile;
          const newPath = await cloudUpload.cloudinaryUpload(path);
          contentData.descriptionImages.push(newPath);
        }
      }
  
      // Upload description videos
      const videoFiles = req.files.descriptionVideos;
      if (videoFiles && Array.isArray(videoFiles)) {
        for (const videoFile of videoFiles) {
          const { path } = videoFile;
          const newPath = await cloudUpload.cloudinaryUpload(path);
          contentData.descriptionVideos.push(newPath);
        }
      }
  
      // Upload primary image if provided
      if (req.files && req.files.primaryImage) {
        const primaryImages = req.files.primaryImage;
        const primaryImage = primaryImages[0];
        const { path } = primaryImage;
        const newPath = await cloudUpload.cloudinaryUpload(path);
        contentData.primaryImage = newPath;
      }
  
      // Upload audio if provided
      if (req.files && req.files.audio) {
        const audioFiles = req.files.audio;
        const audioFile = audioFiles[0];
        const { path } = audioFile;
        const newPath = await cloudUpload.cloudinaryUpload(path);
        contentData.audio = newPath;
      }
  
      var result = await ContentHelper.createContent(contentData);
  
      var message = "Content created successfully";
      if (result == null) {
        message = "Content does not exist.";
      }
  
      res.ok(message, contentData);
    } catch (error) {
      throw new HTTPError(Status.INTERNAL_SERVER_ERROR, error.message);
    }
  }),
  
  // Get all Content users with full details
  getAllContent: catchAsync(async (req, res, next) => {
    console.log("Contentdetails is called");
    try {
      // var ContentData = req.body;

      // var result = await ContentHelper.getContentWithFullDetails(ContentData.sortproperty, ContentData.sortorder, ContentData.offset, ContentData.limit, ContentData.query);
      const pageNumber = parseInt(req.query.pageNumber) || 0;
      const limit = parseInt(req.query.limit) || 10;
      var message = "Contentdetails found successfully";
      var Contents = await Model.Content.find()
        .skip(pageNumber * limit - limit)
        .limit(limit)
        .sort("-_id");
      const ContentSize = Contents.length;
      const result = {
        Content: Contents,
        count: ContentSize,
        limit: limit,
      };
      if (result == null) {
        message = "Contentdetails does not exist.";
      }
      var message = "Content  details find successfully";
      res.ok(message, result);
    } catch (error) {
      throw new HTTPError(Status.INTERNAL_SERVER_ERROR, error);
    }
  }),

  // Update a Content user
  updateContent: catchAsync(async (req, res, next) => {
    // Get the Content user data from the request body
    var ContentUserData = req.body;
    try {
      // Update the Content user with the updated data
      var result = await Model.Content.findOneAndUpdate(
        { _id: ContentUserData.contentId },
        ContentUserData,
        {
          new: true,
        }
      );
      var message = "Content  status updated successfully";
      res.ok(message, result);
    } catch (err) {
      throw new HTTPError(Status.INTERNAL_SERVER_ERROR, err);
    }
  }),

  // Delete a Content user
  declineContent: catchAsync(async (req, res, next) => {
    var ContentId = req.params.id;
    try {
      const ContentUser = await Model.Content.findOneAndDelete(ContentId);
      if (!ContentUser)
        return res.badRequest("Content  Not Found in our records");
      var message = "Content user deleted successfully";
      res.ok(message, ContentUser);
    } catch (err) {
      throw new HTTPError(Status.INTERNAL_SERVER_ERROR, err);
    }
  }),
};
