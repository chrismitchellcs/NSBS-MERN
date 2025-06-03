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

app.get("/", (req, res) => {
  res.send("Backend root — nothing here except 404 by default.");
});

module.exports = serverless(app);
