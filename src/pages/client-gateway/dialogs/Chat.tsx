

// export const Chat = () => {
//   return (
//     <Dialog open={chatOpen} onClose={() => setChatOpen(false)} maxWidth="xs" fullWidth>
//       <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
//         <Stack direction="row" spacing={1} alignItems="center">
//           <ChatBubbleOutlineIcon />
//           <b>AutoLink Assistant</b>
//         </Stack>
//         <Button variant="text" onClick={() => setChatOpen(false)}><CloseIcon /></Button>
//       </DialogTitle>
//       <DialogContent dividers sx={{ bgcolor: "#f8f9fa" }}>
//         <Stack spacing={1}>
//           {chatMsgs.map((m, i) => (
//             <Box key={i} sx={{ display: "flex", justifyContent: m.who === "user" ? "flex-end" : "flex-start" }}>
//               <Box sx={{ px: 1.5, py: 1, borderRadius: 3, maxWidth: "80%", fontSize: 14, bgcolor: m.who === "bot" ? "#e3f2fd" : PALETA.azul, color: m.who === "bot" ? "#1976d2" : "#fff" }}>
//                 {m.text}
//               </Box>
//             </Box>
//           ))}
//         </Stack>
//       </DialogContent>
//       <DialogActions sx={{ display: "block" }}>
//         <Stack direction="row" spacing={1} sx={{ px: 2, pb: 1 }}>
//           {["Precios", "Horarios", "Servicios"].map((q) => (
//             <Button key={q} size="small" onClick={() => sendChat(`¿Cuáles son los ${q.toLowerCase()}?`)} sx={{ bgcolor: "#ecf0f1", color: PALETA.texto, textTransform: "none", borderRadius: 5, "&:hover": { bgcolor: PALETA.azul, color: "#fff" } }}>{q}</Button>
//           ))}
//         </Stack>
//         <Stack direction="row" spacing={1} sx={{ px: 2, pb: 2 }}>
//           <TextField fullWidth size="small" placeholder="Escribe tu pregunta..." value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && sendChat()} />
//           <Button onClick={() => sendChat()} variant="contained">Enviar</Button>
//         </Stack>
//       </DialogActions>
//     </Dialog>
//   );
// }
