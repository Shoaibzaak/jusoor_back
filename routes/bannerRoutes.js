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

const upload = multer({
  storage: userStorage,
  fileFilter: function (req, file, callback) {
    const ext = path.extname(file.originalname).toLowerCase();
    const allowedImageTypes = [".png", ".jpg", ".gif", ".jpeg"];
    const allowedVideoTypes = [".mp4", ".avi", ".mov"];

    if (allowedImageTypes.includes(ext) || allowedVideoTypes.includes(ext)) {
      callback(null, true);
    } else {
      callback(new Error("Only images and videos are allowed"));
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB limit
  },
});


//post custom BannerPost
router.route("/createBanner").post(
  upload.fields([
    {
      name: "images",
      maxCount: 5,
    },
    {
      name: "videos",
      maxCount: 5,
    },
  ]),
  // Authentication.UserAuth,
  Controller.bannerController.createBanner
);

//update BannerPost
router.route("/updateBanner").put(
  Authentication.UserAuth,
  upload.fields([
    {
      name: "images",
      maxCount: 5,
    },
    {
      name: "videos",
      maxCount: 5,
    },
  ]),
  Controller.bannerController.updateBanner
);

//delete BannerPost
router
  .route("/deleteBanner/:id")
  .delete(
    Authentication.UserAuth,
    Controller.bannerController.declineBanner);

// get BannerPost by id
router
  .route("/findBannerById/:id")
  .get(
    Authentication.UserAuth, 
    Controller.bannerController.getBanner);

// get all  BannerPosts with details
router
  .route("/getAllBanners")
  .get(
     Authentication.UserAuth,
     Controller.bannerController.getAllBanner);

module.exports = router;
