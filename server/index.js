require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bikeRoutes = require("./routes/bikes");
const authRoutes = require("./routes/auth");
const imageRoutes = require("./routes/images");

// express
const app = express();
const cors = require("cors");
app.use(cors({ origin: "*" }));

// cors({
//   origin: ["*"],
//   methods: ["POST", "GET", "DELETE"],
//   credentials: true,
// })

app.use("/", (req, res) => {
  res.send("server is running");
});

// middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

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
