import {
  Typography,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Button,
} from "@mui/material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useState, useRef, useEffect } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

export default function ActivityTab({ activities = [], onEdit }) {
  const [editingId, setEditingId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  const quillRef = useRef(null);
  const editorRef = useRef(null);

  useEffect(() => {
    if (!editingId || !editorRef.current) return;

    editorRef.current.innerHTML = "";

    const quill = new Quill(editorRef.current, {
      theme: "snow",
    });

    const current = activities.find((a) => a.id === editingId);
    quill.root.innerHTML = current?.description || "";

    quillRef.current = quill;

    return () => {
      quillRef.current = null;
    };
  }, [editingId]);

  const handleSave = () => {
    if (!quillRef.current) return;

    onEdit?.({
      id: editingId,
      description: quillRef.current.root.innerHTML,
    });

    setEditingId(null);
  };

  if (!activities.length) {
    return (
      <Typography fontSize={13} color="text.secondary">
        No activities available
      </Typography>
    );
  }

  const cleanHtml = (html) => {
    if (!html) return "";
    return html.replace(/<p><br><\/p>/g, "").replace(/<\/?p>/g, "");
  };

  return (
    <Stack spacing={1.4} mt={1}>
      {activities.map((act) => {
        const isOpen = expandedId === act.id;
        const isEditing = editingId === act.id;

        return (
          <Accordion
            key={act.id}
            expanded={isOpen}
            onChange={(e, exp) => setExpandedId(exp ? act.id : null)}
            disableGutters
            elevation={0}
            sx={{
              borderRadius: 2,
              border: "1px solid #e8e8e8",
              overflow: "hidden",
              backgroundColor: "#fff",
              borderLeft: "4px solid #6c63ff", // 🔥 accent color

              transition: "all 0.25s ease",
              "&:hover": {
                transform: "translateY(-1px)",
                boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
              },

              "&:before": { display: "none" },
            }}
          >
            {/* HEADER */}
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{
                background: "linear-gradient(90deg, #fafafa 0%, #ffffff 100%)",
                minHeight: 44,
                px: 2,
              }}
            >
              <Typography fontSize={13} fontWeight={600} color="#2c2c2c">
                {act.type}
              </Typography>
            </AccordionSummary>

            {/* CONTENT */}
            <AccordionDetails sx={{ p: 2.2, backgroundColor: "#fff" }}>
              {isEditing ? (
                <Stack spacing={1}>
                  <Box
                    ref={editorRef}
                    sx={{
                      border: "1px solid #ddd",
                      borderRadius: 1,
                      minHeight: 120,
                      backgroundColor: "#fff",
                    }}
                  />

                  <Stack direction="row" spacing={1}>
                    <Button
                      size="small"
                      variant="contained"
                      onClick={handleSave}
                    >
                      Save
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => setEditingId(null)}
                    >
                      Cancel
                    </Button>
                  </Stack>
                </Stack>
              ) : (
                <Box
                  sx={{
                    fontSize: "12.5px",
                    color: "#444",
                    lineHeight: 1.7,
                  }}
                  dangerouslySetInnerHTML={{
                    __html: cleanHtml(act.description),
                  }}
                />
              )}
            </AccordionDetails>
          </Accordion>
        );
      })}
    </Stack>
  );
}
