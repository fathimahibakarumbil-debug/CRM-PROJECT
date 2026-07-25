import {
  Stack,
  Typography,
  Paper,
  Box,
  IconButton,
  Collapse,
  TextField,
  Button,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState } from "react";

export default function LeadEmailsTab({ activities = [], onDelete }) {
  const [openId, setOpenId] = useState(null);

  if (!activities.length) {
    return <Typography>No emails available</Typography>;
  }

  // GROUP BY MONTH
  const grouped = activities.reduce((acc, email) => {
    // const date = new Date(email.sentAt || email.date);
    const date = new Date(
      email.sentAt || email.sent_at || email.date || email.created_at,
    );
    // const date = new Date(email.sent_at || email.sentAt || email.date);
    const month = date.toLocaleString("default", {
      month: "long",
      year: "numeric",
    });

    if (!acc[month]) acc[month] = [];
    acc[month].push(email);
    return acc;
  }, {});

  return (
    <Stack spacing={1.5}>
      {Object.entries(grouped).map(([month, emails]) => (
        <Box key={month}>
          <Stack spacing={1.2}>
            {emails.map((email) => {
              const isOpen = openId === email.id;
              const emailDate =
                email.sentAt || email.sent_at || email.date || email.created_at;
              return (
                <Paper
                  key={email.id}
                  elevation={0}
                  sx={{
                    border: "1px solid #e6e8f0",
                    borderRadius: "12px",
                    overflow: "hidden",
                  }}
                >
                  {/* HEADER */}
                  <Box
                    display="flex"
                    alignItems="center"
                    px={2}
                    py={1.5}
                    onClick={() => setOpenId(isOpen ? null : email.id)}
                    sx={{
                      cursor: "pointer",
                    }}
                  >
                    <ExpandMoreIcon
                      sx={{
                        fontSize: 18,
                        color: "#4b5a73",
                        transform: isOpen ? "rotate(90deg)" : "rotate(0deg)",
                        transition: "0.2s",
                        mr: 1,
                      }}
                    />

                    <Typography
                      sx={{
                        fontSize: "15px",
                        fontWeight: 700,
                        color: "#22324a",
                      }}
                    >
                      Logged Email - {email.subject || "No Subject"}
                    </Typography>

                    <Typography
                      sx={{
                        fontSize: "14px",
                        color: "#55657d",
                        ml: 0.5,
                      }}
                    >
                      by {email.from || "User"}
                    </Typography>

                    <Box flex={1} />

                    <Typography
                      sx={{
                        fontSize: "13px",
                        color: "#6f7b8a",
                        mr: 1,
                      }}
                    >
                      {emailDate
                        ? new Date(emailDate).toLocaleString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                          })
                        : "No Date"}
                    </Typography>

                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete({
                          id: email.id,
                          type: "email",
                        });
                      }}
                      sx={{ color: "#d32f2f" }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>

                  {/* BODY */}
                  <Collapse in={isOpen}>
                    <Box
                      px={4}
                      pb={3}
                      sx={{
                        borderTop: "1px solid #eef1f5",
                      }}
                    >
                      <Box
                        sx={{
                          mt: 2,
                          color: "#4d6480",
                          fontSize: "14px",
                          lineHeight: 2,
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: "15px",
                            mb: 2,
                            color: "#3e5875",
                          }}
                        >
                          To : Hey {(email.to_email || "-").split("@")[0]},
                        </Typography>

                        <div
                          dangerouslySetInnerHTML={{
                            __html: email.body || "",
                          }}
                        />
                      </Box>
                    </Box>
                  </Collapse>
                </Paper>
              );
            })}
          </Stack>
        </Box>
      ))}
    </Stack>
  );
}
