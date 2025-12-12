import { Box, Button, Stack } from "@mui/material";
import { useAuth } from "components/AuthProvider";
import NavBar from "components/General/NavBar";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
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
      <Stack direction={"row"} justifyContent={"space-around"} pt={5}>
        <Stack bgcolor={"#F5F5F5"} p={5} spacing={2}>
          <Box>To add and update transition bikes, go here:</Box>
          <Button onClick={() => navigate("/admin-addbikes-transition")}>
            Add Bikes
          </Button>
        </Stack>
        {/* <Stack bgcolor={"#F5F5F5"} p={5} spacing={2}>
          <Box>To add and update norco bikes, go here:</Box>
          <Button onClick={() => navigate("/admin-addbikes-norco")}>
            Add Bikes
          </Button>
        </Stack> */}
        <Stack bgcolor={"#F5F5F5"} p={5} spacing={2}>
          <Box>To add other bikes (Norco, Ibis, Custom Transitions):</Box>
          <Button onClick={() => navigate("/admin-addbikes-new")}>
            Add Bikes
          </Button>
        </Stack>
      </Stack>
    </div>
  );
};

export default AdminDashboard;
