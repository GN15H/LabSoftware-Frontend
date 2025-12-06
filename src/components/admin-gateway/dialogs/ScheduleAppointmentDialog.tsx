import React from "react";

import {
  Grid,
  TextField,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import EventIcon from "@mui/icons-material/Event";
import { GhostBtn, PrimaryBtn } from "../AdminGateway.components";
import { AppointmentData } from "@/types/ClientGateway.types";
import { User } from "@/domain/models/User";
import { Service } from "@/domain/models/Service";
import { Vehicle } from "@/domain/models/Vehicle";

interface ScheduleAppointmentDialogProps {
  open: boolean;
  onClose: () => void;
  users: User[];
  services: Service[];
  vehicles: Vehicle[];
  createAppointment: (data: AppointmentData) => void;
}

export function ScheduleAppointmentDialog({ open, onClose, createAppointment, users, services, vehicles }: ScheduleAppointmentDialogProps) {
  const [client, setClient] = React.useState<number | null>(null);
  const [vehicle, setVehicle] = React.useState<number | null>(null);
  const [service, setService] = React.useState<number | null>(null);
  const [date, setDate] = React.useState<string>("");
  const [time, setTime] = React.useState<string>("");

  const serviceMeta = {
    'oil-change': { name: 'Cambio de aceite', duration: 60, mechanic: { name: 'Luis González', specialty: 'Mantenimiento General', avatar: 'LG' } },
    'brake-service': { name: 'Servicio de frenos', duration: 120, mechanic: { name: 'Carlos Rodríguez', specialty: 'Frenos/Suspensión', avatar: 'CR' } },
    'general-inspection': { name: 'Revisión general', duration: 90, mechanic: { name: 'Ana Fernández', specialty: 'Diagnóstico', avatar: 'AF' } },
    'tire-alignment': { name: 'Alineación y balanceo', duration: 45, mechanic: { name: 'José Martínez', specialty: 'Alineación', avatar: 'JM' } },
    'engine-tune': { name: 'Afinación de motor', duration: 180, mechanic: { name: 'Carlos Rodríguez', specialty: 'Motor', avatar: 'CR' } },
    'transmission': { name: 'Servicio de transmisión', duration: 240, mechanic: { name: 'Luis González', specialty: 'Transmisión', avatar: 'LG' } }
  };

  // const meta = service
  //   ? (serviceMeta as Record<
  //     string,
  //     { name: string; duration: number; mechanic: { name: string; specialty: string; avatar: string } }
  //   >)[service]
  //   : null;
  //
  // const confirm = () => {
  //   if (!client || !vehicle || !service || !date || !time) {
  //     alert('Por favor completa todos los campos obligatorios');
  //     return;
  //   }
  //   alert(`¡Cita agendada exitosamente!\n\nCliente: ${client.split(' - ')[0]}\nServicio: ${meta?.name}\nFecha: ${date}\nHora: ${time}\nMecánico asignado: ${meta?.mechanic.name}`);
  //   onClose();
  //   setClient(""); setVehicle(""); setService(""); setDate(""); setTime("");
  // };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Agendar Nueva Cita</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <FormControl fullWidth required>
              <InputLabel>Seleccionar Cliente*</InputLabel>
              <Select label="Seleccionar Cliente*" value={client ?? ""} onChange={(e) => {
                if (e.target.value == null) return;
                setClient(e.target.value as number);
                setVehicle(null);
              }}>
                {
                  users.filter(u => u.userType == 'user').map(u => (
                    <MenuItem key={u.id} value={u.id}>{u.name} {u.lastName}</MenuItem>
                  ))
                }
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <FormControl fullWidth required>
              <InputLabel>Vehículo del Cliente*</InputLabel>
              <Select label="Vehículo del Cliente*" value={vehicle ?? ""} onChange={(e) => {
                if (e.target.value == null) return;
                setVehicle(e.target.value as number)
              }} disabled={!client}>
                {client && (
                  vehicles.filter(v => v.ownerId == client).map(v => (
                    <MenuItem value={v.id}>{v.brand} {v.series} {v.plateNumber}</MenuItem>
                  ))
                )}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <FormControl fullWidth required>
              <InputLabel>Tipo de Servicio*</InputLabel>
              <Select label="Tipo de Servicio*" value={service ?? ""} onChange={(e) => {
                if (e.target.value == null) return;
                setService(e.target.value as number);
              }
              }>
                {
                  services.map(s => (
                    <MenuItem value={s.id}>{s.name}</MenuItem>
                  ))
                }
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField label="Fecha de la Cita*" type="date" InputLabelProps={{ shrink: true }} value={date} onChange={(e) => setDate(e.target.value)} fullWidth required />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <FormControl fullWidth required>
              <InputLabel>Hora Preferida*</InputLabel>
              <Select label="Hora Preferida*" value={time} onChange={(e) => setTime(e.target.value)}>
                {['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'].map(h => <MenuItem key={h} value={h}>{h.replace(':00', '') + (parseInt(h) < 12 ? ':00 AM' : parseInt(h) === 12 ? ' M' : ' PM')}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
          {/* <Grid size={{ xs: 12, md: 6 }}> */}
          {/*   <TextField label="Duración Estimada" value={meta ? `${meta.duration} minutos` : ''} placeholder="Se calculará automáticamente" fullWidth InputProps={{ readOnly: true }} /> */}
          {/* </Grid> */}

          {/* <Grid size={{ xs: 12 }}> */}
          {/*   {meta && ( */}
          {/*     <Box sx={{ mt: 1, border: '1px solid #a5d6a7', background: 'linear-gradient(135deg, #e8f5e8, #c8e6c9)', p: 2, borderRadius: 2 }}> */}
          {/*       <Typography sx={{ color: '#2e7d32', fontWeight: 'bold', mb: 1 }}>Asignación Automática de Mecánico</Typography> */}
          {/*       <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, background: 'rgba(255,255,255,0.8)', p: 2, borderRadius: 1, border: '1px solid #4caf50' }}> */}
          {/*         <Avatar sx={{ width: 50, height: 50, backgroundImage: 'linear-gradient(135deg, #4caf50, #388e3c)', fontWeight: 'bold' }}>{meta.mechanic.avatar}</Avatar> */}
          {/*         <Box sx={{ flex: 1 }}> */}
          {/*           <Typography sx={{ fontWeight: 'bold', color: '#2c3e50' }}>{meta.mechanic.name}</Typography> */}
          {/*           <Typography sx={{ fontSize: '.9rem', color: '#7f8c8d' }}>Especialista en {meta.mechanic.specialty}</Typography> */}
          {/*           <Typography sx={{ fontSize: '.85rem', color: '#27ae60', fontWeight: 500 }}>Disponible en el horario seleccionado</Typography> */}
          {/*         </Box> */}
          {/*         <Chip label="Sugerido" sx={{ backgroundColor: '#4caf50', color: '#fff', borderRadius: 2 }} /> */}
          {/*       </Box> */}
          {/*       <Typography sx={{ color: '#2e7d32', fontStyle: 'italic', mt: 1 }}>Mecánico seleccionado por especialidad en el servicio y disponibilidad horaria.</Typography> */}
          {/*     </Box> */}
          {/*   )} */}
          {/* </Grid> */}

          {/* {(client && service) && ( */}
          {/*   <Grid size={{ xs: 12 }}> */}
          {/*     <Box sx={{ background: 'linear-gradient(135deg, #fff3e0, #ffcc80)', border: '1px solid #ffb74d', p: 2, borderRadius: 2 }}> */}
          {/*       <Typography sx={{ color: '#ef6c00', fontWeight: 'bold', mb: 1 }}>Resumen de la Cita</Typography> */}
          {/*       <Grid container spacing={2}> */}
          {/*         <Grid size={{ xs: 12, md: 6 }}><Typography sx={{ color: '#bf360c', fontWeight: 500 }}>Cliente:</Typography><Typography sx={{ fontWeight: 'bold' }}>{client.split(' - ')[0]}</Typography></Grid> */}
          {/*         <Grid size={{ xs: 12, md: 6 }}><Typography sx={{ color: '#bf360c', fontWeight: 500 }}>Vehículo:</Typography><Typography sx={{ fontWeight: 'bold' }}>{vehicle || '-'}</Typography></Grid> */}
          {/*         <Grid size={{ xs: 12, md: 6 }}><Typography sx={{ color: '#bf360c', fontWeight: 500 }}>Servicio:</Typography><Typography sx={{ fontWeight: 'bold' }}>{meta?.name}</Typography></Grid> */}
          {/*         <Grid size={{ xs: 12, md: 6 }}><Typography sx={{ color: '#bf360c', fontWeight: 500 }}>Fecha y Hora:</Typography><Typography sx={{ fontWeight: 'bold' }}>{(date && time) ? `${date} a las ${time}` : '-'}</Typography></Grid> */}
          {/*         <Grid size={{ xs: 12, md: 6 }}><Typography sx={{ color: '#bf360c', fontWeight: 500 }}>Mecánico:</Typography><Typography sx={{ fontWeight: 'bold' }}>{meta?.mechanic.name}</Typography></Grid> */}
          {/*         <Grid size={{ xs: 12, md: 6 }}><Typography sx={{ color: '#bf360c', fontWeight: 500 }}>Duración:</Typography><Typography sx={{ fontWeight: 'bold' }}>{meta ? `${meta.duration} min` : '-'}</Typography></Grid> */}
          {/*       </Grid> */}
          {/*     </Box> */}
          {/*   </Grid> */}
          {/* )} */}
        </Grid>
      </DialogContent>
      <DialogActions>
        <GhostBtn onClick={onClose}>Cancelar</GhostBtn>
        <PrimaryBtn onClick={() => {
          console.log(vehicle, service, date, time);
          createAppointment({
            vehicle: vehicle,
            service: service,
            date: date,
            description: "",
            hour: time
          })
        }} startIcon={<EventIcon />}>Confirmar Cita</PrimaryBtn>
      </DialogActions>
    </Dialog>
  );
}
