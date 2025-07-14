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

const Home = () => {
  return (
    <div>
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
