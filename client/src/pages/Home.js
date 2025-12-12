import HeaderImage from "components/HomePage/HeaderImage";
import Bikes from "components/HomePage/Bikes";
import Closer from "components/General/Closer";
import TransitionHome from "components/HomePage/TransitionHome";
import NorcoHome from "components/HomePage/NorcoHome";
import Parts from "components/HomePage/Parts";
import Service from "components/HomePage/Service";
import IbisHome from "components/HomePage/IbisHome";
import NavBar from "components/General/NavBar";
import SEO from "components/General/SEO";
import AboutImages from "components/HomePage/AboutImages";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";

function groupBikesByBrand(bikes = []) {
  return bikes.reduce((acc, bike) => {
    const brand = bike.brand;
    if (!acc[brand]) acc[brand] = [];
    acc[brand].push(bike);
    return acc;
  }, {});
}

const Home = () => {
  const [bikes, setBikes] = useState([]);
  useEffect(() => {
    const fetchBikes = async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_VERCEL_DOMAIN}/api/bikes/`
      );
      setBikes(response.data);
    };
    fetchBikes();
  }, []);

  const bikesByBrand = useMemo(() => groupBikesByBrand(bikes ?? []), [bikes]);

  return (
    <div>
      <SEO
        title="North Shore Bike Shop | Premium Mountain Bikes & Expert Service"
        description="North Shore Bike Shop - Your premier destination for Transition, Norco, and Ibis mountain bikes. Expert bike service, repairs, and tune-ups in British Columbia."
        keywords="mountain bikes BC, bike shop Vancouver, Transition bikes, Norco bikes, Ibis bikes, bike service, bike repair, North Vancouver bike shop"
        url="https://www.northshorebikeshop.net"
      />
      <NavBar
        background="transparent"
        position={"absolute"}
        displayLogo={true}
      ></NavBar>
      <HeaderImage></HeaderImage>

      {/* <AboutUs></AboutUs> */}
      <AboutImages></AboutImages>
      <TransitionHome></TransitionHome>

      <Bikes brand={"Transition"} bikes={bikesByBrand["Transition"]}></Bikes>

      <NorcoHome></NorcoHome>

      <Bikes brand={"Norco"} bikes={bikesByBrand["Norco"]}></Bikes>

      <IbisHome></IbisHome>

      <Bikes brand={"Ibis"} bikes={bikesByBrand["Ibis"]}></Bikes>

      <Parts></Parts>

      <Service></Service>

      <Closer></Closer>
    </div>
  );
};

export default Home;
