import NoteIcon from "@mui/icons-material/StickyNote2";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import EventIcon from "@mui/icons-material/Event";
import TaskIcon from "@mui/icons-material/Task";

export function generateQuickActions(handlers) {
  return [
    { icon: NoteIcon, label: "Note", onClick: handlers.onNote },
    { icon: EmailIcon, label: "Email", onClick: handlers.onEmail },
    { icon: PhoneIcon, label: "Call", onClick: handlers.onCall },
    { icon: EventIcon, label: "Meeting", onClick: handlers.onMeeting },
    { icon: TaskIcon, label: "Task", onClick: handlers.onTask },
  ];
}