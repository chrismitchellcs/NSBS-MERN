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
    fulfillmentHtml = `
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
    fulfillmentHtml = `
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
    fulfillmentHtml = `
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

function escapeHtml(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatCad2(n) {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(n) || 0);
}

function checkoutDeliveryLabel(d) {
  const x = String(d || "").toLowerCase();
  if (x === "pickup") return "Pick Up In Store";
  if (x === "ship") return "Ship To Me";
  return d ? String(d) : "N/A";
}

/** Notify shop of a successful web checkout card payment (same inbox as bike inquiries). */
const sendCheckoutPaymentEmail = async ({
  bikeLabel,
  bikeid,
  bikeColor,
  bikeSize,
  inquiry = {},
  cardholderName,
  billing,
  charge,
  bambora,
}) => {
  const sub = formatCad2(charge.subTotal);
  const tax = formatCad2(charge.tax);
  const total = formatCad2(charge.total);
  const txId = bambora?.id != null ? String(bambora.id) : "N/A";
  const txMsg = bambora?.message != null ? String(bambora.message) : "N/A";
  const txOk =
    bambora?.approved === "1" ||
    bambora?.approved === 1 ||
    bambora?.approved === true
      ? "Yes"
      : bambora?.approved != null
      ? String(bambora.approved)
      : "N/A";

  const bill = billing || {};
  const billLines = [
    bill.line1,
    bill.line2,
    [bill.city, bill.province, bill.postal].filter(Boolean).join(", "),
    bill.country,
  ]
    .filter(Boolean)
    .join("\n");

  const q = inquiry;
  const shipIsShip = String(q.deliveryOption || "").toLowerCase() === "ship";

  let shippingText = "";
  if (shipIsShip) {
    shippingText = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SHIPPING ADDRESS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
First Name: ${q.shipFirstName || "N/A"}
Last Name: ${q.shipLastName || "N/A"}
Address: ${q.shipAddress || "N/A"}
Apartment/Suite: ${q.shipApartmentSuite || "N/A"}
City: ${q.shipCity || "N/A"}
Province: ${q.shipProvince || "N/A"}
Postal Code: ${q.shipPostal || "N/A"}
`;
  }

  const textData = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CHECKOUT — CARD PAYMENT (BAMBORA)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CONTACT (from checkout form)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Name: ${q.customerName || "N/A"}
Email: ${q.customerEmail || "N/A"}
Phone: ${q.customerPhone || "N/A"}

DELIVERY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${checkoutDeliveryLabel(q.deliveryOption)}
${shippingText}
PAYMENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Subtotal: ${sub}
Est. tax (BC 5%): ${tax}
Total charged: ${total}
Transaction ID: ${txId}
Gateway message: ${txMsg}
Approved: ${txOk}

BIKE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Bike: ${bikeLabel || "N/A"}
Color: ${bikeColor || "N/A"}
Size: ${bikeSize || "N/A"}
Availability (from link): ${q.bikeAvailability || "N/A"}
Bike ID: ${bikeid || "N/A"}

CARDHOLDER / BILLING (AVS)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Name on card: ${cardholderName || "N/A"}

