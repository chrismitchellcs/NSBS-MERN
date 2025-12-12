import axios from "axios";
import { Image } from "cloudinary-react";
import { useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import CheckIcon from "@mui/icons-material/Check";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

const CheckoutContent = ({ bike, color, size, image, availability }) => {
  const [deliveryOption, setDeliveryOption] = useState("pickup");
  const captchaRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSent, setFormSent] = useState(false);
  const [formNotSent, setFormNotSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const token = captchaRef.current?.getValue();

    setFormSent(false);
    setFormNotSent(false);

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
    const deliveryOption = formData.get("deliveryOption")?.toString().trim();
    const firstName = formData.get("first-name")?.toString().trim();
    const lastName = formData.get("last-name")?.toString().trim();
    const address = formData.get("address")?.toString().trim();
    const apartmentSuite = formData.get("apartment-suite")?.toString().trim();
    const city = formData.get("city")?.toString().trim();
    const province = formData.get("province")?.toString().trim();
    const postalCode = formData.get("postal-code")?.toString().trim();

    console.log(
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
      postalCode
    );

    try {
      await axios.post(
        `${process.env.REACT_APP_VERCEL_DOMAIN}/api/bikes/sendbikeform`,
        {
          token,
          bike: bike.brand + " " + bike.name,
          bikecolor: color,
          bikesize: size,
          bikeprice: bike.price,
          bikeavailability: availability,
          bikeid: bike._id,
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
          message: "N/A",
        }
      );
      form.reset();
      setFormSent(true);
    } catch (error) {
      console.log(error);
      setFormNotSent(true);
      setFormSent(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center px-4 py-8">
      <div className="w-full max-w-4xl flex flex-col items-center space-y-6">
        <div className="md:text-4xl text-2xl font-bold tracking-tight text-gray-900">
          Checkout
        </div>

        <div className="w-full flex md:flex-row flex-col border border-gray-400 rounded-lg p-4 items-center md:items-start gap-4">
          <div className="flex md:flex-row flex-col gap-4 flex-1 items-center md:items-start">
            <Image
              cloudName="ds4ukwnxl"
              publicId={image}
              width="600"
              crop="pad"
              quality="100"
              fetchFormat="auto"
              alt={`bike`}
              style={{
                width: "300px",

                objectFit: "contain",
                display: "block",
              }}
            />

            <div className="flex flex-col">
              <div className="flex-1">
                <div className="text-xl tracking-tight text-gray-900">
                  {bike.brand} {bike.name}
                </div>
                <div className="text-sm tracking-tight text-gray-600">
                  Size: {size}
                </div>
                <div className="text-sm tracking-tight text-gray-600">
                  Colour: {color}
                </div>
                <div className="text-sm tracking-tight text-gray-600">
                  Availability: {availability}
                </div>
              </div>
            </div>
          </div>
          {bike.saleprice === 0 || bike.saleprice === null ? (
            <div className="text-xl tracking-tight text-gray-900">
              ${bike.price.toLocaleString()}.00 CAD
            </div>
          ) : (
            <div className="text-xl tracking-tight text-gray-900">
              ${bike.saleprice.toLocaleString()}.00 CAD
            </div>
          )}
        </div>
        <div className="w-full border bg-gray-200 rounded-lg p-4">
          <form onSubmit={handleSubmit}>
            <div className="w-full flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <div className="text-xl font-semibold tracking-tight text-gray-900">
                  Contact Information
                </div>
                <div className="space-y-2 md:w-1/2">
                  <label
                    htmlFor="name"
                    className="text-sm font-semibold text-gray-900"
                  >
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-500 outline-none transition-all focus:border-black focus:ring-2 focus:ring-black focus:ring-offset-0"
                    placeholder="Name"
                  />
                </div>
                <div className="space-y-2 md:w-1/2">
                  <label
                    htmlFor="phone"
                    className="text-sm font-semibold text-gray-900"
                  >
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="text"
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-500 outline-none transition-all focus:border-black focus:ring-2 focus:ring-black focus:ring-offset-0"
                    placeholder="Phone Number"
                  />
                </div>
                <div className="space-y-2  md:w-1/2">
                  <label
                    htmlFor="email"
                    className="text-sm font-semibold text-gray-900"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="text"
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-500 outline-none transition-all focus:border-black focus:ring-2 focus:ring-black focus:ring-offset-0"
                    placeholder="Email"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <div className="text-xl font-semibold tracking-tight text-gray-900">
                  Delivery Options
                </div>
                <label
                  className={`flex items-center md:w-1/2 space-x-3 cursor-pointer border-2 rounded-lg px-4 py-3 transition-all ${
                    deliveryOption === "pickup"
                      ? "border-black bg-gray-50 shadow-sm"
                      : "border-gray-300 bg-white hover:border-gray-400 hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="deliveryOption"
                    value="pickup"
                    checked={deliveryOption === "pickup"}
                    onChange={() => {
                      setDeliveryOption("pickup");
                    }}
                    className="accent-black w-5 h-5 cursor-pointer"
                  />
                  <span className="text-gray-900 font-medium text-sm">
                    Pick Up In Store
                  </span>
                </label>
                <label
                  className={`flex items-center md:w-1/2 space-x-3 cursor-pointer border-2 rounded-lg px-4 py-3 transition-all ${
                    deliveryOption === "ship"
                      ? "border-black bg-gray-50 shadow-sm"
                      : "border-gray-300 bg-white hover:border-gray-400 hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="deliveryOption"
                    value="ship"
                    checked={deliveryOption === "ship"}
                    onChange={() => {
                      setDeliveryOption("ship");
                    }}
                    className="accent-black w-5 h-5 cursor-pointer"
                  />
                  <span className="text-gray-900 font-medium text-sm">
                    Ship To Me
                  </span>
                </label>
                <div className="w-full">
                  {deliveryOption === "ship" && (
                    <div className="flex flex-col gap-2 mt-4 mb-2">
                      <div className="text-xl font-semibold tracking-tight text-gray-900">
                        Shipping Address
                      </div>
                      <div className="flex flex-row gap-2">
                        <div className="space-y-2">
                          <label
                            htmlFor="first-name"
                            className="text-sm font-semibold text-gray-900"
                          >
                            First Name
                          </label>
                          <input
                            id="first-name"
                            name="first-name"
                            type="text"
                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-500 outline-none transition-all focus:border-black focus:ring-2 focus:ring-black focus:ring-offset-0"
                            placeholder="First Name"
                          />
                        </div>
                        <div className="space-y-2">
                          <label
                            htmlFor="last-name"
                            className="text-sm font-semibold text-gray-900"
                          >
                            Last Name
                          </label>
                          <input
                            id="last-name"
                            name="last-name"
                            type="text"
                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-500 outline-none transition-all focus:border-black focus:ring-2 focus:ring-black focus:ring-offset-0"
                            placeholder="Last Name"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor="address"
                          className="text-sm font-semibold text-gray-900"
                        >
                          Address
                        </label>
                        <input
                          id="last-name"
                          name="address"
                          type="text"
                          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-500 outline-none transition-all focus:border-black focus:ring-2 focus:ring-black focus:ring-offset-0"
                          placeholder="Address"
                        />
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor="apartment-suite"
                          className="text-sm font-semibold text-gray-900"
                        >
                          Apartment/Suite (Optional)
                        </label>
                        <input
                          id="apartment-suite"
                          name="apartment-suite"
                          type="text"
                          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-500 outline-none transition-all focus:border-black focus:ring-2 focus:ring-black focus:ring-offset-0"
                          placeholder="Apartment/Suite"
                        />
                      </div>
                      <div className="flex flex-row gap-2">
                        <div className="space-y-2">
                          <label
                            htmlFor="city"
                            className="text-sm font-semibold text-gray-900"
                          >
                            City
                          </label>
                          <input
                            id="city"
                            name="city"
                            type="text"
                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-500 outline-none transition-all focus:border-black focus:ring-2 focus:ring-black focus:ring-offset-0"
                            placeholder="City"
                          />
                        </div>
                        <div className="space-y-2">
                          <label
                            htmlFor="province"
                            className="text-sm font-semibold text-gray-900"
                          >
                            Province
                          </label>
                          <input
                            id="province"
                            name="province"
                            type="text"
                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-500 outline-none transition-all focus:border-black focus:ring-2 focus:ring-black focus:ring-offset-0"
                            placeholder="Province"
                          />
                        </div>
                        <div className="space-y-2">
                          <label
                            htmlFor="postal-code"
                            className="text-sm font-semibold text-gray-900"
                          >
                            Postal Code
                          </label>
                          <input
                            id="postal-code"
                            name="postal-code"
                            type="text"
                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-500 outline-none transition-all focus:border-black focus:ring-2 focus:ring-black focus:ring-offset-0"
                            placeholder="Postal Code"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="text-sm tracking-tight text-gray-600 mb-2">
                  After submitting this form, we will reserve the bike and send
                  you an email regarding payment and next steps. If the bike is
                  in store, you will be able to pick it up within 24 hours. If
                  the bike is not in store, it will be typically 3-5 business
                  days until we have it at the shop. We will confirm all details
                  via email.
                </div>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <ReCAPTCHA
                    sitekey="6LcIjDQpAAAAANHNJdQQTrJy-LQLR7oAWIWontHU"
                    ref={captchaRef}
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center justify-center rounded-lg bg-black px-8 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-black"
                  >
                    {isSubmitting ? "Sending..." : "Submit"}
                  </button>
                </div>
              </div>
            </div>
            {formSent && (
              <div className="flex items-center gap-3 mt-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
                <CheckIcon fontSize="small" className="text-green-600" />
                <span>Inquiry sent! We'll reply as soon as we can.</span>
              </div>
            )}

            {formNotSent && (
              <div className="flex items-center gap-3 mt-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                <ErrorOutlineIcon fontSize="small" className="text-red-600" />
                <span>
                  Something went wrong. Please try again or email us directly at
                  northshorebikeshop@gmail.com.
                </span>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default CheckoutContent;
