const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
  getPublicListings,
  getAllListings,
  createListing,
  updateListing,
  deleteListing,
} = require("../controllers/serviceListingController");

const router = express.Router();

router.get("/public", getPublicListings);
router.get("/", authMiddleware, getAllListings);
router.post("/", authMiddleware, createListing);
router.patch("/:id", authMiddleware, updateListing);
router.delete("/:id", authMiddleware, deleteListing);

module.exports = router;
