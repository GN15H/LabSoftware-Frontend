import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography
} from "@mui/material";
import { PALETA } from "../ClientPalette";
import { SetStateAction } from "react";
import { Appointment } from "@/domain/models/Appointment";

interface ApproveBudgetProps {
  budgetApprovedOpen: boolean;
  selectedAppointment: Appointment | null;
  setBudgetApprovedOpen: React.Dispatch<SetStateAction<boolean>>;
  submitApproveBudget: (id: number) => void;
}

export const ApproveBudget = ({ selectedAppointment, submitApproveBudget, budgetApprovedOpen, setBudgetApprovedOpen }: ApproveBudgetProps) => {
  return (
    <Dialog open={budgetApprovedOpen} onClose={() => setBudgetApprovedOpen(false)} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ color: PALETA.verde }}>Presupuesto Aprobado</DialogTitle>
      <DialogContent dividers>
        <Box sx={{ textAlign: "center", p: 2, bgcolor: "#d4edda", border: "1px solid #c3e6cb", borderRadius: 2 }}>
          <Typography sx={{ fontSize: 48, mb: 1 }}>✅</Typography>
          <Typography sx={{ fontWeight: 800, mb: 1 }}>Revisión Honda Civic</Typography>
          <Typography sx={{ color: PALETA.verde, fontWeight: 800, mb: 1 }}>$450,000</Typography>
          <Typography>Presupuesto aprobado. Se empezará con el trabajo.</Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => {
          if (selectedAppointment == null) return;
          submitApproveBudget(selectedAppointment.id)
        }} sx={{ bgcolor: "#21aa43", color: "#fff", "&:hover": { bgcolor: "#138d46" } }}>Entendido</Button>
      </DialogActions>
    </Dialog>
  );
}
