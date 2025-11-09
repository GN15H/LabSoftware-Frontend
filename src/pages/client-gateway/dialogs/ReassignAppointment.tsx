import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  Typography
} from "@mui/material";
import Grid from "@mui/material/Grid"; // Grid v2
import { PALETA } from "../ClientPalette";
import { fieldSx } from "../ClientGateway";
import { SetStateAction } from "react";
import { RescheduleData } from "../ClientGateway.types";

interface RescheduleAppointmentProps {
  reasignOpen: boolean;
  setReasignOpen: React.Dispatch<SetStateAction<boolean>>;
  reasignForm: RescheduleData;
  setReasignForm: React.Dispatch<SetStateAction<RescheduleData>>;
  submitReasign: (e: React.FormEvent) => void;
}

export const ReassignAppointment = ({ reasignOpen, setReasignOpen, reasignForm, setReasignForm, submitReasign }: RescheduleAppointmentProps) => {
  return (
    <Dialog open={reasignOpen} onClose={() => setReasignOpen(false)} fullWidth maxWidth="sm">
      <DialogTitle>Reasignar Cita</DialogTitle>
      <DialogContent dividers>
        <Paper sx={{ p: 2, bgcolor: "#e3f2fd", borderRadius: 2, mb: 2 }}>
          <Typography sx={{ color: "#1976d2", fontWeight: 800, mb: 1 }}>Cita Actual:</Typography>
          <Typography sx={{ fontSize: 14, color: PALETA.texto }}>
            <b>Servicio:</b> Cambio de aceite<br />
            <b>Vehículo:</b> Toyota Corolla (ABC-123)<br />
            <b>Fecha actual:</b> Miércoles, 25 de Septiembre - 10:00 AM<br />
            <b>Mecánico:</b> Carlos Rodríguez
          </Typography>
        </Paper>

        <Grid container spacing={2} component="form" onSubmit={submitReasign}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField fullWidth required type="date" label="Nueva Fecha" InputLabelProps={{ shrink: true }} value={reasignForm.date} onChange={(e) => setReasignForm({ ...reasignForm, date: e.target.value })} sx={fieldSx()} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth required sx={fieldSx()}>
              <InputLabel>Nueva Hora</InputLabel>
              <Select label="Nueva Hora" value={reasignForm.hour} onChange={(e) => setReasignForm({ ...reasignForm, hour: e.target.value as string })}>
                {["08:00", "09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"].map((h) => (
                  <MenuItem key={h} value={h}>{h}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField fullWidth multiline minRows={3} label="Motivo del Cambio (Opcional)" value={reasignForm.reason} onChange={(e) => setReasignForm({ ...reasignForm, reason: e.target.value })} sx={fieldSx()} />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Paper sx={{ p: 2, bgcolor: "#fff3cd", border: "1px solid #ffeaa7", color: "#856404", fontSize: 14 }}>
              <b>Nota:</b> La reasignación está sujeta a disponibilidad. Si la fecha no está disponible, te contactaremos.
            </Paper>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setReasignOpen(false)} sx={{ bgcolor: "#eee7e1", color: "rgb(80,80,80)", "&:hover": { bgcolor: "#dad6d3" } }}>Cancelar</Button>
        <Button onClick={submitReasign as any} sx={{ bgcolor: PALETA.naranja, color: "#fff", "&:hover": { bgcolor: PALETA.naranjaHover } }}>Confirmar Reasignación</Button>
      </DialogActions>
    </Dialog>
  );
}
