import { Box, Button, Stack } from "@mui/material";
import AdminHeaderHero from "components/AdminActions/AdminHeaderHero";
import { useAuth } from "components/AuthProvider";
import NavBar, { NAV_BAR_BG } from "components/General/NavBar";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AdminHeaderHeroPage = () => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/admin-login");
    }
  }, [loading, isAuthenticated, navigate]);

  if (loading || !isAuthenticated) return null;

  return (
    <div>
      <NavBar background={NAV_BAR_BG} position="sticky" displayLogo={1} />
      <Stack sx={{ pt: 2, px: 2 }}>
        <Box>
          <Button onClick={() => navigate("/admin-dashboard")}>
            Back to Dashboard
          </Button>
        </Box>
        <AdminHeaderHero />
      </Stack>
    </div>
  );
};

export default AdminHeaderHeroPage;
