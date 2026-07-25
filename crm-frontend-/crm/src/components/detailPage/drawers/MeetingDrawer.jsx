import {
  Drawer,
  Box,
  Typography,
  Button,
  Stack,
  IconButton,
  Divider,
  Backdrop,
  TextField,
  MenuItem,
} from "@mui/material";
import {
  DatePicker,
  TimePicker,
  LocalizationProvider,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect, useRef, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

export default function MeetingDrawer({ open, onClose, onSave }) {
  const editorRef = useRef(null);
  const quillRef = useRef(null);

  const [form, setForm] = useState({
    title: "",
    date: "",
    startTime: "",
    endTime: "",
    attendees: [],
    location: "",
    reminder: "",
    note: "",
  });

  const inputCompactSx = {
    "& .MuiInputBase-root": { height: 30, fontSize: "0.8rem" },
    "& .MuiInputBase-input": { padding: "4px 8px" },
    "& .MuiSelect-select": { padding: "4px 8px" },
  };

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        if (editorRef.current) {
          editorRef.current.innerHTML = "";

          quillRef.current = new Quill(editorRef.current, {
            theme: "snow",
            placeholder: "Enter meeting notes...",
            modules: {
              toolbar: [
                ["bold", "italic", "underline"],
                [{ list: "ordered" }, { list: "bullet" }],
                ["link"],
              ],
            },
          });

          quillRef.current.on("text-change", () => {
            const content = quillRef.current.root.innerHTML;
            setForm((prev) => ({ ...prev, note: content }));
          });
        }
      }, 200);

      return () => clearTimeout(timer);
    }
  }, [open]);

  const handleChange = (field) => (event) =>
    setForm({ ...form, [field]: event.target.value });

  const buildMeetingTime = () => {
    if (!form.date || !form.startTime) return "";
    return `${form.date}T${form.startTime}:00`;
  };
  const buildTitle = () => {
    if (!form.attendees.length) return "Meeting";

    if (form.attendees.length === 1) return `Meeting ${form.attendees[0]}`;

    return `Meeting ${form.attendees[0]} and ${form.attendees[1]}`;
  };
  return (
    <>
      <Backdrop
        open={open}
        sx={{
          backdropFilter: "blur(4px)",
          backgroundColor: "rgba(0,0,0,0.2)",
          zIndex: (theme) => theme.zIndex.drawer - 1,
        }}
      />

      <Drawer
        anchor="right"
        open={open}
        onClose={onClose}
        PaperProps={{ sx: { width: 380 } }}
      >
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Box
            sx={{ height: "100%", display: "flex", flexDirection: "column" }}
          >
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ px: 2, py: 1 }}
            >
              <Typography fontWeight={600}>Schedule Meeting</Typography>
              <IconButton size="small" onClick={onClose}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </Stack>

            <Divider />

            <Box
              sx={{
                flex: 1,
                px: 2,
                py: 1,
                display: "flex",
                flexDirection: "column",
                gap: 0.6,
                overflowY: "auto",
              }}
            >
              <Typography variant="caption">Title</Typography>
              <TextField
                size="small"
                fullWidth
                placeholder="Enter"
                value={form.title}
                onChange={handleChange("title")}
                sx={inputCompactSx}
              />

              <Typography variant="caption">Start Date</Typography>
              <DatePicker
                value={form.date ? dayjs(form.date) : null}
                onChange={(newValue) =>
                  setForm({
                    ...form,
                    date: newValue ? newValue.format("YYYY-MM-DD") : "",
                  })
                }
                slotProps={{
                  textField: {
                    size: "small",
                    fullWidth: true,
                    sx: inputCompactSx,
                  },
                }}
              />

              <Box sx={{ display: "flex", gap: 1 }}>
                <Box sx={{ width: "50%" }}>
                  <Typography variant="caption">Start Time</Typography>
                  <TimePicker
                    value={
                      form.startTime ? dayjs(form.startTime, "HH:mm") : null
                    }
                    onChange={(newValue) =>
                      setForm({
                        ...form,
                        startTime: newValue ? newValue.format("HH:mm") : "",
                      })
                    }
                    slotProps={{
                      textField: {
                        size: "small",
                        fullWidth: true,
                        sx: inputCompactSx,
                      },
                    }}
                  />
                </Box>

                <Box sx={{ width: "50%" }}>
                  <Typography variant="caption">End Time</Typography>
                  <TimePicker
                    value={form.endTime ? dayjs(form.endTime, "HH:mm") : null}
                    onChange={(newValue) =>
                      setForm({
                        ...form,
                        endTime: newValue ? newValue.format("HH:mm") : "",
                      })
                    }
                    slotProps={{
                      textField: {
                        size: "small",
                        fullWidth: true,
                        sx: inputCompactSx,
                      },
                    }}
                  />
                </Box>
              </Box>

              <Typography variant="caption">Attendees</Typography>

              <TextField
                select
                SelectProps={{ multiple: true }}
                size="small"
                fullWidth
                value={form.attendees}
                onChange={(e) =>
                  setForm({ ...form, attendees: e.target.value })
                }
                sx={inputCompactSx}
              >
                <MenuItem value="Maria Johnson">Maria Johnson</MenuItem>
                <MenuItem value="Jane Cooper">Jane Cooper</MenuItem>
                <MenuItem value="John Smith">John Smith</MenuItem>
              </TextField>

              <Typography variant="caption">Location</Typography>
              <TextField
                select
                size="small"
                fullWidth
                value={form.location}
                onChange={handleChange("location")}
                sx={inputCompactSx}
              >
                <MenuItem value="">Choose</MenuItem>
                <MenuItem value="Room 1">Room 1</MenuItem>
                <MenuItem value="Room 2">Room 2</MenuItem>
              </TextField>

              <Typography variant="caption">Reminder</Typography>
              <TextField
                select
                size="small"
                fullWidth
                value={form.reminder}
                onChange={handleChange("reminder")}
                sx={inputCompactSx}
              >
                <MenuItem value="">Choose</MenuItem>
                <MenuItem value="10 min">10 minutes</MenuItem>
                <MenuItem value="30 min">30 minutes</MenuItem>
              </TextField>

              <Typography variant="caption">Notes</Typography>
              <Box
                sx={{
                  border: "1px solid #e0e0e0",
                  borderRadius: 1,
                  overflow: "hidden",
                  "& .ql-toolbar": {
                    borderBottom: "1px solid #e0e0e0",
                    background: "#fafafa",
                    padding: "4px",
                  },
                  "& .ql-container": { border: "none", minHeight: 70 },
                }}
              >
                <Box ref={editorRef} />
              </Box>
            </Box>

            <Box
              sx={{
                px: 2,
                py: 1,
                borderTop: "1px solid #eee",
                background: "#fff",
              }}
            >
              <Stack direction="row" spacing={1}>
                <Button variant="outlined" fullWidth onClick={onClose}>
                  Cancel
                </Button>

                <Button
                  variant="contained"
                  fullWidth
                  sx={{ bgcolor: "#5b5bd6", "&:hover": { bgcolor: "#4747c7" } }}
                  onClick={() => {
                    // const latestNote = quillRef.current
                    //   ? quillRef.current.root.innerHTML
                    //   : form.note;
                    let latestNote = quillRef.current
                      ? quillRef.current.root.innerHTML
                      : form.note;

                    // ✅ remove empty quill html
                    if (
                      latestNote === "<p><br></p>" ||
                      latestNote === "<p></p>"
                    ) {
                      latestNote = "";
                    }

                    // const activityData = {
                    //   type: "meeting",

                    //   title: form.title,

                    //   meetingTime: `${form.date}T${form.startTime}:00`, // ✅ REQUIRED

                    //   location: form.location, // ✅ REQUIRED

                    //   endTime: form.endTime,

                    //   attendees: form.attendees,

                    //   notes: latestNote || "",
                    // };
                    const activityData = {
                      type: "meeting",
                      title: buildTitle(),
                      date: form.date,
                      // organized_by: form.attendees?.[0],
                      organized_by: form.attendees?.[0] || "",
                      startTime: form.startTime,
                      endTime: form.endTime,
                      start_time: form.startTime,
                      end_time: form.endTime,

                      attendees: form.attendees,
                      location: form.location,
                      description: latestNote || "",
                    };

                    onSave(activityData);
                    onClose();
                  }}
                >
                  Save
                </Button>
              </Stack>
            </Box>
          </Box>
        </LocalizationProvider>
      </Drawer>
    </>
  );
}
