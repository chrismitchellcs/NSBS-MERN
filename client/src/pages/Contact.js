import { Box } from "@mui/material";
import Closer from "components/General/Closer";
import NavBar from "components/General/NavBar";
import ContactPage from "components/ContactPage/ContactPage";
import SEO from "components/General/SEO";
import { pageMeta } from "seo/seoData.mjs";

const Contact = () => {
  return (
    <Box sx={{ bgcolor: "#f6f7f6", minHeight: "100vh" }}>
      <SEO {...pageMeta("/contact")} />
      <NavBar position="sticky" displayLogo />
      <ContactPage />
      <Closer />
    </Box>
  );
};

export default Contact;
