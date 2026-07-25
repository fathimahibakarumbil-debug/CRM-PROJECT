  import { useEffect, useState } from "react";
  import { useDispatch, useSelector } from "react-redux";
  import { useNavigate } from "react-router-dom";
  import CreateEditDrawer from "../../components/listPage/drawers/CreateEditDrawer";
  import ModuleTopBar from "../../components/listPage/ModuleTopBar";
  import DataTable from "../../components/listPage/DataTable";
  import { leadColumns } from "../../utils/tableconfig/LeadTableConfig";
  import PhoneInput from "react-phone-input-2";
  import "react-phone-input-2/lib/material.css";

  import AppSnackbar from "../../components/common/AppSnackbar";
  import ConfirmationDialog from "../../components/common/ConfirmationDialog";
  import {
    fetchLeads,
    createLead,
    removeLead,
    updateLead,
  } from "../../store/LeadSlice";

  import {
    Box,
    Stack,
    TextField,
    MenuItem,
    FormControl,
    Select,
    InputLabel,
  } from "@mui/material";

  import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
  import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

  const LeadsList = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { items, loading } = useSelector((state) => state.lead);

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedLead, setSelectedLead] = useState(null);
    const [searchText, setSearchText] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const [filterDate, setFilterDate] = useState(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [leadToDelete, setLeadToDelete] = useState(null);

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");
    const [errors, setErrors] = useState({});
    const leadsPerPage = 10;

    const validateLead = () => {
      const newErrors = {};
      if (!newLead.firstName?.trim())
        newErrors.firstName = "First Name is required";
      if (!newLead.lastName?.trim()) newErrors.lastName = "Last Name is required";
      if (!newLead.email?.trim()) newErrors.email = "Email is required";
      else if (!/\S+@\S+\.\S+/.test(newLead.email))
        newErrors.email = "Enter a valid email";

      if (!newLead.phone?.trim()) newErrors.phone = "Phone is required";

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };
    const [newLead, setNewLead] = useState({
      email: "",
      firstName: "",
      lastName: "",
      phone: "",
      city: "",
      company: "",
      jobTitle: "",
      contactOwner: [],
      leadStatus: "New",
    });

    useEffect(() => {
      dispatch(fetchLeads());
    }, [dispatch]);
    useEffect(() => {
      setCurrentPage(1);
    }, [searchText, filterStatus, filterDate]);
    // ============================
    // FILTERING
    // ============================

    const showSnackbar = (message, severity = "success") => {
      setSnackbarMessage(message);
      setSnackbarSeverity(severity);
      setSnackbarOpen(true);
    };
    const filteredLeads = items.filter((lead) => {
      const fullName =
        `${lead.firstName ?? ""} ${lead.lastName ?? ""}`.toLowerCase();

      const search = searchText.toLowerCase();

      const searchMatch =
        fullName.includes(search) ||
        (lead.email ?? "").toLowerCase().includes(search) ||
        (lead.phone ?? "").toLowerCase().includes(search);

      const statusMatch = filterStatus ? lead.leadStatus === filterStatus : true;

      const dateMatch = filterDate
        ? lead.createdDate?.includes(filterDate.format("YYYY-MM-DD"))
        : true;

      return searchMatch && statusMatch && dateMatch;
    });

    // ============================
    // PAGINATION
    // ============================
    const totalPages = Math.ceil(filteredLeads.length / leadsPerPage);

    const paginatedLeads = filteredLeads.slice(
      (currentPage - 1) * leadsPerPage,
      currentPage * leadsPerPage,
    );

    // ============================
    // ACTIONS
    // ============================
    const confirmDeleteLead = (lead) => {
      setLeadToDelete(lead);
      setDeleteDialogOpen(true);
    };
    const handleConfirmDelete = async () => {
      if (!leadToDelete) return;

      try {
        const resultAction = await dispatch(removeLead(leadToDelete.id));
        if (resultAction.type.endsWith("/fulfilled")) {
          showSnackbar("Lead deleted successfully", "success");
        } else {
          showSnackbar(resultAction.error?.message || "Delete failed", "error");
        }
      } catch (error) {
        showSnackbar(error.message || "Delete failed", "error");
      } finally {
        setDeleteDialogOpen(false);
        setLeadToDelete(null);
      }
    };

    const handleCancelDelete = () => {
      setDeleteDialogOpen(false);
      setLeadToDelete(null);
    };

    const handleEditLead = (lead) => {
      setSelectedLead(lead);
      setNewLead({ ...lead });
      setIsDrawerOpen(true);
    };

    const handleSaveLead = async () => {
      if (!validateLead()) return;
      try {
        let resultAction;
        if (selectedLead) {
          resultAction = await dispatch(
            updateLead({ id: selectedLead.id, updatedData: newLead }),
          );
        } else {
          resultAction = await dispatch(createLead(newLead));
        }

        if (resultAction.type.endsWith("/fulfilled")) {
          showSnackbar(
            selectedLead
              ? "Lead updated successfully"
              : "Lead created successfully",
            "success",
          );
          setIsDrawerOpen(false);
          setSelectedLead(null);
        } else {
          // Thunk rejected
          showSnackbar(
            resultAction.error?.message || "Operation failed",
            "error",
          );
        }
      } catch (error) {
        showSnackbar(error.message || "Operation failed", "error");
      }
    };

    const handleRowClick = (row) => {
      console.log("ROW 👉", row);
      navigate(`/leads/${row.id}`);
    };

    // ============================
    // UI
    // ============================
    return (
      <Box sx={{ p: 2 }}>
        <Stack spacing={2}>
          {/* TOP BAR */}
          <ModuleTopBar
            title="Leads"
            onCreate={() => {
              setSelectedLead(null);
              setNewLead({
                email: "",
                firstName: "",
                lastName: "",
                phone: "",
                city: "",
                company: "",
                jobTitle: "",
                contactOwner: [],
                leadStatus: "New",
              });
              setIsDrawerOpen(true);
            }}
            searchValue={searchText}
            onSearchChange={setSearchText}
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />

          {/* FILTERS */}
          <Stack direction="row" spacing={2}>
            <FormControl sx={{ minWidth: 160 }} size="small">
              <InputLabel
                sx={{
                  color: "black",
                  "&.Mui-focused": {
                    color: "black",
                  },
                }}
              >
                Status
              </InputLabel>
              <Select
                value={filterStatus}
                label="Status"
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="New">New</MenuItem>
                <MenuItem value="Open">Open</MenuItem>
                <MenuItem value="Contacted">Contacted</MenuItem>
                <MenuItem value="In Progress">In Progress</MenuItem>
                <MenuItem value="Qualified">Qualified</MenuItem>
                <MenuItem value="Converted">Converted</MenuItem>
              </Select>
            </FormControl>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Created Date"
                value={filterDate}
                onChange={setFilterDate}
                slotProps={{
                  textField: {
                    size: "small",
                    sx: {
                      "& .MuiInputBase-input": {
                        color: "black",
                      },
                      "& .MuiInputLabel-root": {
                        color: "black",
                      },
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "black",
                      },
                    },
                  },
                }}
              />
            </LocalizationProvider>
          </Stack>

          {/* TABLE */}
          <DataTable
            rows={paginatedLeads}
            columns={leadColumns}
            loading={loading}
            selectedRows={selectedRows}
            setSelectedRows={setSelectedRows}
            onRowClick={handleRowClick}
            onEdit={handleEditLead}
            onDelete={confirmDeleteLead}
          />
        </Stack>

        {/* DRAWER */}
        <CreateEditDrawer
          open={isDrawerOpen}
          onClose={() => {
            setIsDrawerOpen(false);
            setSelectedLead(null);
          }}
          title={selectedLead ? "Edit Lead" : "Create Lead"}
          onSave={handleSaveLead}
        >
          <Stack spacing={2}>
            <TextField
              label="Email"
              value={newLead.email || ""}
              onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
              fullWidth
              required
            />

            <Stack direction="row" spacing={2}>
              <TextField
                label="First Name"
                value={newLead.firstName || ""}
                onChange={(e) =>
                  setNewLead({ ...newLead, firstName: e.target.value })
                }
                fullWidth
                required
              />

              <TextField
                label="Last Name"
                value={newLead.lastName || ""}
                onChange={(e) =>
                  setNewLead({ ...newLead, lastName: e.target.value })
                }
                fullWidth
                required
              />
            </Stack>

            <Stack spacing={0.5}>
              <PhoneInput
                country={"in"} // change if needed
                value={newLead.phone || ""}
                onChange={(phone) => setNewLead({ ...newLead, phone })}
                inputStyle={{
                  width: "100%",
                  height: "60px",
                  fontSize: "0.900rem",
                  borderRadius: "4px",
                  border: "1px solid #c4c4c4",
                }}
                buttonStyle={{
                  border: "1px solid #c4c4c4",
                  borderRight: "none",
                  borderRadius: "4px 0 0 4px",
                }}
                containerStyle={{
                  width: "100%",
                }}
                enableSearch
              />
            </Stack>

            <Stack direction="row" spacing={2}>
              <TextField
                label="City"
                value={newLead.city || ""}
                onChange={(e) => setNewLead({ ...newLead, city: e.target.value })}
                fullWidth
              />

              <TextField
                label="Company"
                value={newLead.company || ""}
                onChange={(e) =>
                  setNewLead({ ...newLead, company: e.target.value })
                }
                fullWidth
              />
            </Stack>

            <Stack direction="row" spacing={2}>
              <TextField
                label="Job Title"
                value={newLead.jobTitle || ""}
                onChange={(e) =>
                  setNewLead({ ...newLead, jobTitle: e.target.value })
                }
                fullWidth
              />

              {/* <FormControl fullWidth size="small">
                <InputLabel>Contact Owner</InputLabel>
                <Select
                  value={newLead.contactOwner || ""}
                  label="Contact Owner"
                  onChange={(e) =>
                    setNewLead({ ...newLead, contactOwner: e.target.value })
                  }
                >
                  <MenuItem value="John Doe">John Doe</MenuItem>
                  <MenuItem value="Jane Smith">Jane Smith</MenuItem>
                  <MenuItem value="John Doe">Rohit Varma</MenuItem>
                  <MenuItem value="John Doe">Neha Menon</MenuItem>
                </Select>
              </FormControl> */}
              <FormControl fullWidth size="small">
    <InputLabel>Contact Owner</InputLabel>

    <Select
      multiple
      value={newLead.contactOwner}
      label="Contact Owner"
      renderValue={(selected) => selected.join(", ")}
      onChange={(e) =>
        setNewLead({
          ...newLead, 
          contactOwner: e.target.value,
        })
      }
    >
      <MenuItem value="John Doe">John Doe</MenuItem>
      <MenuItem value="Jane Smith">Jane Smith</MenuItem>
      <MenuItem value="Rohit Varma">Rohit Varma</MenuItem>
      <MenuItem value="Neha Menon">Neha Menon</MenuItem>
    </Select>
  </FormControl>
            </Stack>

            <FormControl fullWidth size="small">
              <InputLabel>Lead Status</InputLabel>
              <Select
                value={newLead.leadStatus || ""}
                label="Lead Status"
                onChange={(e) =>
                  setNewLead({ ...newLead, leadStatus: e.target.value })
                }
              >
                <MenuItem value="New">New</MenuItem>
                <MenuItem value="Open">Open</MenuItem>
                <MenuItem value="Contacted">Contacted</MenuItem>
                <MenuItem value="In Progress">In Progress</MenuItem>
                <MenuItem value="Lost">Lost</MenuItem>
                <MenuItem value="Qualified">Qualified</MenuItem>
                <MenuItem value="Converted" disabled>
                  Converted
                </MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </CreateEditDrawer>

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
          title="Delete Lead"
          message="Are you sure you want to delete this lead?"
          confirmText="Delete"
          confirmColor="error"
        />
      </Box>
    );
  };

  export default LeadsList;
