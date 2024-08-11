import express, { Application, Request, Response } from "express";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db";
// import productRoutes from "./routes/product.route"; // Use import for routes
import userRoutes from "./routes/user.route"; // Use import for routes
import cartRoutes from "./routes/cart.route"; // Import cart routes

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
  // app.use("/api/product", productRoutes);
  app.use("/api/auth", userRoutes);
  app.use("/api/cart", cartRoutes); // Use cart routes

  // Fallback route for handling all other requests
  app.get("*", (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
  });

  // START SERVER
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

main();
