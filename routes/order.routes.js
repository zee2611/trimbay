const express = require("express");
const orderRouter = express.Router();
const { authenticateToken } = require("../middleware/auth.middleware");
const {
  placeOrder,
  getMyOrder,
  getAllOrders,
  getSingleOrder,
  updateOrderStatus,
  updateOrderToPaid,
} = require("../controller/order.controller");

orderRouter.route("/place_order").post(authenticateToken, placeOrder);
orderRouter.route("/get_my_order").get(authenticateToken, getMyOrder);
orderRouter.route("/get_all_order").get(authenticateToken, getAllOrders);
orderRouter
  .route("/get_single_order/:id")
  .get(authenticateToken, getSingleOrder);
orderRouter
  .route("/update_order_status/:id")
  .put(authenticateToken, updateOrderStatus);
orderRouter
  .route("/update_order_to_paid/:id")
  .put(authenticateToken, updateOrderToPaid);

module.exports = orderRouter;
