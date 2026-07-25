import { Stack, Button, Box } from "@mui/material";
import ActivityTab from "./tabContents/ActivityTab";
import NotesTab from "./tabContents/NotesTab";
import TasksTab from "./tabContents/TasksTab";
import CallsTab from "./tabContents/CallsTab";
import EmailsTab from "./tabContents/EmailsTab";
import MeetingsTab from "./tabContents/MeetingsTab";

export function generateTabs(data, handlers) {
  const renderHeader = (title, onClick, btnText) => (
    <Stack direction="row" justifyContent="space-between" alignItems="center">
      <Box>
        <strong>{title}</strong>
      </Box>

      {onClick && (
        <Button
          variant="contained"
          size="small"
          onClick={onClick}
          sx={{
            textTransform: "none",
            borderRadius: 2,
            px: 2,
            bgcolor: "#5b5bd6",
            "&:hover": { bgcolor: "#4747c7" },
          }}
        >
          {btnText}
        </Button>
      )}
    </Stack>
  );
  const generateActivityData = (data) => {
    return Object.entries(data).flatMap(([type, items]) =>
      (items || []).map((item) => ({
        id: item.id,
        // type,
        type: item.activityType,
        description:
          item.description || item.notes || item.body || item.title || "",
        raw: item,
      })),
    );
  };
  return [
    {
      label: "Activity",
      component: (
        <Stack spacing={2} mt={2}>
          {renderHeader("Activity")}
          <ActivityTab
            // activities={Object.values(data).flat()}
            activities={generateActivityData(data)}
            onEdit={handlers.onEditActivity}
            onDelete={handlers.onDeleteActivity}
          />
        </Stack>
      ),
    },
    {
      label: "Notes",
      component: (
        <Stack spacing={2} mt={2}>
          {renderHeader("Notes", handlers.onNote, "Create Note")}
          <NotesTab
            activities={data.notes}
            onEdit={handlers.onEditActivity}
            onDelete={handlers.onDeleteActivity}
          />
        </Stack>
      ),
    },
    {
      label: "Emails",
      component: (
        <Stack spacing={2} mt={2}>
          {renderHeader("Emails", handlers.onEmail, "Create Email")}{" "}
          <EmailsTab
            activities={data.emails}
            onEdit={handlers.onEditActivity}
            onDelete={handlers.onDeleteActivity}
          />
        </Stack>
      ),
    },
    {
      label: "Calls",
      component: (
        <Stack spacing={2} mt={2}>
          {renderHeader("Calls", handlers.onCall, "Log Call")}
          <CallsTab
            activities={data.calls}
            onEdit={handlers.onEditActivity}
            onDelete={handlers.onDeleteActivity}
          />
        </Stack>
      ),
    },
    {
      label: "Tasks",
      component: (
        <Stack spacing={2} mt={2}>
          {renderHeader("Tasks", handlers.onTask, "Create Task")}
          <TasksTab
            activities={data.tasks}
            onDelete={handlers.onDeleteActivity}
            onUpdate={handlers.onUpdateTask}
          />
        </Stack>
      ),
    },
    {
      label: "Meetings",
      component: (
        <Stack spacing={2} mt={2}>
          {renderHeader("Meetings", handlers.onMeeting, "Schedule Meeting")}
          <MeetingsTab
            activities={data.meetings}
            onEdit={handlers.onEditActivity}
            onDelete={handlers.onDeleteActivity}
          />
        </Stack>
      ),
    },
  ];
}
