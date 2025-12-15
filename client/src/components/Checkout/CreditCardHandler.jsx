import axios from "axios";
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

const CreditCardHandler = ({ bike, color, size, subTotal }) => {
  const checkoutRef = useRef(null);
  const [nameOnCard, setNameOnCard] = useState("");

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

    cc.createToken(
      (response) => {
        console.log(response);
        axios
          .post(`${process.env.REACT_APP_VERCEL_DOMAIN}/api/bikes/pay`, {
            token: response.token,
            nameOnCard: nameOnCard,
            subtotal: subTotal,
            bikeid: bike._id,
            bikeColor: color,
            bikeSize: size,
          })
          .then((res) => {
            console.log(res);
          })
          .catch((error) => {
            console.error(error);
          });
      },
      (error) => {
        console.error(error);
      }
    );
  };

  return (
    <div className="md:w-1/2 w-full bg-gray-300 border border-gray-400 p-4 rounded-lg">
      <form id="checkout-form" className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-900 pb-2">
            Name on Card
          </label>
          <input
            onChange={(e) => setNameOnCard(e.target.value)}
            value={nameOnCard}
            placeholder="Name on Card"
            className={`w-full rounded-lg bg-white px-4 py-[11px] focus:outline-none focus:ring-0 focus:border-black placeholder-gray-500 text-[14px] text-gray-900 `}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-900">
            Card Number
          </label>
          <div
            id="card-number"
            className={`w-full rounded-lg border ${
              status["card-number"].error
                ? "border-red-500"
                : status["card-number"].complete
                ? "border-green-500"
                : "border-gray-300"
            } bg-white px-4 py-3`}
          />
          {status["card-number"].error && (
            <p className="text-red-500 text-sm">
              {status["card-number"].error}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-900">
              Expiry
            </label>
            <div
              id="card-expiry"
              className={`w-full rounded-lg border ${
                status["expiry"].error
                  ? "border-red-500"
                  : status["expiry"].complete
                  ? "border-green-500"
                  : "border-gray-300"
              } bg-white px-4 py-3`}
            />
            {status["expiry"].error && (
              <p className="text-red-500 text-sm">{status["expiry"].error}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-900">CVV</label>
            <div
              id="card-cvv"
              className={`w-full rounded-lg border ${
                status["cvv"].error
                  ? "border-red-500"
                  : status["cvv"].complete
                  ? "border-green-500"
                  : "border-gray-300"
              } bg-white px-4 py-3`}
            />
            {status["cvv"].error && (
              <p className="text-red-500 text-sm">{status["cvv"].error}</p>
            )}
          </div>
        </div>
      </form>
      <div className="flex flex-row gap-2 pt-6">
        <div
          className={`w-[50px] items-center justify-center flex bg-white rounded-sm p-1 ${
            status.brand === "visa"
              ? "border-2 border-black"
              : "border-gray-300"
          }`}
        >
          <img className={``} src="Visa_Logo.png" alt="Visa" />
        </div>
        <div
          className={`w-[50px] items-center justify-center flex bg-white rounded-sm ${
            status.brand === "mastercard"
              ? "border-2 border-black"
              : "border-gray-300"
          }`}
        >
          <img className={``} src="mastercard.png" alt="Visa" />
        </div>
        <div
          className={`w-[50px] items-center justify-center flex bg-white rounded-sm ${
            status.brand === "amex"
              ? "border-2 border-black"
              : "border-gray-300"
          }`}
        >
          <img className="w-full h-full" src="amex.svg" alt="Visa" />
        </div>
      </div>
      <button
        onClick={handlePay}
        className="w-full bg-black text-white px-4 py-2 mt-4 rounded-md hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Pay
      </button>
      <div className="text-sm flex flex-row items-center gap-2 text-gray-500 mt-4">
        <div>Secured and Powered By</div>
        <img className="w-40 h-auto" src="worldline.svg" alt="Worldline" />
      </div>
    </div>
  );
};

export default CreditCardHandler;
