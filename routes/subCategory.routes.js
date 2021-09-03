const express = require("express");
const subRouter = express.Router();
const {
  createSubcategory,
  getSingleSubCategory,
  getAllSubCategory,
  deleteCategory,
  updateSubCategory,
  getSubcategoryBaseParent,
} = require("../controller/subCategory.controller");
const { authenticateToken } = require("../middleware/auth.middleware");

subRouter.route("/create_subcategory").post(createSubcategory);
subRouter.route("/get_subcategory/:id").get(getSingleSubCategory);
subRouter.route("/get_all_subcategory").get(getAllSubCategory);
subRouter.route("/update_subcategory/:id").put(updateSubCategory);
subRouter.route("/delete_subcategory/:id").delete(deleteCategory);
subRouter
  .route("/get_subcategory_base_parent/:parentId")
  .get(getSubcategoryBaseParent);

module.exports = subRouter;
