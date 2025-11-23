import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => res.send("Server is live..."));

app.listen(PORT, () => {
  console.log(`server is running on http://localhost:${PORT}`);
});
