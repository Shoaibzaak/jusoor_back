const mongoose = require("mongoose");
const Model = require("../models/index");
const HTTPError = require("../utils/CustomError");
const QueryHelper = require("../helper/query.helper");
const Status = require("../status");
const catchAsync = require("../utils/catchAsync");
const cloudUpload = require("../cloudinary");
module.exports = {
  // Retrieve Query user by QueryId
  getQuery: catchAsync(async (req, res, next) => {
    console.log("findQueryById is called");
    try {
      var QueryId = req.params.id;
      var result = await QueryHelper.findQueryById(QueryId);

      var message = "QueryId found successfully";
      if (result == null) {
        message = "QueryId does not exist.";
      }
      res.ok(message, result);
    } catch (error) {
      throw new HTTPError(Status.INTERNAL_SERVER_ERROR, error);
    }
  }),

  // Create a new Query
  createQuery: catchAsync(async (req, res, next) => {
    console.log("createQuery is called");
    try {
      var QueryData = req.body;
      var result = await QueryHelper.createQuery(QueryData);

      var message = "Query created successfully";
      if (result == null) {
        message = "Query does not exist.";
      }

      res.ok(message, QueryData);
    } catch (error) {
      throw new HTTPError(Status.INTERNAL_SERVER_ERROR, error);
    }
  }),

  // Get all Query users with full details
  getAllQuery: catchAsync(async (req, res, next) => {
    console.log("Querydetails is called");
    try {
      const pageNumber = parseInt(req.query.pageNumber) || 0;
      const limit = parseInt(req.query.limit) || 10;
      var message = "Querydetails found successfully";
      var Querys = await Model.Query.find()
        .skip(pageNumber * limit - limit)
        .limit(limit)
        .sort("-_id");
      const QuerySize = Querys.length;
      const result = {
        Query: Querys,
        count: QuerySize,
        limit: limit,
      };
      if (result == null) {
        message = "Querydetails does not exist.";
      }
      var message = "Query  details find successfully";
      res.ok(message, result);
    } catch (error) {
      throw new HTTPError(Status.INTERNAL_SERVER_ERROR, error);
    }
  }),

  // Update a Query user
  updateQuery: catchAsync(async (req, res, next) => {
    // Get the Query user data from the request body
    var QueryUserData = req.body;
    try {
      // Update the Query user with the updated data
      var result = await Model.Query.findOneAndUpdate(
        { _id: QueryUserData.queryId },
        QueryUserData,
        {
          new: true,
        }
      );
      var message = "Query  status updated successfully";
      res.ok(message, result);
    } catch (err) {
      throw new HTTPError(Status.INTERNAL_SERVER_ERROR, err);
    }
  }),

  // Delete a Query user
  declineQuery: catchAsync(async (req, res, next) => {
    var QueryId = req.params.id;
    try {
      const QueryUser = await Model.Query.findOneAndDelete(QueryId);
      if (!QueryUser)
        return res.badRequest("Query  Not Found in our records");
      var message = "Query user deleted successfully";
      res.ok(message, QueryUser);
    } catch (err) {
      throw new HTTPError(Status.INTERNAL_SERVER_ERROR, err);
    }
  }),
};
