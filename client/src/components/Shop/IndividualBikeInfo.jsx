import { Box, Button, Stack, styled } from "@mui/material";
import SizeButtons from "./SizeButtons";
import { useState } from "react";
import { Image } from "cloudinary-react";

const InquireButton = styled(Button)({
  backgroundColor: "#3c5d4e",
  margin: "1%",
  paddingLeft: "2%",
  paddingRight: "2%",
  width: "40%",

  color: "white",
  maxHeight: "40px",
  fontWeight: "300",
  fontSize: "18px",

  "&:hover": {
    backgroundColor: "#4d5e5f",
    color: "white",
  },
});

const MoreInfoButton = styled(Button)({
  backgroundColor: "#3c5d4e",

  paddingLeft: "2%",
  paddingRight: "2%",
  color: "white",
  maxHeight: "40px",
  fontWeight: "300",
  fontSize: "18px",

  "&:hover": {
    backgroundColor: "#4d5e5f",
    color: "white",
  },
});

const IndividualBikeInfo = ({ bike }) => {
  const images = JSON.parse(bike.images);
  const [image, setImage] = useState(images[0]);
  const [preview, setPreview] = useState(images[1]);

  const [size, setSize] = useState(false);

  const switchImage = () => {
    const tempImage = image;
    setImage(preview);
    setPreview(tempImage);
  };

  return (
    <Stack justifyContent={"center"} alignItems={"center"}>
      <Stack
        direction={{ xs: "column", sm: "column", md: "row" }}
        justifyContent={"center"}
        alignItems={"center"}
        textAlign={{ xs: "center", sm: "center", md: "initial" }}
        spacing={5}
        mt={5}
        mb={5}
      >
        <Box display={{ xs: "none", sm: "none", md: "none", lg: "block" }}>
          <Image
            cloudName="ds4ukwnxl"
            publicId={image}
            width="700"
            crop="scale"
          ></Image>
        </Box>
        <Box display={{ xs: "none", sm: "block", md: "block", lg: "none" }}>
          <Image
            cloudName="ds4ukwnxl"
            publicId={image}
            width="500"
            crop="scale"
          ></Image>
        </Box>
        <Box display={{ xs: "block", sm: "none", md: "none", lg: "none" }}>
          <Image
            cloudName="ds4ukwnxl"
            publicId={image}
            width="300"
            crop="scale"
          ></Image>
        </Box>
        <Stack spacing={3}>
          {bike.material === "N/A" ? (
            <Box sx={{ fontSize: "30px" }}>
              {bike.brand} {bike.name}
            </Box>
          ) : (
            <Box sx={{ fontSize: "30px" }}>
              {bike.brand} {bike.name} {bike.material}
            </Box>
          )}
          <Box sx={{ fontSize: "30px", fontWeight: "300" }}>
            ${bike.price.toLocaleString()}
          </Box>
          <Stack
            spacing={1}
            alignItems={{ xs: "center", sm: "center", md: "inherit" }}
          >
            {images.length > 1 && <Box>Colour</Box>}
            <Button onClick={switchImage} sx={{ maxWidth: "150px" }}>
              <Image
                cloudName="ds4ukwnxl"
                publicId={preview}
                width="150"
                crop="scale"
              ></Image>
            </Button>
          </Stack>
          <Stack
            spacing={1}
            alignItems={{ xs: "center", sm: "center", md: "inherit" }}
          >
            <Box>Size</Box>

            <SizeButtons
              sizes={JSON.parse(bike.sizes)}
              setSize={setSize}
              size={size}
            ></SizeButtons>
          </Stack>
          {size && <Box>Availiable</Box>}
        </Stack>
      </Stack>
      <Stack width={"80%"} alignItems={"center"} mb={5} spacing={5}>
        <Box
          fontSize={"20px"}
          lineHeight={"1.5"}
          fontWeight={"300"}
          sx={{ whiteSpace: "pre-wrap" }}
        >
          {bike.description}
        </Box>

        <MoreInfoButton
          // @ts-ignore
          target="_blank"
          href={bike.link}
        >
          More Info
        </MoreInfoButton>
      </Stack>
    </Stack>
  );
};

export default IndividualBikeInfo;
