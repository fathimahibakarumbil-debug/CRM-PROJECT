import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as companyService from "../services/companyService";
import api from "../services/api";

/* =====================================
   INITIAL STATE
===================================== */

const initialState = {
  companies: [],
  company: null,
  loading: false,
  error: null,
};

/* =====================================
   COMPANY THUNKS
===================================== */

// GET ALL
export const fetchCompanies = createAsyncThunk(
  "companies/fetchCompanies",
  async (_, thunkAPI) => {
    try {
      return await companyService.getCompanies();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  },
);

// GET BY ID
export const fetchCompanyById = createAsyncThunk(
  "companies/fetchCompanyById",
  async (id, thunkAPI) => {
    try {
      return await companyService.getCompanyById(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  },
);

// CREATE
export const createCompany = createAsyncThunk(
  "companies/createCompany",
  async (data, thunkAPI) => {
    try {
      return await companyService.createCompany(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  },
);

// UPDATE
export const updateCompany = createAsyncThunk(
  "companies/updateCompany",
  async ({ id, data }, thunkAPI) => {
    try {
      return await companyService.updateCompany(id, data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  },
);

// DELETE

export const deleteCompany = createAsyncThunk(
  "companies/deleteCompany",
  async (id) => {
    await companyService.deleteCompany(id);
    return id;
  },
);

/* =====================================
   ACTIVITY THUNKS
===================================== */

// ADD ACTIVITY
export const addActivity = createAsyncThunk(
  "companies/addActivity",
  async ({ companyId, activity }, thunkAPI) => {
    try {
      return await companyService.createNote({
        company: companyId,
        ...activity,
      });
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  },
);

// UPDATE ACTIVITY

export const updateActivity = createAsyncThunk(
  "companies/updateActivity",
  async ({ activityId, activity }, thunkAPI) => {
    try {
      const res = await api.put(`/companies/activity/${activityId}/`, activity);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  },
);
// DELETE ACTIVITY
export const removeActivity = createAsyncThunk(
  "companies/removeActivity",
  async (activityId, thunkAPI) => {
    try {
      await api.delete(`/companies/activity/${activityId}/`);
      return activityId;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  },
);

/* =====================================
   ATTACHMENT THUNKS
===================================== */

// ADD ATTACHMENT
export const addAttachment = createAsyncThunk(
  "companies/addAttachment",
  async ({ companyId, file }, thunkAPI) => {
    try {
      const formData = new FormData();
      formData.append("company", companyId);
      formData.append("file", file);

const res = await api.post(
  `/companies/${companyId}/attachments/`,
  formData,
  {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }
);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  },
);

// DELETE ATTACHMENT
export const removeAttachment = createAsyncThunk(
  "companies/removeAttachment",
  async (attachmentId, thunkAPI) => {
    try {
      await api.delete(`/companies/attachments/${attachmentId}/`);
      return attachmentId;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  },
);

/* =====================================
   SLICE
===================================== */

const companySlice = createSlice({
  name: "companies",
  initialState,

  reducers: {
    clearCompany(state) {
      state.company = null;
    },
  },

  extraReducers: (builder) => {
    builder

      /* FETCH ALL */
      .addCase(fetchCompanies.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCompanies.fulfilled, (state, action) => {
        state.loading = false;
        // state.companies = action.payload;
        state.companies = action.payload.map((c) => ({
          ...c,
          id: c.id || c._id,
        }));
      })
      .addCase(fetchCompanies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      /* FETCH BY ID */
      .addCase(fetchCompanyById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

     .addCase(fetchCompanyById.fulfilled, (state, action) => {
  state.loading = false;

  const response = action.payload;
  const raw = response.company;

  state.company = {
    id: raw.id,

    companyName: raw.companyName,
    domainName: raw.domainName,
    phoneNumber: raw.phoneNumber,
    companyOwner: raw.companyOwner,
    industry: raw.industry,
    type: raw.type,
    city: raw.city,
    countryRegion: raw.countryRegion,
    noOfEmployees: raw.noOfEmployees,
    annualRevenue: raw.annualRevenue,
    leadStatus: raw.leadStatus,
    createdDate: raw.createdDate,

    // activities: [
    //   ...(response.notes || []),
    //   ...(response.calls || []),
    //   ...(response.emails || []),
    //   ...(response.tasks || []),
    //   ...(response.meetings || []),
    // ],

    activities: [
  ...(response.notes || []).map((x) => ({
    ...x,
    activityType: "note",
  })),

  ...(response.calls || []).map((x) => ({
    ...x,
    activityType: "call",
  })),

  ...(response.emails || []).map((x) => ({
    ...x,
    activityType: "email",
  })),

  ...(response.tasks || []).map((x) => ({
    ...x,
    activityType: "task",
  })),

  ...(response.meetings || []).map((x) => ({
    ...x,
    activityType: "meeting",
  })),
],

    attachments: response.attachments || [],
  };
})

      .addCase(fetchCompanyById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* CREATE */
      .addCase(createCompany.fulfilled, (state, action) => {
        state.companies.push(action.payload);
      })

      /* UPDATE */
      // .addCase(updateCompany.fulfilled, (state, action) => {
      //   state.companies = state.companies.map((c) =>
      //     c.id === action.payload.id ? action.payload : c,
      //   );
      // })

      .addCase(updateCompany.fulfilled, (state, action) => {
  state.company = {
    ...state.company,
    ...action.payload,
  };

  state.companies = state.companies.map((c) =>
    c.id === action.payload.id ? action.payload : c
  );
})

      /* DELETE */
      .addCase(deleteCompany.fulfilled, (state, action) => {
        state.companies = state.companies.filter(
          (company) => (company.id || company._id) !== action.payload,
        );
      })

      /* ADD ACTIVITY */
      // .addCase(addActivity.fulfilled, (state, action) => {
      //   state.company.activities.push(action.payload);
      // })

      .addCase(addActivity.fulfilled, (state, action) => {
    console.log("Activity Added:", action.payload);

    // state.company.activities = [
    //     action.payload,
    //     ...state.company.activities,
    // ];
    state.company.activities = [
  {
    ...action.payload,
    activityType: "note",
  },
  ...state.company.activities,
];
})

      /* UPDATE ACTIVITY */
      .addCase(updateActivity.fulfilled, (state, action) => {
        state.company.activities = state.company.activities.map((a) =>
          a.id === action.payload.id ? action.payload : a,
        );
      })

      /* DELETE ACTIVITY */
      .addCase(removeActivity.fulfilled, (state, action) => {
        state.company.activities = state.company.activities.filter(
          (a) => a.id !== action.payload,
        );
      })

      /* ADD ATTACHMENT */
      .addCase(addAttachment.fulfilled, (state, action) => {
        state.company.attachments.push(action.payload);
      })

      /* DELETE ATTACHMENT */
      .addCase(removeAttachment.fulfilled, (state, action) => {
        state.company.attachments = state.company.attachments.filter(
          (a) => a.id !== action.payload,
        );
      });
  },
});

export const { clearCompany } = companySlice.actions;

export default companySlice.reducer;
