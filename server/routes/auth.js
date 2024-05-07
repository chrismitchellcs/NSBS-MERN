const express = require("express");
const Bike = require("../models/bikeModel");
const { checkPassword } = require("../controllers/authController");
const {
  createBike,
  getBikes,
  getBike,
  deleteBike,
  updateBike,
  sendForm,
  // checkPassword,
} = require("../controllers/bikeController");

const router = express.Router();

router.post("/", checkPassword);

module.exports = router;
