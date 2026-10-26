const asyncRouter = require("../utils/asyncRouter");
const authMiddleware = require("../middleware/authMiddleware");
const {
  getPublicSlides,
  getAllSlides,
  createSlide,
  updateSlide,
  deleteSlide,
} = require("../controllers/headerHeroController");

const router = asyncRouter();

router.get("/public", getPublicSlides);
router.get("/", authMiddleware, getAllSlides);
router.post("/", authMiddleware, createSlide);
router.patch("/:id", authMiddleware, updateSlide);
router.delete("/:id", authMiddleware, deleteSlide);

module.exports = router;
