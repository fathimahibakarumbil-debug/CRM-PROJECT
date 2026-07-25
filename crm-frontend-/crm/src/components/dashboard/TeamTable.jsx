import React from "react";

import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Button,
} from "@mui/material";

const TeamTable = ({ data }) => {
  // ✅ CSV EXPORT FUNCTION
  const handleExportCSV = () => {
    if (!data || data.length === 0) return;

    const headers = ["Employee", "Active Deals", "Closed Deals", "Revenue"];

    const rows = data.map((row) => [
      row.employee,
      row.active_deals,
      row.closed_deals,
      row.revenue,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((r) => r.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "team-performance.csv";
    link.click();
  };

  return (
    <Card sx={{ m: 2 }}>
      <CardContent>
        {/* 🔥 HEADER WITH BUTTON */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h6" fontWeight="700">
            Team Performance Tracking
          </Typography>

          <Button
            variant="outlined"
            onClick={handleExportCSV}
            sx={{ height: 40, minWidth: 150, textTransform: "none" }}
          >
            Export CSV
          </Button>
        </Box>

        {/* TABLE */}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Employee</TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Active Deals
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Closed Deals
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: "bold" }}>
                  Revenue
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody> 
              {data?.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.employee}</TableCell>
                  <TableCell align="center">{row.active_deals}</TableCell>
                  <TableCell align="center">{row.closed_deals}</TableCell>
                  <TableCell align="right">₹{row.revenue}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};

export default TeamTable;
