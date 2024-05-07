import { Box, Stack } from "@mui/material";

const FormDescription = () => {
  return (
    <Box m={5}>
      <Stack direction={"column"} spacing={2} lineHeight={"1.5"}>
        <Box sx={{ fontSize: "30px", fontWeight: "400" }}>CONTACT US</Box>
        <Box sx={{ fontSize: "20px", fontWeight: "300" }}>
          If you have any questions, inquiries, or just want to chat about
          bikes, don't hesitate to contact us! We try to reply to emails within
          the business day. Fill out the form below and we will reply via email
          or you can just use <b>northshorebikeshop@gmail.com</b> to email us.
        </Box>
        <Box sx={{ fontSize: "20px", fontWeight: "300" }}>
          You can also call us or text us at <b>(604) 929-6727</b>.
        </Box>
      </Stack>
    </Box>
  );
};

export default FormDescription;
