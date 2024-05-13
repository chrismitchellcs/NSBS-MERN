import { Box, Button, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Image } from "cloudinary-react";
const BikeButton = ({ bike }) => {
  const navigate = useNavigate();
  const handleClick = (e) => {
    e.preventDefault();
    navigate("/bikedetails", { state: bike });
  };

  const image = JSON.parse(bike.images)[0];
  return (
    <Button
      onClick={handleClick}
      sx={{
        borderColor: "black",
        border: "5px",
        minWidth: { xs: "210px", sm: "210px", md: "210px", lg: "350px" },

        minHeight: { xs: "210px", sm: "210px", md: "210px", lg: "260px" },
        maxWidth: { xs: "210px", sm: "210px", md: "210px", lg: "350px" },
        maxHeight: { xs: "210px", sm: "210px", md: "210px", lg: "260px" },
        // minWidth: "350px",
        // minHeight: "260px",
        // maxWidth: "350px",
        // maxHeight: "260px",
        backgroundColor: "white",
        m: 2,
        "&:hover": {
          backgroundColor: "white",
          opacity: "0.8",
          color: "black",
        },
      }}
    >
      <Stack justifyContent={"center"} alignItems={"center"}>
        {/* <Box
          component={"img"}
          src="spire-fadetoblack-xoaxs.jpeg"
          width={"100%"}
          sx={{
            color: "inherit",
          }}
        ></Box> */}
        <Box display={{ xs: "block", sm: "block", md: "block", lg: "none" }}>
          <Image
            cloudName="ds4ukwnxl"
            publicId={image}
            width="210"
            crop="fill"
          ></Image>
        </Box>
        <Box display={{ xs: "none", sm: "none", md: "none", lg: "block" }}>
          <Image
            cloudName="ds4ukwnxl"
            publicId={image}
            width="330"
            crop="fill"
          ></Image>
        </Box>

        {bike.material === "N/A" ? (
          <Box color={"black"} fontSize={"16px"} fontWeight={"400"}>
            {bike.brand} {bike.name}
          </Box>
        ) : (
          <Box color={"black"} fontSize={"16px"} fontWeight={"400"}>
            {bike.brand} {bike.name} {bike.material}
          </Box>
        )}

        <Box color={"black"} fontSize={"16px"} fontWeight={"300"}>
          ${bike.price}
        </Box>
      </Stack>
    </Button>
  );
};

export default BikeButton;
