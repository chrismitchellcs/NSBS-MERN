const nodemailer = require("nodemailer");

/** Markup built by `html` below; passes through unescaped when nested in another `html` template. */
class SafeHtml {
  constructor(value) {
    this.value = value;
  }
  toString() {
    return this.value;
  }
}

/** Template tag for email HTML: every interpolated value is escaped unless it is itself SafeHtml. */
function html(strings, ...values) {
  return new SafeHtml(
    strings.reduce((out, chunk, i) => {
      if (i >= values.length) return out + chunk;
      const v = values[i];
      return out + chunk + (v instanceof SafeHtml ? v.value : escapeHtml(v));
    }, "")
  );
}

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
  const htmlData = html`
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
`.value;

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
        replyTo: email,
        to: "northshorebikeshop@gmail.com", // list of receivers
        subject: subject || "New Contact Form Inquiry", // Subject line
        text: textData, // plain text body
        html: htmlData, // html body
      });
    console.log("Email sent to " + email);
  } catch (e) {
    // Rethrown so the form reports a failure instead of telling the customer it was sent.
    console.error(e);
    throw e;
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
  message,
  fulfillmentMeta = null
) => {
  // Format price
  const formattedPrice = bikeprice
    ? `$${Number(bikeprice).toLocaleString()}.00 CAD`
    : "N/A";

  const fulfillment = fulfillmentMeta && fulfillmentMeta.fulfillment;
  const vendorAvailability =
    (fulfillmentMeta && fulfillmentMeta.vendorAvailability) ||
    bikeavailability ||
    "N/A";

  let fulfillmentText = "";
  let fulfillmentHtml = "";
  if (fulfillment === "from_stock") {
    fulfillmentText = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FULFILLMENT — IN STORE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
In store per website inventory — confirm the unit.
WEBSITE INQUIRY – NOT PAID.
Payable later: yes
`;
    fulfillmentHtml = html`
    <div class="section">
      <div class="section-title">Fulfillment — In Store</div>
      <div class="field"><span class="value">In store per website inventory — confirm the unit. WEBSITE INQUIRY – NOT PAID.</span></div>
      <div class="field"><span class="label">Payable later:</span> <span class="value">Yes</span></div>
    </div>`;
  } else if (fulfillment === "special_order") {
    fulfillmentText = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FULFILLMENT — SPECIAL ORDER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Vendor shows ${vendorAvailability} — place a special order.
WEBSITE INQUIRY – NOT PAID.
Payable later: yes
`;
    fulfillmentHtml = html`
    <div class="section">
      <div class="section-title">Fulfillment — Special Order</div>
      <div class="field"><span class="value">Vendor shows ${vendorAvailability} — place a special order. WEBSITE INQUIRY – NOT PAID.</span></div>
      <div class="field"><span class="label">Payable later:</span> <span class="value">Yes</span></div>
    </div>`;
  } else if (fulfillment === "inquiry_only") {
    const low =
      vendorAvailability && /low\s*stock\s*\(([12])\)/i.test(vendorAvailability);
    const oos =
      vendorAvailability && /out\s*of\s*stock/i.test(String(vendorAvailability));
    const reason = oos
      ? "Out of stock — reply with ETA or alternatives. Do not take payment online."
      : low
      ? "Vendor Low Stock (N≤2) — too thin to special-order/pay online. Reply with options."
      : "Inquiry only. Do not take payment online for this configuration.";
    fulfillmentText = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
INQUIRY ONLY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${reason}
Vendor / availability: ${vendorAvailability}
Payable later: no
`;
    fulfillmentHtml = html`
    <div class="section">
      <div class="section-title">Inquiry Only</div>
      <div class="field"><span class="value">${reason}</span></div>
      <div class="field"><span class="label">Availability:</span> <span class="value">${vendorAvailability}</span></div>
      <div class="field"><span class="label">Payable later:</span> <span class="value">No</span></div>
    </div>`;
  }

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
${fulfillmentText}
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
  const htmlData = html`
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
${fulfillmentHtml}
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
        ? html`
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
`.value;

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
        replyTo: email,
        to: "northshorebikeshop@gmail.com", // list of receivers
        subject: `Bike Inquiry: ${bike || "New Inquiry"}`, // Subject line
        text: textData, // plain text body
        html: htmlData, // html body
      });
    console.log("Email sent to " + email);
  } catch (e) {
    // Rethrown so the form reports a failure instead of telling the customer it was sent.
    console.error(e);
    throw e;
  }
};

function escapeHtml(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

module.exports = {
  sendEmail,
  sendBikeEmail,
};
