import {
  Box,
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  TextField,
} from "@mui/material";

import { useState } from "react";
import { VisibilityOff, Visibility } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "components/AuthProvider";

const PasswordForm = () => {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = e.target[0].value;
    const pass = e.target[2].value;
    login(user, pass)
      .then(() => navigate("/admin-dashboard"))
      .catch((error) => alert(error));
  };

  return (
    <Stack alignItems={"center"} mt={5}>
      <form onSubmit={handleSubmit}>
        <Stack
          sx={{ bgcolor: "#F5F5F5" }}
          p={10}
          textAlign={"center"}
          spacing={3}
        >
          <Box sx={{ fontWeight: "600" }}>NSBS Admin Login</Box>
          <TextField id="username" label="Username" variant="outlined" />
          <FormControl sx={{ m: 1, width: "25ch" }} variant="outlined">
            <InputLabel htmlFor="outlined-adornment-password">
              Password
            </InputLabel>
            <OutlinedInput
              id="password"
              type={showPassword ? "text" : "password"}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label={
                      showPassword
                        ? "hide the password"
                        : "display the password"
                    }
                    onClick={handleClickShowPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Password"
            />
          </FormControl>
          <Button type="submit">Log In</Button>
        </Stack>
      </form>
    </Stack>
  );
};

export default PasswordForm;
