const express = require("express");
const Controller = require("../controllers/index");
const router = express.Router();
const path = require("path");
const multer = require("multer");
const Authentication = require("../services/index");

const userStorage = multer.diskStorage({
  // destination: (req, file, cb) => {
  //   cb(null, "/tmp");
  // },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

var upload = multer({
  //multer settings
  storage: userStorage,
  fileFilter: function (req, file, callback) {
    var ext = path.extname(file.originalname);
    if (ext !== ".png" && ext !== ".jpg" && ext !== ".gif" && ext !== ".jpeg") {
      return callback(new Error("Only images are allowed"));
    }
    callback(null, true);
  },
  limits: {
    fileSize: 1024 * 1024,
  },
});
//post custom QueryPost 
router.route("/createQueryPost").post(
  // Authentication.UserAuth,
  Controller.queryController.createQuery);

//update QueryPost
router.route("/updateQueryPost").put(
  // Authentication.UserAuth,
  Controller.queryController.updateQuery);

//delete QueryPost
router.route("/deleteQueryPost/:id").delete(
  // Authentication.UserAuth,
  Controller.queryController.declineQuery);


// get QueryPost by id
router.route("/findQueryPostById/:id").get(
  // Authentication.UserAuth,
  Controller.queryController.getQuery);

  // get all  QueryPosts with details
router.route("/getAllQueryPosts").get(
  // Authentication.UserAuth,
  Controller.queryController.getAllQuery);



module.exports = router;



