import { AppointmentStateType } from "@/domain/models/types";
import { Box } from "@mui/material";

export const StatusBadge = ({ type }: { type: AppointmentStateType | "ready" }) => {
  const map: Record<string, { bg: string; color: string; label: string }> = {
    pending: { bg: "#f39c12", color: "#fff", label: "Pendiente" },
    "in-progress": { bg: "#3498db", color: "#fff", label: "En Proceso" },
    completed: { bg: "#27ae60", color: "#fff", label: "Completado" },
    cancelled: { bg: "#e74c3c", color: "#fff", label: "Cancelado" },
    ready: { bg: "#27ae60", color: "#fff", label: "Listo" },
  };
  const s = map[type];
  return (
    <></>
  );
};
