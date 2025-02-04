import IndividualBikeInfo from "components/Shop/IndividualBikeInfo";
import NavBar from "components/General/NavBar";
import { useLocation } from "react-router-dom";
import ShopNote from "components/Shop/ShopNote";
import Closer from "components/General/Closer";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import IndividualBikeInfoNew from "components/Shop/IndividualBikeInfoNew";

const BikeDetails = () => {
  // const location = useLocation();
  // const bike = location.state;
  const { bikeid } = useParams();

  const [bike, setBike] = useState(null);

  // useEffect(() => {
  //   const fetchBike = async () => {
  //     await axios
  //       .get(`${process.env.REACT_APP_VERCEL_DOMAIN}/api/bikes/${bikeid}`, {})
  //       .then((res) => {
  //         console.log("bike:" + res.data);
  //         setBike(res.data);
  //         // setCurrentBike(res.data);
  //       })
  //       .catch((error) => {
  //         console.log(error);
  //       });
  //   };

  //   fetchBike();
  // }, []);

  useEffect(() => {
    const fetchBikes = async () => {
      await axios
        .get(`${process.env.REACT_APP_VERCEL_DOMAIN}/api/bikes/${bikeid}`, {})
        .then((res) => {
          setBike(res.data);
        })
        .catch((error) => {
          console.log(error);
        });
    };
    fetchBikes();
  }, []);

  console.log("return");
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
        {/* <ShopNote></ShopNote> */}
        <Box>
          {bike ? (
            <IndividualBikeInfoNew bike={bike}></IndividualBikeInfoNew>
          ) : (
            ""
          )}
        </Box>
      </div>

      <Closer></Closer>
    </div>
  );
};

export default BikeDetails;
