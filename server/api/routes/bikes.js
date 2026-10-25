const express = require("express");
const {
  createBike,
  getBikes,
  getBike,
  getBikeViewStats,
  deleteBike,
  updateBike,
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
  updateNorco,
  getOthers,
  getAllTransitions,
  createOther,
  updateOther,
  deleteOther,
  getAll,
  pay,
  validateCheckoutStockRoute,
} = require("../controllers/bikeController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

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
router.post("/validate-checkout-stock", validateCheckoutStockRoute);
router.get("/:id", getBike);
router.post("/sendform", sendForm);
router.post("/sendbikeform", sendBikeForm);

router.post("/pay", pay);

// private routes

router.post("/", authMiddleware, createBike);
router.post("/transition", authMiddleware, addTransitions);
router.post("/norco/purge-excluded", authMiddleware, purgeNorcoExcludedModels);
router.post("/norco", authMiddleware, addNorco);
router.post("/other", authMiddleware, createOther);
router.delete("/other/:id", authMiddleware, deleteOther);
router.delete("/norco/:id", authMiddleware, deleteNorco);

router.delete("/:id", authMiddleware, deleteBike);
router.patch("/:id", authMiddleware, updateBike);
router.patch("/transition/:id", authMiddleware, updateTransition);
router.patch("/norco/:id", authMiddleware, updateNorco);
router.patch("/other/:id", authMiddleware, updateOther);

// router.get("/password", checkPassword);

module.exports = router;
