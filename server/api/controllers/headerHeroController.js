const mongoose = require("mongoose");
const HeaderHeroSlide = require("../models/HeaderHeroSlide");

/** Hero slides store Cloudinary `secure_url` values only (https). */
const isHttpsImageUrl = (url) =>
  typeof url === "string" && /^https:\/\//i.test(url.trim());

const getPublicSlides = async (req, res) => {
  try {
    const slides = await HeaderHeroSlide.find({ active: true })
      .sort({ sortOrder: 1, createdAt: 1 })
      .lean();
    res.status(200).json(slides);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAllSlides = async (req, res) => {
  try {
    const slides = await HeaderHeroSlide.find({})
      .sort({ sortOrder: 1, createdAt: 1 })
      .lean();
    res.status(200).json(slides);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createSlide = async (req, res) => {
  try {
    if (!isHttpsImageUrl(req.body?.imageUrl)) {
      return res.status(400).json({
        error: "imageUrl must be an https URL from Cloudinary upload.",
      });
    }
    const slide = await HeaderHeroSlide.create(req.body);
    res.status(201).json(slide);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const updateSlide = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Invalid id" });
  }
  try {
    if (Object.prototype.hasOwnProperty.call(req.body, "imageUrl")) {
      const existing = await HeaderHeroSlide.findById(id).select("imageUrl").lean();
      const prev = existing?.imageUrl ?? "";
      const next = req.body.imageUrl ?? "";
      const imageUrlUnchanged =
        String(prev).trim() === String(next).trim();
      if (!imageUrlUnchanged && !isHttpsImageUrl(next)) {
        return res.status(400).json({
          error: "imageUrl must be an https URL from Cloudinary upload.",
        });
      }
    }
    const slide = await HeaderHeroSlide.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true, runValidators: true }
    );
    if (!slide) return res.status(404).json({ error: "Slide not found" });
    res.status(200).json(slide);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const deleteSlide = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Invalid id" });
  }
  try {
    const slide = await HeaderHeroSlide.findByIdAndDelete(id);
    if (!slide) return res.status(404).json({ error: "Slide not found" });
    res.status(200).json({ message: "Deleted", id });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  getPublicSlides,
  getAllSlides,
  createSlide,
  updateSlide,
  deleteSlide,
};
