import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography
} from "@mui/material";
import { SetStateAction } from "react";

interface RejectBudgetProps {
  budgetRejectedOpen: boolean;
  setBudgetRejectedOpen: React.Dispatch<SetStateAction<boolean>>;
}

export const RejectBudget = ({ budgetRejectedOpen, setBudgetRejectedOpen }: RejectBudgetProps) => {
  return (
    <Dialog open={budgetRejectedOpen} onClose={() => setBudgetRejectedOpen(false)} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ color: "#e74c3c" }}>Presupuesto Rechazado</DialogTitle>
      <DialogContent dividers>
        <Box sx={{ textAlign: "center", p: 2, bgcolor: "#f8d7da", border: "1px solid #f5c6cb", borderRadius: 2 }}>
          <Typography sx={{ fontSize: 48, mb: 1 }}>❌</Typography>
          <Typography sx={{ fontWeight: 800, mb: 1 }}>Revisión Honda Civic</Typography>
          <Typography sx={{ color: "#e74c3c", fontWeight: 800, mb: 1 }}>$450,000</Typography>
          <Typography>Presupuesto rechazado. Se cancela el servicio.</Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setBudgetRejectedOpen(false)} sx={{ bgcolor: "#ca370b", color: "#fff", "&:hover": { bgcolor: "#ac3315" } }}>Entendido</Button>
      </DialogActions>
    </Dialog>
  );
}
