import { Box } from "@mui/material";
import Closer from "components/General/Closer";
import NavBar from "components/General/NavBar";

const ReturnPolicy = () => {
  return (
    <div
      style={{
        margin: 0,
        display: "flex",
        minHeight: "100vh",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          flex: 1,
        }}
      >
        <NavBar background="white" position={"sticky"} displayLogo={1}></NavBar>

        <Box m={5}>
          <Box mb={2} sx={{ fontSize: "30px", fontWeight: "600" }}>
            Return Policy
          </Box>
          <Box sx={{ fontSize: "18px" }}>
            Unused parts, accessories, and clothing can be returned up to 15
            days after purchase. Bikes and helmets are final sale.
          </Box>
        </Box>
      </div>

      <Closer></Closer>
    </div>
  );
};

export default ReturnPolicy;
