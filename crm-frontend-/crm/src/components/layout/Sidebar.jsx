import { Box, Typography } from "@mui/material";
import { NavLink } from "react-router-dom";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import BusinessCenterOutlinedIcon from "@mui/icons-material/BusinessCenterOutlined";
import ConfirmationNumberOutlinedIcon from "@mui/icons-material/ConfirmationNumberOutlined";
const menuItems = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: <DashboardOutlinedIcon size={20} />,
  },
  { label: "Leads", path: "/leads", icon: <PeopleOutlineIcon size={20} /> },
  {
    label: "Companies",
    path: "/companies",
    icon: <BusinessCenterOutlinedIcon size={20} />,
  },
  {
    label: "Deals",
    path: "/deals",
    icon: <AssignmentTurnedInIcon size={20} />,
  },
  {
    label: "Tickets",
    path: "/tickets",
    icon: <ConfirmationNumberOutlinedIcon size={20} />,
  },
];

export default function Sidebar() {
  return (
    <Box
      sx={{
        width: 100,
        height: "calc(100vh - 80px)",
        position: "fixed",
        top: 80,
        left: 0,
        bgcolor: "#f3f4f6",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        pt: 3,
      }}
    >
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 3,
        }}
      >
        {menuItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            style={{ textDecoration: "none" }}
          >
            {({ isActive }) => (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  cursor: "pointer",
                }}
              >
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: "50%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    mb: 1,
                    transition: "0.3s",
                    background: isActive
                      ? "linear-gradient(135deg, #6366f1, #8b5cf6)"
                      : "#e5e7eb",
                    color: isActive ? "#fff" : "#64748b",
                  }}
                >
                  {item.icon}
                </Box>

                <Typography
                  sx={{
                    fontWeight: 500,
                    fontSize: 14,
                    color: "#334155",
                  }}
                >
                  {item.label}
                </Typography>
              </Box>
            )}
          </NavLink>
        ))}
      </Box>
    </Box>
  );
}
