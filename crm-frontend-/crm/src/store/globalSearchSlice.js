import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchGlobalSearch } from "../services/globalSearchService";

export const getGlobalSearch = createAsyncThunk(
  "globalSearch/get",
  async (search) => {
    const res = await fetchGlobalSearch(search);
    return res.data;
  },
);

const globalSearchSlice = createSlice({
  name: "globalSearch",
  initialState: {
    results: {},
    loading: false,
  },
  reducers: {
    clearSearch: (state) => {
      state.results = {};
    },
  },

  
  extraReducers: (builder) => {
    builder
      .addCase(getGlobalSearch.pending, (state) => {
        state.loading = true;
      })
      .addCase(getGlobalSearch.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload;
      });
  },
});

export const { clearSearch } = globalSearchSlice.actions;
export default globalSearchSlice.reducer;
