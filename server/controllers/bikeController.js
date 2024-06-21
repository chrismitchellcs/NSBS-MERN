const Bike = require("../models/bikeModel");
const mongoose = require("mongoose");
const { sendEmail } = require("../utils/email");
const axios = require("axios");

// get all bikes
const getBikes = async (req, res) => {
  const bikes = await Bike.find({}).sort({ brand: 1, name: 1 });
  res.status(200).json(bikes);
};

const testBikes = async (req, res) => {
  console.log("test");
  res.status(200).send("Test");
};

const getBikesByBrand = async (req, res) => {
  const brand = req.body.brand;

  try {
    const bikes = await Bike.find({ brand: brand });
    res.status(200).json(bikes);
  } catch (error) {
    res.status(400);
  }
};
const getBikesByType = async (req, res) => {
  const type = req.body.type;
  console.log(type);
  try {
    const bikes = await Bike.find({ type: type });
    res.status(200).json(bikes);
  } catch (error) {
    res.status(400);
  }
};

// get a single bike
const getBike = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Invalid ID" });
  }
  const bike = await Bike.findById(id);

  if (!bike) {
    return res.status(404).json({ error: "No such bike" });
  }

  res.status(200).json(bike);
};

// create a new bike

const createBike = async (req, res) => {
  const {
    brand,
    name,
    material,
    type,
    sizes,
    price,
    images,
    description,
    link,
  } = req.body;
  console.log(sizes);
  try {
    const bike = await Bike.create({
      brand,
      name,
      material,
      type,
      sizes,
      price,
      images,
      description,
      link,
    });
    const bikes = await Bike.find({}).sort({ brand: 1, name: 1 });
    res.status(200).json(bikes);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

// delete a bike
const deleteBike = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Invalid ID" });
  }

  const bike = await Bike.findOneAndDelete({ _id: id });
  if (!bike) {
    return res.status(404).json({ error: "No such bike" });
  }

  const bikes = await Bike.find({}).sort({ brand: 1, name: 1 });
  res.status(200).json(bikes);
};

// update a bike
const updateBike = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Invalid ID" });
  }

  const bike = await Bike.findOneAndUpdate(
    { _id: id },
    {
      ...req.body,
    }
  );
  if (!bike) {
    return res.status(404).json({ error: "No such bike" });
  }

  res.status(200).json(bike);
};

const sendForm = async (req, res) => {
  const { token, name, email, subject, message } = req.body;

  try {
    const response = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.SECRET_KEY}&response=${token}`
    );

    if (response.data.success) {
      await sendEmail(name, email, subject, message);
      res.send("Human");
    } else {
      res.status(500).send("Robot");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
};

const checkPassword = async (req, res) => {
  res.status(200).send("");
};

module.exports = {
  createBike,
  getBikes,
  getBike,
  deleteBike,
  updateBike,
  sendForm,
  checkPassword,
  getBikesByType,
  getBikesByBrand,
  testBikes,
};
