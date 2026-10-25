import { Box, Container, Stack } from "@mui/material";
import ContactForm from "./ContactForm";
import { ContactActions, ContactHero, ContactHours, ContactMap } from "./ContactSections";

const ContactPage = () => {
  return (
    <>
      <ContactHero />
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 }, px: { xs: 2, sm: 3 } }}>
        <Stack spacing={{ xs: 3, md: 4 }}>
          <ContactActions />
          <Box
            sx={{
              display: "grid",
              gap: { xs: 3, md: 3 },
              alignItems: "start",
              gridTemplateColumns: { xs: "1fr", md: "minmax(0, 7fr) minmax(0, 5fr)" },
              gridTemplateAreas: {
                xs: '"hours" "form" "map"',
                md: '"form hours" "form map"',
              },
            }}
          >
            <Box sx={{ gridArea: "form" }}>
              <ContactForm />
            </Box>
            <Box sx={{ gridArea: "hours" }}>
              <ContactHours />
            </Box>
            <Box sx={{ gridArea: "map" }}>
              <ContactMap />
            </Box>
          </Box>
        </Stack>
      </Container>
    </>
  );
};

export default ContactPage;
