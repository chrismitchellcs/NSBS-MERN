const Bike = require("../models/bikeModel");
const mongoose = require("mongoose");
const { post } = require("../routes/bikes");
const axios = require("axios");

// const sendForm = async (req, res) => {
//   const { token, name, email, message } = req.body;

//   try {
//     const response = await axios.post(
//       `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.SECRET_KEY}&response=${token}`
//     );

//     if (response.data.success) {
//       console.log(name);
//       res.send("Human");
//     } else {
//       res.status(500).send("Robot");
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).send(error);
//   }
// };

const checkPassword = async (req, res) => {
  const { password } = req.body;

  if (password == process.env.ADMIN_PASSWORD) {
    res.status(200).send("accepted");
  } else {
    res.status(400).send("incorrect password");
  }
};

module.exports = {
  checkPassword,
};
