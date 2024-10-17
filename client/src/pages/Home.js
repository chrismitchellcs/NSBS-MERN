import HeaderImage from "components/HomePage/HeaderImage";
import Bikes from "components/HomePage/Bikes";
import Closer from "components/General/Closer";
import TransitionHome from "components/HomePage/TransitionHome";
import NorcoHome from "components/HomePage/NorcoHome";
import NSBSInfo from "components/HomePage/NSBSInfo";
import Parts from "components/HomePage/Parts";
import NavBarHome from "components/General/NavBarHome";
import Service from "components/HomePage/Service";

const Home = () => {
  return (
    <div>
      <NavBarHome
        background={"transparent"}
        position={"absolute"}
        displayLogo={0}
      />
      <HeaderImage></HeaderImage>
      <NSBSInfo></NSBSInfo>
      <TransitionHome></TransitionHome>
      <Bikes brand={"Transition"}></Bikes>
      <NorcoHome></NorcoHome>
      <Bikes brand={"Norco"}></Bikes>
      <Parts></Parts>
      <Service></Service>
      <Closer></Closer>
    </div>
  );
};

export default Home;
