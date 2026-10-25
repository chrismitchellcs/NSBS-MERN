import axios from "axios";
import CheckIcon from "@mui/icons-material/Check";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { useEffect, useRef, useState } from "react";

const style = {
  base: {
    color: "#111827", // text-gray-900
    fontSize: "0.875rem", // text-sm
    fontFamily: "Inter, system-ui, sans-serif",
    fontWeight: "400",
  },

  error: {
    color: "#DC2626", // text-red-600
  },
};

// Classes to be applied to the element wrapping the iframe
var classes = {
  error: "my-error-class",
};

var cardOptions = {
  placeholder: "Card number",
  style: style,
  classes: classes,
  brands: ["visa", "mastercard", "amex"],
};

var expiryOptions = {
  placeholder: "MM/YY",
  style: style,
  classes: classes,
};

var cvvOptions = {
  placeholder: "CVV",
  style: style,
  classes: classes,
};

const inputClass =
  "w-full rounded-lg border border-gray-200 bg-white px-3.5 py-3 text-[15px] text-gray-900 placeholder:text-gray-400 shadow-sm outline-none transition-colors focus:border-gray-900 focus:ring-1 focus:ring-gray-900";

const CA_PROVINCES = [
  { code: "BC", name: "British Columbia" },
  { code: "AB", name: "Alberta" },
  { code: "SK", name: "Saskatchewan" },
  { code: "MB", name: "Manitoba" },
  { code: "ON", name: "Ontario" },
  { code: "QC", name: "Quebec" },
  { code: "NB", name: "New Brunswick" },
  { code: "NS", name: "Nova Scotia" },
  { code: "PE", name: "Prince Edward Island" },
  { code: "NL", name: "Newfoundland and Labrador" },
  { code: "YT", name: "Yukon" },
  { code: "NT", name: "Northwest Territories" },
  { code: "NU", name: "Nunavut" },
];

function isCanadianPostal(postalNoSpace) {
  return /^[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z]\d[ABCEGHJ-NPRSTV-Z]\d$/i.test(
    postalNoSpace
  );
}

/** Map free-text shipping province to a billing select code. */
function provinceCodeFromShipping(raw) {
  const t = String(raw || "").trim();
  if (!t) return "BC";
  const up = t.toUpperCase();
  if (CA_PROVINCES.some((p) => p.code === up)) return up;
  const lower = t.toLowerCase();
  const exact = CA_PROVINCES.find((p) => p.name.toLowerCase() === lower);
  if (exact) return exact.code;
  return "BC";
}

/** Reads Contact + Delivery + Shipping from the checkout inquiry form (same page, above Payment). */
function readCheckoutInquiryForm() {
  const el =
    typeof document !== "undefined"
      ? document.getElementById("checkout-inquiry-form")
      : null;
  if (!el || !(el instanceof HTMLFormElement)) {
    return {
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      deliveryOption: "",
      shipFirstName: "",
      shipLastName: "",
      shipAddress: "",
      shipApartmentSuite: "",
      shipCity: "",
      shipProvince: "",
      shipPostal: "",
    };
  }
  const fd = new FormData(el);
  const g = (k) => {
    const v = fd.get(k);
    return v == null ? "" : String(v).trim();
  };
  return {
    customerName: g("name"),
    customerEmail: g("email"),
    customerPhone: g("phone"),
    deliveryOption: g("deliveryOption"),
    shipFirstName: g("first-name"),
    shipLastName: g("last-name"),
    shipAddress: g("address"),
    shipApartmentSuite: g("apartment-suite"),
    shipCity: g("city"),
    shipProvince: g("province"),
    shipPostal: g("postal-code"),
  };
}

function validateContactForPay(inquiry) {
  const name = String(inquiry?.customerName || "").trim();
  if (!name) {
    return "Enter your full name in the Contact section above, then try again.";
  }
  const email = String(inquiry?.customerEmail || "").trim();
  if (!email) {
    return "Enter your email in the Contact section above, then try again.";
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return "Enter a valid email address in the Contact section above, then try again.";
  }
  return null;
}

function validateBillingFields({
  nameOnCard,
  line1,
  city,
  province,
  postal,
  country,
}) {
  if (!String(nameOnCard || "").trim()) {
    return "Enter the name exactly as it appears on your card.";
  }
  if (!String(line1 || "").trim()) {
    return "Enter the street address for your card’s billing address.";
  }
  if (!String(city || "").trim()) return "Enter the billing city.";
  if (!String(province || "").trim()) return "Select or enter the billing province.";
  const p = String(postal || "").replace(/\s+/g, "").toUpperCase();
  if (!p) return "Enter the billing postal code.";
  if (String(country || "CA").toUpperCase() === "CA" && !isCanadianPostal(p)) {
    return "Enter a valid Canadian postal code (e.g. V6Z 1A1).";
  }
  return null;
}

