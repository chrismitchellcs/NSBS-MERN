const express = require("express");
const { checkPassword } = require("../controllers/authController");

const router = express.Router();

router.post("/", checkPassword);

module.exports = router;
