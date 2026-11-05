const asyncRouter = require("../utils/asyncRouter");
const authMiddleware = require("../middleware/authMiddleware");
const { getCatalog, updateCatalog } = require("../controllers/catalogController");

const router = asyncRouter();

router.get("/", authMiddleware, getCatalog);
router.patch("/", authMiddleware, updateCatalog);

module.exports = router;
