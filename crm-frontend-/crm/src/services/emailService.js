// let attachmentIdCounter = 1;

// const delay = (ms) => new Promise((res) => setTimeout(res, ms));

// export const uploadAttachments = async (attachments, moduleType) => {
//   await delay(500); // simulate network delay

//   return attachments.map((file) => ({
//     id: attachmentIdCounter++,
//     moduleType,

//     name: file.name,
//     size: file.size,
//     type: file.type,
//     url: `/uploads/${encodeURIComponent(file.name)}`, // local folder path
//     date: new Date().toISOString(),
//   }));
// };


// export const sendEmail = async ({
//   to,
//   cc,
//   bcc,
//   subject,
//   body,
//   attachments = [],
//   moduleType,
// }) => {
//   // Step 1: upload attachments to local folder
//   let uploadedFiles = [];
//   if (attachments.length > 0) {
//     uploadedFiles = await uploadAttachments(attachments, moduleType);
//   }

//   await delay(500);

//   return {
//     type: "email",
//     to,
//     cc,
//     bcc,
//     subject,
//     body,
//     date: new Date().toISOString(),
//     moduleType,
//     attachments: uploadedFiles,
//   };
// };
