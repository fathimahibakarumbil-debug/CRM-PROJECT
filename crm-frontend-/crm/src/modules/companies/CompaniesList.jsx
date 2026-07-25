import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import ModuleTopBar from "../../components/listPage/ModuleTopBar";
import DataTable from "../../components/listPage/DataTable";
import CreateEditDrawer from "../../components/listPage/drawers/CreateEditDrawer";
import { companyColumns } from "../../utils/tableconfig/CompanyTableConfig";
import { useNavigate } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import {
  fetchCompanies,
  createCompany,
  deleteCompany,
  updateCompany,
} from "../../store/CompanySlice";

import {
  Box,
  Stack,
  TextField,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";

import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import AppSnackbar from "../../components/common/AppSnackbar";
import ConfirmationDialog from "../../components/common/ConfirmationDialog";

const initialCompanyState = {
  companyName: "",
  companyOwner: "",
  phoneNumber: "",
  industry: "",
  city: "",
  countryRegion: "",
  leadStatus: "",
  createdDate: "",
};

const CompaniesList = () => {
  const dispatch = useDispatch();
  const { companies = [], loading } = useSelector((state) => state.company);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const [filterIndustry, setFilterIndustry] = useState("");
  const [filterCity, setFilterCity] = useState("");
  const [filterCountry, setFilterCountry] = useState("");
  const [filterLeadStatus, setFilterLeadStatus] = useState("");
  const [filterDate, setFilterDate] = useState(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [companyToDelete, setCompanyToDelete] = useState(null);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const [newCompany, setNewCompany] = useState(initialCompanyState);
  const navigate = useNavigate();
  // Fetch Companies
  useEffect(() => {
    dispatch(fetchCompanies());
  }, [dispatch]);

  // Dynamic Dropdown Options
  const industries = useMemo(
    () => [...new Set(companies.map((c) => c.industry).filter(Boolean))],
    [companies],
  );

  const cities = useMemo(
    () => [...new Set(companies.map((c) => c.city).filter(Boolean))],
    [companies],
  );

  const countries = useMemo(
    () => [...new Set(companies.map((c) => c.countryRegion).filter(Boolean))],
    [companies],
  );

  // Filtering Logic

  const filteredCompanies = companies.filter((company) => {
    const searchMatch = company.companyName
      ?.toLowerCase()
      .includes(searchText.trim().toLowerCase());

    const industryMatch = filterIndustry
      ? company.industry === filterIndustry
      : true;

    const cityMatch = filterCity ? company.city === filterCity : true;

    const countryMatch = filterCountry
      ? company.countryRegion === filterCountry
      : true;

    const statusMatch = filterLeadStatus
      ? company.leadStatus === filterLeadStatus
      : true;

    const dateMatch = filterDate
      ? company.createdDate?.includes(filterDate.format("YYYY-MM-DD"))
      : true;

    return (
      searchMatch &&
      industryMatch &&
      cityMatch &&
      countryMatch &&
      statusMatch &&
      dateMatch
    );
  });

  // total pages
  const totalPages = Math.ceil(filteredCompanies.length / rowsPerPage);

  // paginate data
  const paginatedCompanies = filteredCompanies.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  );

  // Save Company
  const handleSave = async () => {
    if (!newCompany.companyName.trim()) return;

    if (selectedCompany) {
      await dispatch(
        updateCompany({ id: selectedCompany.id, data: newCompany }),
      );
      setSnackbarMessage("Company updated successfully");
    } else {
      await dispatch(createCompany(newCompany));
      setSnackbarMessage("Company created successfully");
    }

    setDrawerOpen(false);
    setSelectedCompany(null);
    setNewCompany(initialCompanyState);
    setSnackbarOpen(true);
  };

  // Delete Company
  const handleDelete = async () => {
    if (!companyToDelete) return;

    await dispatch(deleteCompany(companyToDelete));

    setSnackbarMessage("Company deleted successfully");
    setDeleteDialogOpen(false);
    setCompanyToDelete(null);
    setSnackbarOpen(true);
  };
  return (
    <Box sx={{ p: 2 }}>
      <Stack spacing={2}>
        <ModuleTopBar
          title="Companies"
          onCreate={() => {
            setSelectedCompany(null);
            setNewCompany(initialCompanyState);
            setDrawerOpen(true);
          }}
          searchValue={searchText}
          onSearchChange={setSearchText}
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />

        <Stack direction="row" spacing={2} flexWrap="wrap">
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <Select
              displayEmpty
              value={filterIndustry}
              onChange={(e) => setFilterIndustry(e.target.value)}
            >
              <MenuItem value="">Industry Type</MenuItem>
              {industries.map((industry) => (
                <MenuItem key={industry} value={industry}>
                  {industry}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 150 }}>
            <Select
              displayEmpty
              value={filterCity}
              onChange={(e) => setFilterCity(e.target.value)}
            >
              <MenuItem value="">City</MenuItem>
              {cities.map((city) => (
                <MenuItem key={city} value={city}>
                  {city}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 150 }}>
            <Select
              displayEmpty
              value={filterCountry}
              onChange={(e) => setFilterCountry(e.target.value)}
            >
              <MenuItem value="">Country/Region</MenuItem>
              {countries.map((country) => (
                <MenuItem key={country} value={country}>
                  {country}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 150 }}>
            <Select
              value={filterLeadStatus}
              onChange={(e) => setFilterLeadStatus(e.target.value)}
              displayEmpty
              renderValue={(selected) => {
                if (!selected) {
                  return <span style={{ color: "#000" }}>Lead Status</span>;
                }
                return selected;
              }}
            >
              <MenuItem value="Lead Status">Lead Status</MenuItem>
              <MenuItem value="New">New</MenuItem>
              <MenuItem value="Open">Open</MenuItem>
              <MenuItem value="Contacted">Contacted</MenuItem>
              <MenuItem value="Qualified">Qualified</MenuItem>
            </Select>
          </FormControl>

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Created Date"
              format="DD/MM/YYYY"
              value={filterDate}
              onChange={setFilterDate}
              slotProps={{
                textField: {
                  size: "small",
                  sx: {
                    "& .MuiInputBase-input::placeholder": {
                      color: "black",
                      opacity: 1,
                    },
                    "& .MuiInputLabel-root": {
                      color: "black",
                    },
                  },
                },
              }}
            />
          </LocalizationProvider>
        </Stack>

        <DataTable
          rows={paginatedCompanies}
          columns={companyColumns}
          loading={loading}
          selectedRows={selectedRows}
          setSelectedRows={setSelectedRows}
          // onRowClick={(row) => navigate(`/companies/${row.id}`)}
          onRowClick={(row) => navigate(`/companies/${row.id || row._id}`)}
          onEdit={(row) => {
            setSelectedCompany(row);
            setNewCompany(row);
            setDrawerOpen(true);
          }}
          onDelete={(row) => {
            setCompanyToDelete(row.id || row._id);
            setDeleteDialogOpen(true);
          }}
        />
      </Stack>

      <CreateEditDrawer
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setSelectedCompany(null);
        }}
        title={selectedCompany ? "Edit Company" : "Create Company"}
        onSave={handleSave}
      >
        <Stack spacing={2}>
          <TextField
            label="Domain Name"
            value={newCompany.domainName}
            onChange={(e) =>
              setNewCompany({ ...newCompany, domainName: e.target.value })
            }
            fullWidth
            required
          />

          <TextField
            label="Company Name"
            value={newCompany.companyName}
            onChange={(e) =>
              setNewCompany({ ...newCompany, companyName: e.target.value })
            }
            fullWidth
            required
          />

          <TextField
            label="Company Owner"
            value={newCompany.companyOwner}
            onChange={(e) =>
              setNewCompany({ ...newCompany, companyOwner: e.target.value })
            }
            fullWidth
            required
          />

          <Stack direction="row" spacing={2}>
            <FormControl fullWidth size="small">
              <Select
                displayEmpty
                value={newCompany.industry}
                onChange={(e) =>
                  setNewCompany({ ...newCompany, industry: e.target.value })
                }
              >
                <MenuItem value="">Choose Industry</MenuItem>
                <MenuItem value="IT">IT</MenuItem>
                <MenuItem value="Finance">Finance</MenuItem>
                <MenuItem value="Marketing">Marketing</MenuItem>
                <MenuItem value="Healthcare">Healthcare</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth size="small">
              <Select
                displayEmpty
                value={newCompany.type}
                onChange={(e) =>
                  setNewCompany({ ...newCompany, type: e.target.value })
                }
              >
                <MenuItem value="">Choose Type</MenuItem>
                <MenuItem value="Startup">Startup</MenuItem>
                <MenuItem value="SME">SME</MenuItem>
                <MenuItem value="Enterprise">Enterprise</MenuItem>
              </Select>
            </FormControl>
          </Stack>

          <Stack direction="row" spacing={2}>
            <TextField
              label="City"
              value={newCompany.city}
              onChange={(e) =>
                setNewCompany({ ...newCompany, city: e.target.value })
              }
              fullWidth
            />

            <TextField
              label="Country/Region"
              value={newCompany.countryRegion}
              onChange={(e) =>
                setNewCompany({ ...newCompany, countryRegion: e.target.value })
              }
              fullWidth
            />
          </Stack>

          <Stack direction="row" spacing={2}>
            <TextField
              label="No of Employees"
              value={newCompany.noOfEmployees}
              onChange={(e) =>
                setNewCompany({ ...newCompany, noOfEmployees: e.target.value })
              }
              fullWidth
            />

            <TextField
              label="Annual Revenue"
              value={newCompany.annualRevenue}
              onChange={(e) =>
                setNewCompany({ ...newCompany, annualRevenue: e.target.value })
              }
              fullWidth
            />
          </Stack>

          <Stack spacing={0.5}>
            <PhoneInput
              country={"in"}
              value={newCompany.phoneNumber || ""}
              onChange={(phoneNumber) =>
                setNewCompany({ ...newCompany, phoneNumber })
              }
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
        </Stack>
      </CreateEditDrawer>

      <AppSnackbar
        open={snackbarOpen}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />

      <ConfirmationDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Delete Company"
        message="Are you sure you want to delete this company?"
        confirmText="Delete"
      />
    </Box>
  );
};

export default CompaniesList;
