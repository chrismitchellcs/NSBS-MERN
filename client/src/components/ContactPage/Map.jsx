import { Box } from "@mui/material";

const MapBox = () => {
  return (
    <Box>
      <Box
        width={"400px"}
        height={"500px"}
        display={{ xs: "none", sm: "block" }}
        m={5}
      >
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2600.3928021592214!2d-123.07506112318826!3d49.32578167139938!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x548670479ba62361%3A0x3bb6e7001e8fc223!2sNorth%20Shore%20Bike%20Shop!5e0!3m2!1sen!2sca!4v1698461218509!5m2!1sen!2sca"
          style={{ border: 0 }}
          width={"400px"}
          height={"500px"}
          loading="lazy"
        ></iframe>
      </Box>
      <Box
        mb={5}
        width={"300px"}
        height={"400px"}
        display={{ xs: "block", sm: "none" }}
      >
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2600.3928021592214!2d-123.07506112318826!3d49.32578167139938!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x548670479ba62361%3A0x3bb6e7001e8fc223!2sNorth%20Shore%20Bike%20Shop!5e0!3m2!1sen!2sca!4v1698461218509!5m2!1sen!2sca"
          style={{ border: 0 }}
          width={"300px"}
          height={"400px"}
          loading="lazy"
        ></iframe>
      </Box>
    </Box>
  );
};

export default MapBox;
