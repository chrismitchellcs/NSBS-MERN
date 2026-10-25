import BuildOutlinedIcon from "@mui/icons-material/BuildOutlined";
import DirectionsBikeIcon from "@mui/icons-material/DirectionsBike";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import OpenInNewOutlinedIcon from "@mui/icons-material/OpenInNewOutlined";
import UploadFileOutlinedIcon from "@mui/icons-material/UploadFileOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Container,
  Grid,
  Link as MuiLink,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useAuth } from "components/AuthProvider";
import NavBar, { NAV_BAR_BG } from "components/General/NavBar";
import { useEffect, useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { adminCostCellText } from "utils/adminBikeSearch";
import { NORCO_CATALOG_ENABLED } from "config/features";

const tools = [
  {
    title: "Transition bikes",
    description:
      "Add and update Transition models in the dedicated Transition workflow.",
    to: "/admin-addbikes-transition",
    action: "Open",
    icon: DirectionsBikeIcon,
  },
  ...(NORCO_CATALOG_ENABLED
    ? [
        {
          title: "Norco catalog (B2B POS)",
          description:
            "Import the Norco Canada POS .xlsx, then publish drafts and add photos like Transition.",
          to: "/admin-addbikes-norco",
          action: "Open",
          icon: UploadFileOutlinedIcon,
        },
      ]
    : []),
  {
    title: "Norco, Ibis & other",
    description:
      "Add Norco, Ibis, and custom builds through the general bike form (one-off listings).",
    to: "/admin-addbikes-new",
    action: "Open",
    icon: Inventory2OutlinedIcon,
  },
  {
    title: "Home hero slides",
    description:
      "Upload images and copy for the rotating hero on the home page.",
    to: "/admin-header-hero",
    action: "Manage slides",
    icon: ImageOutlinedIcon,
  },
  {
    title: "Service pricing",
    description:
      "Edit tune-up packages and the service rate table on the Service page.",
    to: "/admin-service-listings",
    action: "Edit pricing",
    icon: BuildOutlinedIcon,
  },
];

const apiBase = process.env.REACT_APP_VERCEL_DOMAIN;

const AdminDashboard = () => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const [viewRows, setViewRows] = useState([]);
  const [viewStatsError, setViewStatsError] = useState(null);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/admin-login");
    }
  }, [loading, isAuthenticated, navigate]);

  useEffect(() => {
    if (!isAuthenticated) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await axios.get(`${apiBase}/api/bikes/admin/view-stats`, {
          withCredentials: true,
        });
        if (!cancelled) {
          setViewRows(Array.isArray(res.data) ? res.data : []);
          setViewStatsError(null);
        }
      } catch (e) {
        if (!cancelled) {
          setViewStatsError(
            e?.response?.data?.error || e?.message || "Could not load view stats"
          );
          setViewRows([]);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated]);

  if (loading || !isAuthenticated) return null;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#eef1ef",
        pb: 6,
      }}
    >
      <NavBar background={NAV_BAR_BG} position="sticky" displayLogo={1} />
      <Container maxWidth="lg" sx={{ pt: { xs: 3, md: 4 }, px: { xs: 2, sm: 3 } }}>
        <Stack spacing={0.5} sx={{ mb: { xs: 3, md: 4 } }}>
          <Typography
            variant="overline"
            sx={{
              letterSpacing: "0.14em",
              fontWeight: 600,
              color: NAV_BAR_BG,
            }}
          >
            North Shore Bike Shop
          </Typography>
          <Typography
            component="h1"
            variant="h4"
            sx={{
              fontWeight: 700,
              color: "#1a1f1c",
              letterSpacing: "-0.02em",
            }}
          >
            Admin dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 520, pt: 0.5 }}>
            Quick links to inventory and site content tools. Session expires after a period of
            inactivity—log in again if something stops saving.
          </Typography>
        </Stack>

        <Paper
          elevation={0}
          sx={{
            mb: { xs: 3, md: 4 },
            borderRadius: 2,
            border: "1px solid rgba(0,0,0,0.08)",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              px: 2.5,
              py: 2,
              borderBottom: "1px solid",
              borderColor: "divider",
              bgcolor: "#fff",
              display: "flex",
              alignItems: "center",
              gap: 1.5,
            }}
          >
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "rgba(36, 61, 51, 0.1)",
                color: NAV_BAR_BG,
              }}
            >
              <VisibilityOutlinedIcon />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, fontSize: "1.05rem" }}>
                Shop page views
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Counts increase when someone opens a public bike detail page (not drafts or archived
                listings).
              </Typography>
            </Box>
          </Box>
          {viewStatsError ? (
            <Box sx={{ px: 2.5, py: 2 }}>
              <Typography color="error" variant="body2">
                {viewStatsError}
              </Typography>
            </Box>
          ) : (
            <TableContainer sx={{ maxHeight: 360, bgcolor: "#fff" }}>
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Views</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Brand</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Model</TableCell>
                    <TableCell sx={{ fontWeight: 700 }} align="right">
                      Cost
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 700 }} align="right">
                      Link
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {viewRows.map((row) => {
                    const views = row.viewCount ?? 0;
                    const brandSlug = (row.brand || "transition").toLowerCase();
                    const shopPath = `/shop/${brandSlug}/${row._id}`;
                    return (
                      <TableRow key={row._id} hover>
                        <TableCell sx={{ fontVariantNumeric: "tabular-nums", fontWeight: 600 }}>
                          {views.toLocaleString()}
                        </TableCell>
                        <TableCell>{row.brand || "—"}</TableCell>
                        <TableCell>{row.name || row.fullName || "—"}</TableCell>
                        <TableCell align="right" sx={{ fontVariantNumeric: "tabular-nums" }}>
                          {adminCostCellText(row.costPrice)}
                        </TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                            {row.public ? (
                              <Chip label="Public" size="small" color="success" variant="outlined" />
                            ) : (
                              <Chip label="Private" size="small" variant="outlined" />
                            )}
                            {row.archived ? (
                              <Chip label="Archived" size="small" color="warning" variant="outlined" />
                            ) : null}
                          </Stack>
                        </TableCell>
                        <TableCell align="right">
                          {row.public && !row.archived ? (
                            <MuiLink
                              component={RouterLink}
                              to={shopPath}
                              target="_blank"
                              rel="noopener noreferrer"
                              sx={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 0.5,
                                fontWeight: 600,
                                fontSize: "0.8125rem",
                              }}
                            >
                              View
                              <OpenInNewOutlinedIcon sx={{ fontSize: 16 }} />
                            </MuiLink>
                          ) : (
                            <Typography variant="caption" color="text.disabled">
                              —
                            </Typography>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>

        <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }}>
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Grid item xs={12} sm={6} key={tool.to}>
                <Card
                  elevation={0}
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: 2,
                    border: "1px solid rgba(0,0,0,0.08)",
                    bgcolor: "#fff",
                    boxShadow: "0 8px 28px rgba(0,0,0,0.06)",
                    transition: (theme) =>
                      theme.transitions.create(["box-shadow", "transform"], {
                        duration: 220,
                      }),
                    "&:hover": {
                      boxShadow: "0 14px 40px rgba(36, 61, 51, 0.12)",
                      transform: "translateY(-3px)",
                    },
                  }}
                >
                  <CardContent sx={{ flex: 1, pt: 2.5, px: 2.5, pb: 1 }}>
                    <Stack direction="row" spacing={2} alignItems="flex-start">
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: 2,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          bgcolor: "rgba(36, 61, 51, 0.1)",
                          color: NAV_BAR_BG,
                        }}
                      >
                        <Icon sx={{ fontSize: 26 }} aria-hidden />
                      </Box>
                      <Box sx={{ minWidth: 0 }}>
                        <Typography
                          component="h2"
                          variant="h6"
                          sx={{
                            fontWeight: 700,
                            fontSize: "1.1rem",
                            mb: 0.75,
                            color: "#1a1f1c",
                          }}
                        >
                          {tool.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.55 }}>
                          {tool.description}
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                  <CardActions sx={{ px: 2.5, pb: 2.5, pt: 0 }}>
                    <Button
                      variant="contained"
                      disableElevation
                      onClick={() => navigate(tool.to)}
                      sx={{
                        textTransform: "none",
                        fontWeight: 600,
                        borderRadius: "10px",
                        px: 2.25,
                        bgcolor: NAV_BAR_BG,
                        "&:hover": { bgcolor: "#1a3028" },
                      }}
                    >
                      {tool.action}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </Box>
  );
};

export default AdminDashboard;
