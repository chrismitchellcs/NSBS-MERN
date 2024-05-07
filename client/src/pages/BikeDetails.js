import IndividualBikeInfo from "components/Shop/IndividualBikeInfo";
import NavBar from "components/General/NavBar";
import { useLocation } from "react-router-dom";
import ShopNote from "components/Shop/ShopNote";

const BikeDetails = () => {
  const location = useLocation();
  const bike = location.state;

  return (
    <div style={{ display: "grid" }}>
      <NavBar background="white" position={"sticky"} displayLogo={1}></NavBar>
      <ShopNote></ShopNote>
      <IndividualBikeInfo bike={bike}></IndividualBikeInfo>
    </div>
  );
};

export default BikeDetails;
