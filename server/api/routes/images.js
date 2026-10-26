const asyncRouter = require("../utils/asyncRouter");
const {
  uploadImage,
  getImages,
  getSignature,
  destroyUpload,
} = require("../controllers/imageController");
const authMiddleware = require("../middleware/authMiddleware");

const router = asyncRouter();

router.post("/", authMiddleware, uploadImage);
router.get("/", authMiddleware, getImages);
router.get("/get-signature", authMiddleware, getSignature);
router.post("/destroy", authMiddleware, destroyUpload);

module.exports = router;
