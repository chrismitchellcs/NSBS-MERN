import axios from "axios";
import CheckoutContent from "components/Checkout/CheckoutContent";
import Closer from "components/General/Closer";
import NavBar from "components/General/NavBar";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

const Checkout = () => {
  const [bike, setBike] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [params] = useSearchParams();
  const bikeid = params.get("bikeid");
  const color = params.get("color");
  const size = params.get("size");
  const image = params.get("image");
  const availability = params.get("availability");

  useEffect(() => {
    let cancelled = false;
    const fetchBike = async () => {
      if (!bikeid) {
        setLoading(false);
        setLoadError("missing_id");
        return;
      }
      setLoading(true);
      setLoadError(null);
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_VERCEL_DOMAIN}/api/bikes/${bikeid}`,
          { params: { forCheckout: 1 } }
        );
        if (!cancelled) {
          setBike(res.data);
          setLoadError(null);
        }
      } catch (error) {
        if (!cancelled) {
          setBike(null);
          setLoadError("fetch_failed");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchBike();
    return () => {
      cancelled = true;
    };
  }, [bikeid]);

  return (
    <div className="w-full flex flex-col min-h-screen bg-[#fafafa]">
      <div className="flex-1">
        <NavBar position="sticky" displayLogo={1} />
        {loading ? (
          <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10 md:py-14">
            <div className="h-8 w-48 rounded-md bg-gray-200/80 animate-pulse mb-8" />
            <div className="flex flex-col lg:grid lg:grid-cols-[1fr_400px] gap-8 lg:gap-12">
              <div className="order-2 lg:order-1 space-y-4">
                <div className="h-64 rounded-xl bg-white border border-gray-100 shadow-sm animate-pulse" />
                <div className="h-48 rounded-xl bg-white border border-gray-100 shadow-sm animate-pulse" />
              </div>
              <div className="order-1 lg:order-2 h-72 rounded-xl bg-white border border-gray-100 shadow-sm animate-pulse" />
            </div>
          </div>
        ) : loadError || !bike ? (
          <div className="mx-auto max-w-lg px-4 py-20 text-center">
            <h1 className="text-xl font-semibold text-gray-900 mb-2">
              Checkout unavailable
            </h1>
            <p className="text-sm text-gray-600 mb-6">
              {loadError === "missing_id"
                ? "This checkout link is missing a product. Start again from the shop."
                : "We couldn’t load this bike. It may have been removed or the link expired."}
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center justify-center rounded-lg bg-[#1a1a1a] px-6 py-3 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
            >
              Back to shop
            </Link>
          </div>
        ) : (
          <CheckoutContent
            bike={bike}
            color={color}
            size={size}
            image={image}
            availability={availability}
          />
        )}
      </div>
      <Closer />
    </div>
  );
};

export default Checkout;
