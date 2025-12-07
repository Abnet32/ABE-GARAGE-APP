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

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());

await connectDB();

app.get("/", (req, res) => res.send("Server is live..."));

app.use("/api/auth", authRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/services", serviceRoute);
app.use("/api/inventories", inventoryRoute);
app.use("/api/vehicles", vehicleRoute);

app.listen(PORT, () => {
  console.log(`server is running on http://localhost:${PORT}`);
});
