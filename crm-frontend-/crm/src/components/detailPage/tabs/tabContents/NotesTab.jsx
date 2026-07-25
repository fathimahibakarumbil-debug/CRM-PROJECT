import {
  Stack,
  Typography,
  IconButton,
  Box,
  Paper,
  Collapse,
  Button,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState, useRef, useEffect } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

export default function NotesTab({ activities = [], onEdit, onDelete }) {
  const [openId, setOpenId] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const editorRef = useRef(null);
  const quillRef = useRef(null);

  // 🔥 Quill init when editing

  useEffect(() => {
    if (editingId && editorRef.current) {
      editorRef.current.innerHTML = "";

      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
      });

      const current = activities.find((a) => a.id === editingId);

      if (current) {
        quillRef.current.root.innerHTML = current.description || "";
      }
    }

    return () => {
      // 🔥 THIS LINE FIXES YOUR ISSUE
      if (editorRef.current) {
        editorRef.current.innerHTML = "";
      }

      quillRef.current = null;
    };
  }, [editingId]);

  const handleSave = () => {
    const content = quillRef.current.root.innerHTML;

    onEdit?.({
      id: editingId,
      description: content,
    });

    // 🔥 REMOVE QUILL COMPLETELY
    if (editorRef.current) {
      editorRef.current.innerHTML = "";
    }

    quillRef.current = null;

    setEditingId(null);
  };

  if (!activities.length) {
    return <Typography>No notes available</Typography>;
  }

  return (
    <Stack spacing={2}>
      {activities.map((note) => {
        const isOpen = openId === note.id;
        const isEditing = editingId === note.id;

        const rawContent = note.description || "";

        return (
          <Paper
            key={note.id}
            sx={{
              border: "1px solid #e6e8f0",
              borderRadius: "12px",
              overflow: "hidden",
            }}
          >
            {/* 🔥 HEADER */}
            <Box
              px={2}
              py={1.5}
              sx={{
                background: isOpen ? "#eef2f6" : "#ffffff", // ✅ open / closed
                transition: "all 0.25s ease",
                cursor: "pointer",
              }}
              onClick={() => setOpenId(isOpen ? null : note.id)}
            >
              <Box display="flex" justifyContent="space-between">
                <Box display="flex" gap={1}>
                  <ExpandMoreIcon
                    sx={{
                      transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "0.2s ease",
                    }}
                  />

                  <Typography>
                    <b>Note</b>{" "}
                    <span style={{ fontSize: 12, color: "#6b7280" }}>
                      by {note.created_by || "User"}
                    </span>
                  </Typography>
                </Box>

                <Box display="flex" gap={1}>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingId(note.id);
                      setOpenId(note.id);
                    }}
                    sx={{
                      color: "#5b5bd6", 
                    }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>

                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete?.(note.id);
                    }}
                    sx={{
                      color: "red", 
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
            </Box>

            {/* 🔽 CONTENT */}
            <Collapse in={isOpen}>
              <Box p={2}>
                {isEditing ? (
                  <>
                    <Box
                      key={`editor-${note.id}`}
                      ref={editorRef}
                      sx={{ border: "1px solid #ddd", minHeight: 120 }}
                    />

                    <Box mt={1} display="flex" gap={1}>
                      <Button
                        size="small"
                        variant="contained"
                        onClick={handleSave}
                      >
                        Save
                      </Button>

                      <Button size="small" onClick={() => setEditingId(null)}>
                        Cancel
                      </Button>
                    </Box>
                  </>
                ) : (
                  <Typography>
                    <span
                      dangerouslySetInnerHTML={{
                        __html: rawContent,
                      }}
                    />
                  </Typography>
                )}
              </Box>
            </Collapse>
          </Paper>
        );
      })}
    </Stack>
  );
}
