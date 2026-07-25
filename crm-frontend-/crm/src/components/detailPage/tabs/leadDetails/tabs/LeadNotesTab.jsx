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

export default function LeadNotesTab({ activities = [], onEdit, onDelete }) {
  const [openId, setOpenId] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const editorRef = useRef(null);
  const quillRef = useRef(null);

  useEffect(() => {
    if (!editingId || !editorRef.current) return;

    editorRef.current.innerHTML = "";

    const quill = new Quill(editorRef.current, {
      theme: "snow",
    });

    const current = activities.find((a) => a.id === editingId);

    if (current) {
      quill.root.innerHTML = current.description || "";
    }

    quillRef.current = quill;

    return () => {
      if (editorRef.current) {
        editorRef.current.innerHTML = "";
      }
      quillRef.current = null;
    };
  }, [editingId, activities]);

  const handleSave = () => {
    if (!quillRef.current) return;

    const current = activities.find((a) => a.id === editingId);
    if (!current) return;

    const content = quillRef.current.root.innerHTML;

    // onEdit?.({
    //   ...current,
    //   content,
    //   description: content,
    //   type: "note",
    // });
    onEdit?.({
  ...current,
  id: current.id,
  content,
  description: content,
  type: current.type || "note",
});

    if (editorRef.current) {
      editorRef.current.innerHTML = "";
    }

    quillRef.current = null;
    setEditingId(null);
  };

  const handleCancel = () => {
    if (editorRef.current) {
      editorRef.current.innerHTML = "";
    }

    quillRef.current = null;
    setEditingId(null);
  };

  if (!activities.length) {
    return (
      <Typography fontSize={13} color="text.secondary">
        No notes available
      </Typography>
    );
  }

  return (
    <Stack spacing={2}>
      {activities.map((note) => {
        const isOpen = openId === note.id;
        const isEditing = editingId === note.id;
        // const rawContent = note.description || "";
        const rawContent =
          note.description || note.notes || note.body || note.content || "";

        return (
          <Paper
            key={note.id}
            sx={{
              border: "1px solid #e6e8f0",
              borderRadius: "12px",
              overflow: "hidden",
              boxShadow: "none",
            }}
          >
            {/* Header */}
            <Box
              px={2}
              py={1.5}
              sx={{
                background: isOpen ? "#eef2f6" : "#ffffff",
                transition: "all 0.25s ease",
                cursor: "pointer",
              }}
              onClick={() => setOpenId(isOpen ? null : note.id)}
            >
              <Box display="flex" justifyContent="space-between">
                <Box display="flex" gap={1} alignItems="center">
                  <ExpandMoreIcon
                    sx={{
                      transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "0.2s ease",
                    }}
                  />

                  <Typography fontSize={14}>
                    <b>Note</b>{" "}
                    <span
                      style={{
                        fontSize: 12,
                        color: "#6b7280",
                      }}
                    >
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
                    sx={{ color: "#5b5bd6" }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>

                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete?.(note);
                    }}
                    sx={{ color: "red" }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
            </Box>

            {/* Content */}
            <Collapse in={isOpen}>
              <Box p={2}>
                {isEditing ? (
                  <>
                    <Box
                      ref={editorRef}
                      sx={{
                        border: "1px solid #ddd",
                        minHeight: 140,
                        borderRadius: "8px",
                        background: "#fff",
                      }}
                    />

                    <Box mt={2} display="flex" gap={1}>
                      <Button
                        size="small"
                        variant="contained"
                        onClick={handleSave}
                      >
                        Save
                      </Button>

                      <Button size="small" onClick={handleCancel}>
                        Cancel
                      </Button>
                    </Box>
                  </>
                ) : (
                  <Box
                    sx={{
                      fontSize: "13px",
                      color: "#374151",
                      lineHeight: 1.8,
                    }}
                    dangerouslySetInnerHTML={{
                      __html: rawContent,
                    }}
                  />
                )}
              </Box>
            </Collapse>
          </Paper>
        );
      })}
    </Stack>
  );
}
