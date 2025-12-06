import { Box } from "@mui/material"

export const StatusBadge = ({ status }: { status: "pending" | "in-progress" | "completed" }) => {
  const map: Record<string, { bg: string; color: string; label: string }> = {
    pending: { bg: "#fff3cd", color: "#856404", label: "Pendiente" },
    "in-progress": { bg: "#cce5ff", color: "#0056b3", label: "En Proceso" },
    completed: { bg: "#d4edda", color: "#155724", label: "Completada" },
  };
  const s = map[status];
  return (
    <Box sx={{ px: 1.5, py: 0.5, borderRadius: 20, fontSize: 12, fontWeight: 700, bgcolor: s.bg, color: s.color }}>
      {s.label}
    </Box>
  );
};
