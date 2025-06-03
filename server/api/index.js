const express = require("express");
const serverless = require("serverless-http");
const cors = require("cors");

const app = express();

app.use(
  cors({
    origin: "*", // Or restrict to specific domains
    credentials: true,
  })
);

// Test route
app.get("/test", (req, res) => {
  res.json({ message: "Express + Serverless working ✅" });
});

module.exports = serverless(app);
