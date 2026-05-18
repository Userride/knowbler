require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const articleRoutes = require("./routes/articleRoutes");

const expressApp = express();
const SERVER_PORT = process.env.PORT || 5000;

// Middleware
expressApp.use(cors({ origin: "http://localhost:5173", credentials: true }));
expressApp.use(express.json());
expressApp.use(express.urlencoded({ extended: true }));

// Routes
expressApp.use("/api/articles", articleRoutes);

// Health check
expressApp.get("/api/health", (req, res) => {
  res.status(200).json({ success: true, message: "Knowbler API is running" });
});

// 404 handler
expressApp.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// Connect to MongoDB and start server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
    expressApp.listen(SERVER_PORT, () => {
      console.log(`Knowbler server running on port ${SERVER_PORT}`);
    });
  })
  .catch((connectionError) => {
    console.error("MongoDB connection failed:", connectionError.message);
    process.exit(1);
  });
