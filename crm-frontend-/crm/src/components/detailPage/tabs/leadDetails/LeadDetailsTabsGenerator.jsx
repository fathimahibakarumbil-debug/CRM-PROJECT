import { Stack, Button, Box } from "@mui/material";
import ActivityTab from "./tabs/LeadActivityTab";
import NotesTab from "./tabs/LeadNotesTab";
import TasksTab from "./tabs/LeadTasksTab";
import CallsTab from "./tabs/LeadCallsTab";
import EmailsTab from "./tabs/LeadEmailsTab";
import MeetingsTab from "./tabs/LeadMeetingsTab";

export default function LeadDetailsTabsGenerator(data, handlers) {
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
        type,
        description:
          item.description ||
          item.notes ||
          item.body ||
          item.title ||
          item.content ||
          "",
        raw: item,
      })),
    );
  };

  return [
    {
      label: "Activity",
      content: (
        <Stack spacing={2} mt={2}>
          {renderHeader("Activity")}
          <ActivityTab
            activities={generateActivityData(data)}
            onEdit={handlers.onEditActivity}
            onDelete={handlers.onDeleteActivity}
          />
        </Stack>
      ),
    },
    {
      label: "Notes",
      content: (
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
      content: (
        <Stack spacing={2} mt={2}>
          {renderHeader("Emails", handlers.onEmail, "Create Email")}
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
      content: (
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
      content: (
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
      content: (
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