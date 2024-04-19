var Routes = require("./index");
var express = require("express");
const router = express.Router();
router.use("/auth/user", Routes.UserAuthRoutes);
router.use("/contentPost", Routes.contentRoutes);
router.use("/query", Routes.queryRoutes),
router.use("/category", Routes.categoryRoutes),
router.use("/banner", Routes.bannerRoutes),
module.exports = router;
