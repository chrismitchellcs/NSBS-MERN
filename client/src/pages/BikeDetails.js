import NavBar from "components/General/NavBar";
import Closer from "components/General/Closer";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import BikeLandingPage from "components/Shop/BikeLandingPage";

const BikeDetails = () => {
  const { bikeid } = useParams();

  const [bike, setBike] = useState(null);

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
        <Box>{bike ? <BikeLandingPage bike={bike}></BikeLandingPage> : ""}</Box>
      </div>

      <Closer></Closer>
    </div>
  );
};

export default BikeDetails;
