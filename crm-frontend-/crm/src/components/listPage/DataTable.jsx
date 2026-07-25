// src/components/common/DataTable.jsx
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Checkbox,
  IconButton,
  Box,
  TableContainer,
  Paper,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";

export default function DataTable({
  rows,
  columns,
  loading,
  onRowClick,
  onEdit,
  onDelete,
  selectedRows,
  setSelectedRows,
}) {
  const isSelected = (id) => selectedRows.includes(id);

  const handleSelectAll = (event) => {
    setSelectedRows(event.target.checked ? rows.map((r) => r.id) : []);
  };

  const handleSelectRow = (event, id) => {
    event.stopPropagation();
    setSelectedRows(
      isSelected(id)
        ? selectedRows.filter((x) => x !== id)
        : [...selectedRows, id],
    );
  };

  if (loading) return <p>Loading...</p>;

  return (
    <TableContainer
      component={Paper}
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 1, // 👈 rounded corners
        overflow: "hidden", // 👈 VERY IMPORTANT (clips table corners)
      }}
    >
      <Table>
        <TableHead
          sx={{
            backgroundColor: "primary.main",
            "& .MuiTableCell-head": {
              color: "primary.contrastText",
              fontWeight: 600,
              textTransform: "uppercase",
            },
          }}
        >
          <TableRow
            hover
            onClick={() => onRowClick && onRowClick(row)}
            sx={{ cursor: "pointer" }}
          >
            <TableCell padding="checkbox">
              <Checkbox
                indeterminate={
                  selectedRows.length > 0 && selectedRows.length < rows.length
                }
                checked={rows.length > 0 && selectedRows.length === rows.length}
                onChange={handleSelectAll}
              />
            </TableCell>

            {columns.map((col, idx) => (
              <TableCell key={idx}>{col.headerName}</TableCell>
            ))}

            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.id}
              hover
              selected={isSelected(row.id)}
              onDoubleClick={() => onRowClick(row)}
              sx={{ cursor: "pointer" }}
            >
              <TableCell padding="checkbox">
                <Checkbox
                  checked={isSelected(row.id)}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => handleSelectRow(e, row.id)}
                />
              </TableCell>

              {columns.map((col, idx) => (
                <TableCell key={idx}>
                  {col.renderCell ? col.renderCell(row) : row[col.field]}
                </TableCell>
              ))}

              <TableCell align="right">
                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    justifyContent: "flex-end",
                  }}
                >
                  <IconButton onClick={() => onEdit(row)}>
                    <EditIcon fontSize="small" color="primary" />
                  </IconButton>
                  <IconButton onClick={() => onDelete(row)} color="error">
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
