import { Box, Button, Stack, Typography } from "@mui/material"
import { ItemComponent } from "./ItemComponent"
import { PALETA } from "../ClientPalette"
import { Appointment } from "@/domain/models/Appointment"
import { StatusBadge } from "./StatusBadge";
import { SetStateAction } from "react";

interface AppointmentsProps {
  appointments: Appointment[];
  setApptOpen: React.Dispatch<SetStateAction<boolean>>;
  setReasignOpen: React.Dispatch<SetStateAction<boolean>>;
  setCancelOpen: React.Dispatch<SetStateAction<boolean>>;
}


export const Appointments = ({ appointments, setApptOpen, setReasignOpen, setCancelOpen }: AppointmentsProps) => {
  return (
    <ItemComponent title="Gestión de Citas" subtitle="Agenda, modifica o cancela tus citas">
      <Box sx={{ mb: 2 }}>
        <Button onClick={() => setApptOpen(true)} sx={{ bgcolor: PALETA.naranja, color: "#fff", "&:hover": { bgcolor: PALETA.naranjaHover } }}>Agendar Cita</Button>
      </Box>

      {appointments.map((c) => (
        <Box key={c.id} sx={{ borderLeft: `4px solid ${PALETA.azul}`, bgcolor: PALETA.welcomeBg, p: 2, borderRadius: "0 8px 8px 0", mb: 2 }}>
          <Typography sx={{ fontWeight: 800, color: PALETA.texto }}>{c.date.toISOString()}</Typography>
          <Typography sx={{ color: PALETA.textoSuave, fontSize: 14, mt: 0.5 }}>
            <b>Servicio:</b> {c.services.length > 0 ? c.services[0].name : ''}<br />
            <b>Vehículo:</b> {c.vehicle.brand + ' ' + c.vehicle.plateNumber}<br />
            <b>Mecánico:</b> {c.mechanic.name + ' ' + c.mechanic.lastName}
          </Typography>
          <Box sx={{ mt: 1 }}>
            <StatusBadge type={c.appointmentState} />
          </Box>
          <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
            <Button onClick={() => setReasignOpen(true)} sx={{ bgcolor: "#eee7e1", color: "#2c3e50", "&:hover": { bgcolor: "#dad6d3" } }}>Reasignar</Button>
            <Button onClick={() => setCancelOpen(true)} sx={{ bgcolor: "#ca370b", color: "#fff", "&:hover": { bgcolor: "#ac3315" } }}>Cancelar</Button>
          </Stack>
        </Box>
      ))}
    </ItemComponent >
  )
}
