
// import { Box, Paper, Stack, Typography, Button, IconButton } from "@mui/material";
// import CloseIcon from "@mui/icons-material/Close";
// import { useRef, useState } from "react";

// export default function RightPanel({
//   title = "AI Summary",
//   aiSummary,
//   attachments = [],
//   onAddAttachment,
//   onDeleteAttachment,
// }) {
//   const fileInputRef = useRef(null);
//   const [uploading, setUploading] = useState(false);

//   const handleFileSelect = async (e) => {
//     const files = Array.from(e.target.files);
//     if (!files.length) return;

//     setUploading(true);

//     for (const file of files) {
//       await onAddAttachment(file);
//     }

//     setUploading(false);
//   };

//   const triggerFileSelect = () => {
//     fileInputRef.current?.click();
//   };

//   const handleDelete = (attachmentId) => {
//     if (onDeleteAttachment) onDeleteAttachment(attachmentId);
//   };

//   return (
//     <Box
//       sx={{
//         width: 260,
//         p: 2,
//         bgcolor: "#f9fafb",
//         display: "flex",
//         flexDirection: "column",
//         gap: 2,
//       }}
//     >
//       <Paper sx={{ p: 2, border: "1px solid #6C63FF", borderRadius: 1 }}>
//         <Typography variant="subtitle2" color="primary">
//           {title}
//         </Typography>
//         <Typography variant="body2">
//           {aiSummary || "No summary available."}
//         </Typography>
//       </Paper>

//       <Box>
//         <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
//           <Typography variant="subtitle2">Attachments</Typography>

//           <Button size="small" onClick={triggerFileSelect}>
//             + Add
//             <input
//               type="file"
//               multiple
//               ref={fileInputRef}
//               hidden
//               onChange={handleFileSelect}
//             />
//           </Button>
//         </Stack>

//         {attachments?.length === 0 && (
//           <Typography variant="body2">No attachments</Typography>
//         )}

//         {attachments?.map((att) => (
//           <Stack
//             key={att.id}
//             direction="row"
//             justifyContent="space-between"
//             alignItems="center"
//             sx={{ p: 0.5 }}
//           >
//             <a
//               href={att.file}
//               target="_blank"
//               rel="noreferrer"
//               style={{ fontSize: 12 }}
//             >
//               {att.file?.split("/").pop()}
//             </a>

//             <IconButton
//               size="small"
//               onClick={() => handleDelete(att.id)}
//               color="error"
//             >
//               <CloseIcon sx={{ fontSize: 14 }} />
//             </IconButton>
//           </Stack>
//         ))}
//       </Box>

//       {uploading && (
//         <Typography variant="caption" color="text.secondary">
//           Uploading...
//         </Typography>
//       )}
//     </Box>
//   );
// }












//<------------------------------------------------------------------------------------------------------------------------------------








import { Box, Paper, Stack, Typography, Button, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useRef, useState } from "react";

export default function RightPanel({
  title = "AI Summary",
  aiSummary,
  attachments = [],
  onAddAttachment,
  onDeleteAttachment,
}) {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setUploading(true);

    for (const file of files) {
      await onAddAttachment(file);
    }

    setUploading(false);
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <Box
      sx={{
        width: 260,
        p: 2,
        bgcolor: "#f9fafb",
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Paper sx={{ p: 2, border: "1px solid #6C63FF", borderRadius: 1 }}>
        <Typography variant="subtitle2" color="primary">
          {title}
        </Typography>
        <Typography variant="body2">
          {aiSummary || "No summary available."}
        </Typography>
      </Paper>

      <Box>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="subtitle2">Attachments</Typography>

          <Button size="small" onClick={triggerFileSelect}>
            + Add
            <input
              type="file"
              multiple
              ref={fileInputRef}
              hidden
              onChange={handleFileSelect}
            />
          </Button>
        </Stack>

        {!attachments.length ? (
          <Typography variant="body2">No attachments</Typography>
        ) : (
          attachments.map((att) => (
            <Stack
              key={att.id}
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ p: 0.5 }}
            >
              <a
                href={att.file}
                target="_blank"
                rel="noreferrer"
                style={{ fontSize: 12 }}
              >
                {att.file?.split("/").pop()}
              </a>

              <IconButton
                size="small"
                color="error"
                onClick={() => onDeleteAttachment(att.id)}
              >
                <CloseIcon sx={{ fontSize: 14 }} />
              </IconButton>
            </Stack>
          ))
        )}
      </Box>
    </Box>
  );
}