export const mapCompanyToSidebarProfile = (company) => ({
  name: company.companyName || company.name || "-",

  jobTitle: company.industry || "-",

  email: company.domainName || company.domain || "-",

  avatarUrl: company.avatarUrl || null,

  avatarLetter: company.companyName?.[0] || company.name?.[0] || "?",

  onCopyEmail: () => {
    const email = company.domainName || company.domain;
    if (email) navigator.clipboard.writeText(email);
  },
});

export const mapCompanyToSidebarInfo = (company) => [
  {
    key: "domainName",
    label: "Company Domain Name",
    value: company.domainName || company.domain || "-",
  },
  {
    key: "companyName",
    label: "Company Name",
    value: company.companyName || company.name || "-",
  },
  {
    key: "industry",
    label: "Industry",
    value: company.industry || "-",
  },
  {
    key: "phoneNumber",
    label: "Phone Number",
    value: company.phoneNumber || company.phone || "-",
  },
  {
    key: "companyOwner",
    label: "Company Owner",
    value: company.companyOwner || company.owner || "-",
  },
  {
    key: "city",
    label: "City",
    value: company.city || "-",
  },
  {
    key: "countryRegion",
    label: "Country/Region",
    value: company.countryRegion || company.country || "-",
  },
  {
    key: "noOfEmployees",
    label: "No of Employees",
    value: company.noOfEmployees || company.employees || "-",
  },
  {
    key: "annualRevenue",
    label: "Annual Revenue",
    value: company.annualRevenue || company.revenue || "-",
  },
  {
    key: "createdDate",
    label: "Created Date",
    value:
      company.createdDate || company.created_at
        ? new Date(
            company.createdDate || company.created_at,
          ).toLocaleDateString()
        : "-",
  },
];
