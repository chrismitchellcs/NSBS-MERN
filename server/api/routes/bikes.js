const asyncRouter = require("../utils/asyncRouter");
const {
  getBikes,
  getBike,
  getBikeViewStats,
  sendForm,
  sendBikeForm,
  getBikesByType,
  getBikesByBrand,
  getHomePreviewBikes,
  testBikes,
  addTransitions,
  addNorco,
  deleteNorco,
  purgeNorcoExcludedModels,
  getTransitions,
  getAllNorco,
  updateTransition,
  updateTransitionInStore,
  updateNorco,
  getOthers,
  getAllTransitions,
  createOther,
  updateOther,
  deleteOther,
  getAll,
} = require("../controllers/bikeController");
const authMiddleware = require("../middleware/authMiddleware");

const router = asyncRouter();

// public routes
router.get("/test", testBikes);

router.get("/", getBikes);
router.get("/home-preview", getHomePreviewBikes);
router.get("/all", authMiddleware, getAll);

router.get("/transition", getTransitions);
router.get("/alltransition", authMiddleware, getAllTransitions);
router.get("/allnorco", authMiddleware, getAllNorco);
router.get("/other", authMiddleware, getOthers);
router.post("/type", getBikesByType);
router.post("/brand", getBikesByBrand);
router.get("/admin/view-stats", authMiddleware, getBikeViewStats);
router.get("/:id", getBike);
router.post("/sendform", sendForm);
router.post("/sendbikeform", sendBikeForm);

// private routes

router.post("/transition", authMiddleware, addTransitions);
router.post("/norco/purge-excluded", authMiddleware, purgeNorcoExcludedModels);
router.post("/norco", authMiddleware, addNorco);
router.post("/other", authMiddleware, createOther);
router.delete("/other/:id", authMiddleware, deleteOther);
router.delete("/norco/:id", authMiddleware, deleteNorco);

router.patch("/transition/:id", authMiddleware, updateTransition);
router.patch("/transition/:id/in-store", authMiddleware, updateTransitionInStore);
router.patch("/norco/:id", authMiddleware, updateNorco);
router.patch("/other/:id", authMiddleware, updateOther);

// router.get("/password", checkPassword);

module.exports = router;
