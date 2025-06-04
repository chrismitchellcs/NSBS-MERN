const express = require("express");
const {
  createBike,
  getBikes,
  getBike,
  deleteBike,
  updateBike,
  sendForm,
  sendBikeForm,
  getBikesByType,
  getBikesByBrand,
  testBikes,
  addTransitions,
  getTransitions,
  updateTransition,
  getOthers,
  getAllTransitions,
  createOther,
  updateOther,
  getAll,
} = require("../controllers/bikeController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// public routes
router.get("/test", testBikes);

router.get("/", getBikes);
router.get("/all", getAll);

router.get("/transition", getTransitions);
router.get("/alltransition", authMiddleware, getAllTransitions);
router.get("/other", getOthers);
router.post("/type", getBikesByType);
router.post("/brand", getBikesByBrand);
router.get("/:id", getBike);
router.post("/sendform", sendForm);
router.post("/sendbikeform", sendBikeForm);

// private routes

router.post("/", authMiddleware, createBike);
router.post("/transition", authMiddleware, addTransitions);
router.post("/other", authMiddleware, createOther);

router.delete("/:id", authMiddleware, deleteBike);
router.patch("/:id", authMiddleware, updateBike);
router.patch("/transition/:id", authMiddleware, updateTransition);
router.patch("/other/:id", authMiddleware, updateOther);

// router.get("/password", checkPassword);

module.exports = router;
