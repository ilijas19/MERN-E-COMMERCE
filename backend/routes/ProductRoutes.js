import express from "express";
import {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  getTopProducts,
  getNewProducts,
  addReview,
  toggleFavoriteProduct,
  getFavoriteProducts,
} from "../controllers/productController.js";
import {
  authenticateUser,
  authorizeAdmin,
} from "../middlewares/authentication.js";

const router = express.Router();

router
  .route("/")
  .post(authenticateUser, authorizeAdmin, createProduct)
  .get(getAllProducts);

router.get("/top", getTopProducts);
router.get("/new", getNewProducts);
router.get("/favorite", authenticateUser, getFavoriteProducts);

router.route("/favorite/:id").post(authenticateUser, toggleFavoriteProduct);
router.route("/review/:id").post(authenticateUser, addReview);

router
  .route("/:id")
  .get(getSingleProduct)
  .patch(authenticateUser, authorizeAdmin, updateProduct)
  .delete(authenticateUser, authorizeAdmin, deleteProduct);

export default router;
