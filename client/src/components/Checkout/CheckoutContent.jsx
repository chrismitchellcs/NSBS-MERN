import axios from "axios";
import { Image } from "cloudinary-react";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import CheckIcon from "@mui/icons-material/Check";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { effectivePrice, hasActiveShopSale, variantPricingFor } from "utils/shopPrice";

const CLOUD_NAME =
  process.env.REACT_APP_CLOUDINARY_CLOUD_NAME || "ds4ukwnxl";

const inputClass =
  "w-full rounded-lg border border-gray-200 bg-white px-3.5 py-3 text-[15px] text-gray-900 placeholder:text-gray-400 shadow-sm outline-none transition-colors focus:border-gray-900 focus:ring-1 focus:ring-gray-900";

const sectionTitle =
  "text-xs font-semibold uppercase tracking-[0.08em] text-gray-500";

function formatCurrency(amount, locale = "en-CA", currency = "CAD") {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

function availabilityTone(av) {
  const s = String(av || "")
    .trim()
    .toLowerCase();
  if (s === "out of stock") return "bg-gray-100 text-gray-700";
  if (s.includes("low stock")) return "bg-amber-50 text-amber-900";
  if (s.includes("in store") || s.includes("in stock")) {
    return "bg-emerald-50 text-emerald-900";
  }
  return "bg-gray-50 text-gray-700";
}

const CheckoutContent = ({ bike, color, size, image, availability }) => {
  const [deliveryOption, setDeliveryOption] = useState("pickup");
  const [shipFirstName, setShipFirstName] = useState("");
  const [shipLastName, setShipLastName] = useState("");
  const [shipAddress, setShipAddress] = useState("");
  const [shipApt, setShipApt] = useState("");
  const [shipCity, setShipCity] = useState("");
  const [shipProvince, setShipProvince] = useState("BC");
  const [shipPostal, setShipPostal] = useState("");
  const captchaRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSent, setFormSent] = useState(false);
  const [formNotSent, setFormNotSent] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const pricing = variantPricingFor(bike, color, size);
  const hasSale = hasActiveShopSale(pricing.saleprice);
  const subTotal = effectivePrice(pricing);
  const regularPrice = Number(pricing.price) || 0;
  const tax = subTotal * 0.05;
  const total = subTotal + tax;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const token = captchaRef.current?.getValue();

    setFormSent(false);
    setFormNotSent(false);
    setSubmitError("");

    if (!token) {
      setIsSubmitting(false);
      return;
    }
    captchaRef.current?.reset();

    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = formData.get("name")?.toString().trim();
    const email = formData.get("email")?.toString().trim();
    const phone = formData.get("phone")?.toString().trim();
    const deliveryOptionVal = deliveryOption;
    const firstName = shipFirstName.trim();
    const lastName = shipLastName.trim();
    const address = shipAddress.trim();
    const apartmentSuite = shipApt.trim();
    const city = shipCity.trim();
    const province = shipProvince.trim();
    const postalCode = shipPostal.trim();

    try {
      await axios.post(
        `${process.env.REACT_APP_VERCEL_DOMAIN}/api/bikes/sendbikeform`,
        {
          token,
          bike: bike.brand + " " + bike.name,
          bikecolor: color,
          bikesize: size,
          bikeprice: subTotal,
          bikeavailability: availability,
          bikeid: bike._id,
          name,
          email,
          phone,
          deliveryOption: deliveryOptionVal,
          firstName,
          lastName,
          address,
          apartmentSuite,
          city,
          province,
          postalCode,
          message: "N/A",
        }
      );
      form.reset();
      setShipFirstName("");
      setShipLastName("");
      setShipAddress("");
      setShipApt("");
      setShipCity("");
      setShipProvince("BC");
      setShipPostal("");
      setFormSent(true);
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "";
      setSubmitError(typeof msg === "string" ? msg : "");
      setFormNotSent(true);
      setFormSent(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-[#fafafa] min-h-[calc(100vh-4rem)] pb-16 pt-6 md:pt-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <p className="text-sm text-gray-500 mb-2">
          <Link
            to="/shop"
            className="text-gray-500 hover:text-gray-900 transition-colors"
          >
            Shop
          </Link>
          <span className="mx-2 text-gray-300">/</span>
          <span className="text-gray-900 font-medium">Checkout</span>
        </p>
        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 tracking-tight mb-8 md:mb-10">
          Checkout
        </h1>

        <div className="flex flex-col lg:grid lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-12 xl:gap-16 lg:items-start">
          {/* Order summary — first on mobile */}
          <aside className="order-1 lg:order-2 mb-8 lg:mb-0 lg:sticky lg:top-24 self-start w-full">
            <div className="rounded-xl border border-gray-200/80 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)] overflow-hidden">
              <div className="border-b border-gray-100 px-5 py-4">
                <h2 className={sectionTitle}>Order summary</h2>
              </div>
              <div className="border-b border-gray-100">
                <div className="p-5">
                  <div className="w-full rounded-lg border border-gray-100 bg-[#f6f7f6] overflow-hidden">
                    <div className="flex h-[200px] sm:h-[240px] w-full items-center justify-center p-3 sm:p-5">
                      {image ? (
                        <Image
                          cloudName={CLOUD_NAME}
                          publicId={image}
                          width="800"
                          crop="pad"
                          quality="90"
                          fetchFormat="auto"
                          alt={`${bike.brand} ${bike.name}`}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "contain",
                            display: "block",
                          }}
                        />
                      ) : (
                        <div className="w-full py-16 flex items-center justify-center text-sm text-gray-400 text-center px-4">
                          No image
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="mt-4 text-center space-y-2">
                    <p className="font-medium text-gray-900 leading-snug text-[15px]">
                      {bike.brand} {bike.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {color} · {size}
                    </p>
                    <div>
                      <span
                        className={`inline-flex text-xs font-medium px-2.5 py-1 rounded-md ${availabilityTone(
                          availability
                        )}`}
                      >
                        {availability || "—"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-5 py-5 space-y-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="text-gray-900 tabular-nums">
                    {hasSale ? (
                      <span className="flex items-center gap-2 justify-end">
                        <span className="text-gray-400 line-through text-xs font-normal">
                          {formatCurrency(regularPrice)}
                        </span>
                        {formatCurrency(subTotal)}
                      </span>
                    ) : (
                      formatCurrency(subTotal)
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Estimated tax (BC 5%)</span>
                  <span className="text-gray-900 tabular-nums">
                    {formatCurrency(tax)}
                  </span>
                </div>
                <div className="flex justify-between pt-3 border-t border-gray-100 text-base font-semibold text-gray-900">
                  <span>Total</span>
                  <span className="tabular-nums">{formatCurrency(total)}</span>
                </div>
                <p className="text-xs text-gray-500 pt-2 flex items-start gap-1.5">
                  <LockOutlinedIcon
                    sx={{ fontSize: 14, mt: "2px", opacity: 0.7 }}
                  />
                  <span>
                    Prices in CAD. Final confirmation by the shop may apply for
                    pickup and shipping.
                  </span>
                </p>
              </div>
            </div>
          </aside>

          {/* Main column */}
          <div className="order-2 lg:order-1 space-y-6 min-w-0">
            <form
              id="checkout-inquiry-form"
              onSubmit={handleSubmit}
              className="rounded-xl border border-gray-200/80 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)] p-6 sm:p-8 space-y-8"
            >
              <div>
                <h2 className={sectionTitle}>Contact</h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2 space-y-1.5">
                    <label
                      htmlFor="checkout-name"
                      className="text-sm font-medium text-gray-800"
                    >
                      Full name{" "}
                      <span className="text-red-600" aria-hidden="true">
                        *
                      </span>
                    </label>
                    <input
                      id="checkout-name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      className={inputClass}
                      placeholder="Full name"
                      required
                      aria-required="true"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label
                      htmlFor="checkout-email"
                      className="text-sm font-medium text-gray-800"
                    >
                      Email{" "}
                      <span className="text-red-600" aria-hidden="true">
                        *
                      </span>
                    </label>
                    <input
                      id="checkout-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      className={inputClass}
                      placeholder="you@example.com"
                      required
                      aria-required="true"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label
                      htmlFor="checkout-phone"
                      className="text-sm font-medium text-gray-800"
                    >
                      Phone
                    </label>
                    <input
                      id="checkout-phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      className={inputClass}
                      placeholder="(555) 555-5555"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <h2 className={sectionTitle}>Delivery</h2>
                <p className="text-sm text-gray-600 mt-2 mb-4">
                  How would you like to receive this bike?
                </p>
                <div className="space-y-3">
                  <label
                    className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-all ${
                      deliveryOption === "pickup"
                        ? "border-gray-900 bg-gray-50 ring-1 ring-gray-900"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="deliveryOption"
                      value="pickup"
                      checked={deliveryOption === "pickup"}
                      onChange={() => setDeliveryOption("pickup")}
                      className="mt-1 h-4 w-4 border-gray-300 text-gray-900 focus:ring-gray-900"
                    />
                    <div>
                      <span className="font-medium text-gray-900">
                        Pick up in store
                      </span>
                      <p className="text-sm text-gray-600 mt-0.5">
                        We&apos;ll confirm when your bike is ready at the shop.
                      </p>
                    </div>
                  </label>
                  <label
                    className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-all ${
                      deliveryOption === "ship"
                        ? "border-gray-900 bg-gray-50 ring-1 ring-gray-900"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="deliveryOption"
                      value="ship"
                      checked={deliveryOption === "ship"}
                      onChange={() => setDeliveryOption("ship")}
                      className="mt-1 h-4 w-4 border-gray-300 text-gray-900 focus:ring-gray-900"
                    />
                    <div>
                      <span className="font-medium text-gray-900">
                        Ship to me
                      </span>
                      <p className="text-sm text-gray-600 mt-0.5">
                        Enter your shipping address below.
                      </p>
                    </div>
                  </label>
                </div>

                {deliveryOption === "ship" && (
                  <div className="mt-6 space-y-4 pt-6 border-t border-gray-100">
                    <h3 className="text-sm font-medium text-gray-900">
                      Shipping address
                    </h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <label
                          htmlFor="first-name"
                          className="text-sm font-medium text-gray-800"
                        >
                          First name
                        </label>
                        <input
                          id="first-name"
                          name="first-name"
                          type="text"
                          autoComplete="shipping given-name"
                          className={inputClass}
                          placeholder="First name"
                          value={shipFirstName}
                          onChange={(e) => setShipFirstName(e.target.value)}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label
                          htmlFor="last-name"
                          className="text-sm font-medium text-gray-800"
                        >
                          Last name
                        </label>
                        <input
                          id="last-name"
                          name="last-name"
                          type="text"
                          autoComplete="shipping family-name"
                          className={inputClass}
                          placeholder="Last name"
                          value={shipLastName}
                          onChange={(e) => setShipLastName(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label
                        htmlFor="address"
                        className="text-sm font-medium text-gray-800"
                      >
                        Address
                      </label>
                      <input
                        id="address"
                        name="address"
                        type="text"
                        autoComplete="shipping street-address"
                        className={inputClass}
                        placeholder="Street address"
                        value={shipAddress}
                        onChange={(e) => setShipAddress(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label
                        htmlFor="apartment-suite"
                        className="text-sm font-medium text-gray-800"
                      >
                        Apartment, suite (optional)
                      </label>
                      <input
                        id="apartment-suite"
                        name="apartment-suite"
                        type="text"
                        autoComplete="shipping address-line2"
                        className={inputClass}
                        placeholder="Apt, suite, unit"
                        value={shipApt}
                        onChange={(e) => setShipApt(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-3">
                      <div className="space-y-1.5 sm:col-span-1">
                        <label
                          htmlFor="city"
                          className="text-sm font-medium text-gray-800"
                        >
                          City
                        </label>
                        <input
                          id="city"
                          name="city"
                          type="text"
                          autoComplete="shipping address-level2"
                          className={inputClass}
                          placeholder="City"
                          value={shipCity}
                          onChange={(e) => setShipCity(e.target.value)}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label
                          htmlFor="province"
                          className="text-sm font-medium text-gray-800"
                        >
                          Province
                        </label>
                        <input
                          id="province"
                          name="province"
                          type="text"
                          autoComplete="shipping address-level1"
                          className={inputClass}
                          placeholder="BC"
                          value={shipProvince}
                          onChange={(e) => setShipProvince(e.target.value)}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label
                          htmlFor="postal-code"
                          className="text-sm font-medium text-gray-800"
                        >
                          Postal code
                        </label>
                        <input
                          id="postal-code"
                          name="postal-code"
                          type="text"
                          autoComplete="shipping postal-code"
                          className={inputClass}
                          placeholder="V0N 0A0"
                          value={shipPostal}
                          onChange={(e) => setShipPostal(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-gray-100">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex justify-start shrink-0">
                    <ReCAPTCHA
                      sitekey="6LcIjDQpAAAAANHNJdQQTrJy-LQLR7oAWIWontHU"
                      ref={captchaRef}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex w-full sm:w-auto sm:shrink-0 min-h-[48px] items-center justify-center rounded-lg bg-[#1a1a1a] px-8 text-[15px] font-medium text-white shadow-sm transition-colors hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isSubmitting ? "Sending…" : "Send inquiry"}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-4">
                  Submitting sends your details to North Shore Bike Shop. We’ll
                  follow up by email about payment and next steps.
                </p>
              </div>
            </form>

            {formSent && (
              <div
                className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50/80 px-4 py-3.5 text-sm text-emerald-900"
                role="status"
              >
                <CheckIcon
                  className="text-emerald-600 shrink-0"
                  fontSize="small"
                />
                <span>
                  Inquiry sent. We&apos;ll reply as soon as we can at the email
                  you provided.
                </span>
              </div>
            )}

            {formNotSent && (
              <div
                className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50/80 px-4 py-3.5 text-sm text-red-900"
                role="alert"
              >
                <ErrorOutlineIcon
                  className="text-red-600 shrink-0"
                  fontSize="small"
                />
                <span>
                  {submitError ||
                    "Something went wrong. Try again or email northshorebikeshop@gmail.com."}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutContent;
