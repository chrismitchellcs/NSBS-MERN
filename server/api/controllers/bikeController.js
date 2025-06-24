const Bike = require("../models/bikeModel");
const Transition = require("../models/Transition");
const Other = require("../models/Other");
const AllBikes = require("../models/AllBikes");
const mongoose = require("mongoose");
const { sendEmail, sendBikeEmail } = require("../utils/email");
const axios = require("axios");

// get all bikes
const getBikes = async (req, res) => {
  const bikes = await AllBikes.find({ public: true }).sort({
    brand: -1,
    name: 1,
  });
  res.status(200).json(bikes);
};

const getOthers = async (req, res) => {
  const bikes = await AllBikes.find({ database: "OTHER" }).sort({
    brand: -1,
    name: 1,
  });
  res.status(200).json(bikes);
};

const getAll = async (req, res) => {
  const bikes = await AllBikes.find({}).sort({ brand: -1, name: 1 });
  res.status(200).json(bikes);
};

const testBikes = async (req, res) => {
  console.log("test");
  res.status(200).send("Test");
};

const getBikesByBrand = async (req, res) => {
  const brand = req.body.brand;

  try {
    const bikes = await AllBikes.aggregate([
      { $match: { brand: brand, public: true } },
      { $sample: { size: 20 } },
    ]);
    res.status(200).json(bikes);
  } catch (error) {
    res.status(400);
  }
};
const getBikesByType = async (req, res) => {
  const type = req.body.type;
  console.log(type);
  try {
    const bikes = await AllBikes.find({ type: type, public: true }).sort({
      brand: 1,
      name: 1,
    });
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
  const bike = await AllBikes.findById(id);

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
    sizesa,
    sizesis,
    price,
    saleprice,
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
      sizesa,
      sizesis,
      price,
      saleprice,
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

const createOther = async (req, res) => {
  const {
    brand,
    type,
    year,
    name,
    price,
    saleprice,
    description,
    link,
    fullName,
    models,
    colors,
    public,
  } = req.body;

  const database = "OTHER";

  try {
    const bike = await AllBikes.create({
      brand,
      type,
      year,
      name,
      price,
      saleprice,
      description,
      link,
      fullName,
      models,
      colors,
      public,
      database,
    });
    const bikes = await AllBikes.find({}).sort({ brand: 1, name: 1 });
    res.status(200).json(bikes);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

function parsePrice(priceString) {
  if (!priceString || typeof priceString !== "string") return 0;
  const cleaned = priceString.replace(/[^0-9.-]+/g, "");
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : Math.round(parsed);
}

const addTransitions = async (req, res) => {
  const bikes = req.body.stock;
  // console.log(bikes);
  const bikesToInsert = Object.entries(bikes).map(([key, model]) => ({
    brand: "Transition",
    fullName: key,
    name: model.name,
    year: model.modelYear,
    price: parsePrice(model.regularRetail),
    saleprice: parsePrice(model.saleRetail),
    models: JSON.stringify(model.bikes),
    colors: JSON.stringify(model.colors),
    inStock: JSON.stringify([]),
    public: false,
    database: "TRANSITION",
  }));
  const operations = bikesToInsert.map((bike) => {
    const updateFields = {};
    const setOnInsertFields = {};

    for (const key in bike) {
      if (bike[key] !== undefined && bike[key] !== "") {
        if (key === "colors" || key === "public" || key === "inStock") {
          setOnInsertFields[key] = bike[key];
        } else {
          updateFields[key] = bike[key];
        }
      }
    }

    const update = { $set: updateFields };
    if (Object.keys(setOnInsertFields).length > 0) {
      update.$setOnInsert = setOnInsertFields;
    }

    return {
      updateOne: {
        filter: { fullName: bike.fullName },
        update,
        upsert: true,
      },
    };
  });
  AllBikes.bulkWrite(operations)
    .then((result) => {
      console.log(`Matched: ${result.matchedCount}`);
      console.log(`Inserted: ${result.upsertedCount}`);
      console.log(`Modified: ${result.modifiedCount}`);
      return res.status(200).json({
        message: "Bulk upsert completed successfully",
        matchedCount: result.matchedCount,
        modifiedCount: result.modifiedCount,
        upsertedCount: result.upsertedCount,
      });
    })
    .catch((err) => {
      console.error("Error during bulk upsert:", err);
      return res.status(500).json({
        message: "An error occurred during bulk upsert",
        error: err.message,
      });
    });
};

const getTransitions = async (req, res) => {
  const bikes = await AllBikes.find({
    database: "TRANSITION",
    public: true,
  }).sort({
    name: 1,
  });
  res.status(200).json(bikes);
};

const getAllTransitions = async (req, res) => {
  const bikes = await AllBikes.find({
    database: "TRANSITION",
  }).sort({
    name: 1,
  });
  res.status(200).json(bikes);
};

const updateTransition = async (req, res) => {
  const { id } = req.params;
  console.log(req.body);
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Invalid ID" });
  }

  const bike = await AllBikes.findOneAndUpdate(
    { _id: id },
    {
      ...req.body.newBike,
    }
  );
  if (!bike) {
    return res.status(404).json({ error: "No such bike" });
  }

  res.status(200).json(bike);
};

const updateOther = async (req, res) => {
  const { id } = req.params;
  console.log(req.body);
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Invalid ID" });
  }

  const bike = await AllBikes.findOneAndUpdate(
    { _id: id },
    {
      ...req.body.newBike,
    }
  );
  if (!bike) {
    return res.status(404).json({ error: "No such bike" });
  }

  res.status(200).json(bike);
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
  console.log(req.body);
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Invalid ID" });
  }

  const bike = await Bike.findOneAndUpdate(
    { _id: id },
    {
      ...req.body.newBike,
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
      res.status(200).send();
    } else {
      res.status(500).send("Robot");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
};

const sendBikeForm = async (req, res) => {
  const { token, name, email, bikename, color, size, message } = req.body;

  try {
    const response = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.SECRET_KEY}&response=${token}`
    );

    if (response.data.success) {
      await sendBikeEmail(name, email, bikename, color, size, message);
      res.status(200).send();
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
  createOther,
  getBikes,
  getOthers,
  getBike,
  deleteBike,
  updateBike,
  addTransitions,
  getAll,
  getTransitions,
  updateTransition,
  sendForm,
  sendBikeForm,
  checkPassword,
  getBikesByType,
  getBikesByBrand,
  testBikes,
  getAllTransitions,
  updateOther,
};
