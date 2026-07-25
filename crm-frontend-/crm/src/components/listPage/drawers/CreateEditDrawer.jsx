import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Button,
  Stack,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const CreateEditDrawer = ({
  open,
  onClose,
  title,
  width = 420,
  children,
  onSave,
}) => {

      return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width,
          maxWidth: "100%",
          display: "flex",
          flexDirection: "column",
          height: "100%", // full height
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          borderBottom: "1px solid",
          borderColor: "divider",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0, // header does not shrink
        }}
      >
        <Typography variant="h6" fontWeight={600}>
          {title}
        </Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Body: children takes all remaining space */}
      <Box
        sx={{
          flex: 1,        
          p: 3,
          overflowY: "auto", 
        }}
      >
        {children}
      </Box>

      {/* Footer */}
      <Box
        sx={{
          p: 2,
          borderTop: "1px solid",
          borderColor: "divider",
          flexShrink: 0, // footer does not shrink
        }}
      >
        <Stack direction="row" spacing={2}>
          <Button variant="outlined" onClick={onClose} sx={{ flex: 1 }}>
            Cancel
          </Button>
          <Button variant="contained" onClick={onSave} sx={{ flex: 1 }}>
            Save
          </Button>
        </Stack>
      </Box>
    </Drawer>
  );
};

export default CreateEditDrawer;