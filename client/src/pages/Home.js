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
import { pageMeta } from "seo/seoData.mjs";
import AboutImages from "components/HomePage/AboutImages";
import VisitStrip from "components/HomePage/VisitStrip";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";

function groupBikesByBrand(bikes = []) {
  const acc = bikes.reduce((acc, bike) => {
    const brand = bike.brand;
    if (!acc[brand]) acc[brand] = [];
    acc[brand].push(bike);
    return acc;
  }, {});
  for (const key of Object.keys(acc)) {
    acc[key].sort(
      (a, b) => (Number(b.viewCount) || 0) - (Number(a.viewCount) || 0),
    );
  }
  return acc;
}

const Home = () => {
  const [bikes, setBikes] = useState([]);
  useEffect(() => {
    const fetchBikes = async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_VERCEL_DOMAIN}/api/bikes/home-preview`,
      );
      setBikes(response.data);
    };
    fetchBikes();
  }, []);

  const bikesByBrand = useMemo(() => groupBikesByBrand(bikes ?? []), [bikes]);

  return (
    <div>
      <SEO {...pageMeta("/")} />
      <NavBar background="transparent" position="fixed" displayLogo />
      <HeaderImage></HeaderImage>
      <VisitStrip />

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
