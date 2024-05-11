import Closer from "components/General/Closer";
import NavBar from "components/General/NavBar";
import ShopContent from "components/Shop/ShopContent";

const Shop = () => {
  return (
    <div>
      <NavBar background="white" position={"sticky"} displayLogo={1}></NavBar>
      <ShopContent></ShopContent>
      <Closer></Closer>
    </div>
  );
};

export default Shop;
