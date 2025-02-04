import { Alert, Button, Stack, TextField } from "@mui/material";
import ReCAPTCHA from "react-google-recaptcha";
import { useRef, useState } from "react";
import axios from "axios";
import CheckIcon from "@mui/icons-material/Check";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

const ContactForm = () => {
  const [formSent, setFormSent] = useState(false);
  const [formNotSent, setFormNotSent] = useState(false);

  const captchaRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = e.target[0].value;
    const email = e.target[2].value;
    const subject = e.target[4].value;
    const message = e.target[7].value;
    const token = captchaRef.current.getValue();
    captchaRef.current.reset();

    await axios
      .post(`${process.env.REACT_APP_VERCEL_DOMAIN}/api/bikes/sendform`, {
        token,
        name,
        email,
        subject,
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

  return (
    <form onSubmit={handleSubmit}>
      {/* <label htmlFor="name">Name</label> */}
      {/* <input type="text" id="name" className="input" /> */}
      <Stack spacing={2} ml={5} width={{ xs: "80%", sm: "60%" }}>
        <Stack direction={"row"} justifyContent={"space-between"}>
          <TextField
            id="name"
            label="Name"
            variant="outlined"
            sx={{ width: "48%" }}
          />{" "}
          <TextField
            id="email"
            label="Email"
            variant="outlined"
            sx={{ width: "48%" }}
          />
        </Stack>
        <TextField
          id="subject"
          label="Subject"
          variant="outlined"
          multiline
          sx={{ width: "100%" }}
        />
        <TextField
          id="message"
          label="Message"
          variant="outlined"
          multiline
          sx={{ width: "100%" }}
        />
      </Stack>
      <Stack
        width={"60%"}
        direction={{ xs: "column", sm: "row" }}
        sx={{ m: 2, ml: 5 }}
        spacing={2}
      >
        <ReCAPTCHA
          sitekey="6LcIjDQpAAAAANHNJdQQTrJy-LQLR7oAWIWontHU"
          ref={captchaRef}
        />
        <Button
          type="submit"
          sx={{
            color: "white",
            backgroundColor: "#3c5d4e",
            width: "20%",
            "&:hover": {
              color: "white",
              bgcolor: "#4d5e5f",
            },
          }}
        >
          Submit
        </Button>
      </Stack>
      {formSent && (
        <Alert
          sx={{ width: "40%", m: 3, ml: 5, mr: 5 }}
          icon={<CheckIcon fontSize="inherit" />}
          severity="success"
        >
          Email sent! We will reply ASAP.
        </Alert>
      )}
      {formNotSent && (
        <Alert
          sx={{ width: { xs: "70%", sm: "70%", md: "40%" }, m: 3, ml: 5 }}
          icon={<ErrorOutlineIcon fontSize="inherit" />}
          severity="error"
        >
          Email not sent. Please try again or use our email
          northshorebikeshop@gmail.com
        </Alert>
      )}
    </form>
  );
};

export default ContactForm;
