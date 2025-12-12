import axios from "axios";
import CheckoutContent from "components/Checkout/CheckoutContent";
import Closer from "components/General/Closer";
import NavBar from "components/General/NavBar";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const Checkout = () => {
  const [bike, setBike] = useState(null);
  const [params] = useSearchParams();
  const bikeid = params.get("bikeid");
  const color = params.get("color");
  const size = params.get("size");
  const image = params.get("image");
  const availability = params.get("availability");

  useEffect(() => {
    const fetchBike = async () => {
      await axios
        .get(`${process.env.REACT_APP_VERCEL_DOMAIN}/api/bikes/${bikeid}`)
        .then((res) => {
          setBike(res.data);
        })
        .catch((error) => {
          console.log(error);
        });
    };
    fetchBike();
  }, [bikeid]);

  return (
    <div className="w-full flex flex-col min-h-screen">
      <div className="flex-1">
        <NavBar background="white" position={"sticky"} displayLogo={1}></NavBar>
        {bike ? (
          <CheckoutContent
            bike={bike}
            color={color}
            size={size}
            image={image}
            availability={availability}
          />
        ) : (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-gray-200 rounded-full"></div>
              <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
            </div>
          </div>
        )}
      </div>
      <Closer></Closer>
    </div>
  );
};

export default Checkout;
