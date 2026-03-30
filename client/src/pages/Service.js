import BuildOutlinedIcon from "@mui/icons-material/BuildOutlined";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  List,
  ListItem,
  ListItemText,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from "@mui/material";
import Closer from "components/General/Closer";
import NavBar, { NAV_BAR_BG } from "components/General/NavBar";
import SEO from "components/General/SEO";
import ServiceHero from "components/ServicePage/ServiceHero";
import serviceListingsFallback from "data/serviceListingsFallback";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { Link as RouterLink } from "react-router-dom";

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
        if (Array.isArray(data) && data.length > 0) {
          setListings(data);
          setLoadError(false);
        } else {
          setListings(serviceListingsFallback);
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
    <Box sx={{ bgcolor: "#f8f9f8", minHeight: "100vh" }}>
      <SEO
        title="Bike Service & Repair | North Shore Bike Shop"
        description="Professional bike service and repair in North Vancouver. Fast turnaround times, expert mechanics, tune-ups, brake bleeds, suspension service, and more. All bike types welcome."
        keywords="bike service, bike repair, bike tune-up, brake bleed, suspension service, wheel build, bike shop service, North Vancouver bike repair"
        url="https://www.northshorebikeshop.net/service"
        image="/service-xstretch-min.jpg"
      />
      <NavBar position="sticky" displayLogo />

      <ServiceHero />

      <Container
        maxWidth="md"
        sx={{
          py: { xs: 4, md: 6 },
          px: { xs: 2, sm: 3 },
        }}
      >
        {listings === null ? (
          <Box display="flex" justifyContent="center" py={8}>
            <CircularProgress sx={{ color: NAV_BAR_BG }} aria-label="Loading" />
          </Box>
        ) : (
          <Stack spacing={{ xs: 3, md: 4 }}>
            {loadError && (
              <Typography variant="body2" color="text.secondary" textAlign="center">
                Showing saved pricing; live list unavailable—please call if something looks off.
              </Typography>
            )}

            <Stack direction="row" alignItems="center" spacing={1.5} justifyContent="center">
              <BuildOutlinedIcon sx={{ color: NAV_BAR_BG, fontSize: 32 }} aria-hidden />
              <Typography
                component="h2"
                sx={{
                  m: 0,
                  fontWeight: 800,
                  fontSize: { xs: "1.35rem", md: "1.5rem" },
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: NAV_BAR_BG,
                }}
              >
                Packages & tune-ups
              </Typography>
            </Stack>

            <Stack spacing={2.5}>
              {packages.map((pkg) => (
                <Paper
                  key={pkg._id}
                  elevation={0}
                  sx={{
                    borderRadius: 2,
                    border: "1px solid rgba(36, 61, 51, 0.15)",
                    overflow: "hidden",
                    bgcolor: "#fff",
                  }}
                >
                  <Stack
                    direction="row"
                    alignItems="baseline"
                    justifyContent="space-between"
                    sx={{
                      px: { xs: 2, sm: 2.5 },
                      py: 2,
                      borderBottom: "1px solid rgba(0,0,0,0.06)",
                      bgcolor: "rgba(36, 61, 51, 0.04)",
                    }}
                  >
                    <Typography
                      component="h3"
                      sx={{
                        fontWeight: 800,
                        fontSize: { xs: "1.1rem", sm: "1.2rem" },
                        letterSpacing: "0.04em",
                        color: "#1a1a1a",
                      }}
                    >
                      {pkg.title}
                    </Typography>
                    <Typography
                      sx={{
                        fontWeight: 700,
                        fontSize: "1.15rem",
                        color: NAV_BAR_BG,
                        flexShrink: 0,
                        ml: 2,
                      }}
                    >
                      {pkg.price}
                    </Typography>
                  </Stack>
                  {pkg.description?.trim() ? (
                    <Box sx={{ px: { xs: 2, sm: 2.5 }, py: 2 }}>
                      <List dense disablePadding sx={{ listStyleType: "disc", pl: 2.5 }}>
                        {pkg.description
                          .split("\n")
                          .map((line) => line.trim())
                          .filter(Boolean)
                          .map((line) => (
                            <ListItem
                              key={line}
                              disableGutters
                              sx={{ display: "list-item", py: 0.35, pl: 0 }}
                            >
                              <ListItemText
                                primary={line}
                                primaryTypographyProps={{
                                  variant: "body1",
                                  sx: { color: "text.primary", lineHeight: 1.55 },
                                }}
                              />
                            </ListItem>
                          ))}
                      </List>
                    </Box>
                  ) : null}
                </Paper>
              ))}
            </Stack>

            <Divider sx={{ my: 1 }} />

            <Box>
              <Typography
                component="h2"
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: "1.35rem", md: "1.5rem" },
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: NAV_BAR_BG,
                  mb: 0.5,
                }}
              >
                Service rates
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Prices do not include parts unless noted.
              </Typography>

              <TableContainer
                component={Paper}
                elevation={0}
                sx={{
                  borderRadius: 2,
                  border: "1px solid rgba(36, 61, 51, 0.12)",
                  bgcolor: "#fff",
                }}
              >
                <Table size="small" aria-label="Service rates">
                  <TableBody>
                    {rates.map((row) => (
                      <TableRow
                        key={row._id}
                        sx={{
                          "&:nth-of-type(even)": { bgcolor: "rgba(0,0,0,0.02)" },
                          "&:last-child td": { borderBottom: 0 },
                        }}
                      >
                        <TableCell
                          sx={{
                            py: 1.75,
                            pl: { xs: 2, sm: 2.5 },
                            fontSize: "0.95rem",
                            borderColor: "rgba(0,0,0,0.06)",
                          }}
                        >
                          {row.title}
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{
                            py: 1.75,
                            pr: { xs: 2, sm: 2.5 },
                            fontWeight: 600,
                            color: NAV_BAR_BG,
                            whiteSpace: "nowrap",
                            borderColor: "rgba(0,0,0,0.06)",
                          }}
                        >
                          {row.price}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>

            <Stack alignItems="center" sx={{ pt: 2 }}>
              <Button
                component={RouterLink}
                to="/contact"
                variant="contained"
                disableElevation
                sx={{
                  px: 3.5,
                  py: 1.25,
                  borderRadius: "999px",
                  textTransform: "none",
                  fontWeight: 700,
                  fontSize: "1rem",
                  bgcolor: NAV_BAR_BG,
                  "&:hover": { bgcolor: "#1a3028" },
                }}
              >
                Book or ask a question
              </Button>
            </Stack>
          </Stack>
        )}
      </Container>

      <Closer />
    </Box>
  );
};

export default Service;
