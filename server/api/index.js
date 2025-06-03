require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bikeRoutes = require("../routes/bikes");
const authRoutes = require("../routes/auth");
const imageRoutes = require("../routes/images");
const session = require("express-session");
const cors = require("cors");
const serverless = require("serverless-http");
const MongoStore = require("connect-mongo");

const app = express();

// ✅ CORS Whitelist
const allowedOrigins = [
  "http://localhost:3000",
  "https://nsbs-mern-frontend-f20uiuyrs-chris-projects-04c8e11c.vercel.app",
  "https://nsbs-mern-frontend-gw2wswtrg-chris-projects-04c8e11c.vercel.app",
  "https://www.northshorebikeshop.net",
];

// ✅ Request logger (good for debugging)
app.use((req, res, next) => {
  console.log(
    "PATH:",
    req.path,
    "| METHOD:",
    req.method,
    "| ORIGIN:",
    req.headers.origin
  );
  next();
});

// ✅ Body parsers
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// ✅ CORS
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS: " + origin));
    }
  },
  credentials: true,
};
app.use(cors(corsOptions));

app.options("*", cors(corsOptions));

// ✅ Sessions
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

// ✅ Routes
app.use("/api/bikes", bikeRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/images", imageRoutes);

// ✅ Mongo connection (cached so Vercel won't reconnect every time)
let connectionPromise;
if (!connectionPromise) {
  connectionPromise = mongoose
    .connect(process.env.ATLAS_URI)
    .then(() => {
      console.log("✅ MongoDB connected");
    })
    .catch((err) => {
      console.error("❌ MongoDB connection error:", err);
    });
}

// ✅ Export handler for Vercel
const handler = serverless(app);

// ✅ Support both local dev and serverless
if (require.main === module) {
  // Local dev
  const PORT = process.env.PORT || 5000;
  connectionPromise.then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Local server running on http://localhost:${PORT}`);
    });
  });
} else {
  // Vercel serverless
  module.exports = async (req, res) => {
    await connectionPromise;
    return handler(req, res);
  };
}
