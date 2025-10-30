import dotenv from "dotenv";
import express from "express";
import app from "./app.js";
import cors from "cors";
import logger from "./utils/logger.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  logger.info(`🚀 Server running on port ${PORT}`);
});

app.use(cors({
  origin: "http://localhost:5173",  // React app ka URL
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use("/uploads", express.static("uploads"));
