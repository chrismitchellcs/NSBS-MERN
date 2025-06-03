const express = require("express");
const serverless = require("serverless-http");
const cors = require("cors");

const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000", "https://your-frontend.vercel.app"],
    credentials: true,
  })
);

app.get("/test", (req, res) => {
  res.json({ message: "API working! ✅" });
});

// ✅ Final export
module.exports.handler = serverless(app);
