import {
  Stack,
  Typography,
  Paper,
  Box,
  IconButton,
  Collapse,
  Dialog,
  Backdrop,
} from "@mui/material";
import dayjs from "dayjs";
import CallIcon from "@mui/icons-material/Call";
import CallEndIcon from "@mui/icons-material/CallEnd";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import MicOffIcon from "@mui/icons-material/MicOff";
import DialpadIcon from "@mui/icons-material/Dialpad";
import PauseCircleOutlineIcon from "@mui/icons-material/PauseCircleOutline";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import Avatar from "@mui/material/Avatar";
import { useState, useEffect } from "react";
import { TextField, MenuItem, Button } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function CallsTab({ activities = [], onEdit, onDelete }) {
  const [openId, setOpenId] = useState(null);

  // CALL STATES
  const [callOpen, setCallOpen] = useState(false);
  const [selectedCall, setSelectedCall] = useState(null);
  const [status, setStatus] = useState("Calling...");
  const [seconds, setSeconds] = useState(0);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  // START CALL
  const handleCall = (call) => {
    setSelectedCall(call);
    setStatus("Calling...");
    setSeconds(0);
    setCallOpen(true);
  };

  // END CALL
  const handleEndCall = () => {
    setCallOpen(false);
    setSelectedCall(null);
  };

  // Calling → Connected
  useEffect(() => {
    if (callOpen) {
      const timer = setTimeout(() => {
        setStatus("Connected");
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [callOpen]);

  // TIMER
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

  if (!activities.length) {
    return <Typography>No calls available</Typography>;
  }
  const startEdit = (call) => {
    setEditingId(call.id);

    setEditData({
      notes: call.notes || "",
      outcome: call.outcome || call.status || "",
      callTime: call.callTime || "",
    });
    setOpenId(call.id);
  };
  const handleSave = () => {
    onEdit({
      id: editingId,
      description: editData.notes,
      status: editData.outcome,
      call_time: editData.callTime,
    });

    setEditingId(null);
  };

  const stripHtml = (html) => {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || div.innerText || "";
  };

  const formatDateTime = (dateTime) => {
    if (!dateTime) return { date: "-", time: "-" };

    const d = dayjs(dateTime);

    return {
      date: d.format("DD MMM YYYY"),
      time: d.format("hh:mm A"),
    };
  };
  return (
    <>
      {/* ================= LIST ================= */}
      <Stack spacing={2}>
        {activities.map((call) => {
          const isOpen = openId === call.id;
          const { date, time } = formatDateTime(call.callTime);
          const name =
            call.connected?.trim() ||
            call.contact?.trim() ||
            call.name?.trim() ||
            "Client";

          return (
            <Paper
              key={call.id}
              sx={{
                border: "1px solid #e6e8f0",
                borderRadius: "12px",
                overflow: "hidden",
              }}
            >
              {/* HEADER (NotesTab Style) */}
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
                  {/* LEFT */}
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
                        <span style={{ fontSize: 12, color: "#6b7280" }}>
                          from {name}
                        </span>
                      </Typography>

                      {/* 🔝 DATE */}
                      <Typography fontSize={11} color="gray">
                        {date}
                      </Typography>
                    </Box>
                  </Box>

                  {/* RIGHT SIDE */}
                  <Box display="flex" alignItems="center" gap={2}>
                    {/* 🕒 TIME */}
                    <Typography fontSize={12} color="gray">
                      {time}
                    </Typography>

                    {/* ACTIONS */}
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
                          onDelete(call.id);
                        }}
                        sx={{ color: "red" }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                </Box>
              </Box>

              {/* COLLAPSE CONTENT */}
              <Collapse in={isOpen}>
                <Box p={2}>
                  {editingId === call.id ? (
                    <>
                      {/* NOTES */}
                      <TextField
                        fullWidth
                        multiline
                        minRows={3}
                        value={editData.notes}
                        onChange={(e) =>
                          setEditData({ ...editData, notes: e.target.value })
                        }
                        sx={{ mb: 2 }}
                      />

                      {/* OUTCOME */}
                      <TextField
                        select
                        fullWidth
                        size="small"
                        label="Outcome"
                        value={editData.outcome}
                        onChange={(e) =>
                          setEditData({ ...editData, outcome: e.target.value })
                        }
                        sx={{ mb: 2 }}
                      >
                        <MenuItem value="Interested">Interested</MenuItem>
                        <MenuItem value="Not Interested">
                          Not Interested
                        </MenuItem>
                        <MenuItem value="Follow Up">Follow Up</MenuItem>
                      </TextField>

                      {/* DATE + TIME */}
                      <Stack direction="row" spacing={2} mb={2}>
                        <TextField
                          type="date"
                          fullWidth
                          size="small"
                          value={
                            editData.callTime
                              ? dayjs(editData.callTime).format("YYYY-MM-DD")
                              : ""
                          }
                          onChange={(e) => {
                            const newDate = e.target.value;
                            const time =
                              dayjs(editData.callTime).format("HH:mm") ||
                              "00:00";

                            setEditData({
                              ...editData,
                              callTime: `${newDate}T${time}:00`,
                            });
                          }}
                        />

                        <TextField
                          type="time"
                          fullWidth
                          size="small"
                          value={
                            editData.callTime
                              ? dayjs(editData.callTime).format("HH:mm")
                              : ""
                          }
                          onChange={(e) => {
                            const newTime = e.target.value;
                            const date =
                              dayjs(editData.callTime).format("YYYY-MM-DD") ||
                              dayjs().format("YYYY-MM-DD");

                            setEditData({
                              ...editData,
                              callTime: `${date}T${newTime}:00`,
                            });
                          }}
                        />
                      </Stack>

                      {/* ACTION BUTTONS */}
                      <Stack direction="row" spacing={2}>
                        <Button
                          variant="contained"
                          onClick={handleSave}
                          sx={{ bgcolor: "#5b5bd6" }}
                        >
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
                    <>
                      {/* NORMAL VIEW */}
                      <Typography fontSize={13} color="text.secondary">
                        {stripHtml(call.notes) || "No notes"}
                      </Typography>

                      <Box mt={2} display="flex" gap={4}>
                        <Box>
                          <Typography fontSize={12}>Outcome</Typography>
                          <Typography fontSize={12} color="gray">
                            {call.outcome || call.status || "—"}
                          </Typography>
                        </Box>

                        <Box>
                          <Typography fontSize={12}>Time</Typography>
                          <Typography fontSize={12} color="gray">
                            {formatDateTime(call.callTime).time}
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

      {/* ================= CALL SCREEN ================= */}
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
          {(() => {
            const name =
              selectedCall?.connected || selectedCall?.contact || "Client";

            return (
              <>
                {/* TOP */}
                <Box display="flex" flexDirection="column" alignItems="center">
                  {/* PROFILE AVATAR */}
                  <Avatar
                    src={selectedCall?.avatar} // optional image
                    sx={{
                      width: 90,
                      height: 90,
                      mb: 2,
                      fontSize: 32,
                      bgcolor: "#5b5bd6",
                    }}
                  >
                    {(name || "C").charAt(0).toUpperCase()}
                  </Avatar>

                  {/* NAME */}
                  <Typography variant="h5" mb={1}>
                    {name}
                  </Typography>

                  {/* STATUS / TIMER */}
                  <Typography color="#6b6b6b">
                    {status === "Connected" ? formatTime(seconds) : status}
                  </Typography>
                </Box>

                {/* CONTROLS */}
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
                  <Control
                    icon={<FiberManualRecordIcon />}
                    label="Record"
                    red
                  />
                  <Control icon={<PauseCircleOutlineIcon />} label="Hold" />
                </Box>

                {/* END CALL */}
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
              </>
            );
          })()}
        </Box>
      </Dialog>
    </>
  );
}

/* 🔥 reusable control button */
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
