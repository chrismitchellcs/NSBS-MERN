import HeaderImage from "components/HomePage/HeaderImage";
import Bikes from "components/HomePage/Bikes";
import Closer from "components/General/Closer";
import TransitionHome from "components/HomePage/TransitionHome";
import NorcoHome from "components/HomePage/NorcoHome";
import NSBSInfo from "components/HomePage/NSBSInfo";
import Parts from "components/HomePage/Parts";
import Service from "components/HomePage/Service";
import IbisHome from "components/HomePage/IbisHome";
import Announcement from "components/HomePage/Announcements/Announcement";
import NavBar from "components/General/NavBar";
import FadeInSection from "components/General/FadeInSection";
import Announcements from "components/HomePage/Announcements";
import AboutUs from "components/HomePage/AboutUs";

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
      {/* <NSBSInfo></NSBSInfo>
       */}
      <AboutUs></AboutUs>
      {/* <FadeInSection> */}
      <Announcements></Announcements>
      {/* </FadeInSection> */}

      {/* <FadeInSection> */}
      <TransitionHome></TransitionHome>
      {/* </FadeInSection> */}

      <Bikes brand={"Transition"}></Bikes>
      {/* <FadeInSection> */}
      <NorcoHome></NorcoHome>
      {/* </FadeInSection> */}
      <Bikes brand={"Norco"}></Bikes>
      {/* <FadeInSection> */}
      <IbisHome></IbisHome>
      {/* </FadeInSection> */}
      <Bikes brand={"Ibis"}></Bikes>
      {/* <FadeInSection> */}
      <Parts></Parts>
      {/* </FadeInSection> */}
      {/* <FadeInSection> */}
      <Service></Service>
      {/* </FadeInSection> */}

      <Closer></Closer>
    </div>
  );
};

export default Home;
