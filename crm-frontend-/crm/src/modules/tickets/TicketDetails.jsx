// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// // import {
// //   fetchTicketById,
// //   addActivity,
// //   removeActivity,
// //   updateActivity,
// //   addAttachment,
// //   removeAttachment,
// // } from "../../store/TicketSlice";
// import {
//   fetchTicketById
// } from "../../store/TicketSlice";
// import { Box, Stack, Paper, InputBase } from "@mui/material";

// import { generateTabs } from "../../components/detailPage/tabs/GenerateTabs";
// import { generateQuickActions } from "../../components/detailPage/QuickActions/GenerateQuickActions";
// import LeftSidebar from "../../components/detailPage/LeftSideBar";
// import RightPanel from "../../components/detailPage/RightPanel";
// import CustomTabs from "../../components/detailPage/tabs/CustomTabs";
// import NoteDrawer from "../../components/detailPage/drawers/NoteDrawer";
// import EmailDrawer from "../../components/detailPage/drawers/EmailDrawer";
// import CallDrawer from "../../components/detailPage/drawers/CallDrawer";
// import TaskDrawer from "../../components/detailPage/drawers/TaskDrawer";
// import MeetingDrawer from "../../components/detailPage/drawers/MeetingDrawer";
// import AppSnackbar from "../../components/common/AppSnackbar";
// import ConfirmationDialog from "../../components/common/ConfirmationDialog";

// import {
//   mapTicketToSidebarProfile,
//   mapTicketToSidebarInfo,
// } from "./mappingAdapters/TicketAdapter";

// export default function TicketDetails() {
//   const { id } = useParams();
//   const dispatch = useDispatch();
//   const {
//     currentTicket: ticket,
//     loading,
//     error,
//   } = useSelector((state) => state.ticket);

//   const [currentTab, setCurrentTab] = useState(0);
//   const [noteOpen, setNoteOpen] = useState(false);
//   const [emailOpen, setEmailOpen] = useState(false);
//   const [callOpen, setCallOpen] = useState(false);
//   const [taskOpen, setTaskOpen] = useState(false);
//   const [meetingOpen, setMeetingOpen] = useState(false);

//   const [snackbarOpen, setSnackbarOpen] = useState(false);
//   const [snackbarMessage, setSnackbarMessage] = useState("");
//   const [snackbarSeverity, setSnackbarSeverity] = useState("success");

//   const showSnackbar = (message, severity = "success") => {
//     setSnackbarMessage(message);
//     setSnackbarSeverity(severity);
//     setSnackbarOpen(true);
//   };

//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [activityToDelete, setActivityToDelete] = useState(null);

//   const confirmDeleteActivity = (activityId) => {
//     setActivityToDelete(activityId);
//     setDeleteDialogOpen(true);
//   };

//   const handleCancelDelete = () => {
//     setDeleteDialogOpen(false);
//     setActivityToDelete(null);
//   };

//   const handleAddActivity = async (activityData) => {
//     if (!ticket?.id) return;

//     const resultAction = await dispatch(
//       addActivity({ ticketId: ticket.id, activity: activityData })
//     );

//     if (addActivity.fulfilled.match(resultAction)) {
//       dispatch(fetchTicketById(ticket.id));
//       showSnackbar("Activity added successfully", "success");
//     } else {
//       showSnackbar("Failed to add activity", "error");
//     }

//     setCallOpen(false);
//     setNoteOpen(false);
//     setTaskOpen(false);
//     setMeetingOpen(false);
//     setEmailOpen(false);
//   };

//   const handleConfirmDelete = async () => {
//     if (!activityToDelete || !ticket?.id) {
//       setDeleteDialogOpen(false);
//       return;
//     }

//     const resultAction = await dispatch(
//       removeActivity({ ticketId: ticket.id, activityId: activityToDelete })
//     );

//     if (removeActivity.fulfilled.match(resultAction)) {
//       showSnackbar("Activity deleted successfully", "success");
//     } else {
//       showSnackbar("Failed to delete activity", "error");
//     }
//     setDeleteDialogOpen(false);
//     setActivityToDelete(null);
//   };

