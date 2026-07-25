import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AppSnackbar from "../../components/common/AppSnackbar";
import { registerUser } from "../../store/AuthSlice";
import {
  Box,
  Button,
  TextField,
  Typography,
  Link,
  Paper,
  MenuItem,
} from "@mui/material";

const RegistrationForm = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "",
    phone: "",
    password: "",
    confirmPassword: "",
    companyName: "",
    industryType: "",
    country: "",
  });

  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const showSnackbar = (message, severity = "success") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  // ✅ Validate only First Name, Last Name, Email
  // ✅ Validate First Name, Last Name, Email, Password & Confirm Password
  const validate = () => {
    let tempErrors = {};

    // First Name & Last Name
    if (!form.firstName.trim()) tempErrors.firstName = "First Name is required";
    if (!form.lastName.trim()) tempErrors.lastName = "Last Name is required";
    if (!form.role.trim()) tempErrors.role = "Role Name is required";

    // Email
    if (!form.email.trim()) tempErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      tempErrors.email = "Invalid email format";

    // Password validation
    if (!form.password) tempErrors.password = "Password is required";
    else {
      const pwd = form.password;
      if (pwd.length < 8)
        tempErrors.password = "Password must be at least 8 characters long";
      else if (!/[A-Z]/.test(pwd))
        tempErrors.password =
          "Password must contain at least one uppercase letter";
      else if (!/[a-z]/.test(pwd))
        tempErrors.password =
          "Password must contain at least one lowercase letter";
      else if (!/[0-9]/.test(pwd))
        tempErrors.password = "Password must contain at least one number";
      else if (!/[!@#$%^&*(),.?":{}|<>]/.test(pwd))
        tempErrors.password =
          "Password must contain at least one special character";
    }

    // Confirm password
    if (!form.confirmPassword)
      tempErrors.confirmPassword = "Confirm Password is required";
    else if (form.password !== form.confirmPassword)
      tempErrors.confirmPassword = "Passwords do not match";

    setErrors(tempErrors);

    return Object.keys(tempErrors).length === 0;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return; // stop if mandatory fields invalid

    try {
      const resultAction = await dispatch(registerUser(form));

      if (resultAction.type.endsWith("/fulfilled")) {
        showSnackbar("Registration successful!", "success");

        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else {
        showSnackbar(
          resultAction.error?.message || "Registration failed",
          "error",
        );
      }
    } catch (err) {
      showSnackbar(err.message || "Registration failed", "error");
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
        sx={{ p: 4, width: "100%", maxWidth: 500, borderRadius: 2 }}
      >
        <Typography
          variant="h5"
          sx={{ fontWeight: "bold", textAlign: "center", mb: 3 }}
        >
          Register
        </Typography>

        <Box component="form" noValidate onSubmit={handleSubmit}>
          {/* Row 1: First Name & Last Name */}
          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                First Name <span style={{ color: "red" }}>*</span>
              </Typography>
              <TextField
                fullWidth
                placeholder="Enter your first name"
                size="small"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                error={!!errors.firstName}
                helperText={errors.firstName}
                aria-required="true"
              />
            </Box>

            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                Last Name <span style={{ color: "red" }}>*</span>
              </Typography>
              <TextField
                fullWidth
                placeholder="Enter your last name"
                size="small"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                error={!!errors.lastName}
                helperText={errors.lastName}
                aria-required="true"
              />
            </Box>
          </Box>

          {/* Row 2: Email & Phone */}
          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                Email <span style={{ color: "red" }}>*</span>
              </Typography>
              <TextField
                fullWidth
                placeholder="Enter your email"
                size="small"
                name="email"
                value={form.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
                aria-required="true"
              />
            </Box>

            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                Role <span style={{ color: "red" }}>*</span>
              </Typography>
              <TextField
                select
                fullWidth
                size="small"
                name="role"
                value={form.role}
                onChange={handleChange}
                error={!!errors.role}
                helperText={errors.role}
                aria-required="true"
                SelectProps={{
                  displayEmpty: true,
                  renderValue: (selected) => (selected ? selected : "Choose"),
                }}
              >
                <MenuItem value="" disabled>
                  Choose
                </MenuItem>
                <MenuItem value="admin">admin</MenuItem>
                <MenuItem value="user">user</MenuItem>
              </TextField>
            </Box>
          </Box>
          {/* Row 3: Password & confirm */}
          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                Password <span style={{ color: "red" }}>*</span>
              </Typography>
              <TextField
                fullWidth
                placeholder="Enter your email"
                size="small"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                error={!!errors.password}
                helperText={errors.password}
                aria-required="true"
              />
            </Box>

            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                Confirm Password<span style={{ color: "red" }}>*</span>
              </Typography>
              <TextField
                fullWidth
                placeholder="Re- Enter Password"
                size="small"
                name="confirmPassword"
                type="password"
                value={form.confirmPassword}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
                onChange={handleChange}
              />
            </Box>
          </Box>

          {/* Row 3: Company Name & Industry */}
          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                Phone Number
              </Typography>
              <TextField
                fullWidth
                placeholder="Enter your phone number"
                size="small"
                name="phone"
                value={form.phone}
                onChange={handleChange}
              />
            </Box>

            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                Company Name
              </Typography>
              <TextField
                fullWidth
                placeholder="Enter your company name"
                size="small"
                name="companyName"
                value={form.companyName}
                onChange={handleChange}
              />
            </Box>
          </Box>

          {/* Last Row: Country */}
          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                Industry Type
              </Typography>
              <TextField
                select
                fullWidth
                size="small"
                name="industryType"
                value={form.industryType}
                onChange={handleChange}
                SelectProps={{
                  displayEmpty: true,
                  renderValue: (selected) => (selected ? selected : "Choose"),
                }}
              >
                <MenuItem value="" disabled>
                  Choose
                </MenuItem>
                <MenuItem value="IT">IT</MenuItem>
                <MenuItem value="Finance">Finance</MenuItem>
                <MenuItem value="Healthcare">Healthcare</MenuItem>
                <MenuItem value="Education">Education</MenuItem>
              </TextField>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                Country or Region
              </Typography>
              <TextField
                fullWidth
                placeholder="Enter your country or region"
                size="small"
                name="country"
                value={form.country}
                onChange={handleChange}
              />
            </Box>
          </Box>
          {/* Show error message */}
          {error && (
            <Typography color="error" sx={{ mt: 1, textAlign: "center" }}>
              {error}
            </Typography>
          )}

          <Button
            fullWidth
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{
              bgcolor: "#635bff",
              "&:hover": { bgcolor: "#5249d7" },
              textTransform: "none",
              py: 1.2,
              borderRadius: 1.5,
              fontSize: "1rem",
              mt: 2,
            }}
          >
            {loading ? "Registering..." : "Register"}
          </Button>
        </Box>

        <Typography
          variant="body2"
          sx={{ textAlign: "center", mt: 3, color: "text.secondary" }}
        >
          Already have an account?{" "}
          <Link href="/login" underline="none" sx={{ color: "#635bff" }}>
            Log in
          </Link>
        </Typography>
      </Paper>

      <AppSnackbar
        open={snackbarOpen}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
        severity={snackbarSeverity}
      />
    </Box>
  );
};

export default RegistrationForm;
