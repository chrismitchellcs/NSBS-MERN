import HeaderImage from "components/HomePage/HeaderImage";
import Bikes from "components/HomePage/Bikes";
import Closer from "components/General/Closer";
import TransitionHome from "components/HomePage/TransitionHome";
import NorcoHome from "components/HomePage/NorcoHome";
import NSBSInfo from "components/HomePage/NSBSInfo";
import Parts from "components/HomePage/Parts";
import NavBarHome from "components/General/NavBarHome";
import Service from "components/HomePage/Service";
import DemoDay from "components/HomePage/DemoDay";

const Home = () => {
  // const [bikes, setBikes] = useState(null);

  // useEffect(() => {
  //   const fetchBikes = async () => {
  //     const response = await fetch("http://localhost:5050/api/bikes", {
  //       method: "get",
  //       mode: "cors",
  //     });
  //     const json = await response.json();

  //     if (response.ok) {
  //       setBikes(json);
  //     }
  //   };
  //   fetchBikes();
  // }, []);

  return (
    <div>
      {/* <div style={{ position: "relative", minHeight: "100vh", display: "grid" }}> */}
      {/* <div style={{ paddingBottom: "200px" }}> */}
      <NavBarHome
        background={"transparent"}
        position={"absolute"}
        displayLogo={0}
      />
      <HeaderImage></HeaderImage>
      <NSBSInfo></NSBSInfo>
      {/* <DemoDay></DemoDay> */}
      <TransitionHome></TransitionHome>
      <Bikes brand={"Transition"}></Bikes>
      <NorcoHome></NorcoHome>
      <Bikes brand={"Norco"}></Bikes>
      <Parts></Parts>
      <Service></Service>
      {/* </div> */}
      <Closer></Closer>
    </div>
  );
};

export default Home;
