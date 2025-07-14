import { Box, Button, Stack } from "@mui/material";
import { useAuth } from "components/AuthProvider";
import NavBar from "components/General/NavBar";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AdminAddBikesNorco = () => {
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
        {/* <UploadTransitions></UploadTransitions> */}
      </Stack>
    </div>
  );
};

export default AdminAddBikesNorco;
