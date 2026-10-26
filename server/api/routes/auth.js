const asyncRouter = require("../utils/asyncRouter");
const router = asyncRouter();
const authController = require("../controllers/authController");

router.post("/login", authController.login);
router.get("/check-auth", authController.checkAuth);
router.post("/logout", authController.logout);

module.exports = router;
