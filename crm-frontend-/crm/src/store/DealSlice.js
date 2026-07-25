import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as DealService from "../services/DealService";
import { convertLeadApi } from "../services/leadService";
// ================= THUNKS =================

// GET ALL DEALS
export const fetchDeals = createAsyncThunk(
  "deals/fetchDeals",
  async (_, { rejectWithValue }) => {
    try {
      const res = await DealService.getDeals();
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

// GET SINGLE DEAL
export const fetchDealById = createAsyncThunk(
  "deals/fetchDealById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await DealService.getDealById(id);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

// ADD DEAL
export const addDeal = createAsyncThunk(
  "deals/addDeal",
  async (deal, { rejectWithValue }) => {
    try {
      const res = await DealService.createDeal(deal);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

// UPDATE DEAL
export const editDeal = createAsyncThunk(
  "deals/editDeal",
  async ({ id, updatedData }, { rejectWithValue }) => {
    try {
      const res = await DealService.updateDeal(id, updatedData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

// DELETE DEAL
export const removeDeal = createAsyncThunk(
  "deals/removeDeal",
  async (id, { rejectWithValue }) => {
    try {
      await DealService.deleteDeal(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

// ================= ACTIVITIES =================

// ADD ACTIVITY
export const addActivity = createAsyncThunk(
  "deals/addActivity",
  async ({ dealId, activity }, { rejectWithValue }) => {
    try {
      const res = await DealService.addDealActivity(dealId, activity);
      return { dealId, activity: res.data };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

// UPDATE ACTIVITY
export const updateActivity = createAsyncThunk(
  "deals/updateActivity",
  async ({ dealId, activity }, { rejectWithValue }) => {
    try {
      const res = await DealService.updateDealActivity(activity.id, activity);
      return { dealId, activity: res.data };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

// DELETE ACTIVITY

export const removeActivity = createAsyncThunk(
  "deals/removeActivity",
  async ({ dealId, activityId }, { rejectWithValue }) => {
    try {
      // ✅ send ONLY activityId
      await DealService.deleteDealActivity(activityId);

      return { dealId, activityId };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

// ================= ATTACHMENTS =================

// ADD ATTACHMENT

export const addAttachment = createAsyncThunk(
  "deals/addAttachment",
  async ({ dealId, attachment }, { rejectWithValue }) => {
    try {
      const res = await DealService.uploadDealAttachment(dealId, attachment);

      return { dealId, attachment: res.data };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

// DELETE ATTACHMENT

export const removeAttachment = createAsyncThunk(
  "deals/removeAttachment",
  async ({ dealId, attachmentId }, { rejectWithValue }) => {
    try {
      await DealService.deleteDealAttachment(attachmentId);

      return { dealId, attachmentId };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

export const convertLead = createAsyncThunk(
  "lead/convertLead",
  async ({ id, data }) => {
    const res = await convertLeadApi(id, data);
    return res.data;
  },
);

// ================= SLICE =================

const dealSlice = createSlice({
  name: "deal",
  initialState: {
    items: [],
    currentDeal: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      // FETCH DEALS
      .addCase(fetchDeals.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDeals.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.map((d) => ({
          id: d.id,
          dealName: d.deal_name,
          dealOwner: d.deal_owner,
          dealStage: d.deal_stage,
          lead: d.lead,
          leadStatus: d.lead_status,
          leadName: d.lead_name,
          amount: d.amount,
          closeDate: d.close_date,
          priority: d.priority,
          createdDate: d.created_at,
        }));
      })
      .addCase(fetchDeals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchDealById.fulfilled, (state, action) => {
        const d = action.payload;

        state.currentDeal = {
          id: d.id,
          dealName: d.deal_name,
          dealStage: d.deal_stage,
          dealOwner: d.deal_owner,
          leadQualified: d.lead_qualified,
          amount: d.amount,
          priority: d.priority,
          createdDate: d.created_at,
          email: d.email,
          activities: [...(d.activities || []), ...(d.emails || [])],
          attachments: d.attachments || [],
          aiSummary: d.ai_summary,
        };
      })

      // ADD DEAL
      .addCase(addDeal.fulfilled, (state, action) => {
        const d = action.payload;

        state.items.unshift({
          id: d.id,
          dealName: d.deal_name,
          dealOwner: d.deal_owner,
          dealStage: d.deal_stage,
          leadQualified: d.lead_qualified,
          amount: d.amount,
          closeDate: d.close_date,
          priority: d.priority,
          createdDate: d.created_at,
        });
      })

      .addCase(editDeal.fulfilled, (state, action) => {
        const d = action.payload;

        const updatedDeal = {
          id: d.id,
          dealName: d.deal_name,
          dealOwner: d.deal_owner,
          dealStage: d.deal_stage,
          leadQualified: d.lead_qualified,
          amount: d.amount,
          closeDate: d.close_date,
          priority: d.priority,
          createdDate: d.created_at,
          activities: d.activities || [],
          attachments: d.attachments || state.currentDeal?.attachments || [],
          aiSummary: d.ai_summary,
        };

        const index = state.items.findIndex((i) => i.id === d.id);
        if (index !== -1) {
          state.items[index] = updatedDeal;
        }

        if (state.currentDeal?.id === d.id) {
          state.currentDeal = updatedDeal;
        }
      })

      .addCase(removeDeal.fulfilled, (state, action) => {
        state.items = state.items.filter((deal) => deal.id !== action.payload);
      })

      // ACTIVITIES

      .addCase(addActivity.fulfilled, (state, action) => {
        const { dealId, activity } = action.payload;

        const mappedActivity = {
          ...activity,
          type: activity.type, // ✔️ FIXED HERE
          title: activity.title || "",
        };

        if (state.currentDeal?.id == dealId) {
          state.currentDeal.activities = [
            mappedActivity,
            ...(state.currentDeal.activities || []),
          ];
        }
      })

      .addCase(updateActivity.fulfilled, (state, action) => {
        const { dealId, activity } = action.payload;

        if (state.currentDeal?.id == dealId) {
          const idx = state.currentDeal.activities?.findIndex(
            (a) => a.id === activity.id,
          );

          if (idx !== -1) {
            state.currentDeal.activities[idx] = {
              ...state.currentDeal.activities[idx],
              ...activity,
              type: activity.type || state.currentDeal.activities[idx].type,
              title:
                activity.title ||
                activity.subject ||
                state.currentDeal.activities[idx].title,
            };
          }
        }
      })

      .addCase(removeActivity.fulfilled, (state, action) => {
        const { dealId, activityId } = action.payload;
        if (state.currentDeal?.id == dealId) {
          state.currentDeal.activities = state.currentDeal.activities.filter(
            (a) => a.id !== activityId,
          );
        }
      })

      // ATTACHMENTS
      .addCase(addAttachment.fulfilled, (state, action) => {
        const { dealId, attachment } = action.payload;
        if (state.currentDeal?.id == dealId) {
          state.currentDeal.attachments = [
            attachment,
            ...(state.currentDeal.attachments || []),
          ];
        }
      })

      .addCase(removeAttachment.fulfilled, (state, action) => {
        const { dealId, attachmentId } = action.payload;
        if (state.currentDeal?.id == dealId) {
          state.currentDeal.attachments = state.currentDeal.attachments.filter(
            (a) => a.id !== attachmentId,
          );
        }
      })
      .addCase(convertLead.pending, (state) => {
        state.loading = true;
      })

      .addCase(convertLead.fulfilled, (state) => {
        state.loading = false;
      })

      .addCase(convertLead.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default dealSlice.reducer;
