const nodemailer = require("nodemailer");

const sendEmail = async (name, email, subject, message) => {
  const data = `from: ${email}\n
  subject: ${subject}\n
  message: ${message}\n`;

  try {
    await nodemailer
      .createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: "chrismitch774@gmail.com",
          pass: process.env.GMAIL_PASS,
        },
      })
      .sendMail({
        name: name,
        from: email, // sender address
        to: "chrismitch774@gmail.com", // list of receivers
        subject: subject, // Subject line
        text: data, // plain text body
      });
    console.log("Email sent to " + email);
  } catch (e) {
    console.error(e);
  }
};

// // create reusable transporter object using the default SMTP transport
// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   host: "smtp.gmail.com",
//   port: 587,
//   secure: false,
//   auth: {
//     user: "chrismitch774@gmail.com",
//     pass: "fbhc fmno akqs yzbf",
//   },
// });

// const sendEmail = async (name, email, subject, message) => {
//   console.log(
//     "email: " +
//       email +
//       " name: " +
//       name +
//       " subject: " +
//       subject +
//       " message: " +
//       message
//   );

//   transporter
//     .sendMail({
// from: email, // sender address
// to: "chrismitch774@gmail.com", // list of receivers
// subject: subject, // Subject line
// text: message, // plain text body
//     })
//     .then((res) => {
//       console.log(res);
//     })
//     .catch((error) => {
//       console.log(error);
//     });
// };

// const nodemailer = require("nodemailer");

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   host: "smtp.gmail.com",
//   port: 587,
//   secure: false,
//   auth: {
//     user: "chrismitch774@gmail.com",
//     pass: "fbhc fmno akqs yzbf",
//   },
// });

// const sendEmail = async (name, email, subject, message) => {
//   await new Promise((resolve, reject) => {
//     // verify connection configuration
//     transporter.verify(function (error, success) {
//       if (error) {
//         console.log(error);
//         reject(error);
//       } else {
//         console.log("Server is ready to take our messages");
//         resolve(success);
//       }
//     });
//   });

//   const mailData = {
//     from: {
//       name: { name },
//       address: { email },
//     },
//     replyTo: "chrismitch774@gmail.com",
//     to: "chrismitch774@gmail.com",
//     subject: { subject },
//     text: { message },
//   };

//   await new Promise((resolve, reject) => {
//     // send mail
//     transporter.sendMail(mailData, (err, info) => {
//       if (err) {
//         console.error(err);
//         reject(err);
//       } else {
//         console.log(info);
//         resolve(info);
//       }
//     });
//   });

//   res.status(200).json({ status: "OK" });
// };

module.exports = { sendEmail };
