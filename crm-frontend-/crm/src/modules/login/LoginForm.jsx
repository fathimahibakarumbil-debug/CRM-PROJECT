import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../store/authSlice";
import { useNavigate, Link as RouterLink } from "react-router-dom";

import {
  Box,
  Button,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
  Link,
  Paper,
  CircularProgress,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, token } = useSelector((state) => state.auth);

  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  // Navigate after login success
  useEffect(() => {
    if (token) {
      navigate("/dashboard");
    }
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await dispatch(loginUser(form));

    if (loginUser.fulfilled.match(result)) {
      // Login succeeded → navigate
      navigate("/dashboard");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        bgcolor: "#f5f5f5",
      }}
    >
      <Paper
        elevation={3}
        sx={{ p: 4, width: "100%", maxWidth: 400, borderRadius: 2 }}
      >
        <Typography
          variant="h5"
          sx={{ fontWeight: "bold", textAlign: "center", mb: 3 }}
        >
          Log in
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          {/* Email */}
          <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
            Email
          </Typography>
          <TextField
            fullWidth
            name="email"
            type="email"
            placeholder="Enter your email"
            variant="outlined"
            size="small"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            sx={{ mb: 2 }}
            required
          />

          {/* Password Label + Forgot */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1,
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              Password
            </Typography>
            <Link
              component={RouterLink}
              to="/forgot-password"
              underline="none"
              sx={{ fontSize: "0.8rem", color: "#635bff" }}
            >
              Forgot password?
            </Link>
          </Box>

          {/* Password Field */}
          <TextField
            fullWidth
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            variant="outlined"
            size="small"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ mb: 3 }}
            required
          />

          {/* Login Button */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{
              bgcolor: "#635bff",
              "&:hover": { bgcolor: "#5249d7" },
              textTransform: "none",
              py: 1.2,
              borderRadius: 1.5,
              fontSize: "1rem",
            }}
          >
            {loading ? (
              <CircularProgress size={22} color="inherit" />
            ) : (
              "Log in"
            )}
          </Button>
        </Box>

        {/* Error Message */}
        {error && (
          <Typography
            color="error"
            variant="body2"
            sx={{ mt: 2, textAlign: "center" }}
          >
            {error}
          </Typography>
        )}

        {/* Register Link */}
        <Typography
          variant="body2"
          sx={{ textAlign: "center", mt: 3, color: "text.secondary" }}
        >
          Don’t have an account?{" "}
          <Link
            component={RouterLink}
            to="/register"
            underline="none"
            sx={{ color: "#635bff" }}
          >
            Sign up
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
};

export default LoginForm;
