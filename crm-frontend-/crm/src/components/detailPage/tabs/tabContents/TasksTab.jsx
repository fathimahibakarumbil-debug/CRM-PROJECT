import {
  Stack,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  IconButton,
  TextField,
  Button,
  MenuItem,
} from "@mui/material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState } from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { Radio, RadioGroup, FormControlLabel } from "@mui/material";
import EventBusyIcon from "@mui/icons-material/EventBusy";

export default function TasksTab({ activities = [], onDelete, onUpdate }) {
  // const now = new Date();
  const now = dayjs();
  const [expandedId, setExpandedId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  if (!activities.length) {
    return <Typography>No tasks available</Typography>;
  }

  const formatDateTime = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  const stripHtml = (html) => {
    if (!html) return "";
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || div.innerText || "";
  };

  const getDateTime = (task) => {
    if (task.dueDate) return task.dueDate;

    if (task.due_date) {
      return `${task.due_date}T${task.due_time || "00:00"}`;
    }

    return null;
  };

  const handleEdit = (task) => {
    setEditingId(task.id);

    const dateTime = getDateTime(task);

    setForm({
      title: task.title || "",
      dueDate: dateTime ? dateTime.slice(0, 16) : "",
      priority: task.priority || "",
      status: task.status || "",
      description: stripHtml(task.description),
      assigned_to: task.assigned_to || "",
    });
  };

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
  };

  const handleSave = async (id) => {
    setSaving(true);

    await onUpdate(id, form);

    setSaving(false);
    setEditingId(null);
    setForm({});
  };
  const cleanHtml = (html) => {
    if (!html) return "";

    return html.replace(/<p><br><\/p>/g, "").replace(/<\/?p>/g, "");
  };
  return (
    <Stack spacing={2}>
      {activities.map((task) => {


        const taskDate = getDateTime(task);
        const parsedDate = dayjs(taskDate);

        const isOverdue =
          parsedDate.isValid() &&
          parsedDate.isBefore(now) &&
          task.status !== "Completed";

        return (
          <Accordion
            expanded={expandedId === task.id}
            onChange={() =>
              setExpandedId(expandedId === task.id ? null : task.id)
            }
            key={`${task.id}-${task.updated_at || task.dueDate || ""}`}
          >
            <AccordionSummary sx={{ px: 2 }}>
              <Box width="100%">
                <Box display="flex" alignItems="center">
                  <ExpandMoreIcon
                    sx={{
                      mr: 1,
                      transform:
                        expandedId === task.id
                          ? "rotate(180deg)"
                          : "rotate(0deg)",
                      transition: "0.2s",
                    }}
                  />

                  <Typography flex={1} fontWeight={600}>
                    Task assigned to {task.assigned_to || "User"}
                  </Typography>

                  {isOverdue && (
                    <Typography
                      color="error"
                      fontSize={13}
                      sx={{
                        mr: 2,
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <EventBusyIcon sx={{ mr: 0.5, fontSize: 18 }} />
                      Overdue : {formatDateTime(getDateTime(task))}
                    </Typography>
                  )}

                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(task);
                    }}
                    sx={{ color: "#5b5bd6" }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>

                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(task.id);
                    }}
                    sx={{ color: "red" }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
                {expandedId !== task.id && (
                  <Box
                    display="flex"
                    alignItems="center"
                    gap={1}
                    sx={{ mt: 1, ml: 4 }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Radio
                      checked={selectedTask === task.id}
                      onChange={() => setSelectedTask(task.id)}
                      size="small"
                    />

                    <Typography fontSize={14} fontWeight={500}>
                      {task.title}
                    </Typography>
                  </Box>
                )}
              </Box>
            </AccordionSummary>

            {/* BODY */}
            <AccordionDetails>
              {editingId === task.id ? (
                // ✨ EDIT MODE
                <Stack spacing={2}>
                  <TextField
                    label="Task Name"
                    size="small"
                    value={form.title}
                    onChange={handleChange("title")}
                  />
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      {/* DATE */}
                      <Box sx={{ width: "50%" }}>
                        <Typography variant="caption">Due Date</Typography>

                        <DatePicker
                          value={form.dueDate ? dayjs(form.dueDate) : null}
                          onChange={(value) => {
                            const date = value
                              ? value.format("YYYY-MM-DD")
                              : "";

                            setForm((prev) => ({
                              ...prev,
                              dueDate: prev.dueDate
                                ? `${date}T${prev.dueDate.split("T")[1] || "00:00"}`
                                : `${date}T00:00`,
                            }));
                          }}
                          slotProps={{
                            textField: { size: "small", fullWidth: true },
                          }}
                        />
                      </Box>

                      {/* TIME */}
                      <Box sx={{ width: "50%" }}>
                        <Typography variant="caption">Time</Typography>

                        <TextField
                          type="time"
                          size="small"
                          fullWidth
                          value={form.dueDate ? form.dueDate.split("T")[1] : ""}
                          onChange={(e) => {
                            const time = e.target.value;

                            setForm((prev) => ({
                              ...prev,
                              dueDate: prev.dueDate
                                ? `${prev.dueDate.split("T")[0]}T${time}`
                                : `T${time}`,
                            }));
                          }}
                        />
                      </Box>
                    </Box>
                  </LocalizationProvider>
                  <TextField
                    select
                    label="Priority"
                    size="small"
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

                  <TextField
                    select
                    label="Status"
                    size="small"
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
                  <TextField
                    select
                    label="Assigned To"
                    size="small"
                    value={form.assigned_to}
                    onChange={handleChange("assigned_to")}
                    SelectProps={{ displayEmpty: true }}
                  >
                    <MenuItem value="">
                      <em>Choose</em>
                    </MenuItem>
                    <MenuItem value="Jane Cooper">Jane Cooper</MenuItem>
                    <MenuItem value="Robert Fox">Robert Fox</MenuItem>
                    <MenuItem value="Devon Lane">Devon Lane</MenuItem>
                  </TextField>
                  <TextField
                    label="Description"
                    size="small"
                    multiline
                    minRows={3}
                    value={form.description}
                    onChange={handleChange("description")}
                  />
                  <Box display="flex" gap={1}>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => handleSave(task.id)}
                      disabled={saving}
                    >
                      {saving ? "Saving..." : "Save"}
                    </Button>

                    <Button size="small" onClick={() => setEditingId(null)}>
                      Cancel
                    </Button>
                  </Box>
                </Stack>
              ) : (
                // 👇 NORMAL VIEW
                <Stack spacing={2}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Radio
                      checked={selectedTask === task.id}
                      onChange={() => setSelectedTask(task.id)}
                      size="small"
                    />

                    <Typography fontWeight={500}>{task.title}</Typography>
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
                        Due Date
                      </Typography>
                      <Typography fontSize={13} fontWeight={600}>
                        {/* {formatDateTime(task.dueDate)} */}
                        {formatDateTime(getDateTime(task))}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography fontSize={12} color="text.secondary">
                        Priority
                      </Typography>
                      <Typography fontSize={13} fontWeight={600}>
                        {task.priority || "-"}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography fontSize={12} color="text.secondary">
                        Type
                      </Typography>
                      <Typography fontSize={13} fontWeight={600}>
                        {/* {task.type || "-"} */}
                        {task.status || "-"}
                      </Typography>
                    </Box>
                  </Box>

                  {task.description && (
                    <Typography
                      fontSize={13}
                      color="text.secondary"
                      dangerouslySetInnerHTML={{
                        __html: cleanHtml(task.description),
                      }}
                    />
                  )}
                </Stack>
              )}
            </AccordionDetails>
          </Accordion>
        );
      })}
    </Stack>
  );
}
