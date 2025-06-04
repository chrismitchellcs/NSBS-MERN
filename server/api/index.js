require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const cors = require("cors");

const bikeRoutes = require("./routes/bikes");
const authRoutes = require("./routes/auth");
const imageRoutes = require("./routes/images");

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "https://nsbs-mern-frontend-f20uiuyrs-chris-projects-04c8e11c.vercel.app",
  "https://nsbs-mern-frontend-gw2wswtrg-chris-projects-04c8e11c.vercel.app",
  "https://nsbs-mern-frontend-git-test-branch-chris-projects-04c8e11c.vercel.app",
  "https://www.northshorebikeshop.net",
];

// ✅ Request Logger
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

// ✅ Body Parsers
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// ✅ CORS
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
app.use(
  cors({
    origin: true, // Reflects request origin, allowing all origins
    credentials: true,
  })
);

app.options("*", cors()); // enable pre-flight for all routes

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

// app.use(
//   cors({
//     origin: "*", // Allow all origins
//     credentials: false, // No cookies or auth headers
//   })
// );

app.get("/api/debug-test", (req, res) => {
  res.json({ success: true });
});

// ✅ Routes
app.use("/api/bikes", bikeRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/images", imageRoutes);

// ✅ MongoDB Connection (cached)
let connectionPromise;
if (!connectionPromise) {
  connectionPromise = mongoose
    .connect(process.env.ATLAS_URI)
    .then(() => console.log("✅ MongoDB connected"))
    .catch((err) => console.error("❌ MongoDB connection error:", err));
}

module.exports = async (req, res) => {
  console.log("✅ Handling request to:", req.method, req.url);

  await connectionPromise;

  // Manually run middleware stack
  return new Promise((resolve, reject) => {
    app(req, res, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
};
// ✅ Optional: Local Dev Support
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  connectionPromise.then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  });
}
