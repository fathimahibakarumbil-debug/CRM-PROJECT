import {
  Stack,
  Typography,
  IconButton,
  Box,
  Paper,
  Collapse,
  TextField,
  Button,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState } from "react";

export default function LeadMeetingsTab({ activities = [], onEdit, onDelete }) {
  
  const [openId, setOpenId] = useState(null);
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({
    organized_by: "",
    date: "",
    startTime: "",
    endTime: "",
    attendees: [],
    description: "",
    outcome: "",
  });

  const formatDateTime = (date, time) => {
    if (!date) return "-";

    const baseDate = new Date(date);

    if (time) {
      const [h, m] = time.split(":");
      baseDate.setHours(h, m);
    }

    return baseDate.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getDuration = (start, end) => {
    if (!start || !end) return "-";

    const [sh, sm] = start.split(":").map(Number);
    const [eh, em] = end.split(":").map(Number);

    let startMinutes = sh * 60 + sm;
    let endMinutes = eh * 60 + em;

    if (endMinutes < startMinutes) {
      endMinutes += 24 * 60;
    }

    const diff = endMinutes - startMinutes;

    const hours = Math.floor(diff / 60);
    const minutes = diff % 60;

    if (hours > 0 && minutes > 0) {
      return `${hours} Hours ${minutes} Minutes`;
    }

    if (hours > 0) {
      return `${hours} Hours`;
    }

    return `${minutes} Minutes`;
  };

  if (!activities.length) {
    return <Typography>No meetings available</Typography>;
  }

  const stripHtml = (html = "") => {
    return html.replace(/<[^>]*>/g, "").trim();
  };
  return (
    <Stack spacing={2}>
      {activities.map((meeting) => {
        // const m = meeting.meeting_details || {};
        const m = meeting.meeting_details || meeting;
        const attendees = m.attendees || meeting.attendees || [];
        const organizedBy = m.organized_by || meeting.organized_by || "Unknown";
        const desc = meeting.description || m.description || "";
        const outcome = m.outcome || meeting.outcome || "";

        const isOpen = openId === meeting.id;
        const isEditing = editId === meeting.id;

        return (
          <Paper
            key={meeting.id}
            sx={{
              border: "1px solid #e6e8f0",
              borderRadius: "12px",
              overflow: "hidden",
            }}
          >
            {/* HEADER */}
            <Box
              px={2}
              py={1.5}
              sx={{
                background: isOpen ? "#eef2f6" : "#ffffff",
                transition: "all 0.25s ease",
                cursor: "pointer",
              }}
              onClick={() => setOpenId(isOpen ? null : meeting.id)}
            >
              <Box display="flex" justifyContent="space-between">
                <Box display="flex" gap={1}>
                  <ExpandMoreIcon
                    sx={{
                      transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "0.2s ease",
                    }}
                  />

                  <Typography fontWeight={600}>
                    {meeting.title || "Lead Meeting"}
                  </Typography>
                </Box>

                <Box display="flex" alignItems="center" gap={1}>
                  <Typography fontSize={12} color="#6b7280">
                    {formatDateTime(
                      m.date || meeting.date,
                      m.startTime || meeting.startTime,
                    )}
                  </Typography>

                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditId(meeting.id);
                      setOpenId(meeting.id);

                      setEditData({
                        organized_by: organizedBy,
                        date: m.date || meeting.date || "",
                        startTime:
                          m.startTime ||
                          meeting.startTime ||
                          (meeting.meetingTime
                            ? meeting.meetingTime.split("T")[1]?.slice(0, 5)
                            : ""),
                        endTime:
                          m.endTime ||
                          meeting.endTime ||
                          meeting.end_time ||
                          "",
                        attendees,
                        description: stripHtml(desc),
                        outcome,
                      });
                    }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>

                  <IconButton
                    size="small"
                    sx={{ color: "red" }}
                    onClick={(e) => {
                      e.stopPropagation();

                      onDelete({
                        id: meeting.id,
                        type: "meeting",
                      });
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
            </Box>

            {/* CONTENT */}
            <Collapse in={isOpen}>
              <Box p={2}>
                <Box mb={2}>
                  {isEditing ? (
                    <TextField
                      fullWidth
                      size="small"
                      value={editData.organized_by}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          organized_by: e.target.value,
                        })
                      }
                    />
                  ) : (
                    <Typography fontSize={13}>
                      Organized By <b>{organizedBy}</b>
                    </Typography>
                  )}
                </Box>

                <Box
                  display="flex"
                  gap={6}
                  bgcolor="#eef2f6"
                  p={2}
                  borderRadius={1}
                >
                  <Box>
                    <Typography fontSize={12} color="text.secondary">
                      Meeting Date & Time
                    </Typography>

                    {isEditing ? (
                      <>
                        <TextField
                          type="date"
                          size="small"
                          value={editData.date}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              date: e.target.value,
                            })
                          }
                        />

                        <TextField
                          type="time"
                          size="small"
                          value={editData.startTime}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              startTime: e.target.value,
                            })
                          }
                        />
                      </>
                    ) : (
                      <Typography fontWeight={600} fontSize={13}>
                        {formatDateTime(
                          m.date || meeting.date,
                          m.startTime || meeting.startTime,
                        )}
                      </Typography>
                    )}
                  </Box>

                  <Box>
                    <Typography fontSize={12} color="text.secondary">
                      Duration
                    </Typography>

                    {isEditing ? (
                      <TextField
                        type="time"
                        size="small"
                        value={editData.endTime}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            endTime: e.target.value,
                          })
                        }
                      />
                    ) : (
                      <Typography fontWeight={600} fontSize={13}>
                        {getDuration(
                          m.startTime ||
                            meeting.startTime ||
                            meeting.start_time ||
                            (meeting.meetingTime
                              ? meeting.meetingTime.split("T")[1]?.slice(0, 5)
                              : ""),
                          m.endTime ||
                            meeting.endTime ||
                            meeting.end_time ||
                            "",
                        )}
                      </Typography>
                    )}
                  </Box>

                  <Box>
                    <Typography fontSize={12} color="text.secondary">
                      Attendees
                    </Typography>

                    {isEditing ? (
                      <TextField
                        size="small"
                        value={editData.attendees.join(", ")}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            attendees: e.target.value
                              .split(",")
                              .map((a) => a.trim()),
                          })
                        }
                      />
                    ) : (
                      <Typography fontWeight={600} fontSize={13}>
                        {attendees.length}
                      </Typography>
                    )}
                  </Box>
                </Box>

                <Box px={2} py={1}>
                  {isEditing ? (
                    <TextField
                      multiline
                      rows={3}
                      fullWidth
                      size="small"
                      value={editData.description}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          description: e.target.value,
                        })
                      }
                    />
                  ) : (
                    <>
                      <Typography fontSize={12} sx={{ color: "#6b7280" }}>
                        {stripHtml(desc)}{" "}
                      </Typography>

                      {outcome && (
                        <Typography fontSize={12} mt={1} color="text.secondary">
                          Outcome: {outcome}
                        </Typography>
                      )}
                    </>
                  )}
                </Box>

                {isEditing && (
                  <Box display="flex" gap={1} mt={2}>
                    <Button
                      variant="contained"
                      onClick={async () => {
                        await onEdit({
                          id: meeting.id,
                          type: "meeting",
                          meeting_details: {
                            ...editData,
                          },
                        });

                        setEditId(null);
                        setOpenId(null);
                      }}
                    >
                      Save
                    </Button>

                    <Button variant="outlined" onClick={() => setEditId(null)}>
                      Cancel
                    </Button>
                  </Box>
                )}
              </Box>
            </Collapse>
          </Paper>
        );
      })}
    </Stack>
  );
}
