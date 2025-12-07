import mongoose from "mongoose";

const connectDB = async () => {
  const mongodbURL = process.env.MONGODB_URL;
  const dbName = "abe-garage";

  if (!mongodbURL) {
    throw new Error("MONGODB_URL not set in .env");
  }

  const fullURL = `${mongodbURL}/${dbName}`;

  try {
    await mongoose.connect(fullURL); // ✅ No options
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

export default connectDB;
