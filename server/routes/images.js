const express = require("express");
const {
  uploadImage,
  getImages,
  getSignature,
} = require("../controllers/imageController");

const router = express.Router();

router.post("/", uploadImage);
router.get("/", getImages);
router.get("/get-signature", getSignature);

module.exports = router;
