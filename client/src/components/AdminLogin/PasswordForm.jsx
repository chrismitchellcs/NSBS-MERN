import { Box, TextField } from "@mui/material";
import { useAuth } from "./auth";

const PasswordForm = () => {
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const password = e.target[0].value;
    await login({ password });
  };

  return (
    <Box width={"100%"} m={2}>
      <form onSubmit={handleSubmit}>
        <TextField
          id="password"
          label="Enter Password"
          variant="outlined"
          sx={{ width: "30%" }}
        />
      </form>
    </Box>
  );
};

export default PasswordForm;
