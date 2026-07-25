import { Card, CardContent, Typography, Box } from "@mui/material";

const StatCard = ({ title, value, icon, color }) => {
  return (
    <Card sx={{ flex: 1 }}>
      <CardContent sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box>
          <Typography color="text.secondary">{title}</Typography>
          <Typography variant="h5" fontWeight="bold">
            {value}
          </Typography>
        </Box>
        <Box
          sx={{
            bgcolor: color,
            width: 45,
            height: 45,
            borderRadius: "50%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "#fff",
          }}
        >
          {icon}
        </Box>
      </CardContent>
    </Card>
  );
};

export default StatCard;