${billLines || "N/A"}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;

  const e = (v) => escapeHtml(v);

  const shippingHtml = shipIsShip
    ? `
    <div class="section">
      <div class="section-title">Shipping address</div>
      <div class="field"><span class="label">First name:</span> <span class="value">${e(
        q.shipFirstName
      )}</span></div>
      <div class="field"><span class="label">Last name:</span> <span class="value">${e(
        q.shipLastName
      )}</span></div>
      <div class="field"><span class="label">Address:</span> <span class="value">${e(
        q.shipAddress
      )}</span></div>
      <div class="field"><span class="label">Apartment/Suite:</span> <span class="value">${e(
        q.shipApartmentSuite
      )}</span></div>
      <div class="field"><span class="label">City:</span> <span class="value">${e(
        q.shipCity
      )}</span></div>
      <div class="field"><span class="label">Province:</span> <span class="value">${e(
        q.shipProvince
      )}</span></div>
      <div class="field"><span class="label">Postal code:</span> <span class="value">${e(
        q.shipPostal
      )}</span></div>
    </div>
    `
    : "";

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
    .header { font-size: 20px; font-weight: bold; margin-bottom: 20px; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">Checkout — card payment</div>

    <div class="section">
      <div class="section-title">Contact</div>
      <div class="field"><span class="label">Name:</span> <span class="value">${e(
        q.customerName
      )}</span></div>
      <div class="field"><span class="label">Email:</span> <span class="value">${e(
        q.customerEmail
      )}</span></div>
      <div class="field"><span class="label">Phone:</span> <span class="value">${e(
        q.customerPhone
      )}</span></div>
    </div>

    <div class="section">
      <div class="section-title">Delivery</div>
      <div class="field"><span class="value">${e(
        checkoutDeliveryLabel(q.deliveryOption)
      )}</span></div>
    </div>
    ${shippingHtml}

    <div class="section">
      <div class="section-title">Payment</div>
      <div class="field"><span class="label">Subtotal:</span> <span class="value">${e(sub)}</span></div>
      <div class="field"><span class="label">Est. tax (BC 5%):</span> <span class="value">${e(tax)}</span></div>
      <div class="field"><span class="label">Total charged:</span> <span class="value">${e(total)}</span></div>
      <div class="field"><span class="label">Transaction ID:</span> <span class="value">${e(txId)}</span></div>
      <div class="field"><span class="label">Gateway message:</span> <span class="value">${e(txMsg)}</span></div>
      <div class="field"><span class="label">Approved:</span> <span class="value">${e(txOk)}</span></div>
    </div>

    <div class="section">
      <div class="section-title">Bike</div>
      <div class="field"><span class="label">Bike:</span> <span class="value">${e(bikeLabel)}</span></div>
      <div class="field"><span class="label">Color:</span> <span class="value">${e(bikeColor)}</span></div>
      <div class="field"><span class="label">Size:</span> <span class="value">${e(bikeSize)}</span></div>
      <div class="field"><span class="label">Availability (from link):</span> <span class="value">${e(
        q.bikeAvailability
      )}</span></div>
      <div class="field"><span class="label">Bike ID:</span> <span class="value">${e(bikeid)}</span></div>
    </div>

    <div class="section">
      <div class="section-title">Cardholder / billing</div>
      <div class="field"><span class="label">Name on card:</span> <span class="value">${e(cardholderName)}</span></div>
      <div class="field"><span class="value" style="white-space: pre-wrap;">${e(billLines || "N/A")}</span></div>
    </div>
  </div>
</body>
</html>
`;

  const shop = "northshorebikeshop@gmail.com";
  const safeSubjectBike = String(bikeLabel || "Bike").slice(0, 80);
  const replyEmail = String(q.customerEmail || "").trim();
  const mailOpts = {
    from: `"NSBS Checkout" <${shop}>`,
    to: shop,
    subject: `Checkout payment: ${safeSubjectBike} — ${total}`,
    text: textData,
    html: htmlData,
  };
  if (replyEmail.includes("@")) {
    mailOpts.replyTo = replyEmail;
  }

  await nodemailer
    .createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: shop,
        pass: process.env.GMAIL_PASS,
      },
    })
    .sendMail(mailOpts);
  console.log("[sendCheckoutPaymentEmail] sent for tx " + txId);
};

/** Short receipt for the customer after a successful checkout payment. */
const sendCheckoutPaymentCustomerEmail = async ({
  customerName,
  customerEmail,
  bikeLabel,
  bikeColor,
  bikeSize,
  charge,
  transactionId,
}) => {
  const to = String(customerEmail || "").trim();
  if (!to.includes("@")) return;

  const shop = "northshorebikeshop@gmail.com";
  const first = String(customerName || "").trim() || "there";
  const bike = String(bikeLabel || "Your bike").trim();
  const sub = formatCad2(charge.subTotal);
  const tax = formatCad2(charge.tax);
  const total = formatCad2(charge.total);
  const tx = transactionId != null ? String(transactionId) : "N/A";
  const col = String(bikeColor || "—");
  const sz = String(bikeSize || "—");

  const textData = `Hi ${first},

Your payment was successful. Thank you for your order!

ORDER SUMMARY
Bike: ${bike}
Colour: ${col}
Size: ${sz}
Subtotal: ${sub}
Estimated tax (BC 5%): ${tax}
Total charged: ${total}
Transaction reference: ${tx}

We've also notified the shop. We'll be in touch soon to coordinate pickup or shipping. If you have questions, reply to this email or call North Shore Bike Shop.

— North Shore Bike Shop
`;

  const e = escapeHtml;
  const htmlData = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 560px; margin: 0 auto; padding: 20px; }
    .box { padding: 16px; background: #f9f9f9; border-left: 4px solid #111; margin: 16px 0; }
    h1 { font-size: 18px; margin: 0 0 12px; }
  </style>
</head>
<body>
  <div class="container">
    <p>Hi ${e(first)},</p>
    <p><strong>Your payment was successful.</strong> Thank you for your order!</p>
    <div class="box">
      <h1>Order summary</h1>
      <p><strong>Bike:</strong> ${e(bike)}<br/>
      <strong>Colour:</strong> ${e(col)}<br/>
      <strong>Size:</strong> ${e(sz)}<br/>
      <strong>Subtotal:</strong> ${e(sub)}<br/>
      <strong>Est. tax (BC 5%):</strong> ${e(tax)}<br/>
      <strong>Total charged:</strong> ${e(total)}<br/>
      <strong>Transaction reference:</strong> ${e(tx)}</p>
    </div>
    <p>We&apos;ve notified the shop. We&apos;ll be in touch soon to coordinate <strong>pickup</strong> or <strong>shipping</strong>.</p>
    <p>If you have questions, reply to this email or call North Shore Bike Shop.</p>
    <p>— North Shore Bike Shop</p>
  </div>
</body>
</html>
`;

  const subjBike = bike.slice(0, 50);
  await nodemailer
    .createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: shop,
        pass: process.env.GMAIL_PASS,
      },
    })
    .sendMail({
      from: `"North Shore Bike Shop" <${shop}>`,
      to,
      replyTo: shop,
      subject: `Payment received — ${subjBike}`,
      text: textData,
      html: htmlData,
    });
  console.log("[sendCheckoutPaymentCustomerEmail] sent to customer");
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

module.exports = {
  sendEmail,
  sendBikeEmail,
  sendCheckoutPaymentEmail,
  sendCheckoutPaymentCustomerEmail,
};
