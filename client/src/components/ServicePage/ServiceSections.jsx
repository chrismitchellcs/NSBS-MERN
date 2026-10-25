import BoltOutlinedIcon from "@mui/icons-material/BoltOutlined";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import DirectionsBikeOutlinedIcon from "@mui/icons-material/DirectionsBikeOutlined";
import ElectricBikeOutlinedIcon from "@mui/icons-material/ElectricBikeOutlined";
import EngineeringOutlinedIcon from "@mui/icons-material/EngineeringOutlined";
import { Box, Paper, Skeleton, Stack, Typography } from "@mui/material";
import { NAV_BAR_BG } from "utils/brandColors";

export const sectionTitleSx = {
  m: 0,
  fontWeight: 800,
  fontSize: { xs: "1.35rem", md: "1.6rem" },
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  color: NAV_BAR_BG,
};

const cardSx = {
  borderRadius: 3,
  border: "1px solid rgba(36, 61, 51, 0.12)",
  bgcolor: "#fff",
};

const HIGHLIGHTS = [
  {
    icon: BoltOutlinedIcon,
    title: "Quick turnaround",
    body: "Our turnaround time is hard to beat anywhere in town.",
  },
  {
    icon: EngineeringOutlinedIcon,
    title: "Mechanics who ride",
    body: "Experienced mechanics who want to get you back on your bike.",
  },
  {
    icon: DirectionsBikeOutlinedIcon,
    title: "All kinds of bikes",
    body: "We're mountain bike focused, but we stock parts for and service all types of bikes.",
  },
];

export function ServiceHighlights() {
  return (
    <Box
      component="section"
      aria-label="Why service with us"
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
        gap: { xs: 1.5, md: 2 },
      }}
    >
      {HIGHLIGHTS.map(({ icon: Icon, title, body }) => (
        <Paper key={title} elevation={0} sx={{ ...cardSx, p: 2.5 }}>
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: 2,
              display: "grid",
              placeItems: "center",
              bgcolor: "rgba(36, 61, 51, 0.08)",
              color: NAV_BAR_BG,
              mb: 1.5,
            }}
          >
            <Icon aria-hidden />
          </Box>
          <Typography sx={{ fontWeight: 700, mb: 0.5 }}>{title}</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.55 }}>
            {body}
          </Typography>
        </Paper>
      ))}
    </Box>
  );
}

const STEPS = [
  { title: "Bring it in", body: "Drop by any time we're open. No appointment needed." },
  { title: "First come, first served", body: "We work on bikes in the order they come in." },
  {
    title: "Pick it up",
    body: "We'll let you know when it's ready. Call or email any time for an ETA.",
  },
];

