import { Box, Stack } from "@mui/material";

import { useEffect, useState } from "react";
import axios from "axios";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import BikeCard from "components/Shop/BikeCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import "../../index.css";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

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
  }, [brand]);

  return (
    <Box textAlign={"center"} bgcolor={"white"} p={3} pt={6}>
      <Stack
        direction={"row"}
        alignItems={"center"}
        justifyContent={{ xs: "center", sm: "flex-start" }}
        spacing={3}
        pl={3}
      >
        <div className="xs:text-xl sm:text-2xl font-medium">
          Shop {brand} Bikes
        </div>
        <button
          onClick={() => navigate(`/shop/${brand.toLowerCase()}`)}
          className="xs:text-xl sm:text-2xl text-gray-500 hover:text-gray-700 flex flex-row items-center "
        >
          <div className="font-medium">See All</div>
          <div className="">
            <FontAwesomeIcon icon={faArrowRight} />
          </div>
        </button>
      </Stack>
      <Box height={"350px"}>
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
              return <BikeCard bike={bike}></BikeCard>;
            })}
          </Carousel>
        )}
      </Box>

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
