// api/index.js
const express = require("express");
const serverless = require("serverless-http");
const cors = require("cors");

const app = express();

// CORS - allow frontend
app.use(
  cors({
    origin: ["http://localhost:3000", "https://your-frontend.vercel.app"],
    credentials: true,
  })
);

// Test route
app.get("/api/test", (req, res) => {
  res.json({ message: "API working! ✅" });
});

module.exports = serverless(app);
