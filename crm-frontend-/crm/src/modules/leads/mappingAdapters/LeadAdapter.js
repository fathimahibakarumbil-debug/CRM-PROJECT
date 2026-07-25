export const mapLeadToSidebarProfile = (lead) => {
  if (!lead) return null;

  return {
    firstName: lead.firstName,
    lastName: lead.lastName,
    avatarLetter:
      `${lead.firstName?.[0] || ""}${lead.lastName?.[0] || ""}` || "?",
    name: `${lead.firstName} ${lead.lastName}`,
    jobTitle: lead.jobTitle,
    email: lead.email,
    avatarUrl: lead.avatarUrl,
    onCopyEmail: () => {
      if (lead.email) {
        navigator.clipboard.writeText(lead.email);
      }
    },
  };
};

export const mapLeadToSidebarInfo = (lead) => {
  if (!lead) return [];

  return [
    {
      key: "email",
      label: "Email",
      value: lead.email,
    },
    {
      key: "firstName",
      label: "First Name",
      value: lead.firstName,
    },
    {
      key: "lastName",
      label: "Last Name",
      value: lead.lastName,
    },
    {
      key: "phone",
      label: "Phone number",
      value: lead.phone,
    },
    {
      key: "leadStatus",
      label: "Lead Status",
      value: lead.leadStatus,
      type: "select",
      options: [
        { label: "New", value: "New" },
        { label: "Open", value: "Open" },
        { label: "Contacted", value: "Contacted" },
        { label: "In Progress", value: "In Progress" },
        { label: "Qualified", value: "Qualified" },
        { label: "Converted", value: "Converted", disabled: true },
      ],
    },
    {
      key: "jobTitle",
      label: "Job Title",
      value: lead.jobTitle,
    },
    {
      key: "createdDate",
      label: "Created Date",
      value: lead.createdDate,
    },
  ];
};
