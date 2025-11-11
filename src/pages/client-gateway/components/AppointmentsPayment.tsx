import {
  Paper,
  Typography,
  Button,
  Box
} from "@mui/material";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import { PALETA } from "../ClientPalette";
import { Appointment } from "@/domain/models/Appointment";
import { SetStateAction } from "react";

interface AppointmentsPaymentsProps {
  appointments: Appointment[]
  setSelectedAppointment: React.Dispatch<SetStateAction<Appointment | null>>;
  setPaymentOpen: React.Dispatch<SetStateAction<boolean>>;
}

export const AppointmentsPayments = ({ appointments, setPaymentOpen, setSelectedAppointment }: AppointmentsPaymentsProps) => {
  return (
    <>
      {appointments.filter(a => a.appointmentState == 'completed').map(a => (
        < Paper key={a.id} sx={{ p: 3, borderRadius: 3, boxShadow: PALETA.cardShadow, background: "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)", border: `2px solid ${PALETA.azul}` }}>
          <Typography sx={{ fontSize: 20, fontWeight: 800, color: "#1976d2", textAlign: "center", mb: 1.5 }}>🔧 Estado del Servicio</Typography>
          <Box sx={{ borderLeft: "5px solid #4caf50", bgcolor: "rgba(255,255,255,0.9)", p: 2, borderRadius: 1 }}>
            <Typography sx={{ fontWeight: 800, color: PALETA.texto, mb: 0.5 }}>{a.vehicle.brand + ' ' + a.vehicle.series + ' ' + a.vehicle.plateNumber}</Typography>
            <Typography sx={{ color: PALETA.textoSuave, fontSize: 14, lineHeight: 1.6, mb: 1 }}>
              <b>Estado:</b> ✅ Listo para entrega<br />
              <b>Trabajo completado:</b> Sí<br />
              <b>Mecánico:</b> {a.mechanic.name + ' ' + a.mechanic.lastName}<br />
            </Typography>
            {/* <StatusBadge type="ready" /> */}

            {/* Pago */}
            <Box sx={{ mt: 2, p: 2, borderRadius: 2, textAlign: "center", background: "linear-gradient(135deg, #fff3e0, #ffcc80)", border: "2px solid #ff9800" }}>
              <Typography sx={{ color: "#e65100", fontWeight: 800, mb: 1 }}>💳 Pago Pendiente</Typography>
              <Typography sx={{ fontSize: 26, fontWeight: 800, color: PALETA.texto, mb: 1 }}>$450,000</Typography>
              <Button startIcon={<CreditCardIcon />} onClick={() => {
                setSelectedAppointment(a);
                setPaymentOpen(true)
              }} fullWidth variant="contained" sx={{ background: "linear-gradient(135deg, #4caf50, #388e3c)", "&:hover": { background: "linear-gradient(135deg, #66bb6a, #4caf50)" } }}>
                Pagar Ahora
              </Button>
              <Typography sx={{ fontSize: 12, color: "#5d4037", mt: 1 }}>
                ✓ Pago seguro SSL • ✓ Tarjetas crédito/débito • ✓ Factura digital automática
              </Typography>
            </Box>
          </Box>
        </Paper >
      ))

      }
    </>
  );
}
