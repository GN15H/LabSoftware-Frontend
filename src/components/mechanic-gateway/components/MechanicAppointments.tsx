import {
  Box,
  Typography,
  Button,
  Stack,
  LinearProgress
} from "@mui/material";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import Grid from "@mui/material/Grid";
import { PALETA } from "../MechanicGateway";
// import { StatusBadge } from "./StatusBadge";
import { Appointment } from "@/domain/models/Appointment";
import { StepDot } from "./StepDot";
import { AppointmentStateType, getNextState, getProgressFromAppointmentState } from "@/domain/models/types";
import { SetStateAction } from "react";

interface MechanicAppointmentsProps {
  appointment: Appointment;
  openPhotoModal: (stageKey: string) => void;
  setServiceDialogOpen: React.Dispatch<SetStateAction<boolean>>;
  advanceWorkflow: (appointmentId: number, state: AppointmentStateType) => void;
  setSelectedAppointment: React.Dispatch<SetStateAction<number>>;
}

export const MechanicAppointment = ({ appointment, setSelectedAppointment, openPhotoModal, setServiceDialogOpen, advanceWorkflow }: MechanicAppointmentsProps) => {
  return (
    <Box key={appointment.id} sx={{
      bgcolor: PALETA.welcomeBg,
      border: `2px solid ${PALETA.grisBorde}`,
      borderRadius: 2.5,
      p: 2,
      mb: 2.5,
    }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={1} mb={1.5}>
        <Typography sx={{ fontSize: 18, fontWeight: 800 }}>{appointment.date.toISOString().split('T')[0] + ' ' + appointment.date.toISOString().split('T')[1].split('.')[0]}</Typography>
        {/* <StatusBadge status={appointment.appointmentState} /> */}
      </Stack>
      <Grid container spacing={2}>
        {/* <Grid size={{ xs: 12, sm: 6 }}> */}
        {/*   <Typography sx={{ fontSize: 12, color: PALETA.textoSuave }}>Cliente</Typography> */}
        {/*   <Typography sx={{ fontWeight: 600 }}>El owner</Typography> */}
        {/* </Grid> */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography sx={{ fontSize: 12, color: PALETA.textoSuave }}>Vehículo</Typography>
          <Typography sx={{ fontWeight: 600 }}>{appointment.vehicle.brand + ' ' + appointment.vehicle.series + ' ' + appointment.vehicle.plateNumber}</Typography>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography sx={{ fontSize: 12, color: PALETA.textoSuave }}>Servicio</Typography>
          <Typography sx={{ fontWeight: 600 }}>{appointment.services[0].name}</Typography>
        </Grid>
      </Grid>

      <Box sx={{ mt: 2 }}>
        <Typography sx={{ fontWeight: 800, color: PALETA.azul, mb: 1 }}>Estado de la Orden de Trabajo</Typography>
        <Stack direction={{ xs: 'column', md: 'row' }} alignItems="center" justifyContent="space-between" spacing={1}>
          <StepDot state={'pending'} apptState={appointment.appointmentState} />
          <Box sx={{ flex: 1, height: 2, bgcolor: getProgressFromAppointmentState(appointment.appointmentState) > 0 ? PALETA.verde : PALETA.grisBorde, display: { xs: 'none', md: 'block' } }} />
          <StepDot state={'confirmed'} apptState={appointment.appointmentState} />
          <Box sx={{ flex: 1, height: 2, bgcolor: getProgressFromAppointmentState(appointment.appointmentState) > 25 ? PALETA.verde : PALETA.grisBorde, display: { xs: 'none', md: 'block' } }} />
          <StepDot state={'ongoing'} apptState={appointment.appointmentState} />
          <Box sx={{ flex: 1, height: 2, bgcolor: getProgressFromAppointmentState(appointment.appointmentState) > 50 ? PALETA.verde : PALETA.grisBorde, display: { xs: 'none', md: 'block' } }} />
          <StepDot state={'completed'} apptState={appointment.appointmentState} />
          <Box sx={{ flex: 1, height: 2, bgcolor: getProgressFromAppointmentState(appointment.appointmentState) > 75 ? PALETA.verde : PALETA.grisBorde, display: { xs: 'none', md: 'block' } }} />
          <StepDot state={'paid'} apptState={appointment.appointmentState} />
        </Stack>

        {/* Barra de progreso */}
        <Box sx={{ mt: 2 }}>
          <LinearProgress variant="determinate" value={getProgressFromAppointmentState(appointment.appointmentState)} sx={{ height: 10, borderRadius: 5, bgcolor: PALETA.grisBorde }} />
          <Typography sx={{ mt: 0.5, fontSize: 14, fontWeight: 600, color: PALETA.texto }}>
            Estado: {appointment.appointmentState} ({1 + (getProgressFromAppointmentState(appointment.appointmentState) / 25)}/5)
          </Typography>
        </Box>
      </Box>


      <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 2 }}>
        <Button disabled={appointment.appointmentState == 'pending' || appointment.appointmentState == 'completed' || appointment.appointmentState == 'paid'} onClick={() => {
          // startService(a.id)
          advanceWorkflow(appointment.id, getNextState(appointment.appointmentState));
          console.log('iniciar servicio');
        }} sx={{ bgcolor: PALETA.naranja, color: '#fff', '&:hover': { bgcolor: PALETA.naranjaHover } }}>{getProgressFromAppointmentState(appointment.appointmentState) <= 25 ? "Iniciar Servicio" : "Avanzar Estado"}</Button>
        {appointment.appointmentState == 'ongoing' &&
          <Button onClick={() => {
            console.log('Subir fotos');
            setSelectedAppointment(appointment.id)
            openPhotoModal('recibido')
          }} sx={{ bgcolor: PALETA.celeste, color: '#fff', '&:hover': { bgcolor: PALETA.celesteHover } }} startIcon={<PhotoCameraIcon />} >
            Subir Fotos
          </Button>
        }{appointment.appointmentState == 'ongoing' &&
          < Button onClick={() => {
            console.log('Registar procedimientos')
            setSelectedAppointment(appointment.id);
            setServiceDialogOpen(true)
          }}
            sx={{ bgcolor: '#eee7e1', color: 'rgb(80,80,80)', '&:hover': { bgcolor: '#dad6d3' } }}>
            Registrar Servicio
          </Button>
        }
      </Stack>
    </Box >
  );
}
