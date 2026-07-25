import { useState } from "react";
import { Box, Paper, Stack, Typography, Button } from "@mui/material";
import AttachmentDrawer from "./AttachmentDrawer";

export default function RightPanel({ title = "AI Summary", aiSummary, attachments = [] }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [files, setFiles] = useState(attachments);

  const handleAddAttachment = (file) => {
    setFiles([...files, file]);
  };

  return (
    <Box
      sx={{
        width: 260,
        p: 2,
        bgcolor: "#f9fafb",
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      {/* AI Summary */}
      <Paper sx={{ p: 2, border: "1px solid #6C63FF", borderRadius: 1 }}>
        <Stack direction="row" alignItems="center" gap={1} mb={1}>
          <Typography>🤖</Typography>
          <Typography variant="subtitle2" color="primary">
            {title}
          </Typography>
        </Stack>
        <Typography variant="body2">{aiSummary || "No summary available."}</Typography>
      </Paper>

      {/* Attachments */}
      <Box>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="subtitle2">Attachments</Typography>
          <Button size="small" onClick={() => setDrawerOpen(true)}>
            + Add
          </Button>
        </Stack>

        <Typography variant="caption" color="text.secondary" mb={1}>
          See attached files for this record.
        </Typography>

        {files.map((file, idx) => (
          <Typography key={idx} fontSize={12} color="primary">
            {file.name}
          </Typography>
        ))}
      </Box>

      <AttachmentDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onAdd={handleAddAttachment}
      />
    </Box>
  );
}