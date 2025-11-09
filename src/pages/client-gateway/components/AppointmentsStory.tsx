import { Box, Button, Stack, Typography } from "@mui/material"
import { ItemComponent } from "./ItemComponent"
import { PALETA } from "../ClientPalette"
import { Appointment } from "@/domain/models/Appointment";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";

interface AppointmentsStoryProps {
  appointments: Appointment[];
}


export const AppointmentsStory = ({ appointments }: AppointmentsStoryProps) => {
  return (
    <ItemComponent title="Historial de Servicios" subtitle="Consulta tus servicios anteriores y facturas">
      {appointments.map((h, i) => (
        <Box key={i} sx={{ borderLeft: `4px solid ${PALETA.verde}`, bgcolor: PALETA.welcomeBg, p: 2, borderRadius: "0 8px 8px 0", mb: 2 }}>
          <Typography sx={{ fontWeight: 800, color: PALETA.texto }}>{h.date.toISOString().split('T')[0]}</Typography>
          <Typography sx={{ color: PALETA.textoSuave, fontSize: 14, mt: 0.5 }}>
            <b>Servicio:</b> {h.services[0].name}<br />
            <b>Vehículo:</b> {h.vehicle.brand + ' ' + h.vehicle.plateNumber}<br />
            <b>Costo:</b> {h.payment?.price}
          </Typography>
          <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
            <Button startIcon={<ReceiptLongIcon />} sx={{ bgcolor: "#eee7e1", color: "#2c3e50", "&:hover": { bgcolor: "#dad6d3" } }}>Ver Factura</Button>
            <Button startIcon={<ReceiptLongIcon />} sx={{ bgcolor: "#eee7e1", color: "#2c3e50", "&:hover": { bgcolor: "#dad6d3" } }}>Descargar PDF</Button>
          </Stack>
        </Box>
      ))}
    </ItemComponent >
  )
}
