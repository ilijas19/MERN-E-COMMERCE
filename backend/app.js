import "express-async-errors";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { v2 as cloudinary } from "cloudinary";
import fileUpload from "express-fileupload";
import cors from "cors";
import path from "path";

// Database
import connectDb from "./db/connectDb.js";

// Middlewares
import notFound from "./middlewares/notFound.js";
import errorHandler from "./middlewares/errorHandler.js";

// Routes
import UserRouter from "./routes/UserRoutes.js";
import CategoryRouter from "./routes/CategoryRoutes.js";
import ProductRouter from "./routes/ProductRoutes.js";
import UploadRouter from "./routes/uploadRoutes.js";
import OrderRouter from "./routes/OrderRoutes.js";

dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const app = express();
const __dirname = path.resolve();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.JWT_SECRET));
app.use(fileUpload({ useTempFiles: true }));

// CORS
app.use(
  cors({
    origin: ["https://mern-ecomm19.netlify.app", "http://localhost:5173"],
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// API Routes
app.use("/api/v1/user", UserRouter);
app.use("/api/v1/category", CategoryRouter);
app.use("/api/v1/product", ProductRouter);
app.use("/api/v1/upload", UploadRouter);
app.use("/api/v1/order", OrderRouter);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}
// Error Handling
app.use(notFound);
app.use(errorHandler);

// Start Server
const port = process.env.PORT || 4999;
const init = async () => {
  try {
    await connectDb(process.env.MONGO_URI);
    app.listen(port, () => {
      console.log(`App is running on port ${port} :)`);
    });
  } catch (error) {
    console.error(error);
  }
};

init();
