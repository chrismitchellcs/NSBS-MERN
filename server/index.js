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

app.use(
  cors({
    origin: "http://localhost:3000", // Explicitly allow your frontend
    credentials: true, // Allow cookies/session headers
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
app.use("/api/bikes", bikeRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/images", imageRoutes);

// connect to db
mongoose
  .connect(process.env.ATLAS_URI)
  .then(() => {
    // listen for requests
    app.listen(process.env.PORT, () =>
      console.log(`Connected to DB, server running on port ${process.env.PORT}`)
    );
  })
  .catch((error) => {
    console.log(error);
  });

module.exports = app;
