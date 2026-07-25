import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword, clearAuthError } from "../../store/AuthSlice";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  CircularProgress,
  Link,
} from "@mui/material";

const ForgotPasswordForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, forgotData } = useSelector((state) => state.auth);

  const [email, setEmail] = useState("");

  useEffect(() => {
    // Clear previous errors/messages when unmount
    return () => {
      dispatch(clearAuthError());
    };
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(forgotPassword(email));
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
          Forgot Password
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
            Email
          </Typography>
          <TextField
            fullWidth
            type="email"
            placeholder="Enter your email"
            variant="outlined"
            size="small"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ mb: 3 }}
            required
          />

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
              "Send Reset Email"
            )}
          </Button>
        </Box>

        {error && (
          <Typography
            color="error"
            variant="body2"
            sx={{ mt: 2, textAlign: "center" }}
          >
            {error}
          </Typography>
        )}
        {forgotData && (
          <Typography variant="body2" sx={{ mt: 2, textAlign: "center" }}>
            {/* First line: forgotData.message in text.primary */}
            <Typography component="span" color="text.primary" display="block">
              {forgotData.message}
            </Typography>

            {/* Second line: reset link */}
            <Link
              component={RouterLink}
              to={forgotData.link}
              underline="none"
              sx={{ color: "#635bff", display: "block", mt: 0.5 }}
            >
              Click here to reset your password
            </Link>
          </Typography>
        )}

        <Typography
          variant="body2"
          sx={{ textAlign: "center", mt: 3, color: "text.secondary" }}
        >
          Remembered your password?{" "}
          <Link
            component={RouterLink}
            to="/login"
            underline="none"
            sx={{ color: "#635bff" }}
          >
            Log in
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
};

export default ForgotPasswordForm;
