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
} from "@mui/material";
import Grid from "@mui/material/Grid"; // Grid v2
import { PALETA } from "../ClientPalette";
import { Vehicle } from "@/domain/models/Vehicle";
import { SetStateAction } from "react";
// import { AppointmentData } from "../ClientGateway.types";
// import { fieldSx } from "../ClientGateway";
// import { Service } from "@/domain/models/Service";
// import { service } from "../mock/mockData";
import { Service } from "@/domain/models/Service";
import { AppointmentData } from "@/pages/client-gateway/ClientGateway.types";
import { fieldSx } from "@/pages/client-gateway/ClientGateway";

interface BookAppointmentProps {
  vehicles: Vehicle[];
  services: Service[];
  apptOpen: boolean;
  setApptOpen: React.Dispatch<SetStateAction<boolean>>;
  apptForm: AppointmentData;
  setApptForm: React.Dispatch<SetStateAction<AppointmentData>>;
  submitAppointment: (e: React.FormEvent) => void;
}

export const BookAppointment = ({ vehicles, services, apptOpen, setApptOpen, apptForm, setApptForm, submitAppointment }: BookAppointmentProps) => {
  return (
    <Dialog open={apptOpen} onClose={() => setApptOpen(false)} fullWidth maxWidth="sm">
      <DialogTitle>Agendar Nueva Cita</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12 }}>
            <FormControl fullWidth sx={fieldSx()}>
              <InputLabel>Vehículo</InputLabel>
              <Select label="Vehículo" value={apptForm.vehicle} onChange={(e) => setApptForm({ ...apptForm, vehicle: parseInt(String(e.target.value ?? '1')) })}>
                {vehicles.map((v) => (
                  <MenuItem key={v.id} value={v.id}>{v.brand} ({v.plateNumber})</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <FormControl fullWidth sx={fieldSx()}>
              <InputLabel>Servicio</InputLabel>
              <Select label="Servicio" value={apptForm.service} onChange={(e) => setApptForm({ ...apptForm, service: parseInt(String(e.target.value ?? '1')) })}>
                {services.map((s) => (
                  <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField type="date" fullWidth label="Fecha Preferida" InputLabelProps={{ shrink: true }} value={apptForm.date} onChange={(e) => setApptForm({ ...apptForm, date: e.target.value })} sx={fieldSx()} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth sx={fieldSx()}>
              <InputLabel>Hora Preferida</InputLabel>
              <Select label="Hora Preferida" value={apptForm.hour} onChange={(e) => setApptForm({ ...apptForm, hour: e.target.value as string })}>
                {["08:00", "10:00", "14:00", "16:00"].map((h) => (
                  <MenuItem key={h} value={h}>{h}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField fullWidth multiline minRows={3} label="Descripción del Problema (Opcional)" value={apptForm.description} onChange={(e) => setApptForm({ ...apptForm, description: e.target.value })} sx={fieldSx()} />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setApptOpen(false)} sx={{ bgcolor: "#eee7e1", color: "rgb(80,80,80)", "&:hover": { bgcolor: "#dad6d3" } }}>Cancelar</Button>
        <Button onClick={submitAppointment as any} sx={{ bgcolor: PALETA.naranja, color: "#fff", "&:hover": { bgcolor: PALETA.naranjaHover } }}>Agendar Cita</Button>
      </DialogActions>
    </Dialog>
  );
}
