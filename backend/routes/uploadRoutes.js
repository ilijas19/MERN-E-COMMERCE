import express from "express";
import { uploadImage } from "../controllers/uploadController.js";
import {
  authenticateUser,
  authorizeAdmin,
} from "../middlewares/authentication.js";

const router = express.Router();

router.route("/").post(authenticateUser, authorizeAdmin, uploadImage);

export default router;
