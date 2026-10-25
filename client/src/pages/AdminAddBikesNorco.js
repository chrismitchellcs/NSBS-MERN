import { Box, Button, Container, Stack, Typography } from "@mui/material";
import { useAuth } from "components/AuthProvider";
import NavBar, { NAV_BAR_BG } from "components/General/NavBar";
import UploadNorco from "components/Uploaders/UploadNorco";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AdminAddBikesNorco = () => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/admin-login");
    }
  }, [loading, isAuthenticated, navigate]);

  if (loading || !isAuthenticated) return null;

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f4f6f4" }}>
      <NavBar background={NAV_BAR_BG} position="sticky" displayLogo={1} />
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          flexWrap="wrap"
          gap={2}
          sx={{ mb: 2 }}
        >
          <Typography
            variant="h5"
            component="h1"
            fontWeight={800}
            sx={{ color: NAV_BAR_BG }}
          >
            Norco bikes
          </Typography>
          <Button
            variant="outlined"
            onClick={() => navigate("/admin-dashboard")}
            sx={{ borderColor: NAV_BAR_BG, color: NAV_BAR_BG }}
          >
            Back to dashboard
          </Button>
        </Stack>
        <UploadNorco />
      </Container>
    </Box>
  );
};

export default AdminAddBikesNorco;
