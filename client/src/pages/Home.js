import HeaderImage from "components/HomePage/HeaderImage";
import Bikes from "components/HomePage/Bikes";
import Closer from "components/General/Closer";
import TransitionHome from "components/HomePage/TransitionHome";
import NorcoHome from "components/HomePage/NorcoHome";
import NSBSInfo from "components/HomePage/NSBSInfo";
import Parts from "components/HomePage/Parts";
import NavBarHome from "components/General/NavBarHome";
import Service from "components/HomePage/Service";
import IbisHome from "components/HomePage/IbisHome";
import Announcement from "components/HomePage/Announcement";
import NavBar from "components/General/NavBar";

const Home = () => {
  return (
    <div>
      {/* <NavBarHome
        background={"transparent"}
        position={"absolute"}
        displayLogo={0}
      /> */}
      <NavBar
        background="transparent"
        position={"absolute"}
        displayLogo={1}
      ></NavBar>
      <HeaderImage></HeaderImage>
      <NSBSInfo></NSBSInfo>
      <Announcement></Announcement>
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
