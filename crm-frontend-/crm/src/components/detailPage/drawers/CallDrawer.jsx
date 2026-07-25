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
import CloseIcon from "@mui/icons-material/Close";
import { useEffect, useRef, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { useSelector } from "react-redux";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

export default function CallDrawer({ open, onClose, onSave }) {
  const editorRef = useRef(null);
  const quillRef = useRef(null);

  const { currentLead: lead } = useSelector((state) => state.lead);

  const [form, setForm] = useState({
    connected: `${lead?.firstName ?? ""} ${lead?.lastName ?? ""}`.trim(),
    outcome: "",
    date: "",
    time: "",
    note: "",
  });

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        if (editorRef.current) {
          editorRef.current.innerHTML = "";

          quillRef.current = new Quill(editorRef.current, {
            theme: "snow",
            placeholder: "Enter",
            modules: {
              toolbar: [
                [{ header: [1, 2, false] }],
                ["bold", "italic", "underline"],
                [{ list: "ordered" }, { list: "bullet" }],
                ["link"],
                ["clean"],
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

  const handleChange = (field) => (event) => {
    setForm({ ...form, [field]: event.target.value });
  };

  const buildCallTime = () => {
    if (!form.date || !form.time) return "";

    return dayjs(`${form.date}T${form.time}`).format(); // ✅ includes timezone
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
        slotProps={{
          paper: {
            sx: {
              width: 420,
              borderTopLeftRadius: 8,
              borderBottomLeftRadius: 8,
            },
          },
        }}
      >
        <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ px: 3, py: 2 }}
          >
            <Typography variant="subtitle1" fontWeight={600}>
              Log Call
            </Typography>

            <IconButton size="small" onClick={onClose}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Stack>

          <Divider />

          <Box sx={{ flex: 1, px: 3, py: 2 }}>
            <Typography variant="caption" color="text.secondary">
              Connected
            </Typography>
            <TextField
              fullWidth
              size="small"
              value={form.connected}
              onChange={handleChange("connected")}
              sx={{ mt: 0.5, mb: 2 }}
            />

            <Typography variant="caption" color="text.secondary">
              Call Outcome
            </Typography>
            <TextField
              select
              fullWidth
              size="small"
              value={form.outcome}
              onChange={handleChange("outcome")}
              sx={{ mt: 0.5, mb: 2 }}
              placeholder="Choose"
            >
              <MenuItem value="">Choose</MenuItem>
              <MenuItem value="Interested">Interested</MenuItem>
              <MenuItem value="Not Interested">Not Interested</MenuItem>
              <MenuItem value="Follow Up">Follow Up</MenuItem>
            </TextField>

            <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  Date
                </Typography>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    value={form.date ? dayjs(form.date) : null}
                    onChange={(value) =>
                      setForm({
                        ...form,
                        date: value ? value.format("YYYY-MM-DD") : "",
                      })
                    }
                  />
                </LocalizationProvider>
              </Box>

              <Box sx={{ flex: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  Time
                </Typography>
                <TextField
                  type="time"
                  fullWidth
                  size="small"
                  value={form.time}
                  onChange={handleChange("time")}
                  sx={{ mt: 0.5 }}
                  InputLabelProps={{ shrink: true }}
                />
              </Box>
            </Stack>

            <Typography variant="caption" color="text.secondary">
              Note
            </Typography>

            <Box
              sx={{
                border: "1px solid #e0e0e0",
                borderRadius: 1,
                overflow: "hidden",
                minHeight: 150,
                mt: 0.5,
                "& .ql-toolbar": {
                  borderBottom: "1px solid #e0e0e0",
                  backgroundColor: "#fafafa",
                },
                "& .ql-container": {
                  border: "none",
                  minHeight: 120,
                },
              }}
            >
              <Box ref={editorRef} />
            </Box>
          </Box>

          <Box sx={{ px: 3, py: 2 }}>
            <Stack direction="row" spacing={2}>
              <Button
                variant="outlined"
                fullWidth
                onClick={onClose}
                sx={{ textTransform: "none" }}
              >
                Cancel
              </Button>

              <Button
                variant="contained"
                fullWidth
                sx={{
                  textTransform: "none",
                  bgcolor: "#5b5bd6",
                  "&:hover": { bgcolor: "#4747c7" },
                }}
                onClick={() => {
                  const activityData = {
                    type: "Call",
                    callTime: buildCallTime(),
                    // call_time: buildCallTime(),
                    description: form.note || "",
                    connected: form.connected?.trim(),
                    outcome: form.outcome,
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
      </Drawer>
    </>
  );
}
