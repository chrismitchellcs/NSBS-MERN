import { Box, Stack } from "@mui/material";

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
    slidesToSlide: 4,
  },
  desktopSmall: {
    breakpoint: { max: 1200, min: 860 },
    items: 3,
    slidesToSlide: 3,
  },
  tablet: {
    breakpoint: { max: 860, min: 599 },
    items: 2,
    slidesToSlide: 2,
  },
  mobile: {
    breakpoint: { max: 599, min: 0 },
    items: 1,
    slidesToSlide: 1,
  },
};

const Bikes = ({ brand, bikes }) => {
  const navigate = useNavigate();

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
          onClick={() => navigate(`/shop`, { state: { brand: brand } })}
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
            ssr={false}
            infinite={true}
            autoPlay={false}
            autoPlaySpeed={5000}
            keyBoardControl={false}
            customTransition="transform 500ms ease-in-out"
            transitionDuration={0}
            containerClass="carousel-container"
            dotListClass="custom-dot-list-style"
            itemClass="carousel-item-padding-40-px"
          >
            {bikes.slice(0, 20).map((bike) => {
              if (bike.brand.toLowerCase() === brand.toLowerCase()) {
                return (
                  <Box sx={{ display: "inline-block" }}>
                    <BikeCard bike={bike}></BikeCard>
                  </Box>
                );
              } else {
                return null;
              }
            })}
          </Carousel>
        )}
      </Box>
    </Box>
  );
};

export default Bikes;
