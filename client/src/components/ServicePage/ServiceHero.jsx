import { Box, Stack, Typography } from "@mui/material";
import { NAV_BAR_BG } from "components/General/NavBar";

const ServiceHero = () => {
  return (
    <Box sx={{ width: "100%", bgcolor: "#f8f9f8" }}>
      <Box
        component="img"
        src="/IMG_1090-min.jpg"
        alt="North Shore Bike Shop service department"
        sx={{
          width: "100%",
          display: "block",
          height: { xs: "min(58vh, 420px)", sm: "min(50vw, 480px)", md: "min(42vw, 520px)" },
          minHeight: { xs: 260, md: 320 },
          objectFit: "cover",
          objectPosition: "center",
        }}
      />
      <Stack
        spacing={{ xs: 2, md: 2.25 }}
        sx={{
          maxWidth: 720,
          mx: "auto",
          px: { xs: 2.5, sm: 4, md: 6 },
          py: { xs: 3.5, md: 4.5 },
          textAlign: "center",
        }}
      >
        <Typography
          component="h1"
          sx={{
            m: 0,
            fontWeight: 800,
            letterSpacing: "0.08em",
            fontSize: { xs: "1.75rem", sm: "2rem", md: "2.25rem" },
            color: NAV_BAR_BG,
            textTransform: "uppercase",
          }}
        >
          Service
        </Typography>
        <Typography
          sx={{
            color: "text.primary",
            fontWeight: 400,
            fontSize: { xs: "1rem", sm: "1.05rem", md: "1.1rem" },
            lineHeight: 1.65,
          }}
        >
          Our service department is tidy, fast, and staffed with competent
          mechanics who are eager to see you back on your bike. Our turnaround
          time is unmatched anywhere else in town. We fix everything bicycle
          related—contact us with any service questions.
        </Typography>
        <Typography
          sx={{
            color: "text.secondary",
            fontWeight: 400,
            fontSize: { xs: "0.95rem", sm: "1rem", md: "1.05rem" },
            lineHeight: 1.65,
          }}
        >
          While we are mountain-bike focused, we stock parts and service all
          types of bikes. Some e-bikes may need special parts—call or email
          before you come in if you are unsure.
        </Typography>
      </Stack>
    </Box>
  );
};

export default ServiceHero;
