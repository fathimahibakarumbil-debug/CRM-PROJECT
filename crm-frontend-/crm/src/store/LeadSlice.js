import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import {
  getLeads as fetchLeadsApi,
  createLead as createLeadApi,
  deleteLead as deleteLeadApi,
  getLeadById as fetchLeadByIdApi,
  updateLead as updateLeadApi,
  addLeadActivity as addLeadActivityApi,
  updateLeadActivity as updateActivityApi,
  deleteLeadActivity as deleteActivityApi,
  uploadLeadAttachment as addLeadAttachmentApi,
  deleteLeadAttachment,
  convertLeadApi,
  sendLeadEmailApi,
} from "../services/leadService";
import { normalizeActivity } from "../utils/activityAdapter";
// import * as emailService from "../services/emailService";
import { addDeal } from "./DealSlice";
// ----------------------------
// Lead Thunks with rejectWithValue
// ----------------------------

export const fetchLeads = createAsyncThunk(
  "lead/fetchLeads",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchLeadsApi();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch leads",
      );
    }
  },
);

export const createLead = createAsyncThunk(
  "lead/createLead",
  async (newLead, { rejectWithValue }) => {
    try {
      const response = await createLeadApi(newLead);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create lead",
      );
    }
  },
);

export const removeLead = createAsyncThunk(
  "lead/removeLead",
  async (leadId, { rejectWithValue }) => {
    try {
      await deleteLeadApi(leadId);
      return leadId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete lead",
      );
    }
  },
);

export const updateLead = createAsyncThunk(
  "lead/updateLead",
  async ({ id, updatedData }, thunkAPI) => {
    try {
      const response = await updateLeadApi(id, updatedData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to update lead",
      );
    }
  },
);
export const fetchLeadById = createAsyncThunk(
  "lead/fetchLeadById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetchLeadByIdApi(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch lead",
      );
    }
  },
);

// ----------------------------
// Activity Thunks
// ----------------------------

export const addActivity = createAsyncThunk(
  "lead/addActivity",
  async ({ leadId, activity }, { rejectWithValue }) => {
    try {
      const response = await addLeadActivityApi(leadId, activity);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to add activity");
    }
  },
);

export const updateActivity = createAsyncThunk(
  "lead/updateActivity",
  async ({ id, activity }, { rejectWithValue }) => {
    try {
      const response = await updateActivityApi(id, activity);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to update activity",
      );
    }
  },
);

export const removeActivity = createAsyncThunk(
  "lead/removeActivity",
  async ({ id, type }, { rejectWithValue }) => {
    try {
      await deleteActivityApi(id, type);
      return id;
    } catch {
      return rejectWithValue("Failed to delete activity");
    }
  },
);
// ----------------------------
// Attachment Thunks
// ----------------------------

