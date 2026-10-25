import Closer from "components/General/Closer";
import NavBar from "components/General/NavBar";
import NotFoundContent from "components/General/NotFoundContent";
import SEO from "components/General/SEO";
import { NOT_FOUND_META } from "seo/seoData.mjs";

const NotFound = () => (
  <div style={{ margin: 0, display: "flex", minHeight: "100vh", flexDirection: "column" }}>
    <div style={{ flex: 1 }}>
      <SEO {...NOT_FOUND_META} />
      <NavBar position="sticky" displayLogo />
      <NotFoundContent />
    </div>
    <Closer />
  </div>
);

export default NotFound;
