import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  Typography,
  Box
} from "@mui/material";
import { SetStateAction } from "react";

interface CancelAppointmentProps {
  cancelOpen: boolean;
  setCancelOpen: React.Dispatch<SetStateAction<boolean>>;
  executeCancelAppointment: () => void;
}

export const CancelAppointment = ({ cancelOpen, setCancelOpen, executeCancelAppointment }: CancelAppointmentProps) => {
  return (
    <Dialog open={cancelOpen} onClose={() => setCancelOpen(false)} fullWidth maxWidth="xs">
      <DialogTitle>Confirmar Cancelación</DialogTitle>
      <DialogContent dividers>
        <Paper sx={{ p: 2, bgcolor: "#f8d7da", border: "1px solid #f5c6cb", color: "#721c24", textAlign: "center" }}>
          <Typography>¿Estás seguro de que deseas cancelar tu cita?</Typography>
          <Box sx={{ my: 1 }}>
            <Typography><b>Servicio:</b> Cambio de aceite</Typography>
            <Typography><b>Fecha:</b> Miércoles, 25 de Septiembre - 10:00 AM</Typography>
            <Typography><b>Vehículo:</b> Toyota Corolla (ABC-123)</Typography>
          </Box>
          <Typography>Esta acción <b>NO</b> se puede deshacer.</Typography>
        </Paper>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setCancelOpen(false)} sx={{ bgcolor: "#eee7e1", color: "rgb(80,80,80)", "&:hover": { bgcolor: "#dad6d3" } }}>No cancelar</Button>
        <Button onClick={executeCancelAppointment} sx={{ bgcolor: "#ca370b", color: "#fff", "&:hover": { bgcolor: "#ac3315" } }}>Sí, cancelar cita</Button>
      </DialogActions>
    </Dialog>
  );
}