//   const handleEditActivity = async (updatedActivity) => {
//     if (!ticket?.id) return;

//     const resultAction = await dispatch(
//       updateActivity({
//         ticketId: ticket.id,
//         activityId: updatedActivity.id,
//         activity: updatedActivity,
//       })
//     );

//     if (updateActivity.fulfilled.match(resultAction)) {
//       showSnackbar("Activity updated successfully", "success");
//     } else {
//       showSnackbar("Failed to update activity", "error");
//     }
//   };

//   const handleAddAttachment = async (file) => {
//     if (!ticket?.id) return;
//     await dispatch(addAttachment({ ticketId: ticket.id, attachment: file }));
//   };

//   const handleDeleteAttachment = async (attachmentId) => {
//     if (!ticket?.id) return;
//     await dispatch(removeAttachment({ ticketId: ticket.id, attachmentId }));
//   };

//   useEffect(() => {
//     dispatch(fetchTicketById(id));
//   }, [dispatch, id]);

//   if (loading) return <Box p={2}>Loading Ticket Details...</Box>;
//   if (error || !ticket) return <Box p={2}>Ticket not found</Box>;

//   const profileData = mapTicketToSidebarProfile(ticket);
//   const profile = { ...profileData, aiSummary: null };

//   const info = mapTicketToSidebarInfo(ticket);

//   const handlers = {
//     onNote: () => setNoteOpen(true),
//     onEmail: () => setEmailOpen(true),
//     onCall: () => setCallOpen(true),
//     onTask: () => setTaskOpen(true),
//     onMeeting: () => setMeetingOpen(true),
//   };

//   const quickActions = generateQuickActions(handlers);
//   const activities = ticket?.activities ?? [];

//   const tabs = generateTabs(activities, {
//     ...handlers,
//     onEditActivity: handleEditActivity,
//     onDeleteActivity: confirmDeleteActivity,
//   });

//   return (
//     <Box sx={{ display: "flex", height: "100vh", gap: 1, p: 1 }}>
//       <LeftSidebar
//         header="Tickets"
//         profile={profile}
//         quickActions={quickActions}
//         info={info}
//         infoHeader="About this Ticket"
//       />

//       <Box sx={{ flex: 1, bgcolor: "#f8f9fb", p: 1, display: "flex", flexDirection: "column" }}>
//         <Stack direction="row" spacing={1} mb={1}>
//           <Paper
//             component="form"
//             sx={{ flex: 1, p: "2px 8px", display: "flex", alignItems: "center", borderRadius: 1 }}
//           >
//             <InputBase placeholder="Search activities..." fullWidth />
//           </Paper>
//         </Stack>

//         <CustomTabs tabs={tabs} currentTab={currentTab} onTabChange={setCurrentTab} />

//         <NoteDrawer open={noteOpen} onClose={() => setNoteOpen(false)} onSave={handleAddActivity} />
//         <CallDrawer open={callOpen} onClose={() => setCallOpen(false)} onSave={handleAddActivity} />
//         <TaskDrawer open={taskOpen} onClose={() => setTaskOpen(false)} onSave={handleAddActivity} />
//         <EmailDrawer open={emailOpen} onClose={() => setEmailOpen(false)} onSave={handleAddActivity} />
//         <MeetingDrawer open={meetingOpen} onClose={() => setMeetingOpen(false)} onSave={handleAddActivity} />
//       </Box>

//       <RightPanel
//         title="AI Ticket Summary"
//         aiSummary={ticket.aiSummary}
//         attachments={ticket.attachments || []}
//         onAddAttachment={handleAddAttachment}
//         onDeleteAttachment={handleDeleteAttachment}
//       />

