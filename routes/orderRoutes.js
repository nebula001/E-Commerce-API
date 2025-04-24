const express = require("express");
const router = express.Router();

const {
  authenticateUser,
  authorizePermissions,
} = require("../middlewares/authentication");

const {
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrders,
  createOrder,
  updateOrderStatus,
} = require("../controllers/orderController");

router
  .route("/")
  .get(authenticateUser, authorizePermissions("admin"), getAllOrders)
  .post(authenticateUser, createOrder);

router.route("/showAllMyOrders").get(authenticateUser, getCurrentUserOrders);

router
  .route("/:id")
  .get(authenticateUser, getSingleOrder)
  .patch(authenticateUser, updateOrderStatus);

module.exports = router;
