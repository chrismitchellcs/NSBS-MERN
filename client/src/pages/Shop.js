import NavBar from "components/General/NavBar";
import ShopContent from "components/Shop/ShopContent";

const Shop = () => {
  return (
    <div>
      <NavBar background="white" position={"sticky"} displayLogo={1}></NavBar>
      <ShopContent></ShopContent>
    </div>
  );
};

export default Shop;
