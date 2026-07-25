  import React from "react";
  import {
    Card,
    CardContent,
    Typography,
    LinearProgress,
    Box,
    Stack,
  } from "@mui/material";

  const ConversionCard = ({ data }) => {
    const stages = [
      { label: "Contact", value: data?.["Contact"] || 0, color: "#635BFF" },
      {
        label: "Qualified Lead",
        value: data?.["Qualified"] || 0,
        color: "#2DD4BF",
      },
      {
        label: "Proposal Sent",
        value: data?.["Proposal"] || 0,
        color: "#FACC15",
      },
      {
        label: "Negotiation",
        value: data?.["Negotiation"] || 0,
        color: "#635BFF",
      },
      { label: "Closed Won", value: data?.["Closed Won"] || 0, color: "#10B981" },
      {
        label: "Closed Lost",
        value: data?.["Closed Lost"] || 0,
        color: "#EF4444",
      },
    ];
    return (
      <Card sx={{ maxWidth: 350, borderRadius: 3, padding: 2 }}>
        <CardContent>
          <Typography variant="h6" fontWeight="800" mb={3}>
            Contact to Deal Conversion
          </Typography>

          <Stack spacing={2.5}>
            {stages.map((stage, index) => (
              <Box key={index}>
                <Typography fontWeight="700">
                  {stage.label} ({stage.value})
                </Typography>

                <LinearProgress
                  variant="determinate"
                  value={stage.value}
                  sx={{
                    height: 7,
                    borderRadius: 5,
                    "& .MuiLinearProgress-bar": {
                      backgroundColor: stage.color,
                    },
                  }}
                />
              </Box>
            ))}
          </Stack>
        </CardContent>
      </Card>
    );
  };

  export default ConversionCard;
