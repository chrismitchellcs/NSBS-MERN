import { Box, Button, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Image } from "cloudinary-react";
import FadeInSection from "components/General/FadeInSection";
const BikeButton = ({ bike }) => {
  const navigate = useNavigate();
  const handleClick = (e) => {
    e.preventDefault();
    // navigate("/bikedetails", { state: bike });
    var brand = bike.brand;
    brand = brand.toLowerCase();

    navigate(`/shop/${brand}/${bike._id}`);
  };

  const images = JSON.parse(bike.colors);
  const firstImage = Object.values(images)[0];

  const image = firstImage;
  return (
    // <Button
    //   onClick={handleClick}
    //   sx={{
    //     alignItems: "flex-end",
    //     // borderColor: "black",
    //     // border: "5px",
    //     minWidth: { xs: "210px", sm: "210px", md: "210px", lg: "350px" },

    //     minHeight: { xs: "210px", sm: "240px", md: "240px", lg: "290px" },
    //     maxWidth: { xs: "210px", sm: "210px", md: "210px", lg: "350px" },
    //     maxHeight: { xs: "210px", sm: "240px", md: "240px", lg: "290px" },
    //     // minWidth: "350px",
    //     // minHeight: "260px",
    //     // maxWidth: "350px",
    //     // maxHeight: "260px",
    //     backgroundColor: "white",
    //     m: 2,
    //     "&:hover": {
    //       backgroundColor: "white",
    //       opacity: "0.8",
    //       color: "black",
    //     },
    //   }}
    // >
    //   <Stack justifyContent={"center"} alignItems={"center"}>
    //     {/* <Box
    //       component={"img"}
    //       src="spire-fadetoblack-xoaxs.jpeg"
    //       width={"100%"}
    //       sx={{
    //         color: "inherit",
    //       }}
    //     ></Box> */}
    //     <Box display={{ xs: "block", sm: "block", md: "block", lg: "none" }}>
    //       <Image
    //         cloudName="ds4ukwnxl"
    //         publicId={image}
    //         width="210"
    //         crop="fill"
    //       ></Image>
    //     </Box>
    //     <Box display={{ xs: "none", sm: "none", md: "none", lg: "block" }}>
    //       <Image
    //         cloudName="ds4ukwnxl"
    //         publicId={image}
    //         width="330"
    //         crop="fill"
    //       ></Image>
    //     </Box>
    //     <Stack>
    //       {bike.material === "N/A" ? (
    //         <Box color={"black"} fontSize={"16px"} fontWeight={"400"}>
    //           {bike.brand} {bike.name}
    //         </Box>
    //       ) : (
    //         <Box color={"black"} fontSize={"16px"} fontWeight={"400"}>
    //           {bike.brand} {bike.name} {bike.material}
    //         </Box>
    //       )}

    //       <Box color={"black"} fontSize={"16px"} fontWeight={"300"}>
    //         ${bike.price}
    //       </Box>
    //     </Stack>
    //   </Stack>
    // </Button>

    <Button
      onClick={handleClick}
      sx={{
        minHeight: "270px",
        maxHeight: "270px",
        minWidth: "270px",
        maxWidth: "270px",
        m: 2,
        color: "black",
        "&:hover": {
          backgroundColor: "white",
          opacity: "0.6",
          color: "black",
        },
      }}
    >
      <Stack sx={{ height: "270px" }}>
        <Box display={"flex"} justifyContent={"flex-end"}>
          {bike.saleprice ? (
            <Box
              sx={{
                bgcolor: "#faa2b0",
                pl: 1,
                pr: 1,
                borderRadius: "5px",
                height: "25px",
              }}
            >
              SALE
            </Box>
          ) : (
            <Box
              sx={{
                bgcolor: "white",
                pl: 1,
                pr: 1,
                borderRadius: "5px",
                height: "25px",
              }}
            ></Box>
          )}
        </Box>

        <Image
          cloudName="ds4ukwnxl"
          publicId={image}
          width="270"
          height="180"
          crop="pad"
          background="auto"
          quality="1" // absolute minimum quality
          fetchFormat="jpg" // disables WebP/AVIF smart compression
          alt="bike"
          style={{
            width: "270px",
            height: "180px",
            objectFit: "contain",
            display: "block",
          }}
        />

        {bike.material === "N/A" ? (
          <Box color={"black"} fontSize={"14px"} fontWeight={"400"}>
            {bike.brand} {bike.name}
          </Box>
        ) : (
          <Box color={"black"} fontSize={"14px"} fontWeight={"400"}>
            {bike.brand} {bike.name} {bike.material}
          </Box>
        )}
        {bike.saleprice ? (
          <Box display={"flex"} justifyContent={"center"}>
            <Box
              color={"black"}
              fontSize={"14px"}
              fontWeight={"300"}
              sx={{ textDecoration: "line-through", mr: 1 }}
            >
              ${bike.price.toLocaleString()}
            </Box>
            <Box
              color={"black"}
              fontSize={"14px"}
              fontWeight={"400"}
              sx={{ ml: 1 }}
            >
              ${bike.saleprice.toLocaleString()}
            </Box>
          </Box>
        ) : (
          <Box color={"black"} fontSize={"16px"} fontWeight={"400"} sx={{}}>
            ${bike.price.toLocaleString()}
          </Box>
        )}
      </Stack>
    </Button>
  );
};

export default BikeButton;
