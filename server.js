// all your existing imports...
const express = require("express");
const dotenv = require("dotenv"); // ✅ Add this line
const colors = require("colors");
const morgan = require("morgan");
const cors = require("cors");
const connectDB = require("./config/db");
// dot config
dotenv.config();
connectDB();

// rest object
const app = express();

// middlewares
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

// root route
app.get("/", (req, res) => {
  res.send("Welcome to the Blood Bank Management API");
});

// api routes
app.use("/api/v1/test", require("./routes/testRoutes"));
app.use("/api/v1/auth", require("./routes/authRoutes"));
app.use("/api/v1/inventory", require("./routes/inventoryRoutes"));
app.use("/api/v1/analytics", require("./routes/analyticsRoutes"));
app.use("/api/v1/admin", require("./routes/adminRoutes"));

// ✅ Serve frontend in production
const path = require("path");

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "./client/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "./client/build/index.html"));
  });
}

// port
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(
    `Node Server Running In ${process.env.DEV_MODE} Mode On Port ${PORT}`
      .bgBlue.white
  );
});
