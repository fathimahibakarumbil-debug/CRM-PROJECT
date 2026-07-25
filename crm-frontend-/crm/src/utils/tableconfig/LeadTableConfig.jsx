import { Chip } from "@mui/material";

const getStatusChipProps = (status) => {
  const baseStyle = {
    height: 24,
    width: 120,
    fontSize: 12,
    fontWeight: 600,
    px: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  switch (status) {
    case "New":
      return {
        label: "New",
        sx: { ...baseStyle, color: "#1E3A8A", bgcolor: "#DBEAFE" },
      };

    case "InProgress":
    case "In Progress":
      return {
        label: "In Progress",
        sx: { ...baseStyle, color: "#B45309", bgcolor: "#FEF3C7" },
      };

    case "Open":
      return {
        label: "Open",
        sx: { ...baseStyle, color: "#065F46", bgcolor: "#D1FAE5" },
      };

    case "Contacted":
      return {
        label: "Contacted",
        sx: { ...baseStyle, color: "#9333EA", bgcolor: "#F3E8FF" },
      };

    case "Qualified":
      return {
        label: "Qualified",
        sx: { ...baseStyle, color: "#B91C1C", bgcolor: "#FEE2E2" },
      };

    default:
      return { label: status, sx: baseStyle };
  }
};

export const leadColumns = [
  // { field: "id", headerName: "ID" },
  {
    field: "name",
    headerName: "NAME",
    renderCell: (r) => `${r.firstName} ${r.lastName}`,
  },
  { field: "email", headerName: "EMAIL" },
  { field: "phone", headerName: "PHONE NUMBER" },
  { field: "createdDate", headerName: "CREATED DATE" },
  {
    field: "leadStatus",
    headerName: "Status",
    renderCell: (row) => {
      const chipProps = getStatusChipProps(row.leadStatus);
      return <Chip {...chipProps} />;
    },
  },
];
