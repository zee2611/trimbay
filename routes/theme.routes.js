const express = require("express");
const themeRouter = express.Router();
const {
  authenticateToken,
  userRole,
} = require("../middleware/auth.middleware");
const {
  createTheme,
  getSingleTheme,
  getAllTheme,
  updateTheme,
  deleteTheme,
} = require("../controller/theme.controller");

themeRouter.route("/create_theme").post(createTheme);
themeRouter.route("/get_single_theme/:name").get(getSingleTheme);
themeRouter.route("/get_all_theme").get(getAllTheme);
themeRouter.route("/update_theme/:name").put(updateTheme);
themeRouter.route("/delete_theme/:name").delete(deleteTheme);

module.exports = themeRouter;
