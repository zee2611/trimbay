const express = require("express");
const couponRouter = express.Router();
const {
  authenticateToken,
  userRole,
} = require("../middleware/auth.middleware");
const {
  createCoupon,
  getSinleCoupon,
  getAllCoupon,
  updateCoupon,
  deleteCoupon,
  deleteMultipleCoupon,
} = require("../controller/coupon.controller");

couponRouter.route("/create_coupon").post(createCoupon);
couponRouter.route("/get_single_coupon/:name").get(getSinleCoupon);
couponRouter.route("/get_all_coupon").get(getAllCoupon);
couponRouter.route("/update_coupon/:name").put(updateCoupon);
couponRouter.route("/delete_coupon/:name").delete(deleteCoupon);
couponRouter.route("/delete_multiple_coupon").delete(deleteMultipleCoupon);

module.exports = couponRouter;
