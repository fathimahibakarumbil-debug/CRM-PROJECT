import {
  Drawer,
  Box,
  Typography,
  Button,
  Stack,
  IconButton,
  Divider,
  Backdrop,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect, useRef, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

export default function NoteDrawer({ open, onClose, onSave }) {
  const editorRef = useRef(null);
  const quillRef = useRef(null);
  const [content, setContent] = useState("");

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        if (editorRef.current) {
          editorRef.current.innerHTML = "";

          quillRef.current = new Quill(editorRef.current, {
            theme: "snow",
            placeholder: "Enter",
            modules: {
              toolbar: [
                [{ header: [1, 2, false] }],
                ["bold", "italic", "underline"],
                [{ list: "ordered" }, { list: "bullet" }],
                ["link"],
                ["clean"],
              ],
            },
          });

          quillRef.current.on("text-change", () => {
            setContent(quillRef.current.root.innerHTML);
          });
        }
      }, 200); // wait for drawer animation

      return () => clearTimeout(timer);
    }
  }, [open]);

  return (
    <>
      <Backdrop
        open={open}
        sx={{
          backdropFilter: "blur(4px)",
          backgroundColor: "rgba(0,0,0,0.2)",
          zIndex: (theme) => theme.zIndex.drawer - 1,
        }}
      />

      <Drawer
        anchor="right"
        open={open}
        onClose={onClose}
        slotProps={{
          paper: {
            sx: {
              width: 420,
              borderTopLeftRadius: 8,
              borderBottomLeftRadius: 8,
            },
          },
        }}
      >
        <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
          {/* Header */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ px: 3, py: 2 }}
          >
            <Typography variant="subtitle1" fontWeight={600}>
              Create Note
            </Typography>

            <IconButton size="small" onClick={onClose}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Stack>

          <Divider />

          {/* Content */}
          <Box sx={{ flex: 1, px: 3, py: 2 }}>
            <Typography variant="caption" color="text.secondary">
              Note <span style={{ color: "red" }}>*</span>
            </Typography>

            {/* Unified editor container */}
            <Box
              sx={{
                border: "1px solid #e0e0e0",
                borderRadius: 1,
                overflow: "hidden", // make toolbar and editor stick together
                minHeight: 150,
                "& .ql-toolbar": {
                  borderBottom: "1px solid #e0e0e0",
                  borderRadius: 0,
                  backgroundColor: "#fafafa",
                },
                "& .ql-container": {
                  border: "none", // remove default border
                  borderRadius: 0,
                  minHeight: 120,
                },
              }}
            >
              <Box ref={editorRef} />
            </Box>
          </Box>

          {/* Footer */}
          <Box sx={{ px: 3, py: 2 }}>
            <Stack direction="row" spacing={2}>
              <Button
                variant="outlined"
                fullWidth
                onClick={onClose}
                sx={{ textTransform: "none" }}
              >
                Cancel
              </Button>

              <Button
                variant="contained"
                fullWidth
                sx={{
                  textTransform: "none",

                  bgcolor: "#5b5bd6",
                  "&:hover": { bgcolor: "#4747c7" },
                }}
                onClick={() => {
                  const activityData = {
                    type: "Note",
                    description: content,
                    date: new Date().toISOString(),
                  };

                  onSave(activityData);
                  onClose();
                }}
              >
                Save
              </Button>
            </Stack>
          </Box>
        </Box>
      </Drawer>
    </>
  );
}
