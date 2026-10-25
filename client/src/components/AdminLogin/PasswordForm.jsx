import {
  Alert,
  Box,
  Button,
  CircularProgress,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  TextField,
} from "@mui/material";
import { VisibilityOff, Visibility } from "@mui/icons-material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "components/AuthProvider";

const PasswordForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError("");
    setSubmitting(true);
    try {
      await login(username.trim(), password);
      navigate("/admin-dashboard");
    } catch (err) {
      setLoginError(err?.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Stack alignItems="center" mt={5} px={2}>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ width: "100%", maxWidth: 420 }}
      >
        <Stack
          sx={{ bgcolor: "#F5F5F5" }}
          p={{ xs: 4, sm: 6 }}
          textAlign="center"
          spacing={3}
        >
          <Box sx={{ fontWeight: 600, fontSize: "1.125rem" }}>
            NSBS Admin Login
          </Box>
          {loginError ? (
            <Alert severity="error" variant="outlined">
              {loginError}
            </Alert>
          ) : null}
          <TextField
            id="admin-login-username"
            name="username"
            label="Username"
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            required
            fullWidth
            disabled={submitting}
          />
          <FormControl variant="outlined" fullWidth required>
            <InputLabel htmlFor="admin-login-password">Password</InputLabel>
            <OutlinedInput
              id="admin-login-password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              disabled={submitting}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    onClick={() => setShowPassword((s) => !s)}
                    onMouseDown={(ev) => ev.preventDefault()}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Password"
            />
          </FormControl>
          <Button
            type="submit"
            variant="contained"
            disabled={submitting}
            sx={{ py: 1.25 }}
          >
            {submitting ? (
              <CircularProgress size={22} color="inherit" />
            ) : (
              "Log in"
            )}
          </Button>
        </Stack>
      </Box>
    </Stack>
  );
};

export default PasswordForm;
