import { useEffect, useState } from "react";
import { fetchDeals } from "../../store/DealSlice";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchLeadById,
  updateLead,
  addActivity,
  removeActivity,
  updateActivity,
  addAttachment,
  removeAttachment,
  sendLeadEmail,
} from "../../store/LeadSlice";
import { convertLead } from "../../store/LeadSlice";
import {
  Box,
  Stack,
  Paper,
  InputBase,
  Button,
  TextField,
  MenuItem,
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import LeadDetailsTabsGenerator from "../../components/detailPage/tabs/leadDetails/LeadDetailsTabsGenerator";
import { generateQuickActions } from "../../components/detailPage/QuickActions/GenerateQuickActions";
import LeftSidebar from "../../components/detailPage/LeftSideBar";
import RightPanel from "../../components/detailPage/RightPanel";
import CustomTabs from "../../components/detailPage/tabs/leadDetails/LeadCustomTabs";
import NoteDrawer from "../../components/detailPage/drawers/NoteDrawer";
import EmailDrawer from "../../components/detailPage/drawers/EmailDrawer";
import CallDrawer from "../../components/detailPage/drawers/CallDrawer";
import TaskDrawer from "../../components/detailPage/drawers/TaskDrawer";
import MeetingDrawer from "../../components/detailPage/drawers/MeetingDrawer";
import CreateEditLead from "../../components/listPage/drawers/CreateEditDrawer";
import AppSnackbar from "../../components/common/AppSnackbar";
import ConfirmationDialog from "../../components/common/ConfirmationDialog";

import {
  mapLeadToSidebarProfile,
  mapLeadToSidebarInfo,
} from "./mappingAdapters/LeadAdapter";
import {
  normalizeActivity,
  formatActivityForApi,
} from "../../utils/activityAdapter";
export default function LeadDetails() {
  const { id } = useParams();
  console.log("ID 👉", id);
  const dispatch = useDispatch();

  const { currentLead, loading, error } = useSelector((state) => state.lead);

  const lead = currentLead;
  const [currentTab, setCurrentTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [noteOpen, setNoteOpen] = useState(false);
  const [emailOpen, setEmailOpen] = useState(false);
  const [callOpen, setCallOpen] = useState(false);
  const [taskOpen, setTaskOpen] = useState(false);
  const [meetingOpen, setMeetingOpen] = useState(false);
  const [editLeadOpen, setEditLeadOpen] = useState(false);
  const [convertOpen, setConvertOpen] = useState(false);
  // -----------------------------
  // Snackbar state
  // -----------------------------
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const showSnackbar = (message, severity = "success") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };
  // -----------------------------
  // Delete confirmation state
  // -----------------------------
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [activityToDelete, setActivityToDelete] = useState(null);
  const [dealForm, setDealForm] = useState({
    dealName: "",
    dealStage: "New",
    amount: "",
    dealOwner: "",
    closeDate: null,
    priority: "",
  });

  const handleInfoUpdate = async (formData) => {
    if (!lead?.id) return;

    const allowedFields = {
      firstName: formData.firstName ?? lead.firstName,
      lastName: formData.lastName ?? lead.lastName,
      email: formData.email ?? lead.email,
      phone: formData.phone ?? lead.phone,
      city: formData.city ?? lead.city,
      company: formData.company ?? lead.company,
      jobTitle: formData.jobTitle ?? lead.jobTitle,
      contactOwner: formData.contactOwner ?? lead.contactOwner,
      leadStatus: formData.leadStatus ?? lead.leadStatus,
      source: formData.source ?? lead.source,
      priority: formData.priority ?? lead.priority,
      value: formData.value ?? lead.value,
    };

    const resultAction = await dispatch(
      updateLead({
        id: lead.id,
        updatedData: allowedFields,
      }),
    );

    if (updateLead.fulfilled.match(resultAction)) {
      showSnackbar("Lead updated successfully", "success");
      dispatch(fetchLeadById(lead.id));
    } else {
      showSnackbar(
        resultAction.payload ||
          resultAction.error?.message ||
          "Failed to update lead",
        "error",
      );
    }
  };

  const handleConvertSave = async () => {
    if (!lead?.id) return;

    const payload = {
      deal_name: dealForm.dealName,
      deal_owner: dealForm.dealOwner,
      deal_stage: dealForm.dealStage,
      amount: dealForm.amount,
      close_date: dealForm.closeDate
        ? dealForm.closeDate.format("YYYY-MM-DD")
        : null,
      priority: dealForm.priority,
    };

    const result = await dispatch(
      convertLead({
        id: lead.id,
        data: payload,
      }),
    );

    if (convertLead.fulfilled.match(result)) {
      showSnackbar("Lead converted successfully!", "success");

      dispatch(fetchDeals());
      dispatch(fetchLeadById(lead.id));

      setConvertOpen(false);
    } else {
      showSnackbar("Conversion failed", "error");
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setActivityToDelete(null);
  };

  const handleSendEmailActivity = async (emailData) => {
    if (!lead?.id) return;

    const resultAction = await dispatch(
      sendLeadEmail({
        leadId: lead.id,
        emailData: {
          ...emailData,
        },
      }),
    );

    if (sendLeadEmail.fulfilled.match(resultAction)) {
      dispatch(fetchLeadById(lead.id));
      showSnackbar("Email sent & activity recorded!", "success");
      setEmailOpen(false);
    } else {
      showSnackbar(resultAction.payload || "Failed to send email", "error");
    }
  };

  const handleAddActivity = async (activityData) => {
    if (!lead?.id) return;

    const fixedActivity = formatActivityForApi(activityData);

    const resultAction = await dispatch(
      addActivity({
        leadId: lead.id,
        activity: fixedActivity,
      }),
    );

    if (addActivity.fulfilled.match(resultAction)) {
      dispatch(fetchLeadById(lead.id));
      showSnackbar("Activity added", "success");
    }
  }; // ✅ CLOSE HERE
  // -----------------------------
  // Confirm delete handler
  // -----------------------------

  const handleConfirmDelete = async () => {
    if (!activityToDelete) {
      setDeleteDialogOpen(false);
      return;
    }

    try {
      const resultAction =
        await // dispatch(removeActivity(activityToDelete.pk));
        dispatch(
          removeActivity({
            id: activityToDelete.id,
            type: activityToDelete.type,
          }),
        );

      if (removeActivity.fulfilled.match(resultAction)) {
        showSnackbar("Activity deleted successfully", "success");
        dispatch(fetchLeadById(lead.id));
      } else {
        showSnackbar(
          resultAction.payload ||
            resultAction.error?.message ||
            "Failed to delete activity",
          "error",
        );
      }
    } catch {
      showSnackbar("Failed to delete activity", "error");
    } finally {
      setDeleteDialogOpen(false);
      setActivityToDelete(null);
    }
  };

  const handleEditActivity = async (activity) => {
    if (!lead?.id) return;

    // const normalized = formatActivityForApi(activity);

    // const result = await dispatch(
    //   updateActivity({
    //     id: normalized.id,
    //     activity: normalized,
    //   }),
    // );

    const normalized = formatActivityForApi(activity);

    const result = await dispatch(
      updateActivity({
        id: activity.id, // preserve original id
        activity: {
          ...normalized,
          id: activity.id,
        },
      }),
    );

    // if (updateActivity.fulfilled.match(result)) {
    //   showSnackbar("Activity updated successfully", "success");
    //   dispatch(fetchLeadById(lead.id));
    // } else {
    //   showSnackbar("Failed to update activity", "error");
    // }
    if (updateActivity.fulfilled.match(result)) {
      showSnackbar("Activity updated successfully", "success");

      const updated = result.payload;

      // 🔥 LOCAL STATE UPDATE (instant UI)
      dispatch({
        type: "lead/updateActivityLocal",
        payload: updated,
      });

      // 🔄 optional (sync with backend)
      dispatch(fetchLeadById(lead.id));
    }
  };
  const handleDeleteActivity = async (activityOrId, explicitType = null) => {
    if (!lead?.id) return;

    const id =
      typeof activityOrId === "object" ? activityOrId.id : activityOrId;

    const type =
      explicitType ||
      (typeof activityOrId === "object" ? activityOrId.type : "task");

    const result = await dispatch(
      removeActivity({
        id,
        type,
      }),
    );

    if (removeActivity.fulfilled.match(result)) {
      showSnackbar("Activity deleted successfully", "success");
      dispatch(fetchLeadById(lead.id));
    } else {
      showSnackbar("Failed to delete activity", "error");
    }
  };

  const handleAddAttachment = async (file) => {
    if (!lead?.id) return;

    const result = await dispatch(
      addAttachment({
        leadId: lead.id,
        attachment: file,
      }),
    );

    if (addAttachment.fulfilled.match(result)) {
      dispatch(fetchLeadById(lead.id)); // ✅
    }
  };

  const handleDeleteAttachment = async (attachmentId) => {
    if (!lead?.id) return;

    const result = await dispatch(removeAttachment(attachmentId));

    if (removeAttachment.fulfilled.match(result)) {
      dispatch(fetchLeadById(lead.id));
      showSnackbar("Attachment deleted", "success");
    } else {
      showSnackbar("Failed to delete attachment", "error");
    }
  };

  useEffect(() => {
    dispatch(fetchLeadById(id));
  }, [dispatch, id]);

  if (loading) return <Box p={2}>Loading...</Box>;
  if (error || !lead) return <Box p={2}>Lead not found</Box>;

  // Sidebar info
  // Prepare profile
  const profile = mapLeadToSidebarProfile(lead);

  // Info section
  const info = mapLeadToSidebarInfo(lead);

  const confirmDeleteActivity = (activity) => {
    if (!activity) return;

    setActivityToDelete(activity); // store full activity
    setDeleteDialogOpen(true); // open dialog
  };

  // ✅ FIRST define this
  const handleUpdateTask = async (id, data) => {
    if (!lead?.id) return;

    const payload = formatActivityForApi({
      ...data,
      type: "task",
      id,
    });

    const result = await dispatch(
      updateActivity({
        id,
        activity: payload,
      }),
    );

    if (updateActivity.fulfilled.match(result)) {
      showSnackbar("Task updated", "success");
      dispatch(fetchLeadById(lead.id)); // ✅
    } else {
      showSnackbar("Failed to update task", "error");
    }
  };

  // ✅ THEN handlers
  const handlers = {
    onNote: () => setNoteOpen(true),
    onEmail: () => setEmailOpen(true),
    onCall: () => setCallOpen(true),
    onTask: () => setTaskOpen(true),
    onMeeting: () => setMeetingOpen(true),

    onUpdateTask: handleUpdateTask, // ✅ now no error
  };
  const quickActions = generateQuickActions(handlers);

  const activities = (lead?.activities || [])
    .map(normalizeActivity)
    .sort(
      (a, b) =>
        new Date(b.created_at || b.createdDate) -
        new Date(a.created_at || a.createdDate),
    );
const filteredActivities = activities.filter((activity) => {
  const search = searchTerm.toLowerCase();

  return (
    activity.title?.toLowerCase().includes(search) ||
    activity.description?.toLowerCase().includes(search) ||
    activity.body?.toLowerCase().includes(search) ||
    activity.notes?.toLowerCase().includes(search) ||
    activity.subject?.toLowerCase().includes(search) ||
    activity.assigned_to?.toLowerCase().includes(search) ||
    activity.type?.toLowerCase().includes(search)
  );
});
  // const categorizedActivities = {
  //   notes: activities.filter((a) => a.type?.toLowerCase().includes("note")),
  //   // emails: activities.filter((a) =>
  //   //   a.type?.toLowerCase().includes("email")
  //   // ),
  //   emails: activities.filter(
  //     (a) => a.type && a.type.toLowerCase() === "email",
  //   ),
  //   calls: activities.filter((a) => a.type?.toLowerCase().includes("call")),
  //   tasks: activities.filter((a) => a.type?.toLowerCase().includes("task")),
  //   meetings: activities.filter((a) =>
  //     a.type?.toLowerCase().includes("meeting"),
  //   ),
  // };

  const categorizedActivities = {
  notes: filteredActivities.filter((a) =>
    a.type?.toLowerCase().includes("note"),
  ),

  emails: filteredActivities.filter(
    (a) => a.type && a.type.toLowerCase() === "email",
  ),

  calls: filteredActivities.filter((a) =>
    a.type?.toLowerCase().includes("call"),
  ),

  tasks: filteredActivities.filter((a) =>
    a.type?.toLowerCase().includes("task"),
  ),

  meetings: filteredActivities.filter((a) =>
    a.type?.toLowerCase().includes("meeting"),
  ),
};

  const tabs = LeadDetailsTabsGenerator(categorizedActivities, {
    onNote: () => setNoteOpen(true),
    onEmail: () => setEmailOpen(true),
    onCall: () => setCallOpen(true),
    onTask: () => setTaskOpen(true),
    onMeeting: () => setMeetingOpen(true),

    onEditActivity: handleEditActivity,
    onDeleteActivity: confirmDeleteActivity,
    onUpdateTask: handleUpdateTask,
  });

  console.log("ALL ACTIVITIES 👉", activities);
  console.log("EMAILS 👉", categorizedActivities.emails);
  return (
    <Box sx={{ display: "flex", height: "100vh", gap: 1, p: 1 }}>
      {/* LEFT SIDEBAR */}

      <LeftSidebar
        header="Leads"
        profile={profile}
        quickActions={quickActions}
        info={info}
        infoHeader="About this lead"
        onSaveInfo={handleInfoUpdate}
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
        {/* Topbar */}
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
            {/* <InputBase placeholder="Search activities..." fullWidth /> */}
            <InputBase
  placeholder="Search activities..."
  fullWidth
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
/>
          </Paper>
          {lead.leadStatus === "Qualified" && (
            <Button
              variant="contained"
              sx={{ width: 120, textTransform: "none" }}
              onClick={() => {
                setDealForm({
                  dealName: `${lead.firstName} ${lead.lastName}`,
                  dealOwner: lead.contactOwner,
                  dealStage: "New",
                  amount: "",
                  closeDate: null,
                  priority: "",
                });

                setConvertOpen(true);
              }}
            >
              Convert
            </Button>
          )}
        </Stack>

        {/* Tabs */}
        <CustomTabs
          tabs={tabs}
          currentTab={currentTab}
          onTabChange={setCurrentTab}
        />

        {/* Drawers */}

        <NoteDrawer
          open={noteOpen}
          onClose={() => setNoteOpen(false)}
          onSave={(activityData) => handleAddActivity(activityData)}
        />
        <CallDrawer
          open={callOpen}
          onClose={() => setCallOpen(false)}
          onSave={(activityData) => handleAddActivity(activityData)}
        />
        <TaskDrawer
          open={taskOpen}
          onClose={() => setTaskOpen(false)}
          onSave={(activityData) => handleAddActivity(activityData)}
        />
        <EmailDrawer
          open={emailOpen}
          onClose={() => setEmailOpen(false)}
          onSave={handleSendEmailActivity}
          defaultEmail={lead?.email}
        />
        <MeetingDrawer
          open={meetingOpen}
          onClose={() => setMeetingOpen(false)}
          onSave={(activityData) => handleAddActivity(activityData)}
        />
        <CreateEditLead
          open={editLeadOpen}
          onClose={() => setEditLeadOpen(false)}
          lead={lead}
        />
        <CreateEditLead
          open={convertOpen}
          onClose={() => setConvertOpen(false)}
          title="Convert Lead"
          onSave={handleConvertSave}
        >
          <Stack spacing={2}>
            <TextField
              label="First Name"
              fullWidth
              value={lead.firstName || ""}
              disabled
              sx={{
                "& .MuiInputBase-input.Mui-disabled": {
                  WebkitTextFillColor: "black",
                  color: "black",
                },
              }}
            />

            <TextField
              label="Lead Status"
              value="Qualified"
              fullWidth
              disabled
              sx={{
                "& .MuiInputBase-input.Mui-disabled": {
                  WebkitTextFillColor: "black",
                  color: "black",
                },
              }}
            />
          </Stack>
          <Stack spacing={2} sx={{ mt: 2 }}>
            {/* Deal Name */}
            <TextField
              label="Deal Name"
              fullWidth
              value={dealForm.dealName}
              onChange={(e) =>
                setDealForm({ ...dealForm, dealName: e.target.value })
              }
            />

            {/* Deal Stage */}
            <TextField
              select
              label="Deal Stage"
              fullWidth
              value={dealForm.dealStage}
              onChange={(e) =>
                setDealForm({ ...dealForm, dealStage: e.target.value })
              }
            >
              <MenuItem value="Contact">Contact</MenuItem>
              <MenuItem value="Qualified">Qualified</MenuItem>
              <MenuItem value="Proposal">Proposal</MenuItem>
              <MenuItem value="Negotiation">Negotiation</MenuItem>
              <MenuItem value="Closed Won">Closed Won</MenuItem>
              <MenuItem value="Closed Lost">Closed Lost</MenuItem>
            </TextField>

            {/* Amount */}
            <TextField
              label="Amount"
              fullWidth
              value={dealForm.amount}
              onChange={(e) =>
                setDealForm({ ...dealForm, amount: e.target.value })
              }
            />

            {/* Deal Owner */}
            <TextField
              select
              label="Deal Owner"
              fullWidth
              value={dealForm.dealOwner}
              onChange={(e) =>
                setDealForm({ ...dealForm, dealOwner: e.target.value })
              }
            >
              <MenuItem value="">Choose</MenuItem>
              <MenuItem value="Jane Cooper">Jane Cooper</MenuItem>
              <MenuItem value="Wade Warren">Wade Warren</MenuItem>
              <MenuItem value="Robert Fox">Robert Fox</MenuItem>
            </TextField>

            {/* Close Date + Priority */}
            <Stack direction="row" spacing={2}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Close Date"
                  value={dealForm.closeDate}
                  onChange={(value) =>
                    setDealForm({ ...dealForm, closeDate: value })
                  }
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </LocalizationProvider>

              <TextField
                select
                label="Priority"
                fullWidth
                value={dealForm.priority}
                onChange={(e) =>
                  setDealForm({ ...dealForm, priority: e.target.value })
                }
              >
                <MenuItem value="">Choose</MenuItem>
                <MenuItem value="Low">Low</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="High">High</MenuItem>
              </TextField>
            </Stack>
          </Stack>
        </CreateEditLead>
      </Box>

      {/* RIGHT PANEL */}
      <RightPanel
        title="AI Lead Summary"
        // aiSummary={lead.aiSummary}
        // attachments={lead.attachments || []}
        aiSummary={currentLead?.aiSummary}
        attachments={currentLead?.attachments || []}
        onAddAttachment={handleAddAttachment}
        onDeleteAttachment={handleDeleteAttachment}
      />
      {/* ---------------------------
              Snackbar & Confirmation
              --------------------------- */}
      <AppSnackbar
        open={snackbarOpen}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
        severity={snackbarSeverity}
      />
      <ConfirmationDialog
        open={deleteDialogOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Delete Actiivty"
        message={`Are you sure you want to delete this activity? This action cannot be undone.`}
        confirmText="Delete"
        confirmColor="error"
      />
    </Box>
  );
}
