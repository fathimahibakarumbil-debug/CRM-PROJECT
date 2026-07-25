  import { useEffect, useState } from "react";
  import { useDispatch, useSelector } from "react-redux";
  import { useNavigate } from "react-router-dom";

  import ModuleTopBar from "../../components/listPage/ModuleTopBar";
  import DataTable from "../../components/listPage/DataTable";
  import CreateEditDrawer from "../../components/listPage/drawers/CreateEditDrawer";
  import ConfirmationDialog from "../../components/common/ConfirmationDialog";
  import AppSnackbar from "../../components/common/AppSnackbar";

  import {
    fetchTickets,
    addTicket,
    editTicket,
    removeTicket,
  } from "../../store/TicketSlice";

  import { ticketColumns } from "../../utils/tableconfig/TicketTableConfig";

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
  const TicketsList = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { items, loading } = useSelector((state) => state.ticket);

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState(null);
    
    const [filterOwner, setFilterOwner] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const [filterSource, setFilterSource] = useState("");
    const [filterPriority, setFilterPriority] = useState("");
    const [filterDate, setFilterDate] = useState(null);
    const [searchText, setSearchText] = useState("");

    const [selectedRows, setSelectedRows] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [ticketToDelete, setTicketToDelete] = useState(null);

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");

    const ticketsPerPage = 10;

    const initialTicketState = {
      ticketName: "",
      description: "",
      ticketStatus: "New",
      source: "",
      priority: "",
      ticketOwner: "",
    };

    const [newTicket, setNewTicket] = useState(initialTicketState);

    useEffect(() => {
      dispatch(fetchTickets());
    }, [dispatch]);

    useEffect(() => {
      setCurrentPage(1);
    }, [searchText, filterStatus, filterPriority, filterOwner, filterDate]);

    const showSnackbar = (message, severity = "success") => {
      setSnackbarMessage(message);
      setSnackbarSeverity(severity);
      setSnackbarOpen(true);
    };

    // ======================
    // FILTERING LOGIC
    // ======================
    const filteredTickets = items.filter((ticket) => {
      const search = searchText.toLowerCase();
      const searchMatch =
        (ticket.ticketName ?? "").toLowerCase().includes(search) ||
        (ticket.ticketOwner ?? "").toLowerCase().includes(search);

      const statusMatch = filterStatus ? ticket.ticketStatus === filterStatus : true;
      const ownerMatch = filterOwner ? ticket.ticketOwner === filterOwner : true;
      const priorityMatch = filterPriority ? ticket.priority === filterPriority : true;
      const sourceMatch = filterSource ? ticket.source === filterSource : true;
      
      const createdDateMatch = filterDate
        ? ticket.createdDate?.includes(filterDate.format("YYYY-MM-DD"))
        : true;

      return searchMatch && statusMatch && ownerMatch && priorityMatch && sourceMatch && createdDateMatch;
    });

    const totalPages = Math.ceil(filteredTickets.length / ticketsPerPage);
    const paginatedTickets = filteredTickets.slice(
      (currentPage - 1) * ticketsPerPage,
      currentPage * ticketsPerPage
    );

    // ======================
    // ACTIONS
    // ======================
    const handleRowDoubleClick = (ticket) => {
      navigate(`/tickets/${ticket.id}`);
    };

    const confirmDeleteTicket = (ticket) => {
      setTicketToDelete(ticket);
      setDeleteDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
      if (!ticketToDelete) return;
      const resultAction = await dispatch(removeTicket(ticketToDelete.id));
      
      if (removeTicket.fulfilled.match(resultAction)) {
        showSnackbar("Ticket deleted successfully");
        dispatch(fetchTickets()); 
      } else {
        showSnackbar(resultAction.error?.message || "Delete failed", "error");
      }
      setDeleteDialogOpen(false);
      setTicketToDelete(null);
    };

    const handleEditTicket = (ticket) => {
      setSelectedTicket(ticket);
      setNewTicket({ ...ticket });
      setIsDrawerOpen(true);
    };

    const handleSaveTicket = async () => {
      let resultAction;
      if (selectedTicket) {
        resultAction = await dispatch(
          editTicket({ id: selectedTicket.id, updatedData: newTicket })
        );
      } else {
        resultAction = await dispatch(addTicket(newTicket));
      }

      if (addTicket.fulfilled.match(resultAction) || editTicket.fulfilled.match(resultAction)) {
        showSnackbar(selectedTicket ? "Ticket updated successfully" : "Ticket created successfully");
        setIsDrawerOpen(false);
        setSelectedTicket(null);
        setNewTicket(initialTicketState);
        dispatch(fetchTickets());
      } else {
        showSnackbar("Operation failed", "error");
      }
    };

    return (
      <Box sx={{ p: 2 }}>
        <Stack spacing={2}>
          <ModuleTopBar
            title="Tickets"
            onCreate={() => {
              setSelectedTicket(null);
              setNewTicket(initialTicketState);
              setIsDrawerOpen(true);
            }}
            searchValue={searchText}
            onSearchChange={setSearchText}
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />

          <Stack direction="row" spacing={2} flexWrap="wrap">
            <FormControl sx={{ minWidth: 150 }}>
              <Select
                size="small"
                displayEmpty
                value={filterOwner}
                onChange={(e) => setFilterOwner(e.target.value)}
              >
                <MenuItem value="">Ticket Owner</MenuItem>
                <MenuItem value="Jane Cooper">Jane Cooper</MenuItem>
                <MenuItem value="Wade Warren">Wade Warren</MenuItem>
                <MenuItem value="Robert Fox">Robert Fox</MenuItem>
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 150 }}>
              <Select
                size="small"
                displayEmpty
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <MenuItem value="">Ticket Status</MenuItem>
                <MenuItem value="New">New</MenuItem>
                <MenuItem value="Waiting on contact">Waiting on contact</MenuItem>
                <MenuItem value="Closed">Closed</MenuItem>
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 150 }}>
              <Select
                size="small"
                displayEmpty
                value={filterSource}
                onChange={(e) => setFilterSource(e.target.value)}
              >
                <MenuItem value="">Source</MenuItem>
                <MenuItem value="Email">Email</MenuItem>
                <MenuItem value="Chat">Chat</MenuItem>
                <MenuItem value="Phone">Phone</MenuItem>
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 150 }}>
              <Select
                size="small"
                displayEmpty
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
              >
                <MenuItem value="">Priority</MenuItem>
                <MenuItem value="Low">Low</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="High">High</MenuItem>
                <MenuItem value="Critical">Critical</MenuItem>
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

          <DataTable
            rows={paginatedTickets}
            columns={ticketColumns}
            loading={loading}
            selectedRows={selectedRows}
            setSelectedRows={setSelectedRows}
            onEdit={handleEditTicket}
            onDelete={confirmDeleteTicket}
            onRowClick={(row) => handleRowDoubleClick(row)} 
          />
        </Stack>

        <CreateEditDrawer
          open={isDrawerOpen}
          onClose={() => {
            setIsDrawerOpen(false);
            setSelectedTicket(null);
          }}
          title={selectedTicket ? "Edit Ticket" : "Create Ticket"}
          onSave={handleSaveTicket}
        >
          <Stack spacing={2} sx={{ mt: 2 }}>
            <TextField
              label="Ticket Name"
              fullWidth
              value={newTicket.ticketName}
              onChange={(e) => setNewTicket({ ...newTicket, ticketName: e.target.value })}
            />

            <TextField
              label="Description"
              multiline
              rows={3}
              fullWidth
              value={newTicket.description}
              onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
            />

            <Stack direction="row" spacing={2}>
              <TextField
                select
                label="Ticket Status"
                fullWidth
                value={newTicket.ticketStatus}
                onChange={(e) => setNewTicket({ ...newTicket, ticketStatus: e.target.value })}
              >
                <MenuItem value="New">New</MenuItem>
                <MenuItem value="Waiting on contact">Waiting on contact</MenuItem>
                <MenuItem value="Closed">Closed</MenuItem>
              </TextField>

              <TextField
                select
                label="Source"
                fullWidth
                value={newTicket.source}
                onChange={(e) => setNewTicket({ ...newTicket, source: e.target.value })}
              >
                <MenuItem value="Chat">Chat</MenuItem>
                <MenuItem value="Email">Email</MenuItem>
                <MenuItem value="Phone">Phone</MenuItem>
              </TextField>
            </Stack>

            <TextField
              select
              label="Priority"
              fullWidth
              value={newTicket.priority}
              onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value })}
            >
              <MenuItem value="Low">Low</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="High">High</MenuItem>
            </TextField>

            <TextField
              select
              label="Ticket Owner"
              fullWidth
              value={newTicket.ticketOwner}
              onChange={(e) => setNewTicket({ ...newTicket, ticketOwner: e.target.value })}
            >
              <MenuItem value="">Choose</MenuItem>
              <MenuItem value="Jane Cooper">Jane Cooper</MenuItem>
              <MenuItem value="Wade Warren">Wade Warren</MenuItem>
              <MenuItem value="Robert Fox">Robert Fox</MenuItem>
            </TextField>
          </Stack>
        </CreateEditDrawer>

        <ConfirmationDialog
          open={deleteDialogOpen}
          title="Delete Ticket"
          message="Are you sure you want to delete this ticket?"
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

  export default TicketsList;