import {
  Stack,
  Typography,
  Paper,
  Box,
  IconButton,
  Collapse,
  Dialog,
  Backdrop,
  TextField,
  MenuItem,
  Button,
  Avatar,
} from "@mui/material";
import dayjs from "dayjs";
import { useState, useEffect } from "react";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);
import CallIcon from "@mui/icons-material/Call";
import CallEndIcon from "@mui/icons-material/CallEnd";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import MicOffIcon from "@mui/icons-material/MicOff";
import DialpadIcon from "@mui/icons-material/Dialpad";
import PauseCircleOutlineIcon from "@mui/icons-material/PauseCircleOutline";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function LeadCallsTab({ activities = [], onEdit, onDelete }) {
  const [openId, setOpenId] = useState(null);
  const [callOpen, setCallOpen] = useState(false);
  const [selectedCall, setSelectedCall] = useState(null);
  const [status, setStatus] = useState("Calling...");
  const [seconds, setSeconds] = useState(0);

  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  const handleCall = (call) => {
    setSelectedCall(call);
    setStatus("Calling...");
    setSeconds(0);
    setCallOpen(true);
  };

  const handleEndCall = () => {
    setCallOpen(false);
    setSelectedCall(null);
  };

  useEffect(() => {
    if (callOpen) {
      const timer = setTimeout(() => {
        setStatus("Connected");
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [callOpen]);

  useEffect(() => {
    let interval;

    if (status === "Connected") {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [status]);

  const formatTime = (s) => {
    const min = String(Math.floor(s / 60)).padStart(2, "0");
    const sec = String(s % 60).padStart(2, "0");
    return `${min}:${sec}`;
  };

  const formatDateTime = (dateTime) => {
    if (!dateTime) return { date: "-", time: "-" };

    const d = dayjs.utc(dateTime).local();

    return {
      date: d.format("DD MMM YYYY"),
      time: d.format("hh:mm A"),
    };
  };

  const stripHtml = (html) => {
    if (!html) return "";
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || div.innerText || "";
  };

  const startEdit = (call) => {
    setEditingId(call.id);

    setEditData({
      // notes: call.notes || call.description || "",
      notes: stripHtml(call.notes || call.description || ""), // ✅ FIX
      outcome: call.outcome || call.status || "",
      // callTime: call.callTime || "",
      callTime: call.callTime
        ? dayjs.utc(call.callTime).local().format("YYYY-MM-DDTHH:mm:ss")
        : "",
    });

    setOpenId(call.id);
  };

  const handleSave = async () => {
    await onEdit?.({
      id: editingId,
      type: "call",
      description: editData.notes,
      outcome: editData.outcome,

      callTime: editData.callTime
        ? dayjs(editData.callTime).utc().format("YYYY-MM-DDTHH:mm:ss[Z]")
        : null,
    });
    setEditingId(null);
  };
  if (!activities.length) {
    return <Typography>No lead calls available</Typography>;
  }

  return (
    <>
      <Stack spacing={2}>
        {activities.map((call) => {
          const isOpen = openId === call.id;
          const { date, time } = formatDateTime(call.callTime);

          const name =
            call.connected?.trim() ||
            call.contact_name?.trim() ||
            call.lead_name?.trim() ||
            "Lead";
          return (
            <Paper
              key={call.id}
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
                  background: isOpen ? "#eef2f6" : "#fff",
                  transition: "0.25s",
                  cursor: "pointer",
                }}
                onClick={() => setOpenId(isOpen ? null : call.id)}
              >
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Box display="flex" gap={1} alignItems="center">
                    <ExpandMoreIcon
                      sx={{
                        transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                        transition: "0.2s ease",
                      }}
                    />

                    <Box>
                      <Typography>
                        <b>Call</b>{" "}
                        <span
                          style={{
                            fontSize: 12,
                            color: "#6b7280",
                          }}
                        >
                          with {name}
                        </span>
                      </Typography>

                      <Typography fontSize={11} color="gray">
                        {date}
                      </Typography>
                    </Box>
                  </Box>

                  <Box display="flex" alignItems="center" gap={2}>
                    <Typography fontSize={12} color="gray">
                      {time}
                    </Typography>

                    <Box display="flex" gap={1}>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCall(call);
                        }}
                        sx={{ color: "green" }}
                      >
                        <CallIcon fontSize="small" />
                      </IconButton>

                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          startEdit(call);
                        }}
                        sx={{ color: "#5b5bd6" }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>

                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete?.(call, "call");
                        }}
                        sx={{ color: "red" }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                </Box>
              </Box>

              {/* BODY */}
              <Collapse in={isOpen}>
                <Box p={2}>
                  {editingId === call.id ? (
                    <Stack spacing={2}>
                      <TextField
                        multiline
                        minRows={5}
                        fullWidth
                        label="Notes"
                        value={editData.notes}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            notes: e.target.value,
                          })
                        }
                      />

                      <TextField
                        select
                        label="Outcome"
                        value={editData.outcome}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            outcome: e.target.value,
                          })
                        }
                      >
                        <MenuItem value="Interested">Interested</MenuItem>
                        <MenuItem value="Not Interested">
                          Not Interested
                        </MenuItem>
                        <MenuItem value="Follow Up">Follow Up</MenuItem>
                      </TextField>

                      <Stack direction="row" spacing={2}>
                        <TextField
                          type="date"
                          fullWidth
                          value={
                            editData.callTime
                              ? dayjs(editData.callTime).format("YYYY-MM-DD")
                              : ""
                          }
                          onChange={(e) => {
                            const time =
                              dayjs(editData.callTime).format("HH:mm") ||
                              "00:00";

                            setEditData({
                              ...editData,
                              callTime: `${e.target.value}T${time}:00`,
                            });
                          }}
                        />

                        <TextField
                          type="time"
                          fullWidth
                          value={
                            editData.callTime
                              ? dayjs(editData.callTime).format("HH:mm")
                              : ""
                          }
                          onChange={(e) => {
                            const date =
                              dayjs(editData.callTime).format("YYYY-MM-DD") ||
                              dayjs().format("YYYY-MM-DD");

                            setEditData({
                              ...editData,
                              callTime: `${date}T${e.target.value}:00`,
                            });
                          }}
                        />
                      </Stack>

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
                    </Stack>
                  ) : (
                    <>
                      <Typography fontSize={13} color="text.secondary">
                        {stripHtml(call.notes || call.description) ||
                          "No notes"}{" "}
                      </Typography>

                      <Box mt={2} display="flex" gap={4} flexWrap="wrap">
                        <Box>
                          <Typography fontSize={12}>Outcome</Typography>
                          <Typography fontSize={12} color="gray">
                            {call.outcome || "-"}
                          </Typography>
                        </Box>

                        <Box>
                          <Typography fontSize={12}>Time</Typography>
                          <Typography fontSize={12} color="gray">
                            {time || "-"}
                          </Typography>
                        </Box>
                      </Box>
                    </>
                  )}
                </Box>
              </Collapse>
            </Paper>
          );
        })}
      </Stack>

      {/* CALL SCREEN */}
      <Dialog
        open={callOpen}
        onClose={handleEndCall}
        BackdropComponent={Backdrop}
        BackdropProps={{
          sx: { backdropFilter: "blur(6px)" },
        }}
      >
        <Box
          sx={{
            width: 420,
            height: 560,
            p: 4,
            borderRadius: 4,
            textAlign: "center",
            bgcolor: "#fff",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <Box display="flex" flexDirection="column" alignItems="center">
            <Avatar
              sx={{
                width: 90,
                height: 90,
                mb: 2,
                fontSize: 32,
                bgcolor: "#5b5bd6",
              }}
            >
              {(
                selectedCall?.connected ||
                selectedCall?.contact_name ||
                selectedCall?.lead_name ||
                "L"
              )
                .charAt(0)
                .toUpperCase()}{" "}
            </Avatar>

            <Typography variant="h5" mb={1}>
              {selectedCall?.connected ||
                selectedCall?.contact_name ||
                selectedCall?.lead_name ||
                "Lead"}{" "}
            </Typography>

            <Typography color="#6b6b6b">
              {status === "Connected" ? formatTime(seconds) : status}
            </Typography>
          </Box>

          <Box
            display="grid"
            gridTemplateColumns="repeat(3,1fr)"
            gap={3}
            justifyItems="center"
          >
            <Control icon={<MicOffIcon />} label="Mute" />
            <Control icon={<VolumeUpIcon />} label="Speaker" />
            <Control icon={<CallIcon />} label="Add Call" />
            <Control icon={<DialpadIcon />} label="Keypad" />
            <Control icon={<FiberManualRecordIcon />} label="Record" red />
            <Control icon={<PauseCircleOutlineIcon />} label="Hold" />
          </Box>

          <Box>
            <IconButton
              onClick={handleEndCall}
              sx={{
                bgcolor: "red",
                color: "#fff",
                width: 70,
                height: 70,
                "&:hover": {
                  bgcolor: "#d32f2f",
                },
              }}
            >
              <CallEndIcon fontSize="large" />
            </IconButton>
          </Box>
        </Box>
      </Dialog>
    </>
  );
}

function Control({ icon, label, red }) {
  return (
    <Box textAlign="center">
      <IconButton
        sx={{
          bgcolor: red ? "#ffeaea" : "#f3f0ff",
          color: red ? "red" : "#5b5bd6",
        }}
      >
        {icon}
      </IconButton>
      <Typography fontSize={11}>{label}</Typography>
    </Box>
  );
}
