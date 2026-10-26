import { Box, Container, Stack, Typography } from "@mui/material";
import Closer from "components/General/Closer";
import NavBar from "components/General/NavBar";
import SEO from "components/General/SEO";
import { pageMeta } from "seo/seoData.mjs";
import ServiceHero from "components/ServicePage/ServiceHero";
import {
  EbikeNote,
  ServiceHighlights,
  ServiceLoading,
  ServicePackages,
  ServiceRates,
  ServiceSteps,
} from "components/ServicePage/ServiceSections";
import serviceListingsFallback from "data/serviceListingsFallback";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";

const Service = () => {
  const [listings, setListings] = useState(null);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const url = `${process.env.REACT_APP_VERCEL_DOMAIN}/api/service-listings/public`;
    axios
      .get(url)
      .then((res) => {
        if (cancelled) return;
        const data = res.data;
        // An empty list is the admin's choice; the built-in prices are only for a failed load.
        if (Array.isArray(data)) {
          setListings(data);
          setLoadError(false);
        } else {
          setListings(serviceListingsFallback);
          setLoadError(true);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setListings(serviceListingsFallback);
          setLoadError(true);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const { packages, rates } = useMemo(() => {
    const list = listings ?? [];
    return {
      packages: list.filter((x) => x.kind === "package"),
      rates: list.filter((x) => x.kind === "rate"),
    };
  }, [listings]);

  return (
    <Box sx={{ bgcolor: "#f6f7f6", minHeight: "100vh" }}>
      <SEO {...pageMeta("/service")} />
      <NavBar position="sticky" displayLogo />

      <ServiceHero />

      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 }, px: { xs: 2, sm: 3 } }}>
        <Stack spacing={{ xs: 5, md: 7 }}>
          <ServiceHighlights />

          {listings === null ? (
            <ServiceLoading />
          ) : (
            <>
              {loadError ? (
                <Typography variant="body2" color="text.secondary" textAlign="center">
                  These are our saved prices because the live list didn&apos;t load. Give us a
                  call if anything looks off.
                </Typography>
              ) : null}
              <ServicePackages packages={packages} />
              <ServiceRates rates={rates} />
              {!packages.length && !rates.length ? (
                <Typography color="text.secondary" textAlign="center">
                  Give us a call or drop by for service pricing.
                </Typography>
              ) : null}
            </>
          )}

          <EbikeNote />
          <ServiceSteps />
        </Stack>
      </Container>

      <Closer />
    </Box>
  );
};

export default Service;
