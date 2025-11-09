"use client";

import React, { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AppBar,
  Toolbar,
  Container,
  Box,
  Typography,
  Avatar,
  Button,
  Paper,
  Stack,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Snackbar,
  Alert,
} from "@mui/material";
import Grid from "@mui/material/Grid"; // Grid v2
import DirectionsCarFilledIcon from "@mui/icons-material/DirectionsCarFilled";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import CloseIcon from "@mui/icons-material/Close";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import { Appointments } from "./components/Appointments";
import { appointments, appointmentsStory, vehicle } from "./mock/mockData";
import { Vehicles } from "./components/Vehicles";
import { useClientGateway } from "./ClientGateway.hook";
import { AppointmentsStory } from "./components/AppointmentsStory";
import { RegisterVehicle } from "./dialogs/RegisterVehicle";
import { VehicleData } from "./ClientGateway.types";
import { BookAppointment } from "./dialogs/BookAppointment";
import { PaymentGateway } from "./dialogs/PaymentGateway";
import { ReassignAppointment } from "./dialogs/ReassignAppointment";
import { ApproveBudget } from "./dialogs/ApproveBudget";
import { RejectBudget } from "./dialogs/RejectBudget";
import { CancelAppointment } from "./dialogs/CancelAppointment";

const PALETA = {
  fondo: "#f8f9fa",
  headerGrad: "linear-gradient(135deg, #2c3e50 0%, #3498db 100%)",
  welcomeBg: "#c1d1e696",
  cardShadow: "0 2px 20px rgba(0,0,0,0.08)",
  azul: "#3498db",
  azulOsc: "#2980b9",
  verde: "#27ae60",
  naranja: "#e37239",
  naranjaHover: "#c4683a",
  grisBorde: "#ecf0f1",
  textoSuave: "#7f8c8d",
  texto: "#2c3e50",
};

// ------- Tipos simples -------
type CitaStatus = "pending" | "in-progress" | "completed" | "cancelled";

