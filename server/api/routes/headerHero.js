const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
  getPublicSlides,
  getAllSlides,
  createSlide,
  updateSlide,
  deleteSlide,
} = require("../controllers/headerHeroController");

const router = express.Router();

router.get("/public", getPublicSlides);
router.get("/", authMiddleware, getAllSlides);
router.post("/", authMiddleware, createSlide);
router.patch("/:id", authMiddleware, updateSlide);
router.delete("/:id", authMiddleware, deleteSlide);

module.exports = router;
