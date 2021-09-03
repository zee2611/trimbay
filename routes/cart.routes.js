const express = require("express");
const cartRouter = express.Router();
const { authenticateToken } = require("../middleware/auth.middleware");
const {
  addToCart,
  getUserCart,
  removeItemFromCart,
  moveToWishlist,
} = require("../controller/cart.controller");

cartRouter.route("/add_to_cart").post(authenticateToken, addToCart);
cartRouter.route("/get_user_cart").get(authenticateToken, getUserCart);
cartRouter
  .route("/remove_item_from_cart/:id")
  .put(authenticateToken, removeItemFromCart);
cartRouter.route("/move_to_wishlist").put(authenticateToken, moveToWishlist);

module.exports = cartRouter;
