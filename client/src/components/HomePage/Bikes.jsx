import { Box, Button, Stack, capitalize, styled } from "@mui/material";
import BikeButton from "../Shop/BikeButton";
import { useEffect, useState } from "react";
import axios from "axios";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import Slider from "react-slick";

const ShopButton = styled(Button)({
  backgroundColor: "#3c5d4e",
  margin: "1%",
  paddingLeft: "1%",
  paddingRight: "1%",
  color: "white",
  maxHeight: "40px",
  fontWeight: "400",
  fontSize: "14px",

  "&:hover": {
    backgroundColor: "#4d5e5f",
    color: "white",
  },
});
const responsive = {
  desktop: {
    breakpoint: { max: 10000, min: 1200 },
    items: 4,
    slidesToSlide: 4, // optional, default to 1.
  },
  desktopSmall: {
    breakpoint: { max: 1200, min: 860 },
    items: 3,
    slidesToSlide: 3, // optional, default to 1.
  },
  tablet: {
    breakpoint: { max: 860, min: 599 },
    items: 2,
    slidesToSlide: 2, // optional, default to 1.
  },
  mobile: {
    breakpoint: { max: 599, min: 0 },
    items: 1,
    slidesToSlide: 1, // optional, default to 1.
  },
};

const Bikes = ({ brand }) => {
  const [bikes, setBikes] = useState(null);

  const uppercase = brand.toUpperCase();

  useEffect(() => {
    const fetchBikes = async () => {
      await axios
        .post(`${process.env.REACT_APP_VERCEL_DOMAIN}/api/bikes/brand`, {
          brand,
        })
        .then((res) => {
          setBikes(res.data);
        })
        .catch((error) => {
          console.log(error);
        });
    };
    fetchBikes();
  }, []);

  return (
    <Box textAlign={"center"} mb={2}>
      <Stack
        direction={"row"}
        alignItems={"center"}
        justifyContent={"center"}
        mt={2}
        spacing={3}
      >
        <Box sx={{ fontSize: { xs: "18px", sm: "24px" }, fontWeight: "400" }}>
          SHOP {uppercase} BIKES
        </Box>
        <ShopButton href={`shop/${brand.toLowerCase()}`}>See All</ShopButton>
      </Stack>
      {bikes && (
        <Carousel
          swipeable={true}
          draggable={false}
          showDots={false}
          responsive={responsive}
          ssr={false} // means to render carousel on server-side.
          infinite={true}
          autoPlay={false}
          autoPlaySpeed={5000}
          keyBoardControl={false}
          customTransition="transform 500ms ease-in-out"
          transitionDuration={0}
          containerClass="carousel-container"
          //   deviceType={this.props.deviceType}
          dotListClass="custom-dot-list-style"
          itemClass="carousel-item-padding-40-px"
        >
          {bikes.map((bike) => {
            return <BikeButton bike={bike}></BikeButton>;
          })}
        </Carousel>
      )}

      {/* <Box
        display="flex"
        sx={{
          backgroundColor: "white",
          width: "100%",
          height: "300px",
          p: 0,

          display: "-ms-flexbox",
          WebkitBoxPack: "center",
          MsFlexPack: "center",

          padding: "0px",
          margin: "0px",
        }}
      >
        <Stack>
          <Stack
            direction="row"
            display={"-ms-flexbox"}
            onWheel={handleScroll}
            sx={{
              overflowX: "scroll",
              width: "100%",
              MsFlexPack: "center",
              pt: 1,
              pb: 1,
            }}
          >
            {bikes &&
              bikes.map((bike) => {
                return <BikeButton bike={bike}></BikeButton>;
              })}
          </Stack>
        </Stack>
      </Box> */}
    </Box>
  );
};

export default Bikes;
