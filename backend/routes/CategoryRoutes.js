import express from "express";
import {
  createCategory,
  getAllCategories,
  getSingleCategory,
  updateCategory,
  deleteCategory,
  get3Categories,
  getProductsByCategory,
} from "../controllers/categoryController.js";
import {
  authenticateUser,
  authorizeAdmin,
} from "../middlewares/authentication.js";

const router = express.Router();

router
  .route("/")
  .post(authenticateUser, authorizeAdmin, createCategory)
  .get(getAllCategories);

router.get("/top3", get3Categories);
router.get("/products/:id", getProductsByCategory);

router
  .route("/:id")
  .get(authenticateUser, authorizeAdmin, getSingleCategory)
  .patch(authenticateUser, authorizeAdmin, updateCategory)
  .delete(authenticateUser, authorizeAdmin, deleteCategory);

export default router;
