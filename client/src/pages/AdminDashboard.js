import BuildOutlinedIcon from "@mui/icons-material/BuildOutlined";
import DirectionsBikeIcon from "@mui/icons-material/DirectionsBike";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Container,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { useAuth } from "components/AuthProvider";
import NavBar, { NAV_BAR_BG } from "components/General/NavBar";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const tools = [
  {
    title: "Transition bikes",
    description:
      "Add and update Transition models in the dedicated Transition workflow.",
    to: "/admin-addbikes-transition",
    action: "Open",
    icon: DirectionsBikeIcon,
  },
  {
    title: "Norco, Ibis & other",
    description:
      "Add Norco, Ibis, and custom Transition builds through the general bike form.",
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

const AdminDashboard = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/admin-login");
    }
  }, [isAuthenticated, navigate]);

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
