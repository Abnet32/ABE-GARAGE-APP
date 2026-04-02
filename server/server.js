import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import connectDB from "./configs/db.js";
import authRoutes from "./routes/authRoute.js";
import customerRoutes from "./routes/customerRoute.js";
import employeeRoutes from "./routes/employeeRoute.js";
import orderRoutes from "./routes/orderRoute.js";
import serviceRoute from "./routes/serviceRoute.js";
import inventoryRoute from "./routes/inventoryRoute.js";
import vehicleRoute from "./routes/vehicleRoute.js";
import { ensureDefaultAdmin } from "./scripts/ensureDefaultAdmin.js";

const app = express();
const PORT = process.env.PORT || 3001;
const allowedOrigins = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const corsOptions = {
  origin: allowedOrigins.length > 0 ? allowedOrigins : true,
  credentials: true,
};

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(cors(corsOptions));

await connectDB();
await ensureDefaultAdmin();

app.get("/", (req, res) => res.send("Server is live..."));

app.use("/api/auth", authRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/services", serviceRoute);
app.use("/api/inventories", inventoryRoute);
app.use("/api/vehicles", vehicleRoute);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error(err);
  if (res.headersSent) return next(err);
  res.status(500).json({ message: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`server is running on http://localhost:${PORT}`);
});
