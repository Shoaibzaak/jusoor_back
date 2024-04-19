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
//post custom CategoryPost 
router.route("/createCategory").post(
  Authentication.UserAuth,
  Controller.categoryController.createCategory);

//update CategoryPost
router.route("/updateCategory").put(
  Authentication.UserAuth,
  Controller.categoryController.updateCategory);

//delete CategoryPost
router.route("/deleteCategory/:id").delete(
  Authentication.UserAuth,
  Controller.categoryController.declineCategory);


// get CategoryPost by id
router.route("/findCategoryById/:id").get(
  Authentication.UserAuth,
  Controller.categoryController.getCategory);

  // get all  CategoryPosts with details
router.route("/getAllCategory").get(
  Authentication.UserAuth,
  Controller.categoryController.getAllCategory);



module.exports = router;



