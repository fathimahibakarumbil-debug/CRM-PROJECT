import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getTickets,
  getTicketById,
  createTicket,
  updateTicket,
  deleteTicket,
} from "../services/TicketService";

import { mapToBackend, mapToFrontend } from "../utils/ticketMapper";

// ================= FETCH ALL =================
export const fetchTickets = createAsyncThunk(
  "tickets/fetchTickets",
  async () => {
    const data = await getTickets();
    return data.map(mapToFrontend);
  },
);

// ================= FETCH ONE =================
export const fetchTicketById = createAsyncThunk(
  "tickets/fetchTicketById",
  async (id) => {
    const data = await getTicketById(id);
    return mapToFrontend(data);
  },
);

// ================= CREATE =================
export const addTicket = createAsyncThunk(
  "tickets/addTicket",
  async (ticket) => {
    const data = await createTicket(mapToBackend(ticket));
    return mapToFrontend(data);
  },
);

// ================= UPDATE =================
export const editTicket = createAsyncThunk(
  "tickets/editTicket",
  async ({ id, updatedData }) => {
    const data = await updateTicket(id, mapToBackend(updatedData));
    return mapToFrontend(data);
  },
);

// ================= DELETE =================
export const removeTicket = createAsyncThunk(
  "tickets/removeTicket",
  async (id) => {
    await deleteTicket(id);
    return id;
  },
);

// ================= ACTIVITIES =================
export const addActivity = createAsyncThunk(
  "ticket/addActivity",
  async ({ ticketId, activity }) => {
    const res = await fetch(`/api/tickets/${ticketId}/activities/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(activity),
    });
    return await res.json();
  },
);

export const updateActivity = createAsyncThunk(
  "ticket/updateActivity",
  async ({ ticketId, activityId, activity }) => {
    const res = await fetch(
      `/api/tickets/${ticketId}/activities/${activityId}/`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(activity),
      },
    );
    return await res.json();
  },
);

export const removeActivity = createAsyncThunk(
  "ticket/removeActivity",
  async ({ ticketId, activityId }) => {
    await fetch(`/api/tickets/${ticketId}/activities/${activityId}/`, {
      method: "DELETE",
    });
    return activityId;
  },
);

// ================= ATTACHMENTS =================
export const addAttachment = createAsyncThunk(
  "ticket/addAttachment",
  async ({ ticketId, attachment }) => {
    const formData = new FormData();
    formData.append("file", attachment);

    const res = await fetch(`/api/tickets/${ticketId}/attachments/`, {
      method: "POST",
      body: formData,
    });

    return await res.json();
  },
);

export const removeAttachment = createAsyncThunk(
  "ticket/removeAttachment",
  async ({ ticketId, attachmentId }) => {
    await fetch(`/api/tickets/${ticketId}/attachments/${attachmentId}/`, {
      method: "DELETE",
    });
    return attachmentId;
  },
);

// ================= SLICE =================
const ticketSlice = createSlice({
  name: "ticket",
  initialState: {
    items: [],
    currentTicket: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTickets.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTickets.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })

      .addCase(fetchTicketById.fulfilled, (state, action) => {
        state.currentTicket = action.payload;
      })

      .addCase(addTicket.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })

      .addCase(editTicket.fulfilled, (state, action) => {
        const index = state.items.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload;
      })

      .addCase(removeTicket.fulfilled, (state, action) => {
        state.items = state.items.filter((t) => t.id !== action.payload);
      })
      // ADD ACTIVITY
      .addCase(addActivity.fulfilled, (state, action) => {
        if (state.currentTicket) {
          state.currentTicket.activities.push(action.payload);
        }
      })

      // UPDATE ACTIVITY
      .addCase(updateActivity.fulfilled, (state, action) => {
        const activities = state.currentTicket?.activities || [];
        const index = activities.findIndex((a) => a.id === action.payload.id);
        if (index !== -1) activities[index] = action.payload;
      })

      // DELETE ACTIVITY
      .addCase(removeActivity.fulfilled, (state, action) => {
        if (state.currentTicket) {
          state.currentTicket.activities =
            state.currentTicket.activities.filter(
              (a) => a.id !== action.payload,
            );
        }
      })

      // ADD ATTACHMENT
      .addCase(addAttachment.fulfilled, (state, action) => {
        if (state.currentTicket) {
          state.currentTicket.attachments.push(action.payload);
        }
      })

      // DELETE ATTACHMENT
      .addCase(removeAttachment.fulfilled, (state, action) => {
        if (state.currentTicket) {
          state.currentTicket.attachments =
            state.currentTicket.attachments.filter(
              (a) => a.id !== action.payload,
            );
        }
      });
  },
});

export default ticketSlice.reducer;
