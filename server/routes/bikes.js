const express = require("express");
const Bike = require("../models/bikeModel");
const {
  createBike,
  getBikes,
  getBike,
  deleteBike,
  updateBike,
  sendForm,
  getBikesByType,
  getBikesByBrand,
  testBikes,
} = require("../controllers/bikeController");

const router = express.Router();

router.get("/test", testBikes);
router.get("/", getBikes);
router.post("/type", getBikesByType);
router.post("/brand", getBikesByBrand);

router.get("/:id", getBike);

router.post("/", createBike);

router.post("/sendform", sendForm);

router.delete("/:id", deleteBike);

router.patch("/:id", updateBike);

// router.get("/password", checkPassword);

module.exports = router;