const CreditCardHandler = ({
  bike,
  color,
  size,
  availability,
  subTotal,
  shippingAddress,
  sameAsShippingAvailable,
}) => {
  const checkoutRef = useRef(null);
  const [nameOnCard, setNameOnCard] = useState("");
  const [billingAddressLine1, setBillingAddressLine1] = useState("");
  const [billingAddressLine2, setBillingAddressLine2] = useState("");
  const [billingCity, setBillingCity] = useState("");
  const [billingProvince, setBillingProvince] = useState("BC");
  const [billingPostalCode, setBillingPostalCode] = useState("");
  const [billingCountry] = useState("CA");
  const [payUnsuccessful, setPayUnsuccessful] = useState(false);
  const [shippingCopyError, setShippingCopyError] = useState("");
  const [paying, setPaying] = useState(false);
  const [paymentSucceeded, setPaymentSucceeded] = useState(false);
  /** Whether Contact form had an email (server sends receipt when valid). */
  const [willEmailReceipt, setWillEmailReceipt] = useState(false);

  const copyShippingToBilling = () => {
    setShippingCopyError("");
    const s = shippingAddress || {};
    const line1 = String(s.line1 || "").trim();
    if (!line1) {
      setShippingCopyError(
        "Enter your shipping address above first, then use this button."
      );
      return;
    }
    setBillingAddressLine1(line1);
    setBillingAddressLine2(String(s.line2 || "").trim());
    setBillingCity(String(s.city || "").trim());
    setBillingProvince(provinceCodeFromShipping(s.province));
    setBillingPostalCode(String(s.postal || "").trim());
  };

  const shippingHasLine1 = Boolean(
    String(shippingAddress?.line1 || "").trim()
  );

  const [status, setStatus] = useState({
    "card-number": { complete: false, error: null },
    expiry: { complete: false, error: null },
    cvv: { complete: false, error: null },
    brand: null,
  });

  useEffect(() => {
    // this is so it doesn't double mount
    if (document.getElementById("bambora-customcheckout")) return;

    const script = document.createElement("script");
    script.id = "bambora-customcheckout";
    script.src =
      "https://libs.na.bambora.com/customcheckout/1/customcheckout.js";
    script.async = true;

    script.onload = () => {
      const init = window["customcheckout"];
      if (typeof init !== "function") {
        console.error("customcheckout not found after script load");
        return;
      }

      const customCheckout = init();
      checkoutRef.current = customCheckout;

      const cardNumber = customCheckout.create("card-number", cardOptions);
      const cardExpiry = customCheckout.create("expiry", expiryOptions);
      const cardCvv = customCheckout.create("cvv", cvvOptions);

      cardNumber.mount("#card-number");
      cardExpiry.mount("#card-expiry");
      cardCvv.mount("#card-cvv");

      customCheckout.on("brand", (event) => {
        setStatus((s) => ({
          ...s,
          brand: event.brand,
        }));
      });

      // event listeners for errors and when form is filled
      customCheckout.on("error", (event) => {
        setStatus((s) => ({
          ...s,
          [event.field]: {
            ...s[event.field],
            complete: false,
            error: event.message,
          },
        }));
      });

      customCheckout.on("complete", (event) => {
        setStatus((s) => ({
          ...s,
          [event.field]: { ...s[event.field], complete: true, error: null },
        }));
      });
    };

    script.onerror = () =>
      console.error("Failed to load bambora custom checkout");

    document.body.appendChild(script);
  }, []);

  // setReadyToPay(
  //   status["card-number"].complete &&
  //     status["expiry"].complete &&
  //     status["cvv"].complete
  // );

  const handlePay = () => {
    const cc = checkoutRef.current;
    if (!cc) return;
    setPayUnsuccessful(false);

    const inquiryForPay = readCheckoutInquiryForm();
    const contactErr = validateContactForPay(inquiryForPay);
    if (contactErr) {
      console.warn("[checkout pay]", contactErr);
      setPayUnsuccessful(true);
      return;
    }

    const billingErr = validateBillingFields({
      nameOnCard,
      line1: billingAddressLine1,
      city: billingCity,
      province: billingProvince,
      postal: billingPostalCode,
      country: billingCountry,
    });
    if (billingErr) {
      console.warn("[checkout pay]", billingErr);
      setPayUnsuccessful(true);
      return;
    }

    cc.createToken(
      async (response) => {
        setPaying(true);
        try {
          const inquiry = readCheckoutInquiryForm();
          await axios.post(
            `${process.env.REACT_APP_VERCEL_DOMAIN}/api/bikes/validate-checkout-stock`,
            {
              bikeId: bike._id,
              color,
              size,
              quantity: 1,
            }
          );
          await axios.post(
            `${process.env.REACT_APP_VERCEL_DOMAIN}/api/bikes/pay`,
            {
              token: response.token,
              nameOnCard: nameOnCard.trim(),
              subtotal: subTotal,
              bikeid: bike._id,
              bikeColor: color,
              bikeSize: size,
              bikeAvailability:
                availability != null && availability !== ""
                  ? String(availability)
                  : undefined,
              billingAddressLine1: billingAddressLine1.trim(),
              billingAddressLine2: billingAddressLine2.trim(),
              billingCity: billingCity.trim(),
              billingProvince: billingProvince.trim(),
              billingPostalCode: billingPostalCode.trim(),
              billingCountry,
              ...inquiry,
            }
          );
          setPayUnsuccessful(false);
          const em = readCheckoutInquiryForm().customerEmail?.trim() ?? "";
          setWillEmailReceipt(em.includes("@"));
          setPaymentSucceeded(true);
        } catch (error) {
          console.error("[checkout pay]", error?.response?.data || error);
          setPayUnsuccessful(true);
        } finally {
          setPaying(false);
        }
      },
      (error) => {
        console.error("[checkout pay] token", error);
        setPayUnsuccessful(true);
      }
    );
  };

  const fieldShell = (complete, err) =>
    `w-full rounded-lg border bg-white px-3.5 py-2.5 shadow-sm transition-colors ${
      err
        ? "border-red-400 ring-1 ring-red-200"
        : complete
        ? "border-emerald-300"
        : "border-gray-200 focus-within:border-gray-900 focus-within:ring-1 focus-within:ring-gray-900"
    }`;

  if (paymentSucceeded) {
    return (
      <div
        className="flex flex-col gap-3 rounded-xl border border-emerald-200 bg-emerald-50/80 px-4 py-4 text-sm text-emerald-950"
        role="status"
      >
        <div className="flex items-start gap-3">
          <CheckIcon
            className="text-emerald-600 shrink-0 mt-0.5"
            fontSize="small"
          />
          <div className="space-y-2 min-w-0">
            <p className="font-semibold text-emerald-900">Payment successful</p>
            {willEmailReceipt ? (
              <p className="text-emerald-900/90 leading-relaxed">
                Thank you, your card payment went through. You&apos;ll receive
                an email shortly with your order and payment details (check spam
                if you don&apos;t see it).
              </p>
            ) : (
              <p className="text-emerald-900/90 leading-relaxed">
                Thank you, your card payment went through. Add your email in
                the Contact section at the top if you&apos;d like a receipt
                emailed; otherwise we&apos;ll reach out using the details you
                provided.
              </p>
            )}
            <p className="text-emerald-900/90 leading-relaxed">
              We&apos;ll be in touch soon to coordinate{" "}
              <span className="font-medium">pickup</span> or{" "}
              <span className="font-medium">shipping</span> for your bike.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <form id="checkout-form" className="space-y-5">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-800">
            Name on card
          </label>
          <input
            onChange={(e) => setNameOnCard(e.target.value)}
            value={nameOnCard}
            placeholder="Name as it appears on card"
            autoComplete="cc-name"
            className={inputClass}
          />
        </div>

        <div className="pt-1 border-t border-gray-100 space-y-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-gray-500">
              Billing address
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Must match your card issuer’s records for address verification
              (AVS).
            </p>
            {sameAsShippingAvailable ? (
              <div className="mt-3 space-y-2">
                <button
                  type="button"
                  onClick={copyShippingToBilling}
                  disabled={!shippingHasLine1}
                  className="text-sm font-medium text-gray-900 underline underline-offset-2 decoration-gray-300 hover:decoration-gray-900 disabled:cursor-not-allowed disabled:opacity-40 disabled:no-underline"
                >
                  Same as shipping address
                </button>
                {shippingCopyError ? (
                  <p className="text-red-600 text-sm" role="alert">
                    {shippingCopyError}
                  </p>
                ) : null}
              </div>
            ) : null}
          </div>
          <div className="space-y-1.5">
            <label
              htmlFor="billing-address-1"
              className="text-sm font-medium text-gray-800"
            >
              Street address
            </label>
            <input
              id="billing-address-1"
              value={billingAddressLine1}
              onChange={(e) => setBillingAddressLine1(e.target.value)}
              autoComplete="billing address-line1"
              className={inputClass}
              placeholder="Street and number"
            />
          </div>
          <div className="space-y-1.5">
            <label
              htmlFor="billing-address-2"
              className="text-sm font-medium text-gray-800"
            >
              Apartment, suite (optional)
            </label>
            <input
              id="billing-address-2"
              value={billingAddressLine2}
              onChange={(e) => setBillingAddressLine2(e.target.value)}
              autoComplete="billing address-line2"
              className={inputClass}
              placeholder="Apt, suite, unit"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5 col-span-2 sm:col-span-1">
              <label
                htmlFor="billing-city"
                className="text-sm font-medium text-gray-800"
              >
                City
              </label>
              <input
                id="billing-city"
                value={billingCity}
                onChange={(e) => setBillingCity(e.target.value)}
                autoComplete="billing address-level2"
                className={inputClass}
                placeholder="City"
              />
            </div>
            <div className="space-y-1.5 col-span-2 sm:col-span-1">
              <label
                htmlFor="billing-province"
                className="text-sm font-medium text-gray-800"
              >
                Province
              </label>
              <select
                id="billing-province"
                value={billingProvince}
                onChange={(e) => setBillingProvince(e.target.value)}
                autoComplete="billing address-level1"
                className={inputClass}
              >
                {CA_PROVINCES.map((p) => (
                  <option key={p.code} value={p.code}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label
                htmlFor="billing-postal"
                className="text-sm font-medium text-gray-800"
              >
                Postal code
              </label>
              <input
                id="billing-postal"
                value={billingPostalCode}
                onChange={(e) => setBillingPostalCode(e.target.value)}
                autoComplete="billing postal-code"
                className={inputClass}
                placeholder="V6Z 1A1"
              />
            </div>
            <div className="space-y-1.5">
              <label
                htmlFor="billing-country"
                className="text-sm font-medium text-gray-800"
              >
                Country
              </label>
              <input
                id="billing-country"
                value="Canada"
                readOnly
                className={`${inputClass} bg-gray-50 text-gray-600`}
                aria-readonly="true"
              />
            </div>
          </div>
        </div>

        <div className="space-y-1.5 pt-1 border-t border-gray-100">
          <label className="text-sm font-medium text-gray-800">
            Card number
          </label>
          <div
            id="card-number"
            className={fieldShell(
              status["card-number"].complete,
              status["card-number"].error
            )}
          />
          {status["card-number"].error && (
            <p className="text-red-500 text-sm">
              {status["card-number"].error}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-800">
              Expiry
            </label>
            <div
              id="card-expiry"
              className={fieldShell(
                status["expiry"].complete,
                status["expiry"].error
              )}
            />
            {status["expiry"].error && (
              <p className="text-red-600 text-sm">{status["expiry"].error}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-800">
              Security code
            </label>
            <div
              id="card-cvv"
              className={fieldShell(
                status["cvv"].complete,
                status["cvv"].error
              )}
            />
            {status["cvv"].error && (
              <p className="text-red-600 text-sm">{status["cvv"].error}</p>
            )}
          </div>
        </div>
      </form>
      <div className="flex flex-row gap-2 pt-2">
        <div
          className={`w-11 h-7 items-center justify-center flex bg-white rounded-md border p-1 transition-colors ${
            status.brand === "visa"
              ? "border-gray-900 ring-1 ring-gray-900"
              : "border-gray-200"
          }`}
        >
          <img className="max-h-4 object-contain" src="Visa_Logo.png" alt="" />
        </div>
        <div
          className={`w-11 h-7 items-center justify-center flex bg-white rounded-md border p-1 transition-colors ${
            status.brand === "mastercard"
              ? "border-gray-900 ring-1 ring-gray-900"
              : "border-gray-200"
          }`}
        >
          <img
            className="max-h-4 object-contain"
            src="mastercard.png"
            alt=""
          />
        </div>
        <div
          className={`w-11 h-7 items-center justify-center flex bg-white rounded-md border p-1 transition-colors ${
            status.brand === "amex"
              ? "border-gray-900 ring-1 ring-gray-900"
              : "border-gray-200"
          }`}
        >
          <img className="max-h-5 object-contain" src="amex.svg" alt="" />
        </div>
      </div>
      {payUnsuccessful ? (
        <div
          className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50/80 px-4 py-3.5 text-sm text-red-950 mt-4"
          role="alert"
        >
          <ErrorOutlineIcon
            className="text-red-600 shrink-0 mt-0.5"
            fontSize="small"
          />
          <p className="font-semibold text-red-900 pt-0.5">
            Payment unsuccessful
          </p>
        </div>
      ) : null}
      <button
        type="button"
        onClick={handlePay}
        disabled={paying}
        className={`w-full min-h-[48px] rounded-lg bg-[#1a1a1a] text-[15px] font-medium text-white shadow-sm transition-colors hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed ${payUnsuccessful ? "mt-4" : "mt-5"}`}
      >
        {paying ? "Processing…" : "Pay now"}
      </button>
      <div className="text-xs flex flex-row flex-wrap items-center justify-center gap-2 text-gray-500 mt-4">
        <span>Secure payment ·</span>
        <img className="h-5 w-auto opacity-80" src="worldline.svg" alt="Worldline" />
      </div>
    </div>
  );
};

export default CreditCardHandler;
