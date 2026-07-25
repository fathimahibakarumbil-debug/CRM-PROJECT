import React, { useState, useEffect } from "react";
import {
  Drawer,
  Avatar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Badge,
  Divider,
  Box,
  Button,
} from "@mui/material";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../store/authSlice";
import { useNavigate } from "react-router-dom";
import { getNotifications } from "../../store/notificationSlice";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import { getGlobalSearch, clearSearch } from "../../store/globalSearchSlice";

const Topbar = () => {
  const { user } = useSelector((state) => state.auth);
  const { list: notifications = [] } = useSelector(
    (state) => state.notifications,
  );
  const { results } = useSelector((state) => state.globalSearch);
  const { loading } = useSelector((state) => state.globalSearch);

  const [search, setSearch] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ========================
  // Avatar Menu
  // ========================

  const [profileOpen, setProfileOpen] = useState(false);

  // const ProfileRow = ({ label, value }) => (
  //   <Box
  //     sx={{
  //       bgcolor: "#fff",
  //       p: 2,
  //       borderRadius: 3,
  //       boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
  //       display: "flex",
  //       justifyContent: "space-between",
  //       alignItems: "center",
  //     }}
  //   >
  //     <Typography
  //       sx={{
  //         color: "#666",
  //         fontSize: 14,
  //       }}
  //     >
  //       {label}
  //     </Typography>

  //     <Typography
  //       sx={{
  //         fontWeight: 600,
  //         color: "#111",
  //       }}
  //     >
  //       {value || "Not Available"}
  //     </Typography>
  //   </Box>
  // );
  const ProfileRow = ({ label, value }) => (
    <Box
      sx={{
        bgcolor: "#fff",
        p: 2,
        borderRadius: 3,
        border: "1px solid #edf0f5",
        transition: ".3s",

        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 6px 16px rgba(0,0,0,0.08)",
        },
      }}
    >
      <Typography
        sx={{
          fontSize: 12,
          color: "#8a8fa3",
          mb: 0.5,
          textTransform: "uppercase",
          letterSpacing: 1,
        }}
      >
        {label}
      </Typography>

      <Typography
        sx={{
          fontWeight: 600,
          color: "#1a1a1a",
        }}
      >
        {value || "Not Available"}
      </Typography>
    </Box>
  );
  const handleLoginLogout = () => {
    if (user) {
      dispatch(logout());
      navigate("/login");
    } else {
      navigate("/login");
    }
  };

  // ========================
  // Notification Menu
  // ========================
  const [notificationAnchor, setNotificationAnchor] = useState(null);

  const handleNotificationClick = (event) => {
    setNotificationAnchor(event.currentTarget);
  };

  const closeNotificationMenu = () => {
    setNotificationAnchor(null);
  };

  // ========================
  // Load Notifications
  // ========================
  useEffect(() => {
    dispatch(getNotifications());

    const interval = setInterval(() => {
      dispatch(getNotifications());
    }, 10000);

    return () => clearInterval(interval);
  }, [dispatch]);

  // ========================
  // Global Search (Debounce)
  // ========================
  useEffect(() => {
    if (!search.trim()) {
      dispatch(clearSearch());
      return;
    }

    const timer = setTimeout(() => {
      dispatch(getGlobalSearch(search));
    }, 400);

    return () => clearTimeout(timer);
  }, [search, dispatch]);

  // ========================
  // Helpers
  // ========================
  const hasResults =
    results?.leads?.length ||
    results?.companies?.length ||
    results?.deals?.length ||
    results?.tickets?.length;

  const handleNavigate = (path) => {
    navigate(path);
    setSearch(""); // close dropdown
    dispatch(clearSearch());
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: 80,
        bgcolor: "#ffffff",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        px: 4,
        borderBottom: "1px solid #f0f0f0",
        zIndex: 1000,
      }}
    >
      <Typography
        variant="h5"
        sx={{
          fontWeight: "800",
          color: "#000000",
          letterSpacing: "-0.5px",
        }}
      >
        CRM
      </Typography>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          position: "relative",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            px: 2,
            py: 0.8,
            borderRadius: "12px",
            width: 350,
            border: "1px solid #ccced0",
            boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
            transition: "all 0.3s ease",
            "&:hover": {
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            },
            "&:focus-within": {
              border: "1px solid #635bff",
              boxShadow: "0 0 0 2px rgba(25,118,210,0.1)",
            },
          }}
        >
          <SearchIcon sx={{ color: "#9e9e9e", mr: 1 }} />

          <InputBase
            placeholder="Search..."
            fullWidth
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{
              fontSize: "15px",
              color: "#333",
              "& input::placeholder": {
                color: "#aaa",
                opacity: 1,
              },
            }}
          />
        </Box>

        {/* DROPDOWN */}
        {search && (
          <Box
            sx={{
              position: "absolute",
              top: 70,
              width: 350,
              bgcolor: "white",
              boxShadow: 3,
              borderRadius: 1,
              maxHeight: 300,
              overflowY: "auto",
              zIndex: 2000,
            }}
          >
            {loading ? (
              <MenuItem>Searching...</MenuItem>
            ) : !hasResults ? (
              <MenuItem>No Results Found</MenuItem>
            ) : (
              <>
                {/* Leads */}
                {results?.leads?.length > 0 && (
                  <>
                    <Typography
                      sx={{ px: 2, pt: 1, fontSize: 13, color: "#1976d2" }}
                    >
                      Leads
                    </Typography>
                    {results.leads.map((lead) => (
                      <MenuItem
                        key={lead.id}
                        onClick={() => handleNavigate(`/leads/${lead.id}`)}
                      >
                        <Box>
                          <Typography>
                            {lead.firstName} {lead.lastName}
                          </Typography>
                          <Typography fontSize={12} color="gray">
                            {lead.leadStatus}
                          </Typography>
                        </Box>
                      </MenuItem>
                    ))}
                  </>
                )}

                {/* Companies */}
                {results?.companies?.length > 0 && (
                  <>
                    <Divider />
                    <Typography
                      sx={{ px: 2, pt: 1, fontSize: 13, color: "#2e7d32" }}
                    >
                      Companies
                    </Typography>
                    {results.companies.map((c) => (
                      <MenuItem
                        key={c.id}
                        onClick={() => handleNavigate(`/companies/${c.id}`)}
                      >
                        <Box>
                          <Typography>{c.companyName}</Typography>
                          <Typography fontSize={12} color="gray">
                            {c.industry}
                          </Typography>
                        </Box>
                      </MenuItem>
                    ))}
                  </>
                )}

                {/* Deals */}
                {results?.deals?.length > 0 && (
                  <>
                    <Divider />
                    <Typography
                      sx={{ px: 2, pt: 1, fontSize: 13, color: "#9c27b0" }}
                    >
                      Deals
                    </Typography>
                    {results.deals.map((deal) => (
                      <MenuItem
                        key={deal.id}
                        onClick={() => handleNavigate(`/deals/${deal.id}`)}
                      >
                        <Box>
                          <Typography>{deal.deal_name}</Typography>
                          <Typography fontSize={12} color="gray">
                            {deal.deal_stage}
                          </Typography>
                        </Box>
                      </MenuItem>
                    ))}
                  </>
                )}

                {/* Tickets */}
                {results?.tickets?.length > 0 && (
                  <>
                    <Divider />
                    <Typography
                      sx={{ px: 2, pt: 1, fontSize: 13, color: "#ed6c02" }}
                    >
                      Tickets
                    </Typography>
                    {results.tickets.map((ticket) => (
                      <MenuItem
                        key={ticket.id}
                        onClick={() => handleNavigate(`/tickets/${ticket.id}`)}
                      >
                        <Box>
                          <Typography>{ticket.ticket_name}</Typography>
                          <Typography fontSize={12} color="gray">
                            {ticket.ticket_status}
                          </Typography>
                        </Box>
                      </MenuItem>
                    ))}
                  </>
                )}
              </>
            )}
          </Box>
        )}
        {/* ================= Notifications ================= */}
        <IconButton
          onClick={handleNotificationClick}
          sx={{
            border: "1px solid #ccced0",
            borderRadius: "8px",
            p: 1,
            color: "#635bff",
          }}
        >
          <Badge badgeContent={unreadCount} color="error">
            <NotificationsNoneIcon />
          </Badge>
        </IconButton>

        <Menu
          anchorEl={notificationAnchor}
          open={Boolean(notificationAnchor)}
          onClose={closeNotificationMenu}
        >
          {notifications.length === 0 ? (
            <MenuItem>No Notifications</MenuItem>
          ) : (
            notifications.map((n) => (
              <MenuItem key={n.id}>
                <Box>
                  <Typography fontWeight="bold">{n.title}</Typography>
                  <Typography variant="body2">{n.message}</Typography>
                </Box>
              </MenuItem>
            ))
          )}
        </Menu>

        {/* ================= Avatar ================= */}

        <Avatar
          onClick={() => setProfileOpen(true)}
          sx={{
            bgcolor: "#635bff",
            width: 40,
            height: 40,
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          {user?.firstName?.[0]?.toUpperCase() ||
            user?.email?.[0]?.toUpperCase() ||
            "U"}
        </Avatar>

        {/* Avatar Menu */}
      </Box>
      <Drawer
        anchor="right"
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
        PaperProps={{
          sx: {
            width: 400,
            bgcolor: "#f5f7fb",
          },
        }}
      >
        <Box
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Header */}
          <Box
            sx={{
              background: "linear-gradient(135deg,#635BFF,#7B61FF)",
              py: 5,
              px: 3,
              textAlign: "center",
              color: "#fff",
            }}
          >
            <Avatar
              sx={{
                width: 90,
                height: 90,
                mx: "auto",
                mb: 2,
                fontSize: 34,
                bgcolor: "#fff",
                color: "#635BFF",
                fontWeight: 700,
                boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
              }}
            >
              {user?.firstName?.[0]?.toUpperCase() ||
                user?.email?.[0]?.toUpperCase() ||
                "U"}
            </Avatar>

            <Typography variant="h6" fontWeight={700}>
              {user?.firstName} {user?.lastName}
            </Typography>

            <Typography
              sx={{
                opacity: 0.9,
                fontSize: 14,
                mt: 0.5,
              }}
            >
              {user?.email}
            </Typography>

            <Box
              sx={{
                mt: 2,
                display: "inline-block",
                px: 2,
                py: 0.7,
                borderRadius: 10,
                bgcolor: "rgba(255,255,255,0.2)",
                backdropFilter: "blur(8px)",
              }}
            >
              <Typography fontSize={13} fontWeight={600}>
                {user?.role || "User"}
              </Typography>
            </Box>
          </Box>

          {/* Profile Details */}
          <Box
            sx={{
              flex: 1,
              overflowY: "auto",
              p: 3,
            }}
          >
            <Typography
              sx={{
                fontWeight: 700,
                mb: 2,
                color: "#333",
              }}
            >
              Profile Information
            </Typography>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <ProfileRow label="First Name" value={user?.firstName} />
              <ProfileRow label="Last Name" value={user?.lastName} />
              <ProfileRow label="Email" value={user?.email} />
              <ProfileRow label="Phone" value={user?.phone} />
              <ProfileRow label="Company" value={user?.companyName} />
              <ProfileRow label="Industry" value={user?.industryType} />
              <ProfileRow label="Country" value={user?.country} />
            </Box>
          </Box>

          {/* Footer */}
          <Box
            sx={{
              p: 3,
              borderTop: "1px solid #eaeaea",
              bgcolor: "#fff",
            }}
          >
            <Button
              fullWidth
              onClick={handleLoginLogout}
              sx={{
                py: 1.6,
                borderRadius: 3,
                textTransform: "none",
                fontWeight: 700,
                fontSize: 15,
                color: "#fff",
                background: "linear-gradient(135deg,#635BFF 0%,#7B61FF 100%)",

                "&:hover": {
                  background: "linear-gradient(135deg,#5a52f0 0%,#6f58ff 100%)",
                  transform: "translateY(-2px)",
                  boxShadow: "0 10px 20px rgba(99,91,255,.3)",
                },
              }}
            >
              Logout
            </Button>
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
};

export default Topbar;