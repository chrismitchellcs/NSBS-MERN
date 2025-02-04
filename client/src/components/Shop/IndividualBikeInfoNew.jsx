import {
  Alert,
  Box,
  Button,
  FormControl,
  Stack,
  styled,
  TextField,
} from "@mui/material";
import { useRef, useState } from "react";
import { Image } from "cloudinary-react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

import axios from "axios";
import CheckIcon from "@mui/icons-material/Check";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import ReCAPTCHA from "react-google-recaptcha";

const IndividualBikeInfoNew = ({ bike }) => {
  console.log(bike);

  const imageArray = JSON.parse(bike.images);

  const images = imageArray;
  const [preview, setPreview] = useState(images[0]);
  const sizes = JSON.parse(bike.sizes);
  const sizesa = JSON.parse(bike.sizesa);
  const sizesis = JSON.parse(bike.sizesis);
  const [selectedSize, setSelectedSize] = useState("Please select a size");
  const [availability, setAvailability] = useState("Select a Size");
  console.log(bike.sizes);
  const switchImage = (e) => {
    e.preventDefault();
    setPreview(images[e.currentTarget.id]);
  };

  const captchaRef = useRef(null);

  const SizeButton = styled(Button)({
    color: "black",
    backgroundColor: "#c0ccc6",
    maxHeight: "40px",
    fontWeight: "400",
    fontSize: "14px",

    "&:hover": {
      backgroundColor: "#81948a",
      color: "black",
    },
  });

  const SizeButtonSelected = styled(Button)({
    color: "black",
    backgroundColor: "#5c7d6e",
    maxHeight: "40px",
    fontWeight: "400",
    fontSize: "14px",

    "&:hover": {
      backgroundColor: "#81948a",
      color: "black",
    },
  });

  const [formSent, setFormSent] = useState(false);
  const [formNotSent, setFormNotSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    var bikename = "";
    if (bike.material === "N/A") {
      bikename = bike.brand + " " + bike.name;
    } else {
      bikename = bike.brand + " " + bike.name + " " + bike.material;
    }
    const name = e.target[0].value;
    const email = e.target[2].value;
    const color = e.target[4].value;
    const message = e.target[6].value;
    const size = selectedSize;
    const token = captchaRef.current.getValue();
    captchaRef.current.reset();

    await axios
      .post(`${process.env.REACT_APP_VERCEL_DOMAIN}/api/bikes/sendbikeform`, {
        token,
        name,
        email,
        bikename,
        color,
        size,
        message,
      })
      .then((res) => {
        setFormSent(true);
        setFormNotSent(false);
      })
      .catch((error) => {
        setFormNotSent(true);
        setFormSent(false);
      });
  };

  const SizeButtonSmall = styled(Button)({
    color: "black",
    backgroundColor: "#c0ccc6",
    maxHeight: "40px",
    fontWeight: "400",
    fontSize: "12px",
    minWidth: "40px",

    "&:hover": {
      backgroundColor: "#81948a",
      color: "black",
    },
  });

  const SizeButtonSmallSelected = styled(Button)({
    color: "black",
    backgroundColor: "#5c7d6e",
    maxHeight: "40px",
    fontWeight: "400",
    fontSize: "12px",
    minWidth: "40px",

    "&:hover": {
      backgroundColor: "#81948a",
      color: "black",
    },
  });

  const BuyButton = styled(Button)({
    color: "black",
    border: "solid",
    borderRadius: "10px",
    maxHeight: "40px",
    borderWidth: "1px",
    fontWeight: "500",
    fontSize: "18px",

    "&:hover": {
      backgroundColor: "white",
      color: "black",
    },
  });

  const SeeMoreButton = styled(Button)({
    color: "black",
    border: "solid",
    borderWidth: "1px",
    maxHeight: "40px",
    fontWeight: "400",
    fontSize: "14px",

    "&:hover": {
      backgroundColor: "white",
      color: "black",
    },
  });

  const Colours = () => {
    return (
      <Stack>
        <Box sx={{ fontSize: "15px", fontWeight: "700" }}>COLOURS</Box>
        <Stack mt={1} direction={"row"} spacing={1}>
          {images.map((image, index) => {
            return (
              <Button
                onClick={switchImage}
                id={index}
                sx={{ maxWidth: "150px", p: 0 }}
              >
                <Box display={{ xs: "none", sm: "block" }}>
                  <Image
                    cloudName="ds4ukwnxl"
                    publicId={image}
                    width="150"
                    crop="scale"
                  ></Image>
                </Box>
                <Box display={{ xs: "block", sm: "none" }}>
                  <Image
                    cloudName="ds4ukwnxl"
                    publicId={image}
                    width="100"
                    crop="scale"
                  ></Image>
                </Box>
              </Button>
            );
          })}
        </Stack>
      </Stack>
    );
  };

  const [menuOpen, setMenuOpen] = useState(false);

  const toggleBuyMenu = () => {
    // if (availability == "Select a Size") {
    // } else {
    setMenuOpen(!menuOpen);
    // }
  };

  const BuyMenu = () => {
    return (
      <Stack
        bgcolor={"white"}
        sx={{ borderRadius: "10px", p: 2, borderWidth: "1px", border: 1 }}
      >
        <form onSubmit={handleSubmit}>
          <FormControl>
            <Stack spacing={2}>
              <TextField
                id="outlined-multiline-static"
                label="Name"
                color="success"
              />
              <TextField
                color="success"
                id="outlined-multiline-static"
                label="Email or Phone Number"
              />
              <TextField
                color="success"
                id="outlined-multiline-static"
                label="Colour Preference (If Applicable)"
              />
              <TextField
                color="success"
                id="outlined-multiline-static"
                label="Pick-up / Delivery Options, Questions, or Special Requests"
                multiline
                rows={4}
              />
              <Box alignSelf={"center"} fontSize={"16px"} fontWeight={"350"}>
                After submitting, we’ll respond within 24 hours to confirm
                availability and guide you through the next steps. This inquiry
                does not commit you to a purchase.
              </Box>

              <ReCAPTCHA
                sitekey="6LcIjDQpAAAAANHNJdQQTrJy-LQLR7oAWIWontHU"
                ref={captchaRef}
              />

              <Button type="submit" variant="contained" color="success">
                Submit
              </Button>
            </Stack>
          </FormControl>
        </form>
        {formSent && (
          <Alert
            sx={{ mt: 2 }}
            icon={<CheckIcon fontSize="inherit" />}
            severity="success"
          >
            Inquiry sent! We will get back to you within 24 hours.
          </Alert>
        )}
        {formNotSent && (
          <Alert
            sx={{ mt: 2 }}
            icon={<ErrorOutlineIcon fontSize="inherit" />}
            severity="error"
          >
            Inquiry not sent. Please try again or use our email
            northshorebikeshop@gmail.com or phone number 604-929-6727
          </Alert>
        )}
      </Stack>
    );
  };

  const UpdateSize = (e) => {
    e.preventDefault();
    const size = e.currentTarget.id;
    setSelectedSize(size);

    if (sizesis.includes(size)) {
      setAvailability("In Stock");
    } else if (sizesa.includes(size)) {
      setAvailability("Available to Order");
    } else {
      setAvailability("Not Available");
    }
  };

  const Sizes = () => {
    return (
      <Stack>
        <Box sx={{ fontSize: "15px", fontWeight: "700" }}>SIZES</Box>
        <Stack direction={"row"} mt={1} spacing={1}>
          {sizes.map((size) => {
            return (
              <Box>
                <Box
                  display={{ xs: "none", sm: "block", md: "none", lg: "block" }}
                >
                  {selectedSize === size ? (
                    <SizeButtonSelected id={size} onClick={UpdateSize}>
                      {size}
                    </SizeButtonSelected>
                  ) : (
                    <SizeButton id={size} onClick={UpdateSize}>
                      {size}
                    </SizeButton>
                  )}
                </Box>
                <Box
                  display={{ xs: "block", sm: "none", md: "block", lg: "none" }}
                >
                  {selectedSize === size ? (
                    <SizeButtonSmallSelected id={size} onClick={UpdateSize}>
                      {size}
                    </SizeButtonSmallSelected>
                  ) : (
                    <SizeButtonSmall id={size} onClick={UpdateSize}>
                      {size}
                    </SizeButtonSmall>
                  )}
                </Box>
              </Box>
            );
          })}
        </Stack>
      </Stack>
    );
  };

  const Availability = () => {
    return (
      <Box>
        <Box sx={{ fontSize: "15px", fontWeight: "700", mb: 1 }}>
          AVAILABILITY
        </Box>
        <Box>
          {availability === "In Stock" ||
          availability === "Available to Order" ? (
            <Box
              borderRadius={3}
              textAlign={"center"}
              width={"100%"}
              p={1}
              bgcolor={"lightgreen"}
            >
              {availability}
            </Box>
          ) : (
            <Box
              borderRadius={3}
              textAlign={"center"}
              width={"100%"}
              p={1}
              bgcolor={"lightgrey"}
            >
              {availability}
            </Box>
          )}
        </Box>
      </Box>
    );
  };

  return (
    <Stack
      width={{ xs: "90%", sm: "90%", md: "90%", lg: "90%", xl: "80%" }}
      justifySelf={"center"}
      spacing={5}
      mt={{ xs: 0, sm: 0, md: 5 }}
      mb={5}
      ml={"auto"}
      mr={"auto"}
    >
      <Stack
        direction={{ xs: "column", sm: "column", md: "row" }}
        justifyContent={"space-between"}
        spacing={{ xs: 3, sm: 3, md: 10 }}
        width={"100%"}
        justifySelf={"center"}
        mt={5}
      >
        <Stack spacing={2}>
          <Box
            display={{
              xs: "none",
              sm: "none",
              md: "none",
              lg: "none",
              xl: "block",
            }}
          >
            <Image
              cloudName="ds4ukwnxl"
              publicId={preview}
              width="750"
              crop="scale"
            ></Image>
          </Box>
          <Box
            display={{
              xs: "none",
              sm: "none",
              md: "none",
              lg: "block",
              xl: "none",
            }}
          >
            <Image
              cloudName="ds4ukwnxl"
              publicId={preview}
              width="600"
              crop="scale"
            ></Image>
          </Box>
          <Box
            display={{ xs: "none", sm: "none", md: "block", lg: "none" }}
            textAlign={"center"}
          >
            <Image
              cloudName="ds4ukwnxl"
              publicId={preview}
              width="400"
              crop="scale"
            ></Image>
          </Box>
          <Box
            display={{ xs: "none", sm: "block", md: "none", lg: "none" }}
            textAlign={"center"}
          >
            <Image
              cloudName="ds4ukwnxl"
              publicId={preview}
              width="500"
              crop="scale"
            ></Image>
          </Box>
          <Box
            display={{ xs: "block", sm: "none", md: "none", lg: "none" }}
            textAlign={"center"}
          >
            <Image
              cloudName="ds4ukwnxl"
              publicId={preview}
              width="300"
              crop="scale"
            ></Image>
          </Box>
          {imageArray.length >= 1 && <Colours></Colours>}
          {/* <Stack
            display={{ xs: "none", sm: "none", md: "block" }}
            spacing={3}
            width={{
              md: "400px",
              lg: "600px",
              xl: "750px",
            }}
          >
            <Box
              sx={{
                fontSize: "26px",
                fontWeight: "700",
              }}
            >
              ABOUT
            </Box>
            <Box sx={{ whiteSpace: "pre-wrap" }}>{bike.description}</Box>
            <Box>
              <SeeMoreButton>See More</SeeMoreButton>
            </Box>
          </Stack> */}
        </Stack>
        <Stack
          spacing={3}
          width={"100%"}
          //   minWidth={{
          //     xs: "0px",
          //     sm: "0px",
          //     md: "0px",
          //     lg: "400px",
          //     xl: "600px",
          //   }}
        >
          {bike.material === "N/A" ? (
            <Box
              sx={{
                fontSize: "26px",
                fontWeight: "700",
              }}
            >
              {bike.brand.toUpperCase()} {bike.name.toUpperCase()}
            </Box>
          ) : (
            <Box
              sx={{
                fontSize: "26px",
                fontWeight: "700",
              }}
            >
              {bike.brand.toUpperCase()} {bike.name.toUpperCase()}{" "}
              {bike.material.toUpperCase()}
            </Box>
          )}
          {bike.saleprice ? (
            <Stack direction={"row"}>
              <Box
                color={"black"}
                fontSize={"24px"}
                fontWeight={"300"}
                sx={{ textDecoration: "line-through", mr: 1 }}
              >
                ${bike.price.toLocaleString()}
              </Box>
              <Box
                color={"black"}
                fontSize={"24px"}
                fontWeight={"400"}
                sx={{ ml: 1 }}
              >
                ${bike.saleprice.toLocaleString()}
              </Box>
            </Stack>
          ) : (
            <Box
              display={"flex"}
              color={"black"}
              fontSize={"30px"}
              fontWeight={"400"}
              sx={{}}
            >
              ${bike.price.toLocaleString()}
            </Box>
          )}

          <Sizes></Sizes>
          <Availability></Availability>

          {/* {availability == "In Stock" ||
          availability == "Available to Order" ||
          availability == "Select a Size" ? ( */}
          <BuyButton onClick={toggleBuyMenu}>
            BUY
            {!menuOpen ? (
              <KeyboardArrowDownIcon
                sx={{ fontSize: "28px" }}
              ></KeyboardArrowDownIcon>
            ) : (
              <KeyboardArrowUpIcon
                sx={{ fontSize: "28px" }}
              ></KeyboardArrowUpIcon>
            )}
          </BuyButton>

          {menuOpen && <BuyMenu></BuyMenu>}
        </Stack>
      </Stack>
      <Stack display={{ xs: "block", sm: "block", md: "block" }} spacing={3}>
        <Box
          sx={{
            fontSize: "26px",
            fontWeight: "700",
          }}
        >
          ABOUT
        </Box>
        <Box sx={{ whiteSpace: "pre-wrap" }}>{bike.description}</Box>
        <Box>
          <SeeMoreButton
            // @ts-ignore
            target="_blank"
            href={bike.link}
          >
            See More
          </SeeMoreButton>
        </Box>
      </Stack>
      <Stack spacing={4}>
        <Box
          alignSelf={"center"}
          sx={{
            fontSize: "26px",
            fontWeight: "700",
          }}
        >
          WHY BUY FROM NSBS
        </Box>
        <Stack
          direction={{ xs: "column", sm: "column", md: "row" }}
          alignSelf={"center"}
          width={"100%"}
          justifyContent={"space-around"}
          spacing={5}
          alignItems={{ xs: "center", sm: "center", md: "inherit" }}
        >
          <Stack width={{ xs: "80%", sm: "80%", md: "25%" }} spacing={1}>
            <Box
              textAlign={"center"}
              sx={{ fontSize: "20px", fontWeight: "700" }}
            >
              Lifetime Free Tune-Ups
            </Box>
            <Box textAlign={"center"}>
              FREE drivetrain and brake adjustments, wheel truing, and
              additional maintenance whenever you need! Only applies to original
              owner.
            </Box>
          </Stack>
          <Stack width={{ xs: "80%", sm: "80%", md: "25%" }} spacing={1}>
            <Box
              textAlign={"center"}
              sx={{ fontSize: "20px", fontWeight: "700" }}
            >
              15% Off All Parts and Labour
            </Box>
            <Box textAlign={"center"}>
              FREE drivetrain and brake adjustments, wheel truing, and
              additional maintenance whenever you need! Only applies to original
              owner.
            </Box>
          </Stack>
          <Stack width={{ xs: "80%", sm: "80%", md: "25%" }} spacing={1}>
            <Box
              textAlign={"center"}
              sx={{ fontSize: "20px", fontWeight: "700" }}
            >
              Custom Bike Setup
            </Box>
            <Box textAlign={"center"}>
              Professional assistance with custom accessories, fitting, and
              suspension setup
            </Box>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default IndividualBikeInfoNew;
