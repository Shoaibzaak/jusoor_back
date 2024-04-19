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


//post custom ContentPost
router.route("/createContentPost").post(
  upload.fields([
    {
      name: "descriptionImages",
      maxCount: 5,
    },
    {
      name: "descriptionVideos",
      maxCount: 5,
    },
    {
      name: "primaryImage",
      maxCount: 1,
    },
    {
      name: "audio",
      maxCount: 1,
    },
  ]),
  Authentication.UserAuth,
  Controller.contentController.createContent
);

//update ContentPost
router.route("/updateContentPost").put(
  Authentication.UserAuth,
  upload.fields([
    {
      name: "descriptionImages",
      maxCount: 5,
    },
    {
      name: "descriptionVidoes",
      maxCount: 5,
    },
    {
      name: "primaryImage",
      maxCount: 1,
    },
    {
      name: "audio",
      maxCount: 1,
    },
  ]),
  Controller.contentController.updateContent
);

//delete ContentPost
router
  .route("/deleteContentPost/:id")
  .delete(Authentication.UserAuth, Controller.contentController.declineContent);

// get ContentPost by id
router
  .route("/findContentPostById/:id")
  .get(Authentication.UserAuth, Controller.contentController.getContent);

// get all  ContentPosts with details
router
  .route("/getAllContentPosts")
  .get(Authentication.UserAuth, Controller.contentController.getAllContent);

module.exports = router;
