const express = require("express");
const authRouter = express.Router();
const {
  signup,
  signin,
  googleLogin,
  forgotPassword,
  resetPassword,
  changePassword,
  mobileLogin,
} = require("../controller/auth.controller");
const { authenticateToken } = require("../middleware/auth.middleware");

authRouter.route("/signup").post(signup);
authRouter.route("/signin").post(signin);
authRouter.route("/googleLogin").post(googleLogin);
authRouter.route("/mobileLogin").post(mobileLogin);
authRouter.route("/forgotPassword").put(forgotPassword);
authRouter.route("/resetPassword").put(resetPassword);
authRouter.route("/resetPassword").put(resetPassword);
authRouter.route("/changePassword").put(authenticateToken, changePassword);

module.exports = authRouter;
