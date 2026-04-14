const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");

const app = express();

// Middleware
const allowedOrigins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const localDevOrigins = ["http://localhost:3000", "http://localhost:5173"];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.length === 0) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      if (localDevOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
  })
);

app.use(express.json());

// Payments routes allowlist
const paymentsRoutes = require("./routes/paymentsRoutes");
app.use("/api/payments", paymentsRoutes);

// Connect to MongoDB
if (!process.env.MONGO_URI) {
  console.error("Missing MONGO_URI environment variable");
} else {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("MongoDB Connected");
      // Start accommodation auto-sync from partner sources (TC014/TC015)
      const { startAutoSync } = require("./services/accommodationFetcher");
      startAutoSync();
    })
    .catch((err) => console.error("MongoDB connection error:", err));
}

// Basic Route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Import and use Auth Routes
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

// Import and use CRUD Routes
const coursesRoutes = require("./routes/coursesRoutes");
const universitiesRoutes = require("./routes/universitiesRoutes");
const accommodationRoutes = require("./routes/accommodationRoutes");
const educationLoansRoutes = require("./routes/educationLoansRoutes");
const servicesRoutes = require("./routes/servicesRoutes");
const newsRoutes = require("./routes/newsRoutes");
const blogRoutes = require("./routes/blogRoutes");
const eventsRoutes = require("./routes/eventsRoutes");
const usersRoutes = require("./routes/usersRoutes");
const formSubmissionsRoutes = require("./routes/formSubmissionsRoutes");
const foundationProgramsRoutes = require("./routes/foundationProgramsRoutes");
const scholarshipsRoutes = require("./routes/scholarshipsRoutes");

app.use("/api/courses", coursesRoutes);
app.use("/api/universities", universitiesRoutes);
app.use("/api/accommodation", accommodationRoutes);
app.use("/api/education-loans", educationLoansRoutes);
app.use("/api/services", servicesRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/events", eventsRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/form-submissions", formSubmissionsRoutes);
app.use("/api/foundation-programs", foundationProgramsRoutes);
app.use("/api/scholarships", scholarshipsRoutes);

const PORT = process.env.PORT || 5000;

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
