import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchNotifications } from "../services/notificationService";

export const getNotifications = createAsyncThunk(
  "notifications/get",
  async () => {
    const res = await fetchNotifications();
    return res.data;
  },
);

const notificationSlice = createSlice({
  name: "notifications",
  initialState: {
    list: [],
  },
  extraReducers: (builder) => {
    builder.addCase(getNotifications.fulfilled, (state, action) => {
      state.list = action.payload;
    });
  },
});

export default notificationSlice.reducer;
