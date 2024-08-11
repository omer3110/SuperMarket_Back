import express, { Application, Request, Response } from "express";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db";
import userRoutes from "./routes/user.route"; // User routes
import authRoutes from "./routes/auth.route"; // Auth routes
import cartRoutes from "./routes/cart.route"; // Cart routes
import productRoutes from "./routes/product.route"; // Product routes
import { verifyToken } from "./middlewares/auth.middleware";

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

async function main() {
  // Connect to database
  await connectDB();

  // MIDDLEWARES
  app.use(express.json());
  app.use(express.static("public"));

  // allow CORS for local development (for production, you should configure it properly)
  app.use(
    cors({
      origin: "http://localhost:5173",
    })
  );

  // ROUTES
  app.use("/api/auth", authRoutes); // Use auth routes
  app.use("/api/user", verifyToken, userRoutes); // Use user routes
  app.use("/api/products", productRoutes); // Use product routes
  app.use("/api/cart", verifyToken, cartRoutes); // Use cart routes

  // Fallback route for handling all other requests
  // app.get("*", (req: Request, res: Response) => {
  //   res.sendFile(path.join(__dirname, "public", "index.html"));
  // });

  // START SERVER
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

main();
