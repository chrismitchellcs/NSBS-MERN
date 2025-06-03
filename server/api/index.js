const express = require("express");
const cors = require("cors");
const serverless = require("serverless-http");

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "https://nsbs-mern-frontend-git-test-branch-chris-projects-04c8e11c.vercel.app",
];

// CORS options with logging
const corsOptions = {
  origin: function (origin, callback) {
    console.log("CORS Origin:", origin);
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
app.options("*", cors(corsOptions)); // Handle preflight OPTIONS

// A simple test route
app.get("/api/test", (req, res) => {
  res.json({ message: "CORS is working!" });
});

const handler = serverless(app);

if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () =>
    console.log(`Local server on http://localhost:${PORT}`)
  );
} else {
  module.exports = async (req, res) => {
    return handler(req, res);
  };
}
