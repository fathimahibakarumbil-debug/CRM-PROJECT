export const dealColumns = [
  { field: "dealName", headerName: "Deal Name" },
  { field: "dealStage", headerName: "Deal Stage" },
  { field: "closeDate", headerName: "Close Date" },
  // { field: "dealOwner", headerName: "Deal Owner" },
    {
    field: "dealOwner",
    headerName: "Deal Owner",
    renderCell: (row) =>
      Array.isArray(row.dealOwner)
        ? row.dealOwner.join(", ")
        : row.dealOwner,
  },  
  {
    field: "amount",
    headerName: "Amount",
    renderCell: (row) =>
      typeof row.amount === "number" ? `$${row.amount}` : row.amount,
  },
  
];
