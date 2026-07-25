import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCompanyById,
  addActivity,
  updateCompany,
  removeActivity,
  updateActivity,
  addAttachment,
  removeAttachment,
} from "../../store/CompanySlice";

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

import {
  mapCompanyToSidebarProfile,
  mapCompanyToSidebarInfo,
} from "./mappingAdapters/CompanyAdapter";

export default function CompanyDetails() {
  const { id } = useParams();

  console.log("Company ID:", id);
  const dispatch = useDispatch();

  const [search, setSearch] = useState("");

  const { company, loading, error } = useSelector((state) => state.company);

  console.log("COMPANY DATA:", company);

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

  const showSnackbar = (message, severity = "success") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  useEffect(() => {
    if (id) {
      dispatch(fetchCompanyById(id));
    }
  }, [dispatch, id]);

  if (loading) return <Box p={2}>Loading...</Box>;
  if (error || !company) return <Box p={2}>Company not found</Box>;

  const profile = mapCompanyToSidebarProfile(company);
  const info = mapCompanyToSidebarInfo(company);

  const handlers = {
    onNote: () => setNoteOpen(true),
    onEmail: () => setEmailOpen(true),
    onCall: () => setCallOpen(true),
    onTask: () => setTaskOpen(true),
    onMeeting: () => setMeetingOpen(true),
  };

  const quickActions = generateQuickActions(handlers);

  const confirmDeleteActivity = (activityId) => {
    setActivityToDelete(activityId);
    setDeleteDialogOpen(true);
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setActivityToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!activityToDelete || !company?.id) {
      setDeleteDialogOpen(false);
      return;
    }

    // const resultAction = await dispatch(
    //   removeActivity({
    //     companyId: company.id,
    //     activityId: activityToDelete,
    //   }),
    // );
    const resultAction = await dispatch(
  removeActivity(activityToDelete)
);

    if (removeActivity.fulfilled.match(resultAction)) {
      showSnackbar("Activity deleted successfully", "success");
    } else {
      showSnackbar("Failed to delete activity", "error");
    }

    setDeleteDialogOpen(false);
    setActivityToDelete(null);
  };

  const handleEditActivity = async (updatedActivity) => {
    if (!company?.id) return;

    const resultAction = await dispatch(
      updateActivity({
        companyId: company.id,
        activityId: updatedActivity.id,
        activity: updatedActivity,
      }),
    );

    if (updateActivity.fulfilled.match(resultAction)) {
      showSnackbar("Activity updated successfully", "success");
    } else {
      showSnackbar(
        resultAction.payload ||
          resultAction.error?.message ||
          "Failed to update activity",
        "error",
      );
    }
  };

  const handleAddActivity = async (activityData) => {
    if (!company?.id) return;

    const resultAction = await dispatch(
      addActivity({
        companyId: company.id,
        activity: activityData,
      }),
    );

    if (addActivity.fulfilled.match(resultAction)) {
      showSnackbar("Activity added successfully");
    } else {
      showSnackbar("Failed to add activity", "error");
    }

    setNoteOpen(false);
    setCallOpen(false);
    setEmailOpen(false);
    setTaskOpen(false);
    setMeetingOpen(false);
  };
  const handleAddAttachment = async (file) => {
    const result = await dispatch(
      addAttachment({
        companyId: company.id,
        file,
      }),
    );

    if (addAttachment.fulfilled.match(result)) {
      showSnackbar("Attachment uploaded");
    } else {
      showSnackbar("Upload failed", "error");
    }
  };

  const handleDeleteAttachment = async (attachmentId) => {
    if (!company?.id) return;

    // const result = await dispatch(
    //   removeAttachment({
    //     companyId: company.id,
    //     attachmentId,
    //   }),
    // );
    const result = await dispatch(removeAttachment(attachmentId));

    if (removeAttachment.fulfilled.match(result)) {
      showSnackbar("Attachment deleted");
    } else {
      showSnackbar("Delete failed", "error");
    }
  };
const handleSaveCompanyInfo = async (data) => {
const result = await dispatch(
  updateCompany({
    id: company.id,
    data,
  })
);

if (updateCompany.fulfilled.match(result)) {
  showSnackbar("Company updated successfully");

  await dispatch(fetchCompanyById(company.id));
} else {
    showSnackbar("Failed to update company", "error");
  }
};

//   const activityData = {
//   notes: company.activities.filter((a) => a.content),
//   calls: company.activities.filter((a) => a.callTime),
//   emails: company.activities.filter((a) => a.subject),
//   tasks: company.activities.filter((a) => a.title),
//   meetings: company.activities.filter((a) => a.meetingTime),
// };


const activityData = {
  notes: company.activities.filter(
    (a) => a.activityType === "note"
  ),

  calls: company.activities.filter(
    (a) => a.activityType === "call"
  ),

  emails: company.activities.filter(
    (a) => a.activityType === "email"
  ),

  tasks: company.activities.filter(
    (a) => a.activityType === "task"
  ),

  meetings: company.activities.filter(
    (a) => a.activityType === "meeting"
  ),
};


const tabs = generateTabs(activityData, {
      ...handlers,
    onEditActivity: handleEditActivity,
    onDeleteActivity: confirmDeleteActivity,
  });

  return (
    <Box sx={{ display: "flex", height: "100vh", gap: 1, p: 1 }}>
      {/* LEFT SIDEBAR */}
      <LeftSidebar
        header="Companies"
        profile={profile}
        quickActions={quickActions}
        info={info}
        infoHeader="About this company"
          onSaveInfo={handleSaveCompanyInfo}

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
            />{" "}
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
        title="AI Company Summary"
        aiSummary={company.aiSummary}
        attachments={company.attachments || []}
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

      {/* DELETE CONFIRMATION */}
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