export default function ClientGateway() {

  const {
    snack, setSnack,
    appointments, setAppointments,
    vehicles, setVehicles,
    services, setServices,
    vehicleOpen, setVehicleOpen,
    apptOpen, setApptOpen,
    reasignOpen, setReasignOpen,
    cancelOpen, setCancelOpen,
    paymentOpen, setPaymentOpen,
    budgetApprovedOpen, setBudgetApprovedOpen,
    budgetRejectedOpen, setBudgetRejectedOpen,
    chatOpen, setChatOpen,
    vehicleData, setVehicleData,
    apptData, setApptData,
    reassignData, setReassignData,
    paymentData, setPaymentData,
    chatMsgs, setChatMsgs,
    chatInput, setChatInput,
    logout,
    submitVehicle,
    submitAppointment,
    executeCancelAppointment,
    submitReasign,
    processPayment,
    showApproveBudget,
    showRejectBudget,
    sendChat
  } = useClientGateway();

  // Badges de estado
  // const StatusBadge = ({ type }: { type: CitaStatus | "ready" }) => {
  //   const map: Record<string, { bg: string; color: string; label: string }> = {
  //     pending: { bg: "#f39c12", color: "#fff", label: "Pendiente" },
  //     "in-progress": { bg: "#3498db", color: "#fff", label: "En Proceso" },
  //     completed: { bg: "#27ae60", color: "#fff", label: "Completado" },
  //     cancelled: { bg: "#e74c3c", color: "#fff", label: "Cancelado" },
  //     ready: { bg: "#27ae60", color: "#fff", label: "Listo" },
  //   };
  //   const s = map[type];
  //   return (
  //     <Box sx={{ display: "inline-block", px: 1, py: 0.5, borderRadius: 1, fontSize: 12, fontWeight: 700, bgcolor: s.bg, color: s.color }}>
  //       {s.label}
  //     </Box>
  //   );
  // };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: PALETA.fondo, color: "#2d3436" }}>
      {/* Header */}
      <AppBar position="sticky" sx={{ background: PALETA.headerGrad, boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}>
        <Toolbar sx={{ maxWidth: 1200, mx: "auto", width: "100%" }}>
          <Typography sx={{ fontSize: 28, fontWeight: 700, flex: 1 }}>AutoLink Manager</Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography>Juan Pérez</Typography>
            <Avatar sx={{ bgcolor: PALETA.verde, width: 40, height: 40, fontWeight: 700 }}>JP</Avatar>
            <Button onClick={logout} sx={{ bgcolor: "rgba(255,255,255,0.2)", color: "#fff", textTransform: "none", "&:hover": { bgcolor: "rgba(255,255,255,0.28)" } }}>
              Salir
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>

      {/* Contenido */}
      <Container sx={{ py: 3, maxWidth: 1200 }}>
        <Paper sx={{ p: 3, mb: 3, borderRadius: 3, boxShadow: PALETA.cardShadow, bgcolor: PALETA.welcomeBg }}>
          <Typography sx={{ fontSize: 28, fontWeight: 800, color: "#2c3e50", mb: 0.5 }}>Bienvenido a tu Portal</Typography>
          <Typography sx={{ color: "#6b6e6e", fontSize: 16 }}>Gestiona tus vehículos, citas y servicios de manera fácil y rápida</Typography>
        </Paper>

        <Grid container spacing={3}>
          {/* Columna principal */}
          <Grid size={{ xs: 12, md: 8 }}>
            {/* Gestión de Citas */}

            <Appointments setApptOpen={setApptOpen} setReasignOpen={setReasignOpen} setCancelOpen={setCancelOpen} appointments={appointments} />

            {/* Mis Vehículos */}

            <Vehicles setVehicleOpen={setVehicleOpen} vehicles={vehicles} />

            {/* Historial de Servicios */}

            <AppointmentsStory appointments={appointmentsStory} />

          </Grid>


          {/* Sidebar */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Stack spacing={3}>
              {/* Estado del Servicio + Pago */}
              <Paper sx={{ p: 3, borderRadius: 3, boxShadow: PALETA.cardShadow, background: "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)", border: `2px solid ${PALETA.azul}` }}>
                <Typography sx={{ fontSize: 20, fontWeight: 800, color: "#1976d2", textAlign: "center", mb: 1.5 }}>🔧 Estado del Servicio</Typography>
                <Box sx={{ borderLeft: "5px solid #4caf50", bgcolor: "rgba(255,255,255,0.9)", p: 2, borderRadius: 1 }}>
                  <Typography sx={{ fontWeight: 800, color: PALETA.texto, mb: 0.5 }}>Honda Civic - XYZ-789</Typography>
                  <Typography sx={{ color: PALETA.textoSuave, fontSize: 14, lineHeight: 1.6, mb: 1 }}>
                    <b>Estado:</b> ✅ Listo para entrega<br />
                    <b>Trabajo completado:</b> Sí<br />
                    <b>Mecánico:</b> Carlos Rodríguez<br />
                    <b>Finalizado:</b> 2:30 PM
                  </Typography>
                  {/* <StatusBadge type="ready" /> */}

                  {/* Pago */}
                  <Box sx={{ mt: 2, p: 2, borderRadius: 2, textAlign: "center", background: "linear-gradient(135deg, #fff3e0, #ffcc80)", border: "2px solid #ff9800" }}>
                    <Typography sx={{ color: "#e65100", fontWeight: 800, mb: 1 }}>💳 Pago Pendiente</Typography>
                    <Typography sx={{ fontSize: 26, fontWeight: 800, color: PALETA.texto, mb: 1 }}>$450,000</Typography>
                    <Button startIcon={<CreditCardIcon />} onClick={() => setPaymentOpen(true)} fullWidth variant="contained" sx={{ background: "linear-gradient(135deg, #4caf50, #388e3c)", "&:hover": { background: "linear-gradient(135deg, #66bb6a, #4caf50)" } }}>
                      Pagar Ahora
                    </Button>
                    <Typography sx={{ fontSize: 12, color: "#5d4037", mt: 1 }}>
                      ✓ Pago seguro SSL • ✓ Tarjetas crédito/débito • ✓ Factura digital automática
                    </Typography>
                  </Box>
                </Box>
              </Paper>

              {/* Presupuestos Pendientes */}
              <Paper sx={{ p: 2, borderRadius: 3, boxShadow: PALETA.cardShadow }}>
                <Typography sx={{ fontSize: 18, fontWeight: 800, color: PALETA.texto, mb: 1 }}>Presupuestos Pendientes</Typography>

                {[{ titulo: "Revisión Honda Civic", monto: "$450,000", urgente: true }, { titulo: "Cambio de aceite Toyota", monto: "$85,000", urgente: false }].map((b, i) => (
                  <Box key={i} sx={{ p: 2, borderRadius: 2, mb: 2, bgcolor: b.urgente ? "#f8d7da" : "#fff3cd", border: `1px solid ${b.urgente ? "#f5c6cb" : "#ffeaa7"}` }}>
                    <Typography sx={{ fontWeight: 800, color: PALETA.texto }}>{b.titulo}</Typography>
                    <Typography sx={{ color: PALETA.textoSuave, mt: 0.5 }}>Monto: <b style={{ color: "#e17055" }}>{b.monto}</b></Typography>
                    <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                      <Button onClick={showApproveBudget} sx={{ bgcolor: "#21aa43", color: "#fff", "&:hover": { bgcolor: "#138d46" } }}>Aprobar</Button>
                      <Button onClick={showRejectBudget} sx={{ bgcolor: "#ca370b", color: "#fff", "&:hover": { bgcolor: "#ac3315" } }}>Rechazar</Button>
                    </Stack>
                  </Box>
                ))}
              </Paper>
            </Stack>
          </Grid>
        </Grid>
      </Container>

      {/* Floating Chat Button */}
      <Box onClick={() => setChatOpen(true)} sx={{ position: "fixed", bottom: 30, right: 30, width: 60, height: 60, borderRadius: "50%", background: "linear-gradient(135deg, #3498db 0%, #2980b9 100%)", boxShadow: "0 4px 20px rgba(52, 152, 219, 0.4)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 26, zIndex: 1000, transition: "transform .2s, box-shadow .2s", "&:hover": { transform: "scale(1.1)", boxShadow: "0 6px 25px rgba(52, 152, 219, 0.6)" } }}>
        <ChatBubbleOutlineIcon />
      </Box>

      {/* Chat Modal */}

      {/* Dialog: Registrar Vehículo */}
      <RegisterVehicle vehicleOpen={vehicleOpen} vehForm={vehicleData} submitVehicle={submitVehicle} setVehicleOpen={setVehicleOpen} setVehForm={setVehicleData} />

      {/* Dialog: Agendar Cita */}
      <BookAppointment services={services} vehicles={vehicles} apptForm={apptData} setApptForm={setApptData} apptOpen={apptOpen} setApptOpen={setApptOpen} submitAppointment={submitAppointment} />

      {/* Dialog: Reasignar Cita */}
      <ReassignAppointment reasignOpen={reasignOpen} setReasignOpen={setReasignOpen} reasignForm={reassignData} setReasignForm={setReassignData} submitReasign={submitReasign} />

      {/* Dialog: Confirmar Cancelación */}
      <CancelAppointment cancelOpen={cancelOpen} setCancelOpen={setCancelOpen} executeCancelAppointment={executeCancelAppointment} />

      {/* Dialog: Pasarela de Pago */}
      <PaymentGateway paymentOpen={paymentOpen} setPaymentOpen={setPaymentOpen} processPayment={processPayment} paymentForm={paymentData} setPaymentForm={setPaymentData} />

      {/* Dialog: Presupuesto Aprobado */}
      <ApproveBudget budgetApprovedOpen={budgetApprovedOpen} setBudgetApprovedOpen={setBudgetApprovedOpen} />
      {/* Dialog: Presupuesto Rechazado */}
      <RejectBudget budgetRejectedOpen={budgetRejectedOpen} setBudgetRejectedOpen={setBudgetRejectedOpen} />

      {/* Snackbar */}
      <Snackbar open={snack.open} autoHideDuration={4000} onClose={() => setSnack({ ...snack, open: false })}>
        <Alert severity={snack.sev} sx={{ width: "100%" }}>{snack.message}</Alert>
      </Snackbar>
    </Box>
  );
}

export function fieldSx() {
  return {
    "& .MuiOutlinedInput-root": {
      backgroundColor: "#f8f9fa",
      borderRadius: 2,
      "& fieldset": { borderColor: "#ecf0f1", borderWidth: 2 },
      "&:hover fieldset": { borderColor: "#bdc3c7" },
      "&.Mui-focused fieldset": { borderColor: "#3498db" },
    },
  } as const;
}
