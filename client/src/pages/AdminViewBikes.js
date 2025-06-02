import { Box, Button, Stack } from "@mui/material";
import AdminBikes from "components/AdminActions/AdminBikes";
import { useAuth } from "components/AuthProvider";
import NavBar from "components/General/NavBar";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AdminViewBikes = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/admin-login");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div>
      <NavBar background="#F5F5F5" position={"sticky"} displayLogo={1}></NavBar>

      <Stack alignItems={"center"} pt={5} spacing={3}>
        <Button onClick={() => navigate("/admin-dashboard")}>
          Back to Dashboard
        </Button>
        <Box sx={{ fontSize: "30px", fontWeight: "600" }}>View Bikes</Box>
        <AdminBikes></AdminBikes>
      </Stack>
    </div>
  );
};

export default AdminViewBikes;
