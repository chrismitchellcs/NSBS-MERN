import HeaderImage from "components/HomePage/HeaderImage";
import Bikes from "components/HomePage/Bikes";
import Closer from "components/General/Closer";
import TransitionHome from "components/HomePage/TransitionHome";
import NorcoHome from "components/HomePage/NorcoHome";
import Parts from "components/HomePage/Parts";
import Service from "components/HomePage/Service";
import IbisHome from "components/HomePage/IbisHome";
import NavBar from "components/General/NavBar";
import AboutUs from "components/HomePage/AboutUs";
import SEO from "components/General/SEO";

const Home = () => {
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
        displayLogo={1}
      ></NavBar>
      <HeaderImage></HeaderImage>

      <AboutUs></AboutUs>

      <TransitionHome></TransitionHome>

      <Bikes brand={"Transition"}></Bikes>

      <NorcoHome></NorcoHome>

      <Bikes brand={"Norco"}></Bikes>

      <IbisHome></IbisHome>

      <Bikes brand={"Ibis"}></Bikes>

      <Parts></Parts>

      <Service></Service>

      <Closer></Closer>
    </div>
  );
};

export default Home;
