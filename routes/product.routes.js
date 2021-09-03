const express = require("express");
const productRouter = express.Router();
const {
  authenticateToken,
  userRole,
} = require("../middleware/auth.middleware");
const {
  createProduct,
  getAllProduct,
  getSingleProduct,
  deleteProduct,
  createProductReview,
  getProductsBasedCategory,
  newArrival,
  bestSeller,
  getProductsBasedCatSubCat,
  getProductsByFilter,
} = require("../controller/product.controller");

productRouter.route("/create_product").post(createProduct);
productRouter.route("/get_all_product").get(getAllProduct);
productRouter.route("/get_single_product/:id").get(getSingleProduct);
productRouter.route("/delete_product/:id").delete(deleteProduct);
productRouter
  .route("/create_product_review/:id")
  .post(authenticateToken, createProductReview);
productRouter
  .route("/get_products_based_category/:id")
  .get(getProductsBasedCategory);
productRouter.route("/new_arrival").post(newArrival);
productRouter.route("/best_seller").post(bestSeller);
productRouter
  .route("/products_based_cat_subcat")
  .get(getProductsBasedCatSubCat);
productRouter.route("/get_Products_by_filter").post(getProductsByFilter);

module.exports = productRouter;
