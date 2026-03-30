import NavBar from "components/General/NavBar";
import Closer from "components/General/Closer";
import { useParams } from "react-router-dom";
import axios from "axios";
import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { Box } from "@mui/material";
import SEO from "components/General/SEO";

const BikeLandingPageUpdated = lazy(() =>
  import("components/Shop/BikeLandingPageUpdated")
);

const BikeDetails = () => {
  const { bikeid, brand } = useParams();
  const [bike, setBike] = useState(null);

  useEffect(() => {
    const fetchBikes = async () => {
      await axios
        .get(`${process.env.REACT_APP_VERCEL_DOMAIN}/api/bikes/${bikeid}`, {})
        .then((res) => {
          setBike(res.data);
        })
        .catch((error) => {
          console.log(error);
        });
    };
    fetchBikes();
  }, [bikeid]);

  const seoData = useMemo(() => {
    if (!bike) {
      return {
        title: "Bike Details | North Shore Bike Shop",
        description:
          "View bike details and specifications at North Shore Bike Shop.",
        url: `https://www.northshorebikeshop.net/shop/${brand}/${bikeid}`,
      };
    }

    const bikeName = `${bike.brand} ${bike.name}`;
    const year = bike.year ? ` ${bike.year}` : "";
    const price = bike.saleprice || bike.price;
    const priceText = price ? ` | $${price.toLocaleString()}` : "";

    let imageUrl = "/logowhitehq.png";
    try {
      if (bike.images) {
        const parsedImages = JSON.parse(bike.images);
        if (parsedImages && Object.values(parsedImages).length > 0) {
          imageUrl = Object.values(parsedImages)[0];
        }
      }
    } catch (e) {
      // Use default image
    }

    const description = bike.description
      ? `${bike.description.substring(0, 150)}...`
      : `${bikeName}${year} - ${
          bike.type || "mountain bike"
        } available at North Shore Bike Shop. ${
          bike.material || ""
        } frame. View details and specifications.`;

    const canadaKeywords =
      bike.brand?.toLowerCase() === "transition"
        ? "Transition Canada, Transition bikes Canada, "
        : "";
    return {
      title: `${bikeName}${year}${priceText} | North Shore Bike Shop`,
      description: description,
      keywords: `${canadaKeywords}${bikeName}, ${bike.brand} bikes, ${
        bike.type || "mountain bike"
      }, ${
        bike.material || ""
      } frame, bike shop Vancouver, North Shore Bike Shop`,
      url: `https://www.northshorebikeshop.net/shop/${bike.brand}/${bikeid}`,
      image: imageUrl,
    };
  }, [bike, brand, bikeid]);

  return (
    <div
      style={{
        margin: 0,
        display: "flex",
        minHeight: "100vh",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          flex: 1,
        }}
      >
        <SEO {...seoData} />
        <NavBar position="sticky" displayLogo={1} />
        <Box>
          {bike ? (
            <Suspense
              fallback={
                <Box
                  sx={{
                    minHeight: 360,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "text.secondary",
                  }}
                  role="status"
                  aria-live="polite"
                >
                  Loading bike…
                </Box>
              }
            >
              <BikeLandingPageUpdated bike={bike} />
            </Suspense>
          ) : null}
        </Box>
      </div>

      <Closer></Closer>
    </div>
  );
};

export default BikeDetails;
