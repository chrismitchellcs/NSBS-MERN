import { Box, Button, Stack } from "@mui/material";
import AdminServiceListings from "components/AdminActions/AdminServiceListings";
import { useAuth } from "components/AuthProvider";
import NavBar, { NAV_BAR_BG } from "components/General/NavBar";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AdminServiceListingsPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/admin-login");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div>
      <NavBar background={NAV_BAR_BG} position="sticky" displayLogo={1} />
      <Stack sx={{ pt: 2, px: 2 }}>
        <Box>
          <Button onClick={() => navigate("/admin-dashboard")}>Back to Dashboard</Button>
        </Box>
        <AdminServiceListings />
      </Stack>
    </div>
  );
};

export default AdminServiceListingsPage;
