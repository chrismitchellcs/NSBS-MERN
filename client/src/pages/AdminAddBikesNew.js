import { Stack, Box, Button } from "@mui/material";
import AddNewBike from "components/AdminActions/AddNewBike";
import { useAuth } from "components/AuthProvider";
import NavBar from "components/General/NavBar";
import UploadTransitions from "components/Uploaders/UploadTransitions";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AdminAddBikesNew = () => {
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
      <Stack justifyContent={"center"} pt={0}>
        <Box>
          <Button onClick={() => navigate("/admin-dashboard")}>
            Back to Dashboard
          </Button>
        </Box>
        <Stack alignItems={"center"}>
          <Box sx={{ fontSize: "30px" }}>Add a new bike</Box>
          <AddNewBike></AddNewBike>
        </Stack>
      </Stack>
    </div>
  );
};

export default AdminAddBikesNew;