export function ServiceSteps() {
  return (
    <Box component="section" aria-labelledby="service-steps-title">
      <Typography id="service-steps-title" component="h2" sx={{ ...sectionTitleSx, mb: 2 }}>
        How it works
      </Typography>
      <Box
        component="ol"
        sx={{
          listStyle: "none",
          m: 0,
          p: 0,
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
          gap: { xs: 1.5, md: 2 },
        }}
      >
        {STEPS.map((step, i) => (
          <Box component="li" key={step.title}>
            <Paper elevation={0} sx={{ ...cardSx, p: 2.5, height: "100%", display: "flex", gap: 2 }}>
              <Box
                aria-hidden
                sx={{
                  width: 36,
                  height: 36,
                  flexShrink: 0,
                  borderRadius: "50%",
                  display: "grid",
                  placeItems: "center",
                  bgcolor: NAV_BAR_BG,
                  color: "#fff",
                  fontWeight: 800,
                }}
              >
                {i + 1}
              </Box>
              <Box>
                <Typography sx={{ fontWeight: 700, mb: 0.25 }}>{step.title}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {step.body}
                </Typography>
              </Box>
            </Paper>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

/** Tune-up packages as cards; description lines become a checklist. */
export function ServicePackages({ packages }) {
  if (!packages.length) return null;
  return (
    <Box component="section" aria-labelledby="service-packages-title">
      <Typography id="service-packages-title" component="h2" sx={{ ...sectionTitleSx, mb: 2 }}>
        Packages & tune-ups
      </Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: packages.length > 1 ? "repeat(2, 1fr)" : "1fr" },
          gap: { xs: 2, md: 2.5 },
          alignItems: "stretch",
        }}
      >
        {packages.map((pkg) => {
          const lines = (pkg.description || "")
            .split("\n")
            .map((l) => l.trim())
            .filter(Boolean);
          return (
            <Paper key={pkg._id} elevation={0} sx={{ ...cardSx, p: { xs: 2.5, md: 3 } }}>
              <Stack direction="row" alignItems="baseline" justifyContent="space-between" gap={2}>
                <Typography component="h3" sx={{ fontWeight: 800, fontSize: "1.2rem", letterSpacing: "0.03em" }}>
                  {pkg.title}
                </Typography>
                <Typography sx={{ fontWeight: 800, fontSize: "1.6rem", color: NAV_BAR_BG, flexShrink: 0 }}>
                  {pkg.price}
                </Typography>
              </Stack>
              {lines.length ? (
                <Stack component="ul" spacing={1} sx={{ listStyle: "none", m: 0, mt: 2, p: 0 }}>
                  {lines.map((line) => (
                    <Stack component="li" key={line} direction="row" spacing={1.25} alignItems="flex-start">
                      <CheckRoundedIcon sx={{ fontSize: 20, color: NAV_BAR_BG, mt: "2px" }} aria-hidden />
                      <Typography sx={{ lineHeight: 1.5 }}>{line}</Typography>
                    </Stack>
                  ))}
                </Stack>
              ) : null}
            </Paper>
          );
        })}
      </Box>
    </Box>
  );
}

/** Individual service prices in two columns on desktop, with dotted leaders to the price. */
export function ServiceRates({ rates }) {
  if (!rates.length) return null;
  return (
    <Box component="section" aria-labelledby="service-rates-title">
      <Typography id="service-rates-title" component="h2" sx={sectionTitleSx}>
        Service rates
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 2 }}>
        Prices don&apos;t include parts unless noted. Where there&apos;s a range, the final price
        depends on your bike.
      </Typography>
      <Paper elevation={0} sx={{ ...cardSx, px: { xs: 2, sm: 3 }, py: { xs: 1, sm: 1.5 } }}>
        <Box
          component="ul"
          sx={{
            listStyle: "none",
            m: 0,
            p: 0,
            columnCount: { xs: 1, md: 2 },
            columnGap: 6,
          }}
        >
          {rates.map((row) => (
            <Box
              component="li"
              key={row._id}
              sx={{
                breakInside: "avoid",
                display: "flex",
                alignItems: "baseline",
                gap: 1,
                py: 1.25,
                borderBottom: "1px solid rgba(0,0,0,0.06)",
              }}
            >
              <Typography sx={{ fontSize: "0.95rem" }}>{row.title}</Typography>
              <Box
                aria-hidden
                sx={{ flex: 1, minWidth: 16, borderBottom: "1px dotted rgba(0,0,0,0.25)", transform: "translateY(-4px)" }}
              />
              <Typography sx={{ fontWeight: 700, color: NAV_BAR_BG, whiteSpace: "nowrap" }}>
                {row.price}
              </Typography>
            </Box>
          ))}
        </Box>
      </Paper>
    </Box>
  );
}

export function EbikeNote() {
  return (
    <Stack
      direction="row"
      spacing={1.5}
      alignItems="flex-start"
      sx={{
        p: 2,
        borderRadius: 3,
        bgcolor: "rgba(36, 61, 51, 0.06)",
        border: "1px solid rgba(36, 61, 51, 0.12)",
      }}
    >
      <ElectricBikeOutlinedIcon sx={{ color: NAV_BAR_BG, mt: "2px" }} aria-hidden />
      <Typography sx={{ lineHeight: 1.55 }}>
        <strong>Bringing in an e-bike?</strong> Some e-bikes need special parts, so give us a call
        or send an email before you come in if you&apos;re not sure.
      </Typography>
    </Stack>
  );
}

export function ServiceLoading() {
  return (
    <Stack spacing={2}>
      <Skeleton variant="rounded" height={44} width={260} />
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 2 }}>
        <Skeleton variant="rounded" height={240} />
        <Skeleton variant="rounded" height={240} />
      </Box>
      <Skeleton variant="rounded" height={360} />
    </Stack>
  );
}