//       <AppSnackbar
//         open={snackbarOpen}
//         onClose={() => setSnackbarOpen(false)}
//         message={snackbarMessage}
//         severity={snackbarSeverity}
//       />
//       <ConfirmationDialog
//         open={deleteDialogOpen}
//         onClose={handleCancelDelete}
//         onConfirm={handleConfirmDelete}
//         title="Delete Activity"
//         message="Are you sure you want to delete this activity?"
//         confirmText="Delete"
//         confirmColor="error"
//       />
//     </Box>
//   );
// }

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

// ✅ FIX: import all required actions
import {
  fetchTicketById,
  addActivity,
  updateActivity,
  removeActivity,
  addAttachment,
  removeAttachment,
} from "../../store/TicketSlice";

import { Box, Stack, Paper, InputBase } from "@mui/material";

import { generateTabs } from "../../components/detailPage/tabs/GenerateTabs";
import { generateQuickActions } from "../../components/detailPage/QuickActions/GenerateQuickActions";

import LeftSidebar from "../../components/detailPage/LeftSideBar";
import RightPanel from "../../components/detailPage/RightPanel";
import CustomTabs from "../../components/detailPage/tabs/CustomTabs";

import NoteDrawer from "../../components/detailPage/drawers/NoteDrawer";
import EmailDrawer from "../../components/detailPage/drawers/EmailDrawer";
import CallDrawer from "../../components/detailPage/drawers/CallDrawer";
import TaskDrawer from "../../components/detailPage/drawers/TaskDrawer";
import MeetingDrawer from "../../components/detailPage/drawers/MeetingDrawer";

import AppSnackbar from "../../components/common/AppSnackbar";
import ConfirmationDialog from "../../components/common/ConfirmationDialog";

import {
  mapTicketToSidebarProfile,
  mapTicketToSidebarInfo,
} from "./mappingAdapters/TicketAdapter";

