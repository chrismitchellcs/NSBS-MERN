const express = require("express");
const Bike = require("../models/bikeModel");
const { uploadImage, getImages } = require("../controllers/imageController");

const router = express.Router();

router.post("/", uploadImage);
router.get("/", getImages);

module.exports = router;
