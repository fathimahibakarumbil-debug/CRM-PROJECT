import {
  Box,
  Stack,
  Typography,
  Button,
  Avatar,
  IconButton,
  Tooltip,
  MenuItem,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit"; // <-- import the pen icon

import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import SaveIcon from "@mui/icons-material/Save";
import { TextField } from "@mui/material";
import { useState, useEffect } from "react";
export default function LeftSidebar({
  header,
  backAction,
  profile,
  quickActions = [],
  info = [],
  infoHeader,
  onSaveInfo,
  onStageChange,
  showAvatar = true,
}) {
  const [isOpen, setIsOpen] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const getStageColor = (stage) => {
    switch (stage) {
      case "Contact":
        return { bg: "#E0F2FE", color: "#0284C7" };
      case "Qualified":
        return { bg: "#DCFCE7", color: "#16A34A" };
      case "Proposal":
        return { bg: "#FEF3C7", color: "#D97706" };
      case "Negotiation":
        return { bg: "#FCE7F3", color: "#DB2777" };
      case "Closed Won":
        return { bg: "#DCFCE7", color: "#15803D" };
      case "Closed Lost":
        return { bg: "#FEE2E2", color: "#DC2626" };
      default:
        return { bg: "#F1F5F9", color: "#475569" };
    }
  };
  const stageColor = getStageColor(profile.stage);
  useEffect(() => {
    const obj = {};
    info.forEach((item) => {
      obj[item.key] = item.value;
    });
    setFormData(obj);
  }, [info]);

  const handleSave = () => {
    if (onSaveInfo) {
      onSaveInfo(formData);
    }
    setIsEditing(false);
  };
  const DEAL_STAGES = [
    "Contact",
    "Qualified",
    "Proposal",
    "Negotiation",
    "Closed Won",
    "Closed Lost",
  ];
  return (
    <Box
      sx={{
        width: 260,
        bgcolor: "background.paper",
        p: 1,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <Stack direction="row" alignItems="center" gap={1} mb={2}>
        <Button onClick={backAction || (() => window.history.back())}>←</Button>
        <Typography variant="subtitle1">{header}</Typography>
      </Stack>

      {/* Profile */}
      {/* Profile */}
      {profile && (
        <Stack direction="row" alignItems="center" gap={1} mb={2}>
          {/* {profile.avatarUrl ? (
            <Avatar
              ssrc={profile.avatarUrl || undefined}
              variant="square"
              sx={{
                bgcolor: "primary.main",
                width: 48,
                height: 48,
                borderRadius: 4 + "px !important",
              }}
            />
          ) : (
            <Avatar
              variant="square"
              sx={{
                bgcolor: "primary.main",
                width: 48,
                height: 48,
                borderRadius: 4 + "px !important",
              }}
            >
              {profile.avatarLetter || "?"}
            </Avatar>
          )} */}
          {showAvatar &&
  (profile.avatarUrl ? (
    <Avatar
      src={profile.avatarUrl || undefined}
      variant="square"
      sx={{
        bgcolor: "primary.main",
        width: 48,
        height: 48,
        borderRadius: "4px !important",
      }}
    />
  ) : (
    <Avatar
      variant="square"
      sx={{
        bgcolor: "primary.main",
        width: 48,
        height: 48,
        borderRadius: "4px !important",
      }}
    >
      {profile.avatarLetter || "?"}
    </Avatar>
  ))}

          <Box sx={{ flex: 1, minWidth: 0 }}>
            {/* Name */}

            <Tooltip title={profile.name}>
              <Typography
                variant="h6"
                sx={{
                  fontSize: 16,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  color: "text.primary",
                  fontWeight: 700,
                }}
              >
                {profile.name}
              </Typography>
            </Tooltip>

            {profile.stage && (
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  px: 1.2,
                  py: 0.3,
                  borderRadius: 5,
                  fontSize: 12,
                  fontWeight: 500,

                  bgcolor: stageColor.bg,
                  color: stageColor.color,
                  width: "fit-content",
                  mt: 0.5,
                }}
              >
                {profile.stage}
              </Box>
            )}

            <Tooltip title={profile.email}>
              <Box display="flex" alignItems="center" gap={0.5} width="100%">
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    flex: 1,
                    minWidth: 0,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {profile.email}
                </Typography>
                {profile.onCopyEmail && (
                  <IconButton
                    size="small"
                    sx={{ p: 0.5 }}
                    onClick={profile.onCopyEmail}
                  >
                    <ContentCopyIcon color="primary" />
                  </IconButton>
                )}
              </Box>
            </Tooltip>
          </Box>
        </Stack>
      )}

      {profile?.stage && (
        <Box sx={{ mb: 2 }}>
          <Typography
            sx={{
              fontSize: 11,
              color: "text.secondary",
              mb: 0.5,
            }}
          >
            Deal Stage
          </Typography>

          <TextField
            select
            fullWidth
            size="small"
            value={profile.stage}
            onChange={(e) => onStageChange?.(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 3,
                backgroundColor: "#f1f5f9",
                fontSize: 13,
              },
            }}
          >
            {DEAL_STAGES.map((stage) => (
              <MenuItem key={stage} value={stage}>
                {stage}
              </MenuItem>
            ))}
          </TextField>
        </Box>
      )}

      {/* Quick Actions */}
      {quickActions.length > 0 && (
        <Stack direction="row" justifyContent="space-between" mb={2}>
          {quickActions.map((action, idx) => {
            const IconComp = action.icon;

            return (
              <Box
                key={idx}
                display="flex"
                flexDirection="column"
                alignItems="center"
                gap={0.5}
                sx={{ cursor: "pointer" }}
                onClick={action.onClick}
              >
                {/* Square Icon Box */}
                <Box
                  sx={{
                    width: 38,
                    height: 38,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#fff",
                    border: "1px solid",
                    borderColor: "text.secondary",
                    borderRadius: 1,
                  }}
                >
                  <IconComp
                    sx={{
                      fontSize: 20,
                      color: "primary.main",
                    }}
                  />
                </Box>

                {/* Text */}
                <Typography
                  sx={{
                    fontSize: 11,
                    color: "text.primary",
                    textTransform: "none",
                  }}
                >
                  {action.label}
                </Typography>
              </Box>
            );
          })}
        </Stack>
      )}

      {/* Info Section */}
      {/* Info Section */}
      {info.length > 0 && (
        <Box mt={2}>
          {/* Header */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            mb={1}
          >
            <Stack direction="row" alignItems="center" spacing={1}>
<IconButton size="small"   onClick={() => {
  setIsOpen(!isOpen);

  if (isOpen) {
    setIsEditing(false);
  }
}}
>
                {isOpen ? (
                  <KeyboardArrowDownIcon
                    fontSize="small"
                    sx={{
                      color: "primary.main",
                    }}
                  />
                ) : (
                  <KeyboardArrowRightIcon
                    fontSize="small"
                    sx={{
                      color: "primary.main",
                    }}
                  />
                )}


              </IconButton>

              <Typography variant="subtitle2">{infoHeader}</Typography>
            </Stack>

            {isOpen && (
              <IconButton
                size="small"
                onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
              >
                {isEditing ? (
                  <SaveIcon fontSize="small" color="primary" />
                ) : (
                  <EditIcon fontSize="small" color="primary" />
                )}
              </IconButton>
            )}

          </Stack>

          {/* Details */}
          {isOpen && (

            <Box mt={1}>
              {info.map((item) => (
                <Box key={item.key} mb={1}>
                  <Typography variant="caption" color="text.secondary">
                    {item.label}
                  </Typography>

                  {isEditing ? (
                    item.type === "select" ? (
                      <TextField
                        select
                        fullWidth
                        size="small"
                        value={formData[item.key] || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            [item.key]: e.target.value,
                          })
                        }
                      >
                        {item.options?.map((opt) => (
                          <MenuItem
                            key={opt.value}
                            value={opt.value}
                            disabled={opt.disabled}
                          >
                            {opt.label}
                          </MenuItem>
                        ))}
                      </TextField>
                    ) : (
                      <TextField
                        fullWidth
                        size="small"
                        value={formData[item.key] || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            [item.key]: e.target.value,
                          })
                        }
                      />
                    )
                  ) : (
                    <Typography variant="body2">
                      {formData[item.key] || "-"}
                    </Typography>
                  )}
                </Box>
              ))}
            </Box>
            )}
        </Box>
        
      )}
    </Box>
  );
}
