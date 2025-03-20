import express from "express";
import {
  authenticateUser,
  authorizeAdmin,
} from "../middlewares/authentication.js";
import {
  createOrder,
  cancelOrder,
  getMyOrders,
  getSingleOrder,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
  countTotalOrders,
  countTotalSales,
} from "../controllers/orderController.js";

const router = express.Router();

router
  .route("/")
  .post(authenticateUser, createOrder)
  .get(authenticateUser, getMyOrders);

router.get("/all", authenticateUser, authorizeAdmin, getAllOrders);
router.get("/total-orders", authenticateUser, authorizeAdmin, countTotalOrders);
router.get("/total-sales", authenticateUser, authorizeAdmin, countTotalSales);
router.patch(
  "/status/:id",
  authenticateUser,
  authorizeAdmin,
  updateOrderStatus
);

router
  .route("/:id")
  .get(authenticateUser, getSingleOrder)
  .post(authenticateUser, cancelOrder)
  .delete(authenticateUser, authorizeAdmin, deleteOrder);

export default router;
