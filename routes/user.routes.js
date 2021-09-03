const express = require("express");
const userRouter = express.Router();
const {
  singleUser,
  userProfile,
  allUsers,
  AddShippingAddress,
  updateCardDetails,
  deleteUser,
  updateUserProfile,
  removeAddress,
  editAddress,
  wishlist,
  Removewishlist,
  changeUserVerified,
} = require("../controller/user.controller");
const { authenticateToken } = require("../middleware/auth.middleware");

userRouter.route("/single_user/:id").get(singleUser);
userRouter.route("/user_profile").get(authenticateToken, userProfile);
userRouter.route("/all_users").get(authenticateToken, allUsers);
userRouter
  .route("/add_shipping_address")
  .put(authenticateToken, AddShippingAddress);
userRouter
  .route("/update_card_details")
  .put(authenticateToken, updateCardDetails);
userRouter.route("/delete_user/:id").delete(authenticateToken, deleteUser);
userRouter
  .route("/update_user_profile")
  .post(authenticateToken, updateUserProfile);
userRouter.route("/remove_address/:id").put(authenticateToken, removeAddress);
userRouter.route("/edit_address/:id").put(authenticateToken, editAddress);
userRouter.route("/add_wishlist/:productId").put(authenticateToken, wishlist);
userRouter
  .route("/remove_wishlist/:productId")
  .put(authenticateToken, Removewishlist);
userRouter
  .route("/change_user_verified")
  .put(authenticateToken, changeUserVerified);

module.exports = userRouter;
