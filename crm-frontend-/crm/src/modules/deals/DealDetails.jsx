import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchDealById,
  addActivity,
  removeActivity,
  updateActivity,
  addAttachment,
  removeAttachment,
} from "../../store/DealSlice";
import { Box, Stack, Paper, InputBase } from "@mui/material";

import LeftSidebar from "../../components/detailPage/LeftSideBar";
import RightPanel from "../../components/detailPage/RightPanel";
import CustomTabs from "../../components/detailPage/tabs/CustomTabs";

import { generateTabs } from "../../components/detailPage/tabs/GenerateTabs";
import { generateQuickActions } from "../../components/detailPage/QuickActions/GenerateQuickActions";

import NoteDrawer from "../../components/detailPage/drawers/NoteDrawer";
import EmailDrawer from "../../components/detailPage/drawers/EmailDrawer";
import CallDrawer from "../../components/detailPage/drawers/CallDrawer";
import TaskDrawer from "../../components/detailPage/drawers/TaskDrawer";
import MeetingDrawer from "../../components/detailPage/drawers/MeetingDrawer";

import AppSnackbar from "../../components/common/AppSnackbar";
import ConfirmationDialog from "../../components/common/ConfirmationDialog";
import { editDeal } from "../../store/DealSlice";
import {
  mapDealToSidebarProfile,
  mapDealToSidebarInfo,
} from "./mappingAdapters/DealAdapter";

