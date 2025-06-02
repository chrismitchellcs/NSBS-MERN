require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bikeRoutes = require("./routes/bikes");
const authRoutes = require("./routes/auth");
const imageRoutes = require("./routes/images");
const bcrypt = require("bcrypt");
const session = require("express-session");

// express
const app = express();
const cors = require("cors");

// middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

const allowedOrigins = [
  "http://localhost:3000",
  "https://nsbs-mern-frontend-f20uiuyrs-chris-projects-04c8e11c.vercel.app",
  "https://nsbs-mern-frontend-gw2wswtrg-chris-projects-04c8e11c.vercel.app",
  "https://www.northshorebikeshop.net",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 2, httpOnly: true }, // 2-hour session
  })
);

// routes
const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};

// Apply CORS specifically per route
app.use("/api/bikes", cors(corsOptions), bikeRoutes);
app.use("/api/auth", cors(corsOptions), authRoutes);
app.use("/api/images", cors(corsOptions), imageRoutes);

// connect to db
// mongoose
//   .connect(process.env.ATLAS_URI)
//   .then(() => {
//     // listen for requests
//     app.listen(process.env.PORT, () =>
//       console.log(`Connected to DB, server running on port ${process.env.PORT}`)
//     );
//   })
//   .catch((error) => {
//     console.log(error);
//   });

const serverless = require("serverless-http");

const mongooseConnection = mongoose
  .connect(process.env.ATLAS_URI)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

const handler = serverless(app);

module.exports = async (req, res) => {
  await mongooseConnection;
  return handler(req, res);
};

// module.exports = app;
