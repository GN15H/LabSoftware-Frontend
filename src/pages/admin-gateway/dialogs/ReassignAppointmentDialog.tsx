import React from "react";
import {
  Typography,
  Box,
  Paper,
  Chip,
  Stack,
  TextField,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
} from "@mui/material";
import AssignmentIcon from "@mui/icons-material/Assignment";
import SearchIcon from "@mui/icons-material/Search";
import { GhostBtn, ListItemCard, PrimaryBtn } from "../AdminGateway.components";
import { Appointment } from "@/domain/models/Appointment";

interface ReassignAppointmentDialog {
  open: boolean;
  onClose: () => void;
  appointments: Appointment[];
  rescheduleAppointment: (id: number, date: string, hour: string) => void;
}

export function ReassignAppointmentDialog({
  open,
  onClose,
  appointments,
  rescheduleAppointment
}: ReassignAppointmentDialog) {
  const [query, setQuery] = React.useState("");
  const [selected, setSelected] = React.useState<Appointment | null>(null);
  const [newDate, setNewDate] = React.useState("");
  const [newTime, setNewTime] = React.useState("");
  const [newMechanic, setNewMechanic] = React.useState("");

  const mechanics = ["Luis González", "Carlos Rodríguez", "Ana Fernández", "José Martínez"];

  React.useEffect(() => {
    if (!open) {
      setQuery("");
      setSelected(null);
      setNewDate("");
      setNewTime("");
      setNewMechanic("");
    }
  }, [open]);

  const filtered = appointments.filter(a => {
    const q = query.toLowerCase().trim();
    if (!q) return true;
    return (
      a.vehicle.plateNumber.toLowerCase().includes(q) ||
      a.mechanic.name.toLowerCase().includes(q) ||
      a.mechanic.lastName.toLowerCase().includes(q)
    );
  });

  // const selectedAppt = appointments.find(a => a.id === selected) || null;

  // const save = () => {
  //   if (!selectedAppt) return;
  //   const d = newDate || selectedAppt.date;
  //   const t = newTime || selectedAppt.time;
  //   const m = newMechanic || selectedAppt.mechanic;
  //
  //   setAppointments(prev => prev.map(a => a.id === selectedAppt.id ? { ...a, date: d, time: t, mechanic: m } : a));
  //   onClose();
  // };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Reasignar Cita</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              placeholder="Buscar por ID, cliente, servicio, mecánico..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              InputProps={{ startAdornment: <SearchIcon sx={{ mr: 1 }} /> }}
              sx={{ mb: 2 }}
            />
            <Box sx={{ maxHeight: 320, overflowY: 'auto' }}>
              {filtered.map(ap => (
                <ListItemCard
                  key={ap.id}
                  onClick={() => {
                    setSelected(ap)
                    setNewDate(ap.date.toISOString().split('T')[0])
                    setNewTime(ap.date.toISOString().split('T')[1].substring(0, 5))
                    console.log("selected")
                  }}
                >
                  <Box>
                    <Typography sx={{ fontWeight: 'bold', color: '#2c3e50' }}>{ap.id}</Typography>
                    <Typography sx={{ fontSize: '.85rem', color: '#7f8c8d' }}>
                      {ap.vehicle.brand} • {ap.date.toLocaleDateString()} {ap.mechanic.name} {ap.appointmentState}
                    </Typography>
                  </Box>
                  <Chip label="Seleccionar" />
                </ListItemCard>
              ))}
              {filtered.length === 0 && <Typography sx={{ color: '#7f8c8d' }}>Sin resultados.</Typography>}
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Paper sx={{ p: 2, borderRadius: 2, bgcolor: '#f8f9fa' }}>
              <Typography sx={{ fontWeight: 800, mb: 1, color: '#2c3e50' }}>Nueva Asignación</Typography>

              <Stack spacing={2}>
                <TextField
                  label="Fecha"
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  disabled={selected != null && selected.appointmentState != 'pending'}
                />
                <FormControl fullWidth>
                  <InputLabel>Hora</InputLabel>
                  <Select
                    disabled={selected != null && selected.appointmentState != 'pending'}
                    label="Hora" value={newTime} onChange={(e) => setNewTime(e.target.value as string)}>
                    {['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'].map(h => (
                      <MenuItem key={h} value={h}>{h}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {selected && (
                  <Box sx={{ mt: 1, p: 2, border: '1px solid #a5d6a7', borderRadius: 2, background: 'linear-gradient(135deg, #e8f5e9, #e3f2fd)' }}>
                    <Typography sx={{ color: '#2e7d32', fontWeight: 'bold' }}>Resumen</Typography>
                    <Typography sx={{ fontSize: '.9rem', color: '#2c3e50' }}>
                      {
                        (() => {
                          let services: string = '';
                          selected.services.forEach(s => {
                            services += `${s.name} `;
                          })
                          return services
                        })()
                      }
                    </Typography>
                    <Typography sx={{ fontSize: '.9rem', color: '#2c3e50' }}>
                      {selected.vehicle.plateNumber}
                    </Typography>
                    <Typography sx={{ fontSize: '.9rem', color: '#2c3e50' }}>
                      {newDate || selected.date.toLocaleString()} {newTime || selected.date.toLocaleString()} • {newMechanic || selected.mechanic.name}
                    </Typography>
                  </Box>
                )}
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <GhostBtn onClick={onClose}>Cancelar</GhostBtn>
        <PrimaryBtn
          onClick={() => {
            if (selected == null) return;
            rescheduleAppointment(selected.id, newDate, newTime)
          }}
          disabled={!selected}
          startIcon={<AssignmentIcon />}
        >
          Guardar cambios
        </PrimaryBtn>
      </DialogActions>
    </Dialog>
  );
}
