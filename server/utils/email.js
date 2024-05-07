const nodemailer = require("nodemailer");

// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "chrismitch774@gmail.com",
    pass: "fbhc fmno akqs yzbf",
  },
});

const sendEmail = async (name, email, subject, message) => {
  console.log(
    "email: " +
      email +
      " name: " +
      name +
      " subject: " +
      subject +
      " message: " +
      message
  );

  transporter
    .sendMail({
      from: email, // sender address
      to: "chrismitch774@gmail.com", // list of receivers
      subject: subject, // Subject line
      text: message, // plain text body
    })
    .then((res) => {
      console.log(res);
    })
    .catch((error) => {
      console.log(error);
    });
};

module.exports = { sendEmail };
