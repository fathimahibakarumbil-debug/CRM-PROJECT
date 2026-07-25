import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import ModuleTopBar from "../../components/listPage/ModuleTopBar";
import DataTable from "../../components/listPage/DataTable";
import CreateEditDrawer from "../../components/listPage/drawers/CreateEditDrawer";
import ConfirmationDialog from "../../components/common/ConfirmationDialog";
import AppSnackbar from "../../components/common/AppSnackbar";
import { useMemo } from "react";
import { fetchLeads } from "../../store/LeadSlice";
import {
  fetchDeals,
  addDeal,
  editDeal,
  removeDeal,
} from "../../store/DealSlice";

import { dealColumns } from "../../utils/tableconfig/DealTableConfig";

import {
  Box,
  Stack,
  FormControl,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";

import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const DealsList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, loading } = useSelector((state) => state.deal);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  // const [selectedDeal, setSelectedDeal] = useState(null);
  const { items: leads } = useSelector((state) => state.lead);
  const [filterOwner, setFilterOwner] = useState("");
  const [filterCloseDate, setFilterCloseDate] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [filterStage, setFilterStage] = useState("");
  const [filterDate, setFilterDate] = useState(null);

  const [selectedRows, setSelectedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [dealToDelete, setDealToDelete] = useState(null);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const dealsPerPage = 10;

  const initialDealState = {
    id: null,
    deal_name: "",
    deal_owner: [],
    deal_stage: "Contact",
    lead: "",
    amount: "",
    close_date: null,
    priority: "",
  };

  const [newDeal, setNewDeal] = useState(initialDealState);

  useEffect(() => {
    dispatch(fetchDeals());
    dispatch(fetchLeads()); // 👈 ADD THIS
  }, [dispatch]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchText, filterStage, filterDate, filterOwner, filterCloseDate]);

  const showSnackbar = (message, severity = "success") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  // ================= FILTER =================

  const filteredDeals = useMemo(() => {
    return items.filter((deal) => {
      const search = searchText.toLowerCase();

      // const searchMatch =
      //   (deal.dealName ?? "").toLowerCase().includes(search) ||
      //   (deal.dealOwner ?? "").toLowerCase().includes(search);

      const ownerText = Array.isArray(deal.dealOwner)
  ? deal.dealOwner.join(", ").toLowerCase()
  : (deal.dealOwner ?? "").toLowerCase();

const searchMatch =
  (deal.dealName ?? "").toLowerCase().includes(search) ||
  ownerText.includes(search);

      const stageMatch = filterStage ? deal.dealStage === filterStage : true;

      // const ownerMatch = filterOwner ? deal.dealOwner === filterOwner : true;
      const ownerMatch = filterOwner
  ? Array.isArray(deal.dealOwner) &&
    deal.dealOwner.includes(filterOwner)
  : true;

      const createdDateMatch = filterDate
        ? deal.created_at?.includes(filterDate.format("YYYY-MM-DD"))
        : true;

      const closeDateMatch = filterCloseDate
        ? deal.closeDate?.includes(filterCloseDate.format("YYYY-MM-DD"))
        : true;

      return (
        searchMatch &&
        stageMatch &&
        ownerMatch &&
        createdDateMatch &&
        closeDateMatch
      );
    });
  }, [
    items,
    searchText,
    filterStage,
    filterOwner,
    filterDate,
    filterCloseDate,
  ]);

  const totalPages = Math.ceil(filteredDeals.length / dealsPerPage);

  const paginatedDeals = filteredDeals.slice(
    (currentPage - 1) * dealsPerPage,
    currentPage * dealsPerPage,
  );

  // ================= ACTIONS =================

  const handleRowDoubleClick = (params) => {
    const deal = params?.row || params;
    navigate(`/deals/${deal.id}`);
  };

  const confirmDeleteDeal = (deal) => {
    setDealToDelete(deal);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!dealToDelete) return;

    const resultAction = await dispatch(removeDeal(dealToDelete.id));

    if (removeDeal.fulfilled.match(resultAction)) {
      showSnackbar("Deal deleted successfully");
      setCurrentPage(1);
    } else {
      showSnackbar(resultAction.error?.message || "Delete failed", "error");
    }

    setDeleteDialogOpen(false);
    setDealToDelete(null);
  };

  const handleEditDeal = (params) => {
    const deal = params?.row || params;

    setNewDeal({
      id: deal.id,
      deal_name: deal.dealName ?? "",
      // deal_owner: deal.dealOwner ?? "",
      deal_owner: deal.dealOwner ?? [],
      deal_stage: deal.dealStage ?? "Contact",
      lead: deal.lead?.id || deal.lead || "",

      amount: deal.amount ?? "",
      priority: deal.priority ?? "",
      close_date: deal.closeDate ? dayjs(deal.closeDate) : null,
    });

    setIsDrawerOpen(true);
  };
  const filteredLeads = leads.filter(
    (l) => l.leadStatus === "Qualified" || l.id === newDeal.lead,
  );

  const handleSaveDeal = async () => {
    const formattedDeal = {
      ...newDeal,
      close_date: newDeal.close_date
        ? newDeal.close_date.format("YYYY-MM-DD")
        : null,
    };

    let resultAction;

    if (newDeal.id) {
      resultAction = await dispatch(
        editDeal({
          id: newDeal.id,
          updatedData: formattedDeal,
        }),
      );
    } else {
      resultAction = await dispatch(addDeal(formattedDeal));
    }

    // ✅ SUCCESS CHECK
    if (
      addDeal.fulfilled.match(resultAction) ||
      editDeal.fulfilled.match(resultAction)
    ) {
      showSnackbar(
        newDeal.id ? "Deal updated successfully" : "Deal created successfully",
      );

      setIsDrawerOpen(false);
      setNewDeal(initialDealState);

      dispatch(fetchLeads());
    } else {
      showSnackbar("Operation failed", "error");
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Stack spacing={2}>
        <ModuleTopBar
          title="Deals"
          onCreate={() => {
            setNewDeal(initialDealState);
            setIsDrawerOpen(true);
          }}
          searchValue={searchText}
          onSearchChange={setSearchText}
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />

        <Stack direction="row" spacing={2} flexWrap="wrap">
          <FormControl sx={{ minWidth: 160 }}>
            <Select
              size="small"
              displayEmpty
              value={filterOwner || ""}
              onChange={(e) => setFilterOwner(e.target.value)}
            >
              <MenuItem value="">Deal Owner</MenuItem>
              <MenuItem value="Jane Cooper">Jane Cooper</MenuItem>
              <MenuItem value="Wade Warren">Wade Warren</MenuItem>
              <MenuItem value="Robert Fox">Robert Fox</MenuItem>
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 160 }}>
            <Select
              size="small"
              displayEmpty
              value={filterStage}
              onChange={(e) => setFilterStage(e.target.value)}
            >
              <MenuItem value="">Deal Stage</MenuItem>
              <MenuItem value="Contact">Contact</MenuItem>
              <MenuItem value="Qualified">Qualified</MenuItem>
              <MenuItem value="Proposal">Proposal</MenuItem>
              <MenuItem value="Negotiation">Negotiation</MenuItem>
              <MenuItem value="Closed Won">Closed Won</MenuItem>
              <MenuItem value="Closed Lost">Closed Lost</MenuItem>
            </Select>
          </FormControl>

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Close Date"
              value={filterCloseDate}
              onChange={setFilterCloseDate}
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

        <DataTable
          rows={paginatedDeals}
          columns={dealColumns}
          loading={loading}
          selectedRows={selectedRows}
          setSelectedRows={setSelectedRows}
          onEdit={handleEditDeal}
          onDelete={confirmDeleteDeal}
          onRowClick={handleRowDoubleClick}
        />
      </Stack>

      <CreateEditDrawer
        open={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setNewDeal(initialDealState);
        }}
        title={newDeal.id ? "Edit Deal" : "Create Deal"}
        onSave={handleSaveDeal}
      >
        <Stack spacing={2} sx={{ mt: 2 }}>
          <TextField
            label="Deal Name"
            fullWidth
            value={newDeal.deal_name}
            onChange={(e) =>
              setNewDeal({ ...newDeal, deal_name: e.target.value })
            }
          />

          <TextField
            select
            label="Deal Stage"
            value={newDeal.deal_stage}
            onChange={(e) =>
              setNewDeal({ ...newDeal, deal_stage: e.target.value })
            }
          >
            <MenuItem value="Contact">Contact</MenuItem>
            <MenuItem value="Qualified">Qualified</MenuItem>
            <MenuItem value="Proposal">Proposal</MenuItem>
            <MenuItem value="Negotiation">Negotiation</MenuItem>
            <MenuItem value="Closed Won">Closed Won</MenuItem>
            <MenuItem value="Closed Lost">Closed Lost</MenuItem>
          </TextField>

          <TextField
            label="Amount"
            fullWidth
            value={newDeal.amount}
            onChange={(e) => setNewDeal({ ...newDeal, amount: e.target.value })}
          />
{/* 
          <TextField
            select
            label="Deal Owner"
            value={newDeal.deal_owner}
            onChange={(e) =>
              setNewDeal({ ...newDeal, deal_owner: e.target.value })
            }
          > */}
          <TextField
  select
  SelectProps={{
    multiple: true,
  }}
  label="Deal Owner"
  value={newDeal.deal_owner}
  onChange={(e) =>
    setNewDeal({
      ...newDeal,
      deal_owner: e.target.value,
    })
  }
