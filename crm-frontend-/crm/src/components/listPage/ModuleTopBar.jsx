import { Stack, Typography, Button, TextField, Pagination } from "@mui/material";

const ModuleTopBar = ({
  title,
  onCreate,
  onImport,
  searchValue,
  onSearchChange,
  totalPages,
  currentPage,
  onPageChange,
}) => {
  
  return (
    <>
      {/* HEADER */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{
          p: 1,
          boxShadow: "0px 2px 4px rgba(0,0,0,0.08)",
        }}
      >
        <Typography variant="h5" fontWeight={600}>
          {title}
        </Typography>

        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            sx={{ height: 40, minWidth: 150, textTransform: "none" }}
            onClick={onImport}
          >
            Import
          </Button>

          <Button
            variant="contained"
            sx={{ height: 40, minWidth: 150, textTransform: "none" }}
            onClick={onCreate}
          >
            Create
          </Button>
        </Stack>
      </Stack>

      {/* SEARCH + PAGINATION */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          p: 1,
          boxShadow: "0px 2px 4px rgba(0,0,0,0.08)",
        }}
      >
        <TextField
          placeholder="Search"
          size="small"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          sx={{ width: 405 }}
        />

        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={(e, value) => onPageChange(value)}
          color="primary"
          showFirstButton
          showLastButton
        />
      </Stack>
    </>
  );
};

export default ModuleTopBar;