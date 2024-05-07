import { Box, Stack } from "@mui/material";
import ContactContent from "./ContactContent";
import MapBox from "./Map";
import FormDescription from "./FormDescription";
import ContactForm from "./ContactForm";

const ContactPage = () => {
  return (
    <Stack>
      <Box width={"100%"} bgcolor={"black"}>
        <Stack
          direction={{ xs: "column", sm: "column", md: "row" }}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <ContactContent></ContactContent>
          <MapBox></MapBox>
        </Stack>
      </Box>
      <Box>
        <Stack>
          <FormDescription></FormDescription>
          <ContactForm></ContactForm>
        </Stack>
      </Box>
    </Stack>
  );
};

export default ContactPage;