export const convertLead = createAsyncThunk(
  "lead/convertLead",
  async ({ id, data }, { dispatch, rejectWithValue }) => {
    try {
      const res = await convertLeadApi(id, data);

      // ✅ add deal instantly to deal store
      dispatch(addDeal(res.data));

      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  },
);

export const addAttachment = createAsyncThunk(
  "lead/addAttachment",
  async ({ leadId, attachment }, { rejectWithValue }) => {
    try {
      // ✅ send FILE only
      const response = await addLeadAttachmentApi(leadId, attachment);

      return {
        leadId,
        attachment: response.data,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add attachment",
      );
    }
  },
);

export const removeAttachment = createAsyncThunk(
  "lead/removeAttachment",
  async (attachmentId) => {
    // await deleteAttachment(attachmentId);
    await deleteLeadAttachment(attachmentId);
    return attachmentId;
  },
);

//EmailServcie
// export const sendLeadEmail = createAsyncThunk(
//   "lead/sendLeadEmail",
//   async ({ leadId, emailData }, { rejectWithValue }) => {
//     try {
//       const activity = await emailService.sendEmail({
//         ...emailData,
//         moduleType: "Lead",
//       });

//       const savedActivity = await addLeadActivityApi(leadId, activity);

//       return { leadId, activity: savedActivity.data };
//     } catch (err) {
//       return rejectWithValue(err.message);
//     }
//   },
// );

export const sendLeadEmail = createAsyncThunk(
  "lead/sendLeadEmail",
  async ({ leadId, emailData }, { rejectWithValue }) => {
    try {
      const response = await sendLeadEmailApi(leadId, {
        subject: emailData.subject,
        body: emailData.body,
        to_email: emailData.to_email,
        cc: emailData.cc || [],
        bcc: emailData.bcc || [],
      });

      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to send email",
      );
    }
  },
);
// ----------------------------
// Lead Slice
// ----------------------------
const leadSlice = createSlice({
  name: "lead",
  initialState: {
    items: [],
    currentLead: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Leads

      .addCase(convertLead.fulfilled, (state, action) => {
        const convertedId = action.meta.arg.id;

        if (state.currentLead?.id === convertedId) {
          state.currentLead.leadStatus = "Converted";
        }

        const index = state.items.findIndex((l) => l.id === convertedId);

        if (index !== -1) {
          state.items[index].leadStatus = "Converted";
        }
      })

      .addCase(fetchLeads.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLeads.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchLeads.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      // Create Lead
      .addCase(createLead.pending, (state) => {
        state.loading = true;
      })

      .addCase(createLead.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
        state.loading = false;
      })

      .addCase(createLead.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      // Remove Lead
      .addCase(removeLead.pending, (state) => {
        state.loading = true;
      })

      .addCase(removeLead.fulfilled, (state, action) => {
        // remove from list
        state.items = state.items.filter((l) => l.id !== action.payload);

        // ⭐ ALSO clear details page
        if (state.currentLead?.id === action.payload) {
          state.currentLead = null;
        }

        state.loading = false;
      })
      .addCase(removeLead.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      // Update Lead
      .addCase(updateLead.pending, (state) => {
        state.loading = true;
      })

      // .addCase(updateLead.fulfilled, (state, action) => {
      //   // const updated = action.payload;
      //   const updated = normalizeActivity(action.payload);

      //   // ✅ update list
      //   const index = state.items.findIndex((l) => l.id === updated.id);
      //   if (index !== -1) {
      //     state.items[index] = updated;
      //   }

      //   if (state.currentLead?.id === updated.id) {
      //     state.currentLead = {
      //       ...state.currentLead,
      //       firstName: updated.firstName,
      //       lastName: updated.lastName,
      //       email: updated.email,
      //       phone: updated.phone,
      //       leadStatus: updated.leadStatus,
      //       jobTitle: updated.jobTitle,
      //       createdDate: updated.createdDate,
      //       city: updated.city,
      //       company: updated.company,
      //       contactOwner: updated.contactOwner,
      //       source: updated.source,
      //       priority: updated.priority,
      //       value: updated.value,
      //       aiSummary: updated.aiSummary,
      //       attachments:
      //         updated.attachments || state.currentLead.attachments || [],
      //     };
      //   }

      //   state.loading = false;
      // })

      .addCase(updateLead.fulfilled, (state, action) => {
        state.loading = false;

        const updated = action.payload;

        const updatedLead = {
          id: updated.id,
          firstName: updated.first_name || updated.firstName,
          lastName: updated.last_name || updated.lastName,
          email: updated.email,
          phone: updated.phone,
          leadStatus:
            updated.status || updated.lead_status || updated.leadStatus,
          jobTitle: updated.job_title || updated.jobTitle,
          createdDate: updated.created_at || updated.createdDate,
          company: updated.company,
          city: updated.city,
          contactOwner: updated.contactOwner,
          source: updated.source,
          priority: updated.priority,
          value: updated.value,
          aiSummary: updated.aiSummary || updated.ai_summary,
          attachments: updated.attachments || [],
        };

        // ✅ update list
        const index = state.items.findIndex((l) => l.id === updatedLead.id);
        if (index !== -1) {
          state.items[index] = updatedLead;
        }

        // ✅ update current lead (IMPORTANT)
        if (state.currentLead?.id === updatedLead.id) {
          state.currentLead = {
            ...state.currentLead,
            ...updatedLead,
          };
        }
      })

      .addCase(updateLead.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      .addCase(fetchLeadById.fulfilled, (state, action) => {
        state.loading = false;

        const data = action.payload;

        const activities = (data.activities || []).map((a) => {
          const id = a.id || a.pk; // ⭐ normalize backend id

          return {
            ...a,
            id, // ⭐ force id always
            type: a.type?.toLowerCase(),
            uid: `${a.type}-${id}`,
          };
        });

        // state.currentLead = {
        //   id: data.id,

        //   firstName: data.first_name || data.firstName,
        //   lastName: data.last_name || data.lastName,

        //   email: data.email,
        //   phone: data.phone,

        //   leadStatus: data.status || data.lead_status || data.leadStatus,

        //   jobTitle: data.job_title || data.jobTitle,

        //   createdDate: data.created_at || data.createdDate,

        //   company: data.company,
        //   city: data.city,

        //   attachments: data.attachments || [],
        //   // aiSummary: data.ai_summary,
        //   aiSummary: data.aiSummary || data.ai_summary,

        //   activities,
        // };
        state.currentLead = {
          id: data.id,
          firstName: data.first_name || data.firstName,
          lastName: data.last_name || data.lastName,
          email: data.email,
          phone: data.phone,
          leadStatus: data.status || data.lead_status || data.leadStatus,
          jobTitle: data.job_title || data.jobTitle,
          createdDate: data.created_at || data.createdDate,
          company: data.company,
          city: data.city,
          attachments: data.attachments || [],
          aiSummary: data.aiSummary || data.ai_summary,

          activities,

          notes: activities.filter((a) => a.type === "note"),
          calls: activities.filter((a) => a.type === "call"),
          tasks: activities.filter((a) => a.type === "task"),
          meetings: activities.filter((a) => a.type === "meeting"),
          emails: activities.filter((a) => a.type === "email"),
        };
        console.log("LEAD OBJECT 👉", data);
      })

      // Activity cases
      .addCase(addActivity.pending, (state) => {
        state.loading = true;
      })

      .addCase(addActivity.fulfilled, (state, action) => {
        state.loading = false;

        if (!state.currentLead) return;

        const id = action.payload.id || action.payload.pk;

        const activity = {
          ...action.payload,
          // type: action.payload.type?.toLowerCase(),
          type: (
            action.payload.type ||
            action.meta.arg.activity.type ||
            ""
          ).toLowerCase(),

          uid: `${action.meta.arg.activity.type}-${id}`,
        };

        // state.currentLead.activities.unshift(activity);
        if (activity.type === "note") {
          state.currentLead.notes.unshift(activity);
        }
        if (activity.type === "call") {
          state.currentLead.calls.unshift(activity);
        }
        if (activity.type === "task") {
          state.currentLead.tasks.unshift(activity);
        }
        if (activity.type === "meeting") {
          state.currentLead.meetings.unshift(activity);
        }
        if (activity.type === "email") {
          state.currentLead.emails.unshift(activity);
        }
      })

      .addCase(addActivity.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

    



      .addCase(updateActivity.fulfilled, (state, action) => {
        state.loading = false;

        if (!state.currentLead) return;

        const updated = normalizeActivity(action.payload);

     
        // const mergeUpdated = (a) => {
        //   if (a.id !== updated.id) return a;

        //   return {
        //     ...a,
        //     ...updated,

        //     meeting_details:
        //       updated.type === "meeting"
        //         ? {
        //             ...a.meeting_details,
        //             ...updated.meeting_details,
        //           }
        //         : a.meeting_details,
        //   };
        // };

        const mergeUpdated = (a) => {
  if (a.id !== updated.id) return a;

  return {
    ...a,
    ...updated,

    // 🔥 FULL overwrite for meeting
    meeting_details:
      updated.type === "meeting"
        ? updated.meeting_details
        : a.meeting_details,
  };
};

        state.currentLead.activities =
          state.currentLead.activities.map(mergeUpdated);

        state.currentLead.notes = state.currentLead.notes.map(mergeUpdated);

        state.currentLead.calls = state.currentLead.calls.map(mergeUpdated);

        state.currentLead.tasks = state.currentLead.tasks.map(mergeUpdated);

        state.currentLead.meetings =
          state.currentLead.meetings.map(mergeUpdated);

        state.currentLead.emails = state.currentLead.emails.map(mergeUpdated);
      })

      .addCase(updateActivity.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      .addCase(removeActivity.fulfilled, (state, action) => {
        state.loading = false;

        if (!state.currentLead) return;

        const id = action.payload;

        const removeFn = (a) => a.id !== id;

        state.currentLead.activities =
          state.currentLead.activities.filter(removeFn);

        state.currentLead.notes = state.currentLead.notes.filter(removeFn);

        state.currentLead.calls = state.currentLead.calls.filter(removeFn);

        state.currentLead.tasks = state.currentLead.tasks.filter(removeFn);

        state.currentLead.meetings =
          state.currentLead.meetings.filter(removeFn);

        state.currentLead.emails = state.currentLead.emails.filter(removeFn);
      })

      .addCase(removeActivity.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      // Attachment cases
      .addCase(addAttachment.pending, (state) => {
        state.loading = true;
      })
      .addCase(addAttachment.fulfilled, (state, action) => {
        if (state.currentLead?.id === action.payload.leadId) {
          state.currentLead.attachments = state.currentLead.attachments || [];
          state.currentLead.attachments.push(action.payload.attachment);
        }
        state.loading = false;
      })
      .addCase(addAttachment.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      .addCase(removeAttachment.pending, (state) => {
        state.loading = true;
      })

      .addCase(removeAttachment.fulfilled, (state, action) => {
        state.currentLead.attachments = state.currentLead.attachments.filter(
          (att) => att.id !== action.payload,
        );
      })

      .addCase(removeAttachment.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      //Emailcservie
      .addCase(sendLeadEmail.pending, (state) => {
        state.loading = true;
      })

      // .addCase(sendLeadEmail.fulfilled, (state, action) => {
      //   state.loading = false;

      //   if (!state.currentLead) return;

      //   const activity = {
      //     ...action.payload.activity,
      //     type: "email",
      //     uid: `email-${action.payload.activity.id}`,
      //   };

      //   state.currentLead.activities.unshift(activity);
      // })

      //       .addCase(sendLeadEmail.fulfilled, (state, action) => {
      //   if (state.selectedLead) {
      //     if (!state.selectedLead.activities) {
      //       state.selectedLead.activities = [];
      //     }

      //     state.selectedLead.activities.unshift(action.payload);
      //   }
      // })

      .addCase(sendLeadEmail.fulfilled, (state, action) => {
        state.loading = false;

        if (!state.currentLead) return;

        const email = action.payload;

        const id = email.id || email.pk;

        const activity = {
          ...email,
          id,
          type: "email",
          uid: `email-${id}`,
        };

        // ✅ push into all required places
        state.currentLead.activities.unshift(activity);

        if (!state.currentLead.emails) {
          state.currentLead.emails = [];
        }

        state.currentLead.emails.unshift(activity);
      })

      .addCase(sendLeadEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default leadSlice.reducer;
