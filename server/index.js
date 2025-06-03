require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bikeRoutes = require("./routes/bikes");
const authRoutes = require("./routes/auth");
const imageRoutes = require("./routes/images");
const session = require("express-session");
const cors = require("cors");
const serverless = require("serverless-http");
const MongoStore = require("connect-mongo");

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "https://nsbs-mern-frontend-f20uiuyrs-chris-projects-04c8e11c.vercel.app",
  "https://nsbs-mern-frontend-gw2wswtrg-chris-projects-04c8e11c.vercel.app",
  "https://www.northshorebikeshop.net",
];

// Middleware for logging requests
app.use((req, res, next) => {
  console.log(req.path, req.method, req.headers.origin);
  next();
});

// Parse JSON and URL-encoded data
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

const corsOptions = {
  origin: function (origin, callback) {
    console.log("Incoming Origin:", origin);
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

// ✅ Only apply CORS once, globally
app.use(cors(corsOptions));

// ✅ Clean cookie config
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.ATLAS_URI,
      collectionName: "sessions",
    }),
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 1000 * 60 * 60 * 2,
    },
  })
);

// ✅ No need to add CORS to every route again
app.use("/api/bikes", bikeRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/images", imageRoutes);

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
