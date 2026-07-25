

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
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState } from "react";

export default function EmailsTab({ activities = [], onEdit, onDelete }) {
  const [openId, setOpenId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  if (!activities.length) {
    return <Typography>No emails available</Typography>;
  }

  // ✅ Group by month
  const grouped = activities.reduce((acc, email) => {
    const date = new Date(
      email.sentAt || email.sent_at || email.date || email.created_at
    );

    const month = date.toLocaleString("default", {
      month: "long",
      year: "numeric",
    });

    if (!acc[month]) acc[month] = [];
    acc[month].push(email);
    return acc;
  }, {});

  // ✅ Start edit
  const startEdit = (email) => {
    setEditingId(email.id);
    setEditData({
      subject: email.title || email.subject || "",
      body: email.description || email.body || "",
      to_email: email.recipient || "",
    });
    setOpenId(email.id);
  };

  // ✅ Save edit
  const handleSave = () => {
    onEdit({
      type: "email",
      id: editingId,
      subject: editData.subject,
      body: editData.body,
      to_email: editData.to_email,
    });

    setEditingId(null);
  };

  return (
    <Stack spacing={1.5}>
      {Object.entries(grouped).map(([month, emails]) => (
        <Box key={month}>
          <Stack spacing={1.2}>
            {emails.map((email) => {
              const isOpen = openId === email.id;

              const emailDate =
                email.sentAt ||
                email.sent_at ||
                email.date ||
                email.created_at;

              const cleanBody = (email.description || email.body || "")
                .replace(/<[^>]+>/g, "")
                .replace(/\s+/g, " ")
                .trim();

              const displaySubject =
                email.title && email.title !== "No Subject"
                  ? email.title
                  : cleanBody || "No Subject";

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
                    sx={{ cursor: "pointer" }}
                  >
                    <ExpandMoreIcon
                      sx={{
                        fontSize: 18,
                        color: "#4b5a73",
                        transform: isOpen
                          ? "rotate(90deg)"
                          : "rotate(0deg)",
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
                      Logged Email - {displaySubject}
                    </Typography>

                    <Typography
                      sx={{
                        fontSize: "14px",
                        color: "#55657d",
                        ml: 0.5,
                      }}
                    >
                      by {email.from_name || email.from || "User"}
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

                    {/* EDIT */}
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        startEdit(email);
                      }}
                      sx={{ color: "#5b5bd6" }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>

                    {/* DELETE */}
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
                      sx={{ borderTop: "1px solid #eef1f5" }}
                    >
                      {editingId === email.id ? (
                        <>
                          <TextField
                            fullWidth
                            label="Subject"
                            value={editData.subject}
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                subject: e.target.value,
                              })
                            }
                            sx={{ mb: 2, mt: 2 }}
                          />

                          <TextField
                            fullWidth
                            label="To Email"
                            value={editData.to_email}
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                to_email: e.target.value,
                              })
                            }
                            sx={{ mb: 2 }}
                          />

                          <TextField
                            fullWidth
                            multiline
                            minRows={6}
                            label="Body"
                            value={editData.body}
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                body: e.target.value,
                              })
                            }
                            sx={{ mb: 2 }}
                          />

                          <Stack direction="row" spacing={2}>
                            <Button variant="contained" onClick={handleSave}>
                              Save
                            </Button>

                            <Button
                              variant="outlined"
                              onClick={() => setEditingId(null)}
                            >
                              Cancel
                            </Button>
                          </Stack>
                        </>
                      ) : (
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
                            To :{" "}
                            {(email.recipient || "-").split("@")[0]}
                          </Typography>

                          <div
                            dangerouslySetInnerHTML={{
                              __html:
                                email.description || email.body || "",
                            }}
                          />
                        </Box>
                      )}
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