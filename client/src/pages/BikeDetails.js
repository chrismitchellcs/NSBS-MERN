import NavBar from "components/General/NavBar";
import Closer from "components/General/Closer";
import NotFoundContent from "components/General/NotFoundContent";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { Box } from "@mui/material";
import SEO from "components/General/SEO";
import { BIKE_NOT_FOUND_META, SITE_URL, bikePath, bikeSeo } from "seo/seoData.mjs";

const BikeLandingPageUpdated = lazy(() =>
  import("components/Shop/BikeLandingPageUpdated")
);

const BikeDetails = () => {
  const { bikeid, brand } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [bike, setBike] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [navHidden, setNavHidden] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setNotFound(false);
    axios
      .get(`${process.env.REACT_APP_VERCEL_DOMAIN}/api/bikes/${bikeid}`, {
        withCredentials: true,
      })
      .then((res) => {
        if (!cancelled) setBike(res.data);
      })
      .catch((error) => {
        if (cancelled) return;
        if (error?.response?.status === 404) setNotFound(true);
        else console.log(error);
      });
    return () => {
      cancelled = true;
    };
  }, [bikeid]);

  /** Old links use "/shop/Transition/…"; settle on the lowercase address without a history entry. */
  useEffect(() => {
    if (!bike?._id) return;
    const canonical = bikePath(bike);
    if (location.pathname !== canonical) {
      navigate(`${canonical}${location.search}`, { replace: true, state: location.state });
    }
  }, [bike, location.pathname, location.search, location.state, navigate]);

  const seoData = useMemo(() => {
    if (notFound) return BIKE_NOT_FOUND_META;
    if (!bike) {
      return {
        title: "Bike Details | North Shore Bike Shop",
        description: "View bike details and specifications at North Shore Bike Shop.",
        url: `${SITE_URL}/shop/${String(brand || "").toLowerCase()}/${bikeid}`,
      };
    }
    return bikeSeo(bike);
  }, [bike, notFound, brand, bikeid]);

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
        <NavBar
          position="sticky"
          displayLogo={1}
          onBarsHiddenChange={setNavHidden}
        />
        <Box>
          {notFound ? (
            <NotFoundContent
              title="This bike isn't listed anymore"
              body="It may have sold out or been replaced by a newer model. Have a look at what we have now, or get in touch and we'll help you find something similar."
            />
          ) : bike ? (
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
              <BikeLandingPageUpdated bike={bike} navHidden={navHidden} />
            </Suspense>
          ) : null}
        </Box>
      </div>

      <Closer></Closer>
    </div>
  );
};

export default BikeDetails;
