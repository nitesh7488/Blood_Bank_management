const express = require("express");
const dotenv = require("dotenv");
const colors = require("colors");
const morgan = require("morgan");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Create Express app
const app = express();

// Middleware: JSON parser
app.use(express.json());

// ✅ Updated CORS Configuration
app.use(
  cors({
    origin: [
      "http://localhost:3000", // Local development
      "https://blood-bank-management-1-ttrb.onrender.com", // 🔁 Replace with your deployed frontend URL
    ],
    credentials: true,
  })
);

// HTTP request logger
app.use(morgan("dev"));

// Root route
app.get("/", (req, res) => {
  res.send("Welcome to the Blood Bank Management API");
});

// API Routes
app.use("/api/v1/test", require("./routes/testRoutes"));
app.use("/api/v1/auth", require("./routes/authRoutes"));
app.use("/api/v1/inventory", require("./routes/inventoryRoutes"));
app.use("/api/v1/analytics", require("./routes/analyticsRoutes"));
app.use("/api/v1/admin", require("./routes/adminRoutes"));

// ✅ Serve React frontend in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "./client/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "./client/build/index.html"));
  });
}

// Server port
const PORT = process.env.PORT || 8080;

// Start server
app.listen(PORT, () => {
  console.log(
    `Node Server Running In ${process.env.DEV_MODE || "production"} Mode On Port ${PORT}`
      .bgBlue.white
  );
});
