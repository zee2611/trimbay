const express = require("express");
const s3Router = express.Router();
const { authenticateToken } = require("../middleware/auth.middleware");
const { s3Url } = require("../controller/s3.controller");
const multer = require("multer");

s3Router.route("/s3Url").get(s3Url);

module.exports = s3Router;
