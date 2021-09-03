const express = require("express");
const feedbackRouter = express.Router();
const { authenticateToken } = require("../middleware/auth.middleware");
const { addfeedback } = require("../controller/feedback.controller");

feedbackRouter.route("/add_feedback").post(authenticateToken, addfeedback);

module.exports = feedbackRouter;
