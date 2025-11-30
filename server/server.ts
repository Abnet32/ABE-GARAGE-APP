import dotenv from "dotenv";
dotenv.config();
import express from "express";
import type{ Request, Response, NextFunction } from "express";
import cors from "cors";
import connectDB from "./configs/db.ts";
import authRoutes from "./routes/authRoute.ts";
import customerRoutes from "./routes/customerRoute.ts";
import employeeRoutes from "./routes/employeeRoute.ts";
import orderRoutes from "./routes/orderRoute.ts"
import serviceRoute from "./routes/serviceRoute.ts"
import inventoryRoute from "./routes/inventoryRoute.ts";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());

await connectDB();

app.get("/", (req: Request, res: Response) => res.send("Server is live..."));

app.use("/api/auth", authRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/services", serviceRoute);
app.use("/api/inventories", inventoryRoute);

app.listen(PORT, () => {
  console.log(`server is running on http://localhost:${PORT}`);
});
