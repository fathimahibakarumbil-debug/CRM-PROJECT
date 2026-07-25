import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { resetPassword, clearAuthError } from "../../store/AuthSlice";
import { useNavigate, useLocation, Link as RouterLink } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
  Paper,
  CircularProgress,
  Link,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import AppSnackbar from "../../components/common/AppSnackbar";

const ResetPasswordForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, error } = useSelector((state) => state.auth);

  // Query params
  const query = new URLSearchParams(location.search);
  const prefilledEmail = query.get("email") || "";
  const token = query.get("token") || "";

  const [form, setForm] = useState({
    email: prefilledEmail,
    token: token,
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  // ---------------------------
  // Snackbar state
  // ---------------------------
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const showSnackbar = (message, severity = "success") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  useEffect(() => {
    return () => dispatch(clearAuthError());
  }, [dispatch]);

  // ✅ Validation
  const validate = () => {
    let tempErrors = {};

    if (!form.newPassword) tempErrors.newPassword = "Password is required";
    else {
      const pwd = form.newPassword;
      if (pwd.length < 8)
        tempErrors.newPassword = "Password must be at least 8 characters";
      else if (!/[A-Z]/.test(pwd))
        tempErrors.newPassword = "Password must contain uppercase letter";
      else if (!/[a-z]/.test(pwd))
        tempErrors.newPassword = "Password must contain lowercase letter";
      else if (!/[0-9]/.test(pwd))
        tempErrors.newPassword = "Password must contain a number";
      else if (!/[!@#$%^&*(),.?":{}|<>]/.test(pwd))
        tempErrors.newPassword = "Password must contain special character";
    }

    if (!form.confirmPassword)
      tempErrors.confirmPassword = "Confirm Password is required";
    else if (form.newPassword !== form.confirmPassword)
      tempErrors.confirmPassword = "Passwords do not match";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  // ---------------------------
  // Handle Submit
  // ---------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const resultAction = await dispatch(resetPassword(form));

      if (resultAction.type.endsWith("/fulfilled")) {
        showSnackbar(resultAction.payload.message, "success");
        setForm({
          email: prefilledEmail,
          token,
          newPassword: "",
          confirmPassword: "",
        });
        setErrors({});
        setTimeout(() => navigate("/login"), 1500);
      } else {
        showSnackbar(resultAction.error?.message || "Reset failed", "error");
      }
    } catch (err) {
      showSnackbar(err.message || "Reset failed", "error");
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
      <Paper sx={{ p: 4, width: "100%", maxWidth: 400, borderRadius: 2 }}>
        <Typography
          variant="h5"
          sx={{ fontWeight: "bold", textAlign: "center", mb: 3 }}
        >
          Reset Password
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          {/* Email */}
          <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
            Email <span style={{ color: "red" }}>*</span>
          </Typography>
          <TextField
            fullWidth
            type="email"
            value={form.email}
            variant="outlined"
            size="small"
            sx={{ mb: 2 }}
            InputProps={{ readOnly: true }}
          />

          {/* New Password */}
          <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
            New Password <span style={{ color: "red" }}>*</span>
          </Typography>
          <TextField
            fullWidth
            type={showPassword ? "text" : "password"}
            value={form.newPassword}
            onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
            variant="outlined"
            size="small"
            sx={{ mb: 1 }}
            error={!!errors.newPassword}
            helperText={errors.newPassword}
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
          />

          {/* Confirm Password */}
          <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
            Confirm Password <span style={{ color: "red" }}>*</span>
          </Typography>
          <TextField
            fullWidth
            type={showPassword ? "text" : "password"}
            value={form.confirmPassword}
            onChange={(e) =>
              setForm({ ...form, confirmPassword: e.target.value })
            }
            variant="outlined"
            size="small"
            sx={{ mb: 3 }}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword}
          />

          {/* Reset Button */}
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
              "Reset Password"
            )}
          </Button>
        </Box>
      </Paper>

      {/* ---------------------------
          Snackbar
      --------------------------- */}
      <AppSnackbar
        open={snackbarOpen}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
        severity={snackbarSeverity}
      />
    </Box>
  );
};

export default ResetPasswordForm;
