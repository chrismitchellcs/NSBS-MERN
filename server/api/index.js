require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const cors = require("cors");

const bikeRoutes = require("./routes/bikes");
const authRoutes = require("./routes/auth");
const imageRoutes = require("./routes/images");
const headerHeroRoutes = require("./routes/headerHero");
const serviceListingsRoutes = require("./routes/serviceListings");

const app = express();

// Trust the first proxy (important for secure cookies behind Vercel)
app.set("trust proxy", 1);

const allowedOrigins = [
  "http://localhost:3000",
  "https://nsbs-mern-frontend-f20uiuyrs-chris-projects-04c8e11c.vercel.app",
  "https://nsbs-mern-frontend-gw2wswtrg-chris-projects-04c8e11c.vercel.app",
  "https://nsbs-mern-frontend-git-test-branch-chris-projects-04c8e11c.vercel.app",
  "https://www.northshorebikeshop.net",
];

// Request Logger
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

// Body Parsers
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// CORS
const corsOptions = {
  origin: function (origin, callback) {
    console.log("CORS origin:", origin);
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log("Blocked CORS for origin:", origin);
      callback(new Error("Not allowed by CORS: " + origin));
    }
  },
  credentials: true,
};
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// Sessions
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
      maxAge: 1000 * 60 * 60 * 2, // 2 hours
    },
  })
);

// Routes
app.use("/api/bikes", bikeRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/images", imageRoutes);
app.use("/api/header-hero", headerHeroRoutes);
app.use("/api/service-listings", serviceListingsRoutes);

// Errors from any route (see utils/asyncRouter) end here instead of hanging the request.
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (res.headersSent) return;
  if (err && /Not allowed by CORS/.test(err.message || "")) {
    return res.status(403).json({ error: "Origin not allowed" });
  }
  if (err && (err.name === "CastError" || err.name === "ValidationError")) {
    return res.status(400).json({ error: "Invalid request" });
  }
  console.error("[unhandled]", req.method, req.path, err);
  res.status(500).json({ error: "Something went wrong" });
});

// MongoDB connection, cached per instance. A failed connect is retried on the next request
// rather than leaving this instance broken until it's recycled.
let connectionPromise = null;
function connectDb() {
  if (mongoose.connection.readyState === 1) return Promise.resolve();
  if (!connectionPromise) {
    connectionPromise = mongoose
      .connect(process.env.ATLAS_URI)
      .then(() => console.log("✅ MongoDB connected"))
      .catch((err) => {
        connectionPromise = null;
        console.error("❌ MongoDB connection error:", err.message);
        throw err;
      });
  }
  return connectionPromise;
}
connectDb().catch(() => {});

// Vercel Serverless Handler
module.exports = async (req, res) => {
  console.log("✅ Handling request to:", req.method, req.url);

  try {
    await connectDb();
  } catch {
    res.statusCode = 503;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "Database unavailable, please try again shortly." }));
    return;
  }

  // Run Express middleware stack
  await new Promise((resolve, reject) => {
    app(req, res, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });

  if (!res.writableEnded) {
    res.end();
  }
};

// Optional: Local long-lived server
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  connectDb().then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  });
}
