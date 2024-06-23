import Closer from "components/General/Closer";
import NavBar from "components/General/NavBar";
import ShopContent from "components/Shop/ShopContent";

const Shop = () => {
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
        <ShopContent></ShopContent>
      </div>
      <Closer></Closer>
    </div>
  );
};

export default Shop;
