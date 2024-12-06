import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
// import Announcement from "./Announcement";
import { Box } from "@mui/material";
import Announcement from "./Announcements/Announcement";
import TransitionAnnouncement from "./Announcements/TransitionAnnouncement";

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 1,
    slidesToSlide: 1, // optional, default to 1.
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 1,
    slidesToSlide: 1, // optional, default to 1.
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
    slidesToSlide: 1, // optional, default to 1.
  },
};

const Announcements = () => {
  return (
    <Box mb={3}>
      <Carousel
        swipeable={false}
        draggable={false}
        showDots={true}
        responsive={responsive}
        ssr={false} // means to render carousel on server-side.
        infinite={true}
        autoPlay={true}
        autoPlaySpeed={5000}
        keyBoardControl={false}
        customTransition="all .5"
        transitionDuration={500}
        containerClass="carousel-container"
        //   deviceType={this.props.deviceType}
        dotListClass="custom-dot-list-style"
        itemClass="carousel-item-padding-40-px"
      >
        {/* <Announcement></Announcement> */}
        <TransitionAnnouncement></TransitionAnnouncement>
        <Announcement></Announcement>
        {/* <TransitionAnnouncement></TransitionAnnouncement> */}
      </Carousel>
    </Box>
  );
};

export default Announcements;
