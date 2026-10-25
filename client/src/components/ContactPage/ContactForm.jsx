import { useRef, useState } from "react";
import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";
import { Alert, Box, Button, Paper, Stack, TextField, Typography } from "@mui/material";
import { sectionTitleSx } from "components/ServicePage/ServiceSections";
import { NAV_BAR_BG } from "utils/brandColors";
import { SHOP_EMAIL } from "utils/shopHours";
import { cardSx } from "./ContactSections";

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 2,
    bgcolor: "#fff",
    "&.Mui-focused fieldset": { borderColor: NAV_BAR_BG },
  },
  "& label.Mui-focused": { color: NAV_BAR_BG },
};

const ContactForm = () => {
  const [result, setResult] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const captchaRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResult(null);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = formData.get("name")?.toString().trim();
    const email = formData.get("email")?.toString().trim();
    const message = formData.get("message")?.toString().trim();
    const token = captchaRef.current?.getValue();

    if (!token) {
      setResult("captcha");
      return;
    }

    captchaRef.current?.reset();

    try {
      setIsSubmitting(true);
      await axios.post(`${process.env.REACT_APP_VERCEL_DOMAIN}/api/bikes/sendform`, {
        token,
        name,
        email,
        subject: "Website inquiry",
        message,
      });
      setResult("sent");
      form.reset();
    } catch (error) {
      console.log(error);
      setResult("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Paper
      component="section"
      aria-labelledby="contact-form-title"
      elevation={0}
      sx={{ ...cardSx, p: { xs: 2.5, md: 3.5 } }}
    >
      <Typography id="contact-form-title" component="h2" sx={sectionTitleSx}>
        Send us a message
      </Typography>
      <Typography color="text.secondary" sx={{ mt: 0.5, mb: 3 }}>
        We&apos;ll get back to you by email.
      </Typography>

      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={2.5}>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
            <TextField name="name" label="Name" required autoComplete="name" sx={fieldSx} />
            <TextField name="email" label="Email" type="email" required autoComplete="email" sx={fieldSx} />
          </Box>

          <TextField
            name="message"
            label="Message"
            required
            multiline
            minRows={5}
            sx={fieldSx}
          />

          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { xs: "stretch", sm: "center" },
              justifyContent: "space-between",
              gap: 2,
            }}
          >
            <Box
              sx={{
                minHeight: 78,
                "@media (max-width: 380px)": { transform: "scale(0.88)", transformOrigin: "left top", minHeight: 70 },
              }}
            >
              <ReCAPTCHA sitekey="6LcIjDQpAAAAANHNJdQQTrJy-LQLR7oAWIWontHU" ref={captchaRef} />
            </Box>
            <Button
              type="submit"
              variant="contained"
              disableElevation
              disabled={isSubmitting}
              sx={{
                px: 4,
                py: 1.4,
                borderRadius: "10px",
                fontWeight: 700,
                fontSize: "1rem",
                textTransform: "none",
                bgcolor: NAV_BAR_BG,
                "&:hover": { bgcolor: "#1e332b" },
              }}
            >
              {isSubmitting ? "Sending..." : "Send message"}
            </Button>
          </Box>

          {result === "sent" ? (
            <Alert severity="success" sx={{ borderRadius: 2 }}>
              Thanks, your message is on its way. We&apos;ll reply as soon as we can.
            </Alert>
          ) : null}
          {result === "captcha" ? (
            <Alert severity="warning" sx={{ borderRadius: 2 }}>
              Please tick the &quot;I&apos;m not a robot&quot; box before sending.
            </Alert>
          ) : null}
          {result === "error" ? (
            <Alert severity="error" sx={{ borderRadius: 2 }}>
              That didn&apos;t send. Please try again, or email us directly at {SHOP_EMAIL}.
            </Alert>
          ) : null}
        </Stack>
      </Box>
    </Paper>
  );
};

export default ContactForm;
