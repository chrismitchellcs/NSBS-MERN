import DirectionsOutlinedIcon from "@mui/icons-material/DirectionsOutlined";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import { Box, Paper, Stack, Typography } from "@mui/material";
import { StatusDot, useShopStatus } from "components/General/NavShopStatus";
import { sectionTitleSx } from "components/ServicePage/ServiceSections";
import { NAV_BAR_BG } from "utils/brandColors";
import {
  SHOP_ADDRESS,
  SHOP_DIRECTIONS_URL,
  SHOP_EMAIL,
  SHOP_HOURS,
  SHOP_PHONE,
  todayHours,
} from "utils/shopHours";

export const cardSx = {
  borderRadius: 3,
  border: "1px solid rgba(36, 61, 51, 0.12)",
  bgcolor: "#fff",
};

export function ContactHero() {
  const status = useShopStatus();

  return (
    <Box sx={{ position: "relative", overflow: "hidden", bgcolor: NAV_BAR_BG }}>
      <Box
        component="img"
        src="/trees-edit-min.png"
        alt=""
        aria-hidden
        sx={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center 60%",
        }}
      />
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(90deg, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.45) 55%, rgba(0,0,0,0.2) 100%)",
        }}
      />
      <Stack
        spacing={{ xs: 1.5, md: 2 }}
        sx={{
          position: "relative",
          color: "#fff",
          maxWidth: "lg",
          mx: "auto",
          px: { xs: 2.5, sm: 3 },
          py: { xs: 6, md: 9 },
        }}
      >
        <Typography
          component="h1"
          sx={{
            m: 0,
            fontWeight: 800,
            lineHeight: 1,
            letterSpacing: "0.015em",
            textTransform: "uppercase",
            fontSize: { xs: "2.2rem", sm: "2.6rem", md: "clamp(2.4rem, 3.6vw, 3.2rem)" },
          }}
        >
          Get in touch
        </Typography>
        <Typography sx={{ color: "rgba(255,255,255,0.92)", fontSize: { xs: "1rem", md: "1.1rem" }, lineHeight: 1.6, maxWidth: 520 }}>
          Questions about a bike, parts, or a repair? Give us a call, send us a message, or come
          by the shop on Lonsdale.
        </Typography>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ color: "rgba(255,255,255,0.85)", fontSize: "0.95rem" }}>
          <StatusDot isOpen={status.isOpen} />
          <span>{status.label}</span>
        </Stack>
      </Stack>
    </Box>
  );
}

const ACTIONS = [
  {
    icon: PhoneOutlinedIcon,
    label: "Call or text",
    value: SHOP_PHONE.display,
    note: "The quickest way to reach us while we're open.",
    href: `tel:${SHOP_PHONE.tel}`,
  },
  {
    icon: MailOutlineIcon,
    label: "Email",
    value: SHOP_EMAIL,
    note: "We usually reply within a business day.",
    href: `mailto:${SHOP_EMAIL}`,
  },
  {
    icon: PlaceOutlinedIcon,
    label: "Visit",
    value: SHOP_ADDRESS.street,
    note: `${SHOP_ADDRESS.city} ${SHOP_ADDRESS.postalCode}`,
    href: SHOP_DIRECTIONS_URL,
    external: true,
    cta: "Get directions",
  },
];

