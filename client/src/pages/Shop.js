import Closer from "components/General/Closer";
import FadeInSection from "components/General/FadeInSection";
import NavBar from "components/General/NavBar";
import ShopContent from "components/Shop/ShopContent";
import ShopContentNew from "components/Shop/ShopContentNew";
import { useEffect, useState } from "react";

const Shop = () => {
  return (
    // <div
    //   style={{
    //     margin: 0,
    //     display: "flex",
    //     minHeight: "100vh",
    //     flexDirection: "column",
    //   }}
    // >
    //   <div
    //     style={{
    //       flex: 1,
    //     }}
    //   >
    //     <NavBar background="white" position={"sticky"} displayLogo={1}></NavBar>
    //     <ShopContent></ShopContent>
    //   </div>
    //   <Closer></Closer>
    // </div>
    <div>
      <ShopContentNew></ShopContentNew>
    </div>
  );
};

export default Shop;