>
<MenuItem disabled value="">
  Choose Owner
</MenuItem>            <MenuItem value="Jane Cooper">Jane Cooper</MenuItem>
            <MenuItem value="Wade Warren">Wade Warren</MenuItem>
            <MenuItem value="Robert Fox">Robert Fox</MenuItem>
          </TextField>

          <TextField
            select
            label="Select Lead"
            fullWidth
            value={newDeal.lead || ""}
            // onChange={(e) => setNewDeal({ ...newDeal, lead: e.target.value })}
            onChange={(e) => {
              const selectedLeadId = e.target.value;

              const selectedLead = leads.find((l) => l.id === selectedLeadId);

              setNewDeal({
                ...newDeal,
                lead: selectedLeadId,

                // 👇 ADD THIS
                email: selectedLead?.email || "",
                phone: selectedLead?.phone || "",
              });
            }}
          >
            <MenuItem value="">Choose Lead</MenuItem>

            {filteredLeads.map((lead) => (
              <MenuItem key={lead.id} value={lead.id}>
                {lead.firstName} {lead.lastName}
              </MenuItem>
            ))}
          </TextField>

          <Stack direction="row" spacing={2}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Close Date"
                value={newDeal.close_date}
                onChange={(value) =>
                  setNewDeal({ ...newDeal, close_date: value })
                }
                slotProps={{ textField: { fullWidth: true } }}
              />
            </LocalizationProvider>

            <TextField
              select
              label="Priority"
              fullWidth
              value={newDeal.priority}
              onChange={(e) =>
                setNewDeal({ ...newDeal, priority: e.target.value })
              }
            >
              <MenuItem value="">Choose</MenuItem>
              <MenuItem value="Low">Low</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="High">High</MenuItem>
            </TextField>
          </Stack>
        </Stack>
      </CreateEditDrawer>

      <ConfirmationDialog
        open={deleteDialogOpen}
        title="Delete Deal"
        message="Are you sure you want to delete this deal?"
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteDialogOpen(false)}
      />

      <AppSnackbar
        open={snackbarOpen}
        message={snackbarMessage}
        severity={snackbarSeverity}
        onClose={() => setSnackbarOpen(false)}
      />
    </Box>
  );
};

export default DealsList;
