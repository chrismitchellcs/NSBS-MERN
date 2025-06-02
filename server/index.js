require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bikeRoutes = require("./routes/bikes");
const authRoutes = require("./routes/auth");
const imageRoutes = require("./routes/images");
const session = require("express-session");
const cors = require("cors");
const serverless = require("serverless-http");

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "https://nsbs-mern-frontend-f20uiuyrs-chris-projects-04c8e11c.vercel.app",
  "https://nsbs-mern-frontend-gw2wswtrg-chris-projects-04c8e11c.vercel.app",
  "https://www.northshorebikeshop.net",
];

// Middleware for logging requests
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

// Parse JSON and URL-encoded data
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// CORS options for all routes
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
  optionsSuccessStatus: 204,
  preflightContinue: false,
};

// Handle OPTIONS preflight requests *before* other routes
app.options("*", cors(corsOptions));

// Apply CORS middleware globally (optional; can also be applied per route)
app.use(cors(corsOptions));

// Session setup
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 2, httpOnly: true }, // 2 hours
  })
);

// Routes with CORS explicitly applied again (safe redundancy)
app.use("/api/bikes", cors(corsOptions), bikeRoutes);
app.use("/api/auth", cors(corsOptions), authRoutes);
app.use("/api/images", cors(corsOptions), imageRoutes);

// Connect to MongoDB
const mongooseConnection = mongoose
  .connect(process.env.ATLAS_URI)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

// Export handler for serverless environment (Vercel)
const handler = serverless(app);

module.exports = async (req, res) => {
  await mongooseConnection;
  return handler(req, res);
};
