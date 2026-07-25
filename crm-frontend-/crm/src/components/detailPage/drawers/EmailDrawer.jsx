import {
  Dialog,
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  IconButton,
  Divider,
  Paper,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect, useRef, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
// import { useSelector } from "react-redux";

export default function EmailDrawer({ open, onClose, onSave, defaultEmail  }) {
  const editorRef = useRef(null);
  const quillRef = useRef(null);
  const toolbarRef = useRef(null);

  // const { currentLead: lead } = useSelector((state) => state.lead);

  // const [form, setForm] = useState({
  //   to: lead?.email || "",
  //   cc: "",
  //   bcc: "",
  //   subject: "",
  //   body: "",
  // });
  const [form, setForm] = useState({
  to: defaultEmail || "",
  cc: "",
  bcc: "",
  subject: "",
  body: "",
});


  const [attachments, setAttachments] = useState([]);
  const [showCc, setShowCc] = useState(false);
  const [showBcc, setShowBcc] = useState(false);
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [selectedRange, setSelectedRange] = useState(null);
  const [linkError, setLinkError] = useState("");
  const handleSendEmail = async (emailData) => {
    await dispatch(sendLeadEmailThunk({ leadId, data: emailData }));
  };
  const [errors, setErrors] = useState({
    to: false,
    body: false,
  });

  // useEffect(() => {
  //   if (open) {
  //     setForm({
  //       to: lead?.email || "",
  //       cc: "",
  //       bcc: "",
  //       subject: "",
  //       body: "",
  //     });
  //     setAttachments([]);
  //     setShowCc(false);
  //     setShowBcc(false);
  //     setErrors({ to: false, body: false });
  //     if (editorRef.current) editorRef.current.innerHTML = "";
  //   }
  // }, [open, lead]);

  useEffect(() => {
  if (open) {
    setForm({
      to: defaultEmail || "",   // ✅ KEY FIX
      cc: "",
      bcc: "",
      subject: "",
      body: "",
    });

    setAttachments([]);
    setShowCc(false);
    setShowBcc(false);
    setErrors({ to: false, body: false });

    if (editorRef.current) editorRef.current.innerHTML = "";
  }
}, [open, defaultEmail]);

  useEffect(() => {
    if (!open) return;

    const timer = setTimeout(() => {
      if (editorRef.current) {
        editorRef.current.innerHTML = "";

        quillRef.current = new Quill(editorRef.current, {
          theme: "snow",
          placeholder: "Body Text",
          modules: {
            toolbar: {
              container: toolbarRef.current,
              handlers: {
                attach: handleFileUpload,
                emoji: () => {
                  const range = quillRef.current.getSelection();
                  quillRef.current.insertText(range?.index || 0, "😊");
                },
                image: handleFileUpload,
                link: () => {
                  const range = quillRef.current.getSelection();
                  if (range && range.length > 0) {
                    setSelectedRange(range);
                    setLinkDialogOpen(true);
                    setLinkError("");
                  } else {
                    setLinkError("Select text first to add a link.");
                  }
                },
              },
            },
          },
        });

        quillRef.current.on("text-change", () => {
          setForm((prev) => ({
            ...prev,
            body: quillRef.current.root.innerHTML,
          }));
        });
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [open]);

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
    setErrors((prev) => ({ ...prev, [field]: false }));
  };

  const handleFileUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = true;
    input.click();

    input.onchange = () => {
      const files = Array.from(input.files).map((file) => ({
        file,
        url: URL.createObjectURL(file),
      }));
      setAttachments((prev) => [...prev, ...files]);
    };
  };

  const handleSend = () => {
    const newErrors = {
      to: !form.to,
      body: !form.body || form.body === "<p><br></p>",
    };

    setErrors(newErrors);
    if (newErrors.to || newErrors.body) return;
    const cleanEmails = (value = "") =>
      value
        .split(",")
        .map((e) => e.trim())
        .filter((e) => e && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e));
    const attachmentsData = attachments.map((att) => ({
      name: att.file.name,
      size: att.file.size,
      type: att.file.type,
      file: att.file,
    }));

    onSave({
      type: "email",
      subject: form.subject,
      body: form.body,
      to_email: form.to,

      cc: cleanEmails(form.cc),
      bcc: cleanEmails(form.bcc),
      attachments: attachmentsData,
    });

    onClose();
  };

  const applyLink = () => {
    if (selectedRange && linkUrl) {
      quillRef.current.formatText(
        selectedRange.index,
        selectedRange.length,
        "link",
        linkUrl,
      );
    }
    setLinkDialogOpen(false);
    setLinkUrl("");
  };

  const handleReplaceAttachment = (index) => {
  const input = document.createElement("input");
  input.type = "file";

  input.onchange = () => {
    const file = input.files[0];
    if (!file) return;

    setAttachments((prev) =>
      prev.map((att, i) =>
        i === index
          ? { file, url: URL.createObjectURL(file) }
          : att
      )
    );
  };

  input.click();
};

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
        <Paper
          sx={{ display: "flex", flexDirection: "column", height: "100%" }}
        >
          <Box
            sx={{
              bgcolor: "#5b5bd6",
              color: "#fff",
              px: 2,
              py: 1.5,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography fontWeight={500}>New Email</Typography>
            <IconButton onClick={onClose} sx={{ color: "#fff" }}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Box sx={{ px: 2, pt: 1 }}>
            {/* <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              sx={{ mb: 1 }}
            >
              <Typography sx={{ minWidth: 40 }}>To:</Typography>
              <TextField
                variant="standard"
                fullWidth
                value={form.to}
                onChange={handleChange("to")}
                InputProps={{ disableUnderline: true }}
                size="small"
                error={errors.to}
                helperText={errors.to ? "Recipient is required" : ""}
              />
            </Stack> */}

            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              sx={{ mb: 1 }}
            >
              <Typography sx={{ minWidth: 40 }}>To:</Typography>

              <TextField
                variant="standard"
                fullWidth
                value={form.to}
                onChange={handleChange("to")}
                InputProps={{ disableUnderline: true }}
                size="small"
                error={errors.to}
                helperText={errors.to ? "Recipient is required" : ""}
              />

              <Stack direction="row" spacing={1}>
                {!showCc && (
                  <Typography
                    sx={{
                      fontSize: 13,
                      cursor: "pointer",
                      color: "#5b5bd6",
                      fontWeight: 500,
                    }}
                    onClick={() => setShowCc(true)}
                  >
                    Cc
                  </Typography>
                )}

                {!showBcc && (
                  <Typography
                    sx={{
                      fontSize: 13,
                      cursor: "pointer",
                      color: "#5b5bd6",
                      fontWeight: 500,
                    }}
                    onClick={() => setShowBcc(true)}
                  >
                    Bcc
                  </Typography>
                )}
              </Stack>
            </Stack>

            {showCc && (
              <Stack
                direction="row"
                alignItems="center"
                spacing={1}
                sx={{ mb: 1 }}
              >
                <Typography sx={{ minWidth: 40 }}>Cc:</Typography>
                <TextField
                  variant="standard"
                  fullWidth
                  value={form.cc}
                  onChange={handleChange("cc")}
                  InputProps={{ disableUnderline: true }}
                  size="small"
                />
              </Stack>
            )}

            {showBcc && (
              <Stack
                direction="row"
                alignItems="center"
                spacing={1}
                sx={{ mb: 1 }}
              >
                <Typography sx={{ minWidth: 40 }}>Bcc:</Typography>
                <TextField
                  variant="standard"
                  fullWidth
                  value={form.bcc}
                  onChange={handleChange("bcc")}
                  InputProps={{ disableUnderline: true }}
                  size="small"
                />
              </Stack>
            )}

            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              sx={{ mb: 1 }}
            >
              <Typography sx={{ minWidth: 40 }}>Subject:</Typography>
              <TextField
                variant="standard"
                fullWidth
                value={form.subject}
                onChange={handleChange("subject")}
                InputProps={{ disableUnderline: true }}
                size="small"
              />
            </Stack>
          </Box>

          <Divider />

          <Box sx={{ px: 2, py: 1 }} ref={toolbarRef}>
            <span className="ql-formats">
              <button className="ql-bold" />
              <button className="ql-italic" />
              <button className="ql-underline" />
              <button className="ql-list" value="ordered" />
              <button className="ql-list" value="bullet" />
              <button className="ql-link" />
              <button className="ql-clean" />
            </span>
            <span className="ql-formats">
              <button className="ql-attach">
                <AttachFileIcon sx={{ fontSize: 18 }} />
              </button>
              <button className="ql-emoji">
                <EmojiEmotionsIcon sx={{ fontSize: 18 }} />
              </button>
              <button className="ql-image">
                <InsertPhotoIcon sx={{ fontSize: 18 }} />
              </button>
            </span>
          </Box>

          <Box
            sx={{
              flex: 1,
              px: 2,
              py: 1,
              border: errors.body ? "1px solid red" : "1px solid #e0e0e0",
              borderRadius: 1,
              minHeight: 150,
              "& .ql-toolbar": { borderBottom: "1px solid #e0e0e0" },
              "& .ql-container": { border: "none", minHeight: 120 },
            }}
          >
            <Box ref={editorRef} />
            {errors.body && (
              <Typography color="error" variant="caption">
                Body is required
              </Typography>
            )}
            {linkError && (
              <Typography color="error" variant="caption">
                {linkError}
              </Typography>
            )}
          </Box>

          <Box sx={{ px: 2, py: 1 }}>
            {/* {attachments.map((att, idx) => (
              <Stack
                key={idx}
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mb: 0.5 }}
              >
                <a
                  href={att.url}
                  download={att.file.name}
                  style={{ textDecoration: "none" }}
                >
                  {att.file.name}
                </a>
                <IconButton
                  size="small"
                  onClick={() => {
                    URL.revokeObjectURL(att.url);
                    setAttachments((prev) => prev.filter((_, i) => i !== idx));
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Stack>
            ))} */}
            
          </Box>

          <Divider />

          <Box sx={{ px: 2, py: 1 }}>
            <Stack direction="row" spacing={2}>
              <Button variant="outlined" fullWidth onClick={onClose}>
                Cancel
              </Button>
              <Button
                variant="contained"
                fullWidth
                sx={{ bgcolor: "#5b5bd6", "&:hover": { bgcolor: "#4747c7" } }}
                onClick={handleSend}
              >
                Send
              </Button>
            </Stack>
          </Box>
        </Paper>
      </Dialog>

      <Dialog
        open={linkDialogOpen}
        onClose={() => setLinkDialogOpen(false)}
        fullWidth
        maxWidth="xs"
      >
        <Box sx={{ p: 2 }}>
          <Typography sx={{ mb: 1 }}>Enter URL</Typography>
          <TextField
            fullWidth
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder="https://example.com"
          />
          <Stack
            direction="row"
            spacing={1}
            justifyContent="flex-end"
            sx={{ mt: 2 }}
          >
            <Button variant="outlined" onClick={() => setLinkDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="contained" onClick={applyLink}>
              Apply
            </Button>
          </Stack>
        </Box>
      </Dialog>
    </>
  );
}
