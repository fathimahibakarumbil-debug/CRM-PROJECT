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

export default function MeetingsTab({ activities = [], onEdit, onDelete }) {
  const [openId, setOpenId] = useState(null);
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({
    organized_by: "",
    date: "",
    startTime: "",
    endTime: "",
    attendees: [],
    description: "",
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

    const startMinutes = sh * 60 + sm;
    const endMinutes = eh * 60 + em;

    const diff = endMinutes - startMinutes;

    if (diff <= 0) return "-";

    const hours = Math.floor(diff / 60);
    const minutes = diff % 60;

    if (hours && minutes) return `${hours} Hours ${minutes} Minutes`;
    if (hours) return `${hours} Hours`;
    return `${minutes} Minutes`;
  };

  if (!activities.length) {
    return <Typography>No meetings available</Typography>;
  }

  return (
    <Stack spacing={2}>
      {activities.map((meeting) => {
        const m = meeting.meeting_details || {};
        const organizer =
          m?.attendees?.[0] || m?.organized_by || meeting?.organized_by || "-";
        const count = Array.isArray(m?.attendees)
          ? m.attendees.length
          : Array.isArray(meeting.attendees)
            ? meeting.attendees.length
            : 0;

        const isOpen = openId === meeting.id;
        const isEditing = editId === meeting.id;
        // const desc = meeting.description;
        const desc =
          meeting.description || meeting.meeting_details?.description || "";
        console.log("MEETING:", meeting);
        // const isEditing = editId === meeting.id;
        return (
          <Paper
            key={meeting.id}
            sx={{
              border: "1px solid #e6e8f0",
              borderRadius: "12px",
              overflow: "hidden",
            }}
          >
            {/* ================= HEADER ================= */}
            <Box
              px={2}
              py={1.5}
              sx={{
                background: isOpen ? "#eef2f6" : "#ffffff", // ✅ open / closed
                transition: "all 0.25s ease",
                cursor: "pointer",
              }}
              onClick={() => setOpenId(isOpen ? null : meeting.id)}
            >
              <Box display="flex" justifyContent="space-between">
                {/* LEFT */}
                <Box display="flex" gap={1}>
                  <ExpandMoreIcon
                    sx={{
                      transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "0.2s ease",
                    }}
                  />

                  <Box>
                    <Typography fontWeight={600}>
                      {meeting.title || "Meeting"}
                    </Typography>
                  </Box>
                </Box>

                {/* RIGHT */}
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography fontSize={12} color="#6b7280">
                    {/* {formatDateTime(m.date, m.startTime)} */}
                    {formatDateTime(
                      m?.date || meeting?.date,
                      m?.startTime || meeting?.startTime,
                    )}
                  </Typography>

                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditId(meeting.id);
                      setOpenId(meeting.id);

                      setEditData({
                        organized_by:
                          m?.organized_by ||
                          meeting?.organized_by ||
                          organizer ||
                          "",

                        date: m?.date
                          ? String(m.date).split("T")[0]
                          : meeting?.date
                            ? String(meeting.date).split("T")[0]
                            : "",

                        startTime: m?.startTime || meeting?.startTime || "",

                        endTime: m?.endTime || meeting?.endTime || "",

                        attendees: m?.attendees || meeting?.attendees || [],

                        description: meeting.description || "",
                      });
                    }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>

                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(meeting.id);
                    }}
                    sx={{ color: "red" }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
            </Box>

            {/* ================= CONTENT ================= */}
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
                      Organized By <b>{(organizer || "-").split(" ")[0]}</b>
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
                  {/* DATE */}
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
                          m?.date || meeting?.date,
                          m?.startTime || meeting?.startTime,
                        )}
                      </Typography>
                    )}
                  </Box>

                  {/* DURATION */}
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
                          m?.startTime || meeting.startTime,
                          m?.endTime || meeting.endTime,
                        )}
                      </Typography>
                    )}
                  </Box>

                  {/* ATTENDEES */}
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
                        {count}
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
                    <Typography
                      fontSize={12}
                      sx={{ color: "#6b7280" }}
                      dangerouslySetInnerHTML={{
                        __html: desc,
                      }}
                    />
                  )}
                </Box>
                {isEditing && (
                  <Box display="flex" gap={1} mt={2}>
                    <Button
                      variant="contained"
                      onClick={async () => {
                        onEdit({
                          id: meeting.id,
                          type: "Meeting",
                          description: editData.description,
                          organized_by: editData.organized_by,
                          date: editData.date,
                          startTime: editData.startTime,
                          endTime: editData.endTime,
                          attendees: editData.attendees,
                        });

                        // setEditId(null);
                        await Promise.resolve();
                        setEditId(null);
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
