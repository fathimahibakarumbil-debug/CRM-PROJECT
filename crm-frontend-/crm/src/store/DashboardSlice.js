import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchSummaryAPI,
  fetchConversionAPI,
  fetchSalesAPI,
  fetchTeamAPI,
} from "../services/dashboardService";

/* ================= FETCH ACTIONS ================= */

export const fetchDashboardSummary = createAsyncThunk(
  "dashboard/summary",
  async () => {
    const res = await fetchSummaryAPI();
    return res.data;
  },
);

export const fetchConversion = createAsyncThunk(
  "dashboard/conversion",
  async () => {
    const res = await fetchConversionAPI();
    return res.data;
  },
);

export const fetchSales = createAsyncThunk("dashboard/sales", async () => {
  const res = await fetchSalesAPI();
  return res.data;
});

export const fetchTeam = createAsyncThunk("dashboard/team", async () => {
  const res = await fetchTeamAPI();
  return res.data;
});

/* ================= SLICE ================= */

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    summary: {},
    conversion: {},
    sales: [],
    team: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardSummary.fulfilled, (state, action) => {
        state.summary = action.payload;
      })
      .addCase(fetchConversion.fulfilled, (state, action) => {
        state.conversion = action.payload;
      })
      .addCase(fetchSales.fulfilled, (state, action) => {
        state.sales = action.payload;
      })
      .addCase(fetchTeam.fulfilled, (state, action) => {
        state.team = action.payload;
      });
  },
});

export default dashboardSlice.reducer;