export function ContactActions() {
  return (
    <Box
      component="section"
      aria-label="Ways to reach us"
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
        gap: { xs: 1.5, md: 2 },
      }}
    >
      {ACTIONS.map(({ icon: Icon, label, value, note, href, external, cta }) => (
        <Paper
          key={label}
          component="a"
          href={href}
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          elevation={0}
          sx={{
            ...cardSx,
            p: 2.5,
            display: "flex",
            gap: 2,
            alignItems: "flex-start",
            textDecoration: "none",
            color: "inherit",
            transition: "border-color 0.2s, box-shadow 0.2s, transform 0.2s",
            "&:hover": {
              borderColor: "rgba(36, 61, 51, 0.35)",
              boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
              transform: "translateY(-1px)",
            },
            "&:focus-visible": { outline: `2px solid ${NAV_BAR_BG}`, outlineOffset: 2 },
          }}
        >
          <Box
            sx={{
              width: 44,
              height: 44,
              flexShrink: 0,
              borderRadius: 2,
              display: "grid",
              placeItems: "center",
              bgcolor: "rgba(36, 61, 51, 0.08)",
              color: NAV_BAR_BG,
            }}
          >
            <Icon aria-hidden />
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
              {label}
            </Typography>
            <Typography sx={{ fontWeight: 700, fontSize: "1.05rem", overflowWrap: "anywhere" }}>{value}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
              {note}
            </Typography>
            {cta ? (
              <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 1, color: NAV_BAR_BG, fontWeight: 700, fontSize: "0.9rem" }}>
                <DirectionsOutlinedIcon sx={{ fontSize: 18 }} aria-hidden />
                <span>{cta}</span>
              </Stack>
            ) : null}
          </Box>
        </Paper>
      ))}
    </Box>
  );
}

const MONDAY_FIRST = [...SHOP_HOURS.slice(1), SHOP_HOURS[0]];

/** "11:00 AM" → "11 AM" */
const clock = (t) => String(t).replace(":00", "");

export function ContactHours() {
  const status = useShopStatus();
  const today = todayHours().day;

  return (
    <Paper component="section" aria-labelledby="contact-hours-title" elevation={0} sx={{ ...cardSx, p: { xs: 2.5, md: 3 } }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" gap={2} sx={{ mb: 1.5 }}>
        <Typography id="contact-hours-title" component="h2" sx={{ ...sectionTitleSx, fontSize: { xs: "1.15rem", md: "1.25rem" } }}>
          Hours
        </Typography>
        <Stack
          direction="row"
          alignItems="center"
          spacing={0.75}
          sx={{
            px: 1.25,
            py: 0.5,
            borderRadius: 999,
            fontSize: "0.8rem",
            fontWeight: 700,
            bgcolor: status.isOpen ? "rgba(22, 163, 74, 0.1)" : "rgba(0,0,0,0.05)",
            color: status.isOpen ? "#15803d" : "text.secondary",
          }}
        >
          <Box
            component="span"
            aria-hidden
            sx={{ width: 7, height: 7, borderRadius: "50%", bgcolor: status.isOpen ? "#16a34a" : "rgba(0,0,0,0.35)" }}
          />
          <span>{status.label}</span>
        </Stack>
      </Stack>
      <Box component="dl" sx={{ m: 0 }}>
        {MONDAY_FIRST.map((h) => {
          const isToday = h.day === today;
          return (
            <Box
              key={h.day}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                gap: 2,
                py: 1,
                px: 1.25,
                mx: -1.25,
                borderRadius: 1.5,
                bgcolor: isToday ? "rgba(36, 61, 51, 0.07)" : "transparent",
                fontWeight: isToday ? 700 : 400,
              }}
            >
              <Box component="dt" sx={{ m: 0 }}>
                {h.day}
                {isToday ? (
                  <Box component="span" sx={{ ml: 1, fontSize: "0.75rem", fontWeight: 600, color: NAV_BAR_BG }}>
                    Today
                  </Box>
                ) : null}
              </Box>
              <Box component="dd" sx={{ m: 0, whiteSpace: "nowrap" }}>
                {clock(h.open)} to {clock(h.close)}
              </Box>
            </Box>
          );
        })}
      </Box>
    </Paper>
  );
}

export function ContactMap() {
  return (
    <Paper elevation={0} sx={{ ...cardSx, overflow: "hidden", height: { xs: 280, md: 320 } }}>
      <Box
        component="iframe"
        title="Map to North Shore Bike Shop"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2600.3928021592214!2d-123.07506112318826!3d49.32578167139938!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x548670479ba62361%3A0x3bb6e7001e8fc223!2sNorth%20Shore%20Bike%20Shop!5e0!3m2!1sen!2sca!4v1698461218509!5m2!1sen!2sca"
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        sx={{ display: "block", width: "100%", height: "100%", border: 0 }}
      />
    </Paper>
  );
}
