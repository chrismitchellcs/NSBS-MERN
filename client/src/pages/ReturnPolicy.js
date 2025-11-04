import { Box } from "@mui/material";
import Closer from "components/General/Closer";
import NavBar from "components/General/NavBar";
import SEO from "components/General/SEO";

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
        <SEO
          title="Return Policy | North Shore Bike Shop"
          description="Return policy for North Shore Bike Shop. Unused parts, accessories, and clothing can be returned within 15 days. Bikes and helmets are final sale."
          keywords="bike shop return policy, bike shop refund policy, return policy"
          url="https://www.northshorebikeshop.net/return-policy"
        />
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
