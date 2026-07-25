import { Box, Tabs, Tab } from "@mui/material";

export default function CustomTabs({ tabs = [], currentTab = 0, onTabChange }) {
  const handleChange = (event, newValue) => {
    onTabChange?.(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      {/* Tabs Header */}
      <Tabs
        value={currentTab}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          borderBottom: "1px solid #e0e0e0",
          "& .MuiTab-root": {
            textTransform: "none",
            fontSize: "15px",
            color: "#8a94a6",
          },
          "& .Mui-selected": {
            color: "#5b5bd6 !important",
          },
          "& .MuiTabs-indicator": {
            backgroundColor: "#5b5bd6",
            borderRadius: "3px",
          },
        }}
      >
        {tabs.map((tab, index) => (
          <Tab key={index} label={tab.label} />
        ))}
      </Tabs>

      {/* Active Tab Content */}
      <Box sx={{ mt: 3 }}>{tabs[currentTab]?.content || null}</Box>
    </Box>
  );
}
