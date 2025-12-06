import {
  Paper,
  Typography,
  Stack,
  Button,
  Box
} from "@mui/material";
import { PALETA } from "../ClientPalette";
import { SetStateAction } from "react";
import { Appointment } from "@/domain/models/Appointment";

interface PendingOrdersProps {
  appointments: Appointment[];
  showApproveBudget: React.Dispatch<SetStateAction<boolean>>;
  showRejectBudget: React.Dispatch<SetStateAction<boolean>>;
  setSelectedAppointment: React.Dispatch<SetStateAction<Appointment | null>>;
}

export const PendingOrders = ({ appointments, showApproveBudget, showRejectBudget, setSelectedAppointment }: PendingOrdersProps) => {

  const total = (appt: Appointment): bigint => {
    let value: bigint = BigInt(0);
    for (const s of appt.services) {
      value = value + s.price;
    }
    return value;
  }

  return (
    <Paper sx={{ p: 2, borderRadius: 3, boxShadow: PALETA.cardShadow }}>
      <Typography sx={{ fontSize: 18, fontWeight: 800, color: PALETA.texto, mb: 1 }}>Presupuestos Pendientes</Typography>

      {appointments.filter(a => a.appointmentState == 'pending').map((b, i) => (
        <Box key={i} sx={{ p: 2, borderRadius: 2, mb: 2, bgcolor: Math.floor(Math.random() * 2) ? "#f8d7da" : "#fff3cd", border: `1px solid ${Math.floor(Math.random() * 2) ? "#f5c6cb" : "#ffeaa7"}` }}>
          <Typography sx={{ fontWeight: 800, color: PALETA.texto }}>{b.vehicle.brand + " " + b.vehicle.plateNumber}</Typography>
          <Typography sx={{ color: PALETA.textoSuave, mt: 0.5 }}>Monto: <b style={{ color: "#e17055" }}>{total(b)}</b></Typography>
          <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
            <Button onClick={() => {
              setSelectedAppointment(b);
              showApproveBudget(true)
            }} sx={{ bgcolor: "#21aa43", color: "#fff", "&:hover": { bgcolor: "#138d46" } }}>Aprobar</Button>
            <Button onClick={() => {
              setSelectedAppointment(b);
              showRejectBudget(true)
            }} sx={{ bgcolor: "#ca370b", color: "#fff", "&:hover": { bgcolor: "#ac3315" } }}>Rechazar</Button>
          </Stack>
        </Box>
      ))}
    </Paper>

  );
}
