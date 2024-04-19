const express = require("express");
const Controller = require("../../controllers/index");
const router = express.Router();
const path = require("path");
const multer = require("multer");
const fs = require("fs");
const Authentication = require("../../services/index");
const userStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Check if the directory exists, if not create it
    if (!fs.existsSync("uploads/")) {
      fs.mkdirSync("uploads/");
    }
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});
const upload = multer({ storage: userStorage });

router.route("/register").post(Controller.UserAuthController.registerUser);
router
  .route("/userAccontVerification")
  .post(Controller.UserAuthController.accountVerificationUser);
router.route("/login").post(Controller.UserAuthController.loginUser);
router
  .route("/userForgetpassword")
  .post(Controller.UserAuthController.forgetUserPassword);
router
  .route("/getSingleUser/:id")
  .get(Controller.UserAuthController.getSingleUser);

router.route("/getAllCustomers").get(Controller.UserAuthController.getAllUsers);
router
  .route("/changepassword")
  .post(
    Authentication.UserAuth,
    Controller.UserAuthController.changeUserPassword
  );
router.route("/resendOtp").post(Controller.UserAuthController.resendUserOtp);
router
  .route("/userChangepassword")
  .post(Controller.UserAuthController.changeUserPassword);

router
  .route("/deleteSingleUser/:id")
  .delete(Controller.UserAuthController.deleteUser);

// router.route("/uploadProfilePic).post(
//   upload.fields([
//     {
//       name: "profilePic",
//       maxCount: 1,
//     },
//     {
//       name: "resume",
//       maxCount: 1,
//     },
//   ]),
//   Controller.AuthController.setupProfile
// );

module.exports = router;
