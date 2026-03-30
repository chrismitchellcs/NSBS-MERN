const express = require("express");
const {
  uploadImage,
  getImages,
  getSignature,
  destroyUpload,
} = require("../controllers/imageController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", uploadImage);
router.get("/", getImages);
router.get("/get-signature", getSignature);
router.post("/destroy", authMiddleware, destroyUpload);

module.exports = router;
