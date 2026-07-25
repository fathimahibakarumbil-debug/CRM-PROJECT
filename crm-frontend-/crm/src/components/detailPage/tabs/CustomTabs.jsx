// src/components/common/CenterTabs.jsx
import { Tabs, Tab, Box } from "@mui/material";

export default function CustomTabs({ tabs = [], currentTab, onTabChange }) {
  return (
    <>
      <Tabs
        value={currentTab}
        onChange={(e, newValue) => onTabChange(newValue)}
        sx={{ borderBottom: 1, borderColor: "divider" }}
      >
        {tabs.map((tab, idx) => (
          <Tab key={idx} label={tab.label} sx={{ textTransform: "none" }} />
        ))}
      </Tabs>

      <Box mt={2}>
        {tabs.map((tab, idx) => (
          <Box key={idx} sx={{ display: currentTab === idx ? "block" : "none" }}>
            {tab.component}
          </Box>
        ))}
      </Box>
    </>
  );
}