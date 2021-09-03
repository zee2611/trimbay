const express = require("express");
const categoryRouter = express.Router();
const {
  createCategory,
  getSingleCategory,
  getAllCategory,
  updateCategory,
  deleteCategory,
} = require("../controller/category.controller");
const {
  authenticateToken,
  userRole,
} = require("../middleware/auth.middleware");

categoryRouter.route("/create_category").post(createCategory);
categoryRouter.route("/get_single_category/:name").get(getSingleCategory);
categoryRouter
  .route("/get_all_category")
  .get(authenticateToken, userRole, getAllCategory);
categoryRouter.route("/update_category/:name").put(updateCategory);
categoryRouter.route("/delete_category/:name").delete(deleteCategory);

module.exports = categoryRouter;