export default function DealDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const {
    currentDeal: deal,
    loading,
    error,
  } = useSelector((state) => state.deal);

  const [search, setSearch] = useState("");
  const [currentTab, setCurrentTab] = useState(0);

  // drawers
  const [noteOpen, setNoteOpen] = useState(false);
  const [emailOpen, setEmailOpen] = useState(false);
  const [callOpen, setCallOpen] = useState(false);
  const [taskOpen, setTaskOpen] = useState(false);
  const [meetingOpen, setMeetingOpen] = useState(false);

  // snackbar
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const showSnackbar = (message, severity = "success") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  // delete dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [activityToDelete, setActivityToDelete] = useState(null);

  useEffect(() => {
    if (id) dispatch(fetchDealById(id));
  }, [dispatch, id]);

  if (loading) return <Box p={2}>Loading...</Box>;
  if (error || !deal) return <Box p={2}>Deal not found</Box>;

  const profile = mapDealToSidebarProfile(deal);
  const info = mapDealToSidebarInfo(deal);

  const handlers = {
    onNote: () => setNoteOpen(true),
    onEmail: () => setEmailOpen(true),
    onCall: () => setCallOpen(true),
    onTask: () => setTaskOpen(true),
    onMeeting: () => setMeetingOpen(true),
  };

  const quickActions = generateQuickActions(handlers);

  /* ---------------------------
      ACTIVITY HANDLERS
    ----------------------------*/

  const handleAddActivity = async (activityData) => {
    if (!deal?.id) return;

    const cleanedData = {
      ...activityData,
      type:
        activityData.type &&
        activityData.type.charAt(0).toUpperCase() +
          activityData.type.slice(1).toLowerCase(),
    };

    const result = await dispatch(
      addActivity({
        dealId: deal.id,
        activity: cleanedData,
      }),
    );

    if (addActivity.fulfilled.match(result)) {
      showSnackbar("Activity added successfully");
      dispatch(fetchDealById(deal.id)); // 🔥 MUST ADD
    } else showSnackbar("Failed to add activity", "error");

    setNoteOpen(false);
    setEmailOpen(false);
    setCallOpen(false);
    setTaskOpen(false);
    setMeetingOpen(false);
  };

  // const confirmDeleteActivity = (activityId) => {
  //   setActivityToDelete(activityId);
  //   setDeleteDialogOpen(true);
  // };
  const confirmDeleteActivity = (activityId) => {
    setActivityToDelete(activityId);
    setDeleteDialogOpen(true);
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setActivityToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!activityToDelete || !deal?.id) return;

    const result = await dispatch(
      removeActivity({
        dealId: deal.id,
        activityId: activityToDelete,
      }),
    );

    if (removeActivity.fulfilled.match(result)) {
      showSnackbar("Activity deleted successfully");
      dispatch(fetchDealById(deal.id));
    } else {
      showSnackbar("Delete failed", "error");
    }

    setDeleteDialogOpen(false);
    setActivityToDelete(null);
  };

  const handleEditActivity = async (updatedActivity) => {
    const result = await dispatch(
      updateActivity({
        dealId: deal.id,
        activity: updatedActivity,
      }),
    );

    if (updateActivity.fulfilled.match(result)) {
      showSnackbar("Activity updated successfully");

      await dispatch(fetchDealById(deal.id));
    } else {
      showSnackbar("Update failed", "error");
    }
  };

  const handleTaskUpdate = async (id, form) => {
    if (!deal?.id) return;

    const payload = {
      id: id,
      title: form.title,
      description: form.description,

      due_date: form.dueDate ? form.dueDate.split("T")[0] : null,

      due_time: form.dueDate ? form.dueDate.split("T")[1] : null,

      priority: form.priority,
      // type: form.type,
      type: "Task",
      assigned_to: form.assigned_to,
    };

    const result = await dispatch(
      updateActivity({
        dealId: deal.id,
        activity: payload,
      }),
    );

    if (updateActivity.fulfilled.match(result)) {
      showSnackbar("Task updated successfully");

      // 🔥 VERY IMPORTANT
      dispatch(fetchDealById(deal.id));
    } else {
      showSnackbar("Update failed", "error");
    }
  };

  const handleStageChange = async (stage) => {
    const result = await dispatch(
      editDeal({
        id: deal.id,
        updatedData: {
          deal_stage: stage,
        },
      }),
    );

    if (editDeal.fulfilled.match(result)) showSnackbar("Stage updated");
    else showSnackbar("Update failed", "error");
  };

  const handleInfoSave = async (formData) => {
    if (!deal?.id) return;

    const result = await dispatch(
      editDeal({
        id: deal.id,
        updatedData: {
          deal_owner: formData.owner ?? deal.dealOwner,
          priority: formData.priority ?? deal.priority,
        },
      }),
    );

    if (editDeal.fulfilled.match(result))
      showSnackbar("Deal info updated successfully");
    else showSnackbar("Failed to update deal info", "error");
  };
  /* ---------------------------
      ATTACHMENTS
    ----------------------------*/

  const handleAddAttachment = async (file) => {
    const result = await dispatch(
      addAttachment({
        dealId: deal.id,
        attachment: file,
      }),
    );

    if (addAttachment.fulfilled.match(result)) {
      dispatch(fetchDealById(deal.id));
      showSnackbar("Attachment uploaded");
    } else {
      showSnackbar("Upload failed", "error");
    }
  };

  const handleDeleteAttachment = async (attachmentId) => {
    const result = await dispatch(
      removeAttachment({
        dealId: deal.id,
        attachmentId,
      }),
    );

    if (removeAttachment.fulfilled.match(result)) {
      dispatch(fetchDealById(deal.id));
      showSnackbar("Attachment deleted");
    } else {
      showSnackbar("Delete failed", "error");
    }
  };

  /* ---------------------------
      ACTIVITIES
    ----------------------------*/

  const normalizeType = (a) => {
    const t = a.type || a.activity_type;

    if (t) {
      const value = String(t).toLowerCase().trim();

      if (value.includes("task")) return "task";
      if (value.includes("meeting")) return "meeting";
      if (value.includes("call")) return "call";
      if (value.includes("email")) return "email";
      if (value.includes("note")) return "note";
    }

    if (a.to_email) return "email"; // ✅ SAFE fallback

    if (a.due_date || a.dueDate) return "task";
    if (a.meeting_date || a.meeting_details) return "meeting";
    if (a.contact || a.call_type) return "call";

    return "note";
  };

  const activities = (deal?.activities ?? [])
    .map((a) => {
      const type = normalizeType(a);

      return {
        ...a,
        type,

        title: a.title || a.subject || a.task_name || a.name || "",

        description:
          a.description ||
          a.body ||
          a.meeting_details?.description ||
          a.notes ||
          "",

        /* ---------------- TASK ---------------- */
        dueDate: a.dueDate
          ? a.dueDate
          : a.due_date
            ? `${a.due_date}T${a.due_time || "00:00"}`
            : null,

        /* ---------------- MEETING FIX ---------------- */
        date:
          a.date ||
          a.meeting_date ||
          a.meeting_details?.date ||
          (a.start_time && a.meeting_date
            ? `${a.meeting_date}T${a.start_time}`
            : a.created_at),

        startTime:
          a.startTime || a.start_time || a.meeting_details?.startTime || null,

        endTime: a.endTime || a.end_time || a.meeting_details?.endTime || null,

        attendees: Array.isArray(a.attendees)
          ? a.attendees
          : a.participants
            ? a.participants.split(",").map((p) => p.trim())
            : [],

        location: a.location || a.meeting_location || "",

        /* ---------------- COMMON ---------------- */
        contact: a.connected || a.contact || a.contact_name || "",

        notes: a.notes ?? a.note ?? a.description ?? "",

        status: a.status || "",
        // outcome: a.outcome || a.status || "",
        outcome: a.outcome ?? a.status ?? "",

        callTime: a.call_time || a.date || a.created_at || "",
      };
    })

    .filter((a) => {
      const searchText = search.toLowerCase();

      return (
        (a.title || "").toLowerCase().includes(searchText) ||
        (a.description || "").toLowerCase().includes(searchText) ||
        (a.notes || "").toLowerCase().includes(searchText) ||
        (a.contact || "").toLowerCase().includes(searchText) ||
        (a.location || "").toLowerCase().includes(searchText) ||
        (a.status || "").toLowerCase().includes(searchText) ||
        (a.to_email || "").toLowerCase().includes(searchText)
      );
    });

  // ✅ IMPORTANT: categorize here
  const categorizedActivities = {
    notes: activities.filter((a) => a.type === "note"),
    emails: activities.filter((a) => a.type === "email"),
    calls: activities.filter((a) => a.type === "call"),
    tasks: activities.filter((a) => a.type === "task"),
    meetings: activities.filter((a) => a.type === "meeting"),
  };
  console.log("CATEGORIZED", categorizedActivities);

  console.log("DEAL ACTIVITIES RAW", deal?.activities);

  const tabs = generateTabs(categorizedActivities, {
    ...handlers,
    onEditActivity: handleEditActivity,
    onDeleteActivity: confirmDeleteActivity,

    // 🔥 ADD THIS
    onUpdateTask: handleTaskUpdate,
  });
  /* ---------------------------
      UI
    ----------------------------*/

  return (
    <Box sx={{ display: "flex", height: "100vh", gap: 1, p: 1 }}>
      {/* LEFT SIDEBAR */}

      <LeftSidebar
        header="Deals"
        profile={profile}
        quickActions={quickActions}
        info={info}
        infoHeader="About this deal"
        onSaveInfo={handleInfoSave}
        onStageChange={handleStageChange}
        showAvatar={false}
      />

      {/* CENTER CONTENT */}
      <Box
        sx={{
          flex: 1,
          bgcolor: "#f8f9fb",
          p: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Stack direction="row" spacing={1} mb={1}>
          <Paper
            sx={{
              flex: 1,
              p: "2px 8px",
              display: "flex",
              alignItems: "center",
              borderRadius: 1,
            }}
          >
            <InputBase
              placeholder="Search activities..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              fullWidth
            />
          </Paper>
        </Stack>

        <CustomTabs
          tabs={tabs}
          currentTab={currentTab}
          onTabChange={setCurrentTab}
        />
      </Box>

      {/* RIGHT PANEL */}
      <RightPanel
        title="AI Deal Summary"
        aiSummary={deal.aiSummary}
        attachments={deal.attachments || []}
        onAddAttachment={handleAddAttachment}
        onDeleteAttachment={handleDeleteAttachment}
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
      <EmailDrawer
        open={emailOpen}
        onClose={() => setEmailOpen(false)}
        onSave={handleAddActivity}
        // defaultEmail={deal?.email || deal?.lead?.email}
        defaultEmail={deal?.email || ""}
      />
      <TaskDrawer
        open={taskOpen}
        onClose={() => setTaskOpen(false)}
        onSave={handleAddActivity}
      />
      <MeetingDrawer
        open={meetingOpen}
        onClose={() => setMeetingOpen(false)}
        onSave={handleAddActivity}
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
