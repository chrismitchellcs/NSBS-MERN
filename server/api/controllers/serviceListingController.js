const mongoose = require("mongoose");
const ServiceListing = require("../models/ServiceListing");
const { defaultServiceListings } = require("../utils/defaultServiceListings");

async function ensureSeeded() {
  const count = await ServiceListing.countDocuments();
  if (count === 0) {
    await ServiceListing.insertMany(defaultServiceListings);
  }
}

const getPublicListings = async (req, res) => {
  try {
    await ensureSeeded();
    const items = await ServiceListing.find({ active: true })
      .sort({ sortOrder: 1, createdAt: 1 })
      .lean();
    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAllListings = async (req, res) => {
  try {
    await ensureSeeded();
    const items = await ServiceListing.find({})
      .sort({ sortOrder: 1, createdAt: 1 })
      .lean();
    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createListing = async (req, res) => {
  try {
    const item = await ServiceListing.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const updateListing = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Invalid id" });
  }
  try {
    const item = await ServiceListing.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true, runValidators: true }
    );
    if (!item) return res.status(404).json({ error: "Not found" });
    res.status(200).json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const deleteListing = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Invalid id" });
  }
  try {
    const item = await ServiceListing.findByIdAndDelete(id);
    if (!item) return res.status(404).json({ error: "Not found" });
    res.status(200).json({ message: "Deleted", id });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  getPublicListings,
  getAllListings,
  createListing,
  updateListing,
  deleteListing,
};
