const express = require("express");
const brandRouter = express.Router();
const {
  authenticateToken,
  userRole,
} = require("../middleware/auth.middleware");
const {
  createBrand,
  getSingleBrand,
  getAllBrand,
  updateBrand,
  deleteBrand,
} = require("../controller/brand.controller");

brandRouter.route("/create_brand").post(createBrand);
brandRouter.route("/get_single_brand/:name").get(getSingleBrand);
brandRouter.route("/get_all_brand").get(getAllBrand);
brandRouter.route("/update_brand/:name").put(updateBrand);
brandRouter.route("/delete_brand/:name").delete(deleteBrand);

module.exports = brandRouter;
