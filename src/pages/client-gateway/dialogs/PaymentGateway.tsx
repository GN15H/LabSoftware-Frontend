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
  Typography,
  Paper
} from "@mui/material";
import Grid from "@mui/material/Grid"; // Grid v2
import { PALETA } from "../ClientPalette";
import { fieldSx } from "../ClientGateway";
import { SetStateAction } from "react";
import { PaymentData } from "../ClientGateway.types";
import { Appointment } from "@/domain/models/Appointment";

interface PaymentGatewayProps {
  selectedAppointment: Appointment | null;
  paymentOpen: boolean;
  setPaymentOpen: React.Dispatch<SetStateAction<boolean>>;
  processPayment: (appointment: Appointment) => void;
  paymentForm: PaymentData;
  setPaymentForm: React.Dispatch<SetStateAction<PaymentData>>;
}

export const PaymentGateway = ({ selectedAppointment, paymentOpen, setPaymentOpen, processPayment, paymentForm, setPaymentForm }: PaymentGatewayProps) => {

  const total = (appt: Appointment | null): bigint => {
    if (appt == null) return BigInt(0);
    let value: bigint = BigInt(0);
    for (const s of appt.services) {
      value = value + s.price;
    }
    return value;
  }

  return (
    <Dialog open={paymentOpen} onClose={() => setPaymentOpen(false)} fullWidth maxWidth="sm">
      <DialogTitle>💳 Pasarela de Pago Seguro</DialogTitle>
      <DialogContent dividers>
        <Paper sx={{ p: 2, bgcolor: "#e3f2fd", borderRadius: 2, mb: 2 }}>
          <Typography sx={{ color: "#1976d2", fontWeight: 800, mb: 1 }}>Resumen del Servicio:</Typography>
          <Typography sx={{ fontSize: 14, color: PALETA.texto }}>
            <b>Servicio:</b> Revisión Honda Civic<br />
            <b>Vehículo:</b> Honda Civic (XYZ-789)<br />
            <b>Fecha:</b> Miércoles, 25 de Septiembre<br />
            <b>Total a pagar:</b> <span style={{ color: "#27ae60", fontWeight: 800 }}>${total(selectedAppointment)}</span>
          </Typography>
        </Paper>

        <Grid container spacing={2} component="form" >
          <Grid size={{ xs: 12 }}>
            <TextField required fullWidth label="Número de Tarjeta" placeholder="1234 5678 9012 3456" inputProps={{ maxLength: 19 }} sx={fieldSx()} onChange={(e) => setPaymentForm({ ...paymentForm, number: e.target.value })} />
          </Grid>
          <Grid size={{ xs: 6 }}>
            <TextField required fullWidth label="Fecha de Expiración" placeholder="MM/AA" inputProps={{ maxLength: 5 }} sx={fieldSx()} onChange={(e) => setPaymentForm({ ...paymentForm, exp: e.target.value })} />
          </Grid>
          <Grid size={{ xs: 6 }}>
            <TextField required fullWidth label="CVV" placeholder="123" inputProps={{ maxLength: 3 }} sx={fieldSx()} onChange={(e) => setPaymentForm({ ...paymentForm, cvv: e.target.value })} />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField required fullWidth label="Nombre del Titular" placeholder="Nombre como aparece en la tarjeta" sx={fieldSx()} onChange={(e) => setPaymentForm({ ...paymentForm, holder: e.target.value })} />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <FormControl fullWidth required sx={fieldSx()}>
              <InputLabel>Tipo de Tarjeta</InputLabel>
              <Select label="Tipo de Tarjeta" value={paymentForm.type} onChange={(e) => setPaymentForm({ ...paymentForm, type: e.target.value as string })}>
                <MenuItem value="credit">Tarjeta de Crédito</MenuItem>
                <MenuItem value="debit">Tarjeta de Débito</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <Paper sx={{ p: 2, bgcolor: "#fff3cd", border: "1px solid #ffeaa7", color: "#856404", mt: 2, fontSize: 14 }}>
          🔒 <b>Pago 100% seguro:</b> Tus datos están protegidos con encriptación SSL.
        </Paper>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setPaymentOpen(false)} sx={{ bgcolor: "#eee7e1", color: "rgb(80,80,80)", "&:hover": { bgcolor: "#dad6d3" } }}>Cancelar</Button>
        <Button onClick={() => {
          if (selectedAppointment == null) return;
          processPayment(selectedAppointment);
        }} sx={{ bgcolor: "#21aa43", color: "#fff", "&:hover": { bgcolor: "#138d46" } }}>PAGAR</Button>
      </DialogActions>
    </Dialog>
  )
}
