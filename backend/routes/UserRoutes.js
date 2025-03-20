import express from "express";

import {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  getUserById,
  deleteUserById,
  updateUserById,
  getCurrentUser,
} from "../controllers/userController.js";

import {
  authenticateUser,
  getUserAuthenticate,
  authorizeAdmin,
} from "../middlewares/authentication.js";

const router = express.Router();

//public
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", authenticateUser, logoutUser);
router.get("/me", getUserAuthenticate, getCurrentUser);
router.get("/profile", authenticateUser, getUserProfile);
router.patch("/updateMe", authenticateUser, updateUserProfile);

//admin
router.route("/").get(authenticateUser, authorizeAdmin, getAllUsers);
router
  .route("/:id")
  .get(authenticateUser, authorizeAdmin, getUserById)
  .delete(authenticateUser, authorizeAdmin, deleteUserById)
  .patch(authenticateUser, authorizeAdmin, updateUserById);

export default router;
