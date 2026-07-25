import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    background: {
      default: "#F5F6FA",
    },
    primary: {
      main: "#6C63FF",
    },
    text: {
      primary: "#474242",
      secondary: "#98a7c0",
    },
  },
  typography: {
    fontFamily: "Inter, sans-serif",
    fontSize: 14,
    h1: { fontSize: "2rem" },
    h2: { fontSize: "1.75rem" },
    body1: { fontSize: "1rem" },
    body2: { fontSize: "0.875rem" },
  },
  shape: {
    borderRadius: 12,
  },
});

export default theme;