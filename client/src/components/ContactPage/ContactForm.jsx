import { Button, Stack, TextField } from "@mui/material";
import ReCAPTCHA from "react-google-recaptcha";
import { useRef } from "react";
import axios from "axios";

const ContactForm = () => {
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
        console.log(res);
      })
      .catch((error) => {
        alert("form not sent");
      });
    // await axios
    //   .post(`http://localhost:5050/api/bikes/sendform`, {
    //     token,
    //     name,
    //     email,
    //     subject,
    //     message,
    //   })
    //   .then((res) => {
    //     console.log(res);
    //   })
    //   .catch((error) => {
    //     alert("form not sent");
    //   });
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
    </form>
  );
};

export default ContactForm;
