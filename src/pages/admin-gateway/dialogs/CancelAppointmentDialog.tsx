import React from "react";
import {
  Typography,
  Box,
  Chip,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import SearchIcon from "@mui/icons-material/Search";
import { DangerBtn, GhostBtn, ListItemCard } from "../AdminGateway.components";
import { Appointment } from "@/domain/models/Appointment";

interface CancelAppointmentDialogProps {
  open: boolean;
  onClose: () => void;
  appointments: Appointment[];
  cancelAppointment: (id: number) => void;
}
export function CancelAppointmentDialog({
  open,
  onClose,
  appointments,
  cancelAppointment
}: CancelAppointmentDialogProps) {
  const [query, setQuery] = React.useState("");
  const [selected, setSelected] = React.useState<Appointment | null>(null);
  const [confirmOpen, setConfirmOpen] = React.useState(false);

  React.useEffect(() => {
    if (!open) {
      setQuery("");
      setSelected(null);
      setConfirmOpen(false);
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

  const requestCancel = () => {
    if (!selected) return;
    setConfirmOpen(true);
  };

  const executeCancel = () => {
    if (!selected) return;
    // setAppointments(prev => prev.filter(a => a.id !== selectedAppt.id));
    setConfirmOpen(false);
    cancelAppointment(selected.id);
    onClose();
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>Cancelar Cita</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ backgroundColor: '#fff3cd', border: '1px solid #ffeaa7', color: '#856404', p: 2, borderRadius: 2, mb: 2 }}>
            <Typography fontWeight={700}>⚠️ Atención:</Typography>
            <Typography fontSize=".9rem">Esta acción no se puede deshacer.</Typography>
          </Box>

          <TextField
            fullWidth
            placeholder="Buscar por ID, cliente, servicio, mecánico..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            InputProps={{ startAdornment: <SearchIcon sx={{ mr: 1 }} /> }}
            sx={{ mb: 2 }}
          />

          <Box sx={{ maxHeight: 320, overflowY: 'auto' }}>
            {filtered.filter(ap => ap.appointmentState == 'pending').map(ap => (
              <ListItemCard
                key={ap.id}
                onClick={() => setSelected(ap)}
              >
                <Box>
                  <Typography sx={{ fontWeight: 'bold', color: '#2c3e50' }}>{ap.id}</Typography>
                  <Typography sx={{ fontSize: '.85rem', color: '#7f8c8d' }}>
                    {ap.vehicle.brand} • {ap.date.toLocaleDateString()} {ap.mechanic.name} {ap.appointmentState}
                  </Typography>
                </Box>
                <Chip label="Elegir" color="error" />
              </ListItemCard>
            ))}
            {filtered.length === 0 && <Typography sx={{ color: '#7f8c8d' }}>Sin resultados.</Typography>}
          </Box>
        </DialogContent>
        <DialogActions>
          <GhostBtn onClick={onClose}>Cerrar</GhostBtn>
          <DangerBtn onClick={requestCancel} disabled={!selected}>Cancelar cita</DangerBtn>
        </DialogActions>
      </Dialog>

      {/* Confirmación */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>Confirmar cancelación</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ backgroundColor: '#f8d7da', border: '1px solid #f5c6cb', borderRadius: 2, p: 2, textAlign: 'center' }}>
            <Typography>¿Cancelar la cita seleccionada?</Typography>
            <Typography fontWeight={700} sx={{ my: 1 }}>{selected?.id || '-'}</Typography>
            <Typography fontSize=".9rem">{selected ? `${(() => {
              let services: string = '';
              selected.services.forEach(s => {
                services += `${s.name} `;
              })
              return services
            })()} • ${selected.date.toLocaleString()}` : ''}</Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <GhostBtn onClick={() => setConfirmOpen(false)}>Atrás</GhostBtn>
          <DangerBtn onClick={executeCancel} startIcon={<DeleteOutlineIcon />}>Cancelar definitivamente</DangerBtn>
        </DialogActions>
      </Dialog>
    </>
  );
}