export default function TicketDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const {
    currentTicket: ticket,
    loading,
    error,
  } = useSelector((state) => state.ticket);

  // ---------------- STATE ----------------
  const [currentTab, setCurrentTab] = useState(0);

  const [noteOpen, setNoteOpen] = useState(false);
  const [emailOpen, setEmailOpen] = useState(false);
  const [callOpen, setCallOpen] = useState(false);
  const [taskOpen, setTaskOpen] = useState(false);
  const [meetingOpen, setMeetingOpen] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [activityToDelete, setActivityToDelete] = useState(null);

  // ---------------- HELPERS ----------------
  const showSnackbar = (message, severity = "success") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  // ---------------- ACTIVITY ----------------
  const handleAddActivity = async (activityData) => {
    if (!ticket?.id) return;

    const resultAction = await dispatch(
      addActivity({ ticketId: ticket.id, activity: activityData }),
    );

    if (addActivity.fulfilled.match(resultAction)) {
      dispatch(fetchTicketById(ticket.id));
      showSnackbar("Activity added successfully");
    } else {
      showSnackbar("Failed to add activity", "error");
    }

    // Close drawers
    setNoteOpen(false);
    setCallOpen(false);
    setTaskOpen(false);
    setMeetingOpen(false);
    setEmailOpen(false);
  };

  const handleEditActivity = async (updatedActivity) => {
    if (!ticket?.id) return;

    const resultAction = await dispatch(
      updateActivity({
        ticketId: ticket.id,
        activityId: updatedActivity.id,
        activity: updatedActivity,
      }),
    );

    if (updateActivity.fulfilled.match(resultAction)) {
      showSnackbar("Activity updated successfully");
    } else {
      showSnackbar("Failed to update activity", "error");
    }
  };

  const confirmDeleteActivity = (activityId) => {
    setActivityToDelete(activityId);
    setDeleteDialogOpen(true);
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setActivityToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!activityToDelete || !ticket?.id) return;

    const resultAction = await dispatch(
      removeActivity({
        ticketId: ticket.id,
        activityId: activityToDelete,
      }),
    );

    if (removeActivity.fulfilled.match(resultAction)) {
      showSnackbar("Activity deleted successfully");
    } else {
      showSnackbar("Failed to delete activity", "error");
    }

    setDeleteDialogOpen(false);
    setActivityToDelete(null);
  };

  // ---------------- ATTACHMENTS ----------------
  const handleAddAttachment = async (file) => {
    if (!ticket?.id) return;
    await dispatch(addAttachment({ ticketId: ticket.id, attachment: file }));
  };

  const handleDeleteAttachment = async (attachmentId) => {
    if (!ticket?.id) return;
    await dispatch(removeAttachment({ ticketId: ticket.id, attachmentId }));
  };

  // ---------------- EFFECT ----------------
  useEffect(() => {
    dispatch(fetchTicketById(id));
  }, [dispatch, id]);

  // ---------------- UI STATES ----------------
  if (loading) return <Box p={2}>Loading Ticket Details...</Box>;
  if (error || !ticket) return <Box p={2}>Ticket not found</Box>;

  // ---------------- DATA ----------------
  const profileData = mapTicketToSidebarProfile(ticket);
  const profile = { ...profileData, aiSummary: null };
  const info = mapTicketToSidebarInfo(ticket);

  const handlers = {
    onNote: () => setNoteOpen(true),
    onEmail: () => setEmailOpen(true),
    onCall: () => setCallOpen(true),
    onTask: () => setTaskOpen(true),
    onMeeting: () => setMeetingOpen(true),
  };

  const quickActions = generateQuickActions(handlers);
  const activities = ticket?.activities ?? [];

  const tabs = generateTabs(activities, {
    ...handlers,
    onEditActivity: handleEditActivity,
    onDeleteActivity: confirmDeleteActivity,
  });

  // ---------------- UI ----------------
  return (
    <Box sx={{ display: "flex", height: "100vh", gap: 1, p: 1 }}>
      {/* LEFT SIDEBAR */}
      <LeftSidebar
        header="Tickets"
        profile={profile}
        quickActions={quickActions}
        info={info}
        infoHeader="About this Ticket"
      />

      {/* CENTER */}
      <Box
        sx={{
          flex: 1,
          bgcolor: "#f8f9fb",
          p: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* SEARCH */}
        <Stack direction="row" spacing={1} mb={1}>
          <Paper
            component="form"
            sx={{
              flex: 1,
              p: "2px 8px",
              display: "flex",
              alignItems: "center",
              borderRadius: 1,
            }}
          >
            <InputBase placeholder="Search activities..." fullWidth />
          </Paper>
        </Stack>

        {/* TABS */}
        <CustomTabs
          tabs={tabs}
          currentTab={currentTab}
          onTabChange={setCurrentTab}
        />

        {/* DRAWERS */}
        <NoteDrawer
          open={noteOpen}
          onClose={() => setNoteOpen(false)}
          onSave={handleAddActivity}
        />
        <CallDrawer
          open={callOpen}
          onClose={() => setCallOpen(false)}
          onSave={handleAddActivity}
        />
        <TaskDrawer
          open={taskOpen}
          onClose={() => setTaskOpen(false)}
          onSave={handleAddActivity}
        />
        <EmailDrawer
          open={emailOpen}
          onClose={() => setEmailOpen(false)}
          onSave={handleAddActivity}
        />
        <MeetingDrawer
          open={meetingOpen}
          onClose={() => setMeetingOpen(false)}
          onSave={handleAddActivity}
        />
      </Box>

      {/* RIGHT PANEL */}
      <RightPanel
        title="AI Ticket Summary"
        aiSummary={ticket.aiSummary}
        attachments={ticket.attachments || []}
        onAddAttachment={handleAddAttachment}
        onDeleteAttachment={handleDeleteAttachment}
      />

      {/* SNACKBAR */}
      <AppSnackbar
        open={snackbarOpen}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
        severity={snackbarSeverity}
      />

      {/* DELETE CONFIRM */}
      <ConfirmationDialog
        open={deleteDialogOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Delete Activity"
        message="Are you sure you want to delete this activity?"
        confirmText="Delete"
        confirmColor="error"
      />
    </Box>
  );
}
