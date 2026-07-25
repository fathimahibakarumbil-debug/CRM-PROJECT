
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { Box } from "@mui/material";

const SIDEBAR_WIDTH = 100; // px
const TOPBAR_HEIGHT = 80;  // px

function MainLayout() {
  return (
    <Box sx={{ display: "flex", width: "100%", minHeight: "100vh" }}>
      
      {/* Fixed Sidebar */}
      <Box
        sx={{
          width: `${SIDEBAR_WIDTH}px`,
          position: "fixed",
          top: 0,
          left: 0,
          height: "100vh",
          backgroundColor: "#fff",
          borderRight: "1px solid #e0e0e0",
          zIndex: 10,
        }}
      >
        <Sidebar />
      </Box>

      {/* Main content wrapper */}
      <Box
        sx={{
          marginLeft: `${SIDEBAR_WIDTH}px`,
          flexGrow: 1,
          minWidth: 0,
        }}
      >
        <Topbar />

        {/* Main Content Area */}
        <Box
          sx={{
            mt: `${TOPBAR_HEIGHT}px`,
            minWidth: "800px",
            backgroundColor: "#f8fafc",
            overflowX: "auto",
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}

export default MainLayout;