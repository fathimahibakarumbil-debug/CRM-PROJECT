export const mapDealToSidebarProfile = (deal) => {
  if (!deal) return null;

  return {
    name: deal.dealName || "Website Revamp - Atlas Corp",

    amountText: deal.amount
      ? `Amount : ${deal.amount}`
      : "Amount : $12,500",

    jobTitle: "Deal Stage", 

    stage: deal.dealStage || "Contact", 
  };
};

export const mapDealToSidebarInfo = (deal) => {
  if (!deal) return [];

  return [
    {
      key: "owner",
      label: "Deal Owner",
      value: deal.dealOwner || "Jane Cooper",
    },
    {
      key: "priority",
      label: "Priority",
      value: deal.priority || "High",
      type: "select", 
      options: [
        { label: "High", value: "High" },
        { label: "Medium", value: "Medium" },
        { label: "Low", value: "Low" }
      ],
    },
    {
      key: "createdDate",
      label: "Created Date",
      value: deal.createdDate || "04/08/2025 2:31 PM GMT+5:30",
      disabled: true 
    },
  ];
};
