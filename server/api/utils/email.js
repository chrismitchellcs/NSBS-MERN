const nodemailer = require("nodemailer");

const sendEmail = async (name, email, subject, message) => {
  // Plain text version
  const textData = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
NEW CONTACT FORM INQUIRY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CONTACT INFORMATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Name: ${name || "N/A"}
Email: ${email || "N/A"}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SUBJECT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${subject || "N/A"}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MESSAGE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${message || "N/A"}
`;

  // HTML version
  const htmlData = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .section { margin-bottom: 25px; padding: 15px; background-color: #f9f9f9; border-left: 4px solid #000; }
    .section-title { font-size: 16px; font-weight: bold; margin-bottom: 10px; color: #000; text-transform: uppercase; letter-spacing: 1px; }
    .field { margin-bottom: 8px; }
    .label { font-weight: 600; color: #555; }
    .value { color: #000; }
    .message-box { padding: 15px; background-color: #fff; border: 1px solid #ddd; border-radius: 4px; white-space: pre-wrap; }
    .header { font-size: 20px; font-weight: bold; margin-bottom: 20px; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">NEW CONTACT FORM INQUIRY</div>
    
    <div class="section">
      <div class="section-title">Contact Information</div>
      <div class="field"><span class="label">Name:</span> <span class="value">${
        name || "N/A"
      }</span></div>
      <div class="field"><span class="label">Email:</span> <span class="value">${
        email || "N/A"
      }</span></div>
    </div>

    <div class="section">
      <div class="section-title">Subject</div>
      <div class="value">${subject || "N/A"}</div>
    </div>

    <div class="section">
      <div class="section-title">Message</div>
      <div class="message-box">${message || "N/A"}</div>
    </div>
  </div>
</body>
</html>
`;

  try {
    await nodemailer
      .createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: "northshorebikeshop@gmail.com",
          pass: process.env.GMAIL_PASS,
        },
      })
      .sendMail({
        name: name,
        from: email, // sender address
        to: "northshorebikeshop@gmail.com", // list of receivers
        subject: subject || "New Contact Form Inquiry", // Subject line
        text: textData, // plain text body
        html: htmlData, // html body
      });
    console.log("Email sent to " + email);
  } catch (e) {
    console.error(e);
  }
};

const sendBikeEmail = async (
  token,
  bike,
  bikecolor,
  bikesize,
  bikeprice,
  bikeavailability,
  bikeid,
  name,
  email,
  phone,
  deliveryOption,
  firstName,
  lastName,
  address,
  apartmentSuite,
  city,
  province,
  postalCode,
  message
) => {
  // Format price
  const formattedPrice = bikeprice
    ? `$${Number(bikeprice).toLocaleString()}.00 CAD`
    : "N/A";

  // Build shipping address section
  let shippingAddressSection = "";
  if (deliveryOption === "ship") {
    shippingAddressSection = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SHIPPING ADDRESS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
First Name: ${firstName || "N/A"}
Last Name: ${lastName || "N/A"}
Address: ${address || "N/A"}
Apartment/Suite: ${apartmentSuite || "N/A"}
City: ${city || "N/A"}
Province: ${province || "N/A"}
Postal Code: ${postalCode || "N/A"}
`;
  }

  // Plain text version
  const textData = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
NEW BIKE INQUIRY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

BIKE INFORMATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Bike: ${bike || "N/A"}
Color: ${bikecolor || "N/A"}
Size: ${bikesize || "N/A"}
Price: ${formattedPrice}
Availability: ${bikeavailability || "N/A"}
Bike ID: ${bikeid || "N/A"}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CONTACT INFORMATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Name: ${name || "N/A"}
Email: ${email || "N/A"}
Phone: ${phone || "N/A"}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DELIVERY OPTION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${
  deliveryOption === "pickup"
    ? "Pick Up In Store"
    : deliveryOption === "ship"
    ? "Ship To Me"
    : deliveryOption || "N/A"
}
${shippingAddressSection}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;

  // HTML version
  const htmlData = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .section { margin-bottom: 25px; padding: 15px; background-color: #f9f9f9; border-left: 4px solid #000; }
    .section-title { font-size: 16px; font-weight: bold; margin-bottom: 10px; color: #000; text-transform: uppercase; letter-spacing: 1px; }
    .field { margin-bottom: 8px; }
    .label { font-weight: 600; color: #555; }
    .value { color: #000; }
    .divider { border-top: 2px solid #ddd; margin: 20px 0; }
    .header { font-size: 20px; font-weight: bold; margin-bottom: 20px; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">NEW BIKE INQUIRY</div>
    
    <div class="section">
      <div class="section-title">Bike Information</div>
      <div class="field"><span class="label">Bike:</span> <span class="value">${
        bike || "N/A"
      }</span></div>
      <div class="field"><span class="label">Color:</span> <span class="value">${
        bikecolor || "N/A"
      }</span></div>
      <div class="field"><span class="label">Size:</span> <span class="value">${
        bikesize || "N/A"
      }</span></div>
      <div class="field"><span class="label">Price:</span> <span class="value">${formattedPrice}</span></div>
      <div class="field"><span class="label">Availability:</span> <span class="value">${
        bikeavailability || "N/A"
      }</span></div>
      <div class="field"><span class="label">Bike ID:</span> <span class="value">${
        bikeid || "N/A"
      }</span></div>
    </div>

    <div class="section">
      <div class="section-title">Contact Information</div>
      <div class="field"><span class="label">Name:</span> <span class="value">${
        name || "N/A"
      }</span></div>
      <div class="field"><span class="label">Email:</span> <span class="value">${
        email || "N/A"
      }</span></div>
      <div class="field"><span class="label">Phone:</span> <span class="value">${
        phone || "N/A"
      }</span></div>
    </div>

    <div class="section">
      <div class="section-title">Delivery Option</div>
      <div class="field"><span class="value">${
        deliveryOption === "pickup"
          ? "Pick Up In Store"
          : deliveryOption === "ship"
          ? "Ship To Me"
          : deliveryOption || "N/A"
      }</span></div>
    </div>

    ${
      deliveryOption === "ship"
        ? `
    <div class="section">
      <div class="section-title">Shipping Address</div>
      <div class="field"><span class="label">First Name:</span> <span class="value">${
        firstName || "N/A"
      }</span></div>
      <div class="field"><span class="label">Last Name:</span> <span class="value">${
        lastName || "N/A"
      }</span></div>
      <div class="field"><span class="label">Address:</span> <span class="value">${
        address || "N/A"
      }</span></div>
      <div class="field"><span class="label">Apartment/Suite:</span> <span class="value">${
        apartmentSuite || "N/A"
      }</span></div>
      <div class="field"><span class="label">City:</span> <span class="value">${
        city || "N/A"
      }</span></div>
      <div class="field"><span class="label">Province:</span> <span class="value">${
        province || "N/A"
      }</span></div>
      <div class="field"><span class="label">Postal Code:</span> <span class="value">${
        postalCode || "N/A"
      }</span></div>
    </div>
    `
        : ""
    }
  </div>
</body>
</html>
`;

  try {
    await nodemailer
      .createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: "northshorebikeshop@gmail.com",
          pass: process.env.GMAIL_PASS,
        },
      })
      .sendMail({
        name: name,
        from: email, // sender address
        to: "northshorebikeshop@gmail.com", // list of receivers
        subject: `Bike Inquiry: ${bike || "New Inquiry"}`, // Subject line
        text: textData, // plain text body
        html: htmlData, // html body
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

module.exports = { sendEmail, sendBikeEmail };
