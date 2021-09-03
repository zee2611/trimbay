const express = require("express");
const bannerRouter = express.Router();
const {
  authenticateToken,
  userRole,
} = require("../middleware/auth.middleware");
const {
  createBanner,
  getSingleBanner,
  getAllBanner,
  updateBanner,
  deleteBanner,
} = require("../controller/banner.controller");

bannerRouter.route("/create_banner").post(createBanner);
bannerRouter.route("/get_single_banner/:id").get(getSingleBanner);
bannerRouter.route("/get_all_banner").get(getAllBanner);
bannerRouter.route("/update_banner/:id").put(updateBanner);
bannerRouter.route("/delete_banner/:id").delete(deleteBanner);

module.exports = bannerRouter;
