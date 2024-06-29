import { Box, Stack } from "@mui/material";
import Closer from "components/General/Closer";
import NavBar from "components/General/NavBar";

const Service = () => {
  const serviceItems = [
    { item: "Minimum Charge", price: "	$15" },
    { item: "Tube / Tire install", price: "	$15" },
    { item: "Install Cushcore / Tire Insert", price: "	$15 - $30" },
    { item: "Drivetrain adjustment", price: "	$25 - 40" },
    { item: "Brake Adjustment / Replace Pads", price: "	$25" },
    { item: "Brake Bleed", price: "	$40	" },
    { item: "Wheel True / Spoke Replacement", price: "	$35 - 55" },
    { item: "Wheel Build (includes spokes, nipples, and tape)", price: "	$145" },
    { item: "Hub Service", price: "	$45 - $65	" },
    { item: "Headset Install", price: "	$40	" },
    { item: "Bottom Bracket Install", price: "	$40" },
    { item: "50hr Shock Air Can Service", price: "	$75	" },
    { item: "50hr Fork Lowers Service", price: "	$90" },
    { item: "Suspension Full Service", price: "	$190 - 230" },
    { item: "Pivot Bearing Replacement", price: "	$225" },
  ];
  return (
    <Stack alignItems={"center"}>
      <NavBar background="white" position={"sticky"} displayLogo={1}></NavBar>
      <Box
        component={"img"}
        src={"service-xstretch-min.jpg"}
        width={"100%"}
      ></Box>
      <Stack
        width={"100%"}
        bgcolor={"black"}
        color={"white"}
        justifyContent={"center"}
        alignItems={"center"}
        pt={5}
        pb={5}
      >
        <Box
          width={{ xs: "80%", sm: "80%", md: "60%" }}
          fontSize={"26px"}
          fontWeight={"400"}
          m={1}
        >
          NSBS SERVICE
        </Box>
        <Box
          width={{ xs: "80%", sm: "80%", md: "60%" }}
          fontSize={"1.1rem"}
          fontWeight={"300"}
          m={1}
          lineHeight={"1.5"}
        >
          Our service department is tidy, fast, and staffed with competent
          mechanics who are eager to see you back on your bike. Our turn-around
          time is unmatched anywhere else in town. We fix everything bicycle
          related. Feel free to contact us about any service inquiries.
        </Box>
        <Box
          width={{ xs: "80%", sm: "80%", md: "60%" }}
          fontSize={"1.1rem"}
          fontWeight={"300"}
          m={1}
          lineHeight={"1.5"}
        >
          While we are a mountain bike-focused shop, we stock parts and service
          all types of bikes! The only exception is some e-bikes, as we may not
          have all the necessary parts. If you have any questions about this,
          please feel free to call or email us before coming in.
        </Box>
      </Stack>

      <Stack
        sx={{
          width: { xs: "90%", sm: "90%", md: "60%" },
        }}
        m={5}
      >
        <Box color={"black"} mt={3} mb={3}>
          <Stack
            fontSize={"24px"}
            fontWeight={"400"}
            direction={"row"}
            justifyContent={"space-between"}
          >
            <Box>TUNE-UP</Box>
            <Box>$100</Box>
          </Stack>
          <Box fontSize={"16px"} fontWeight={"300"} mt={1} lineHeight={"1.5"}>
            Complete safety check of all components <br />
            Brake & drivetrain adjustment
            <br /> Minor wheel truing
            <br /> Lubricate derailleur / brake pivot points, barrel adjusters &
            chain
            <br /> Inflate tires
            <br /> Superficial bike cleanup
          </Box>
        </Box>
        <Box color={"black"} mt={3} mb={3}>
          <Stack
            fontSize={"24px"}
            fontWeight={"400"}
            direction={"row"}
            mb={1}
            justifyContent={"space-between"}
          >
            <Box>KIDS BIKE TUNE-UP </Box>
            <Box>$60</Box>
          </Stack>
          <Box fontSize={"16px"} fontWeight={"300"} lineHeight={"1.5"}>
            Everything included in the tune-up for bikes 24" and under
          </Box>
        </Box>
        <Box color={"black"} mt={3} mb={3}>
          <Box lineHeight={"2"}>
            <Stack direction={{ xs: "column" }} spacing={0} mb={2}>
              <Box sx={{ fontSize: "24px" }}>SERVICE RATES </Box>
              <Box sx={{ fontSize: "20px", fontWeight: "300" }}>
                (prices do not include parts)
              </Box>
            </Stack>

            {serviceItems.map(function (data) {
              return (
                <Stack
                  fontSize={"16px"}
                  fontWeight={"300"}
                  direction={"row"}
                  justifyContent={"space-between"}
                >
                  <Box>{data.item}</Box>
                  <Box>{data.price}</Box>
                </Stack>
              );
            })}
          </Box>
        </Box>
      </Stack>
      <Closer></Closer>
    </Stack>
    // <Stack justifyContent={"center"}>
    //   <NavBar background="white" position={"sticky"} displayLogo={1}></NavBar>
    //   <Stack justifyContent={"center"} alignItems={"center"}>
    //     <Box component={"img"} src={"service-stretch.jpg"} width={"100%"}></Box>
    //     <Box sx={{ fontSize: "36px", m: 2 }}>NSBS SERVICE</Box>
    //     <Box sx={{ fontSize: "18px", width: "60%", mb: 2 }}>
    //       Our service department is tidy, fast, and staffed with competent
    //       mechanics who are eager to see you back on your bike. Our turn-around
    //       time is unmatched anywhere else in town. We fix everything bicycle
    //       related.
    //     </Box>
    //     <Box sx={{ fontSize: "18px", width: "60%", mb: 2 }}>
    //       At NSBS we operate on a first come first serve basis. Bring your bike
    //       in anytime and leave it with us for some time depending on how busy it
    //       is. We will give an accurate estimate of how long you will be without
    //       it. Feel free to call or email to get the current ETA for service. You
    //       do not need to call ahead to book your bike in.
    //     </Box>

    //     <Box width={"95%"} height={"2px"} bgcolor={"grey"}></Box>
    //     <Box sx={{ fontSize: "18px", width: "95%", mb: 2 }}>
    //       At NSBS we operate on a first come first serve basis. Bring your bike
    //       in anytime and leave it with us for some time depending on how busy it
    //       is. We will give an accurate estimate of how long you will be without
    //       it. Feel free to call or email to get the current ETA for service. You
    //       do not need to call ahead to book your bike in.
    //     </Box>
    //   </Stack>
    // </Stack>
  );
};

export default Service;
