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
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

export default function TaskDrawer({ open, onClose, onSave }) {
  const editorRef = useRef(null);
  const quillRef = useRef(null);

  const [form, setForm] = useState({
    taskName: "",
    dueDate: "",
    time: "",
    status: "",
    priority: "",
    assignedTo: "",
    description: "",
  });

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        if (editorRef.current) {
          editorRef.current.innerHTML = "";

          quillRef.current = new Quill(editorRef.current, {
            theme: "snow",
            placeholder: "Enter task description...",
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

            setForm((prev) => ({
              ...prev,
              description: content,
            }));
          });
        }
      }, 200);

      return () => clearTimeout(timer);
    }
  }, [open]);

  const handleChange = (field) => (event) => {
    setForm({ ...form, [field]: event.target.value });
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
        PaperProps={{
          sx: {
            width: 400,
            borderTopLeftRadius: 8,
            borderBottomLeftRadius: 8,
          },
        }}
      >
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Box
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* HEADER */}

            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ px: 2, py: 1 }}
            >
              <Typography fontWeight={600}>Create Task</Typography>

              <IconButton size="small" onClick={onClose}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </Stack>

            <Divider />

            {/* CONTENT */}

            <Box
              sx={{
                flex: 1,
                px: 2,
                py: 1,
                display: "flex",
                flexDirection: "column",
                gap: 1.2,
                overflowY: "auto",
              }}
            >
              {/* Task Name */}

              <Typography variant="caption">
                Task Name <span style={{ color: "red" }}>*</span>
              </Typography>

              <TextField
                size="small"
                fullWidth
                value={form.taskName}
                onChange={handleChange("taskName")}
              />

              {/* Due Date + Time */}

              <Box sx={{ display: "flex", gap: 1 }}>
                <Box sx={{ width: "50%" }}>
                  <Typography variant="caption">Due Date</Typography>

                  <DatePicker
                    value={form.dueDate ? dayjs(form.dueDate) : null}
                    onChange={(value) =>
                      setForm({
                        ...form,
                        dueDate: value ? value.format("YYYY-MM-DD") : "",
                      })
                    }
                    slotProps={{
                      textField: {
                        size: "small",
                        fullWidth: true,
                      },
                    }}
                  />
                </Box>

                <Box sx={{ width: "50%" }}>
                  <Typography variant="caption">Time</Typography>

                  <TextField
                    size="small"
                    type="time"
                    fullWidth
                    value={form.time}
                    onChange={handleChange("time")}
                  />
                </Box>
              </Box>

              {/* Task Type + Priority */}

              <Box sx={{ display: "flex", gap: 1 }}>
                <Box sx={{ width: "50%" }}>
                  <Typography variant="caption">Task Type</Typography>

                  <TextField
                    select
                    size="small"
                    fullWidth
                    value={form.status}
                    onChange={handleChange("status")}
                    SelectProps={{ displayEmpty: true }}
                  >
                    <MenuItem value="">
                      <em>Choose</em>
                    </MenuItem>
                    <MenuItem value="Open">Open</MenuItem>
                    <MenuItem value="In Progress">In Progress</MenuItem>
                    <MenuItem value="Completed">Completed</MenuItem>
                  </TextField>
                </Box>

                <Box sx={{ width: "50%" }}>
                  <Typography variant="caption">Priority</Typography>

                  <TextField
                    select
                    size="small"
                    fullWidth
                    value={form.priority}
                    onChange={handleChange("priority")}
                    SelectProps={{ displayEmpty: true }}
                  >
                    <MenuItem value="">
                      <em>Choose</em>
                    </MenuItem>
                    <MenuItem value="Low">Low</MenuItem>
                    <MenuItem value="Medium">Medium</MenuItem>
                    <MenuItem value="High">High</MenuItem>
                  </TextField>
                </Box>
              </Box>

              {/* Assigned To */}

              <Typography variant="caption">Assigned To</Typography>

              <TextField
                select
                size="small"
                fullWidth
                value={form.assignedTo}
                onChange={handleChange("assignedTo")}
                SelectProps={{ displayEmpty: true }}
              >
                <MenuItem value="">
                  <em>Choose</em>
                </MenuItem>
                <MenuItem value="Jane Cooper">Jane Cooper</MenuItem>
                <MenuItem value="Robert Fox">Robert Fox</MenuItem>
                <MenuItem value="Devon Lane">Devon Lane</MenuItem>
              </TextField>

              {/* Description */}

              <Typography variant="caption">Description</Typography>

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
                  "& .ql-container": {
                    border: "none",
                    minHeight: 120,
                  },
                }}
              >
                <Box ref={editorRef} />
              </Box>
            </Box>

            {/* FOOTER */}

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
                  sx={{
                    bgcolor: "#5b5bd6",
                    "&:hover": { bgcolor: "#4747c7" },
                  }}
                  onClick={() => {
                    const activityData = {
                      type: "task",
                      title: form.taskName,
                      description: form.description,
                      due_date: form.dueDate || null,
                      due_time: form.time || null,
                      dueDate: form.dueDate || null,
                      priority: form.priority,
                      status: form.status,
                      assigned_to: form.assignedTo,
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
