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
  Radio,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState } from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import EventBusyIcon from "@mui/icons-material/EventBusy";

export default function LeadTasksTab({ activities = [], onDelete, onUpdate }) {
  const now = new Date();

  const [expandedId, setExpandedId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title: "",
    dueDate: "",
    priority: "",
    status: "",
    assigned_to: "",
    description: "",
  });

  if (!activities.length) {
    return <Typography>No lead tasks available</Typography>;
  }

  const formatDateTime = (date) => {
    if (!date) return "-";

    return dayjs(date).format("DD MMM YYYY, hh:mm a");
  };

  const getDateTime = (task) => {
    const date = task.dueDate || task.due_date;
    const time = task.due_time;

    if (!date) return null;

    if (!time) return `${date}T23:59:00`;

    return `${date}T${time}`;
  };

  const stripHtml = (html) => {
    if (!html) return "";
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || div.innerText || "";
  };

  const cleanHtml = (html) => {
    if (!html) return "";
    return html.replace(/<p><br><\/p>/g, "").trim();
  };

  const handleEdit = (task) => {
    const dateTime = getDateTime(task);

    setEditingId(task.id);
    setExpandedId(task.id);

    setForm({
      title: task.title || "",
      dueDate: dateTime ? dateTime.slice(0, 16) : "",
      priority: task.priority || "",
      status: task.status || "",
      assigned_to: task.assigned_to || "",
      description: stripHtml(task.description || ""),
    });
  };

  const handleChange = (field) => (e) => {
    setForm((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleSave = async (id) => {
    setSaving(true);

    await onUpdate?.(id, form);

    setSaving(false);
    setEditingId(null);
    setForm({});
  };

  return (
    <Stack spacing={2}>
      {activities.map((task) => {
        const isExpanded = expandedId === task.id;
        const isEditing = editingId === task.id;

        const isOverdue =
          ["Open", "In Progress"].includes(task.status) &&
          getDateTime(task) &&
          dayjs(getDateTime(task)).isBefore(dayjs());

        console.log("task date:", getDateTime(task));
        console.log("now:", now);
        console.log("isOverdue:", isOverdue);
        return (
          <Accordion
            key={`${task.id}-${task.updated_at || task.dueDate || ""}`}
            expanded={isExpanded}
            onChange={() => setExpandedId(isExpanded ? null : task.id)}
          >
            {/* HEADER */}
            <AccordionSummary sx={{ px: 2 }}>
              <Box width="100%">
                <Box display="flex" alignItems="center">
                  <ExpandMoreIcon
                    sx={{
                      mr: 1,
                      transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
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
                      onDelete?.(task);
                    }}
                    sx={{ color: "red" }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>

                {/* CLOSED VIEW */}
                {!isExpanded && (
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
              {isEditing ? (
                <Stack spacing={2}>
                  <TextField
                    label="Task Name"
                    size="small"
                    value={form.title}
                    onChange={handleChange("title")}
                  />

                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Box sx={{ display: "flex", gap: 1 }}>
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
                                ? `${date}T${
                                    prev.dueDate.split("T")[1] || "00:00"
                                  }`
                                : `${date}T00:00`,
                            }));
                          }}
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
                  >
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
                  >
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
                  >
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
