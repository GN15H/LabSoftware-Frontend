"use client";

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
  Snackbar,
  Alert,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import Grid from "@mui/material/Grid"; // Grid v2
// import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { Appointments } from "./components/Appointments";
import { Vehicles } from "./components/Vehicles";
import { useClientGateway } from "./ClientGateway.hook";
import { AppointmentsStory } from "./components/AppointmentsStory";
import { RegisterVehicle } from "./dialogs/RegisterVehicle";
import { BookAppointment } from "./dialogs/BookAppointment";
import { PaymentGateway } from "./dialogs/PaymentGateway";
import { ReassignAppointment } from "./dialogs/ReassignAppointment";
import { ApproveBudget } from "./dialogs/ApproveBudget";
import { RejectBudget } from "./dialogs/RejectBudget";
import { CancelAppointment } from "./dialogs/CancelAppointment";
import { AppointmentsPayments } from "./components/AppointmentsPayment";
import { PendingOrders } from "./components/PendingOrders";

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


export default function ClientGateway() {

  const {
    isLoading, setLoading,
    snack, setSnack,
    appointments,
    vehicles,
    services,
    vehicleOpen, setVehicleOpen,
    apptOpen, setApptOpen,
    reasignOpen, setReasignOpen,
    cancelOpen, setCancelOpen,
    paymentOpen, setPaymentOpen,
    budgetApprovedOpen, setBudgetApprovedOpen,
    budgetRejectedOpen, setBudgetRejectedOpen,
    // chatOpen, setChatOpen,
    vehicleData, setVehicleData,
    apptData, setApptData,
    reassignData, setReassignData,
    paymentData, setPaymentData,
    // chatMsgs, setChatMsgs,
    // chatInput, setChatInput,
    selectedAppointment, setSelectedAppointment,
    logout,
    submitVehicle,
    submitAppointment,
    submitApproveBudget,
    executeCancelAppointment,
    submitReasign,
    processPayment,
    showApproveBudget,
    showRejectBudget,
    // sendChat
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

            <Appointments setSelectedAppointment={setSelectedAppointment} setApptOpen={setApptOpen} setReasignOpen={setReasignOpen} setCancelOpen={setCancelOpen} appointments={appointments} />

            {/* Mis Vehículos */}

            <Vehicles setVehicleOpen={setVehicleOpen} vehicles={vehicles} />

            {/* Historial de Servicios */}

            <AppointmentsStory appointments={appointments} />

          </Grid>


          {/* Sidebar */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Stack spacing={3}>
              {/* Estado del Servicio + Pago */}
              <AppointmentsPayments setSelectedAppointment={setSelectedAppointment} appointments={appointments} setPaymentOpen={setPaymentOpen} />

              {/* Presupuestos Pendientes */}
              <PendingOrders setSelectedAppointment={setSelectedAppointment} appointments={appointments} showApproveBudget={showApproveBudget} showRejectBudget={showRejectBudget} />

            </Stack>
          </Grid>
        </Grid>
      </Container>

      {/* Floating Chat Button */}
      {/* <Box onClick={() => setChatOpen(true)} sx={{ position: "fixed", bottom: 30, right: 30, width: 60, height: 60, borderRadius: "50%", background: "linear-gradient(135deg, #3498db 0%, #2980b9 100%)", boxShadow: "0 4px 20px rgba(52, 152, 219, 0.4)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 26, zIndex: 1000, transition: "transform .2s, box-shadow .2s", "&:hover": { transform: "scale(1.1)", boxShadow: "0 6px 25px rgba(52, 152, 219, 0.6)" } }}> */}
      {/*   <ChatBubbleOutlineIcon /> */}
      {/* </Box> */}

      {/* Chat Modal */}

      {/* Dialog: Registrar Vehículo */}
      <RegisterVehicle vehicleOpen={vehicleOpen} vehForm={vehicleData} submitVehicle={submitVehicle} setVehicleOpen={setVehicleOpen} setVehForm={setVehicleData} />

      {/* Dialog: Agendar Cita */}
      <BookAppointment services={services} vehicles={vehicles} apptForm={apptData} setApptForm={setApptData} apptOpen={apptOpen} setApptOpen={setApptOpen} submitAppointment={submitAppointment} />

      {/* Dialog: Reasignar Cita */}
      <ReassignAppointment reasignOpen={reasignOpen} setReasignOpen={setReasignOpen} reasignForm={reassignData} setReasignForm={setReassignData} submitReasign={submitReasign} />

      {/* Dialog: Confirmar Cancelación */}
      <CancelAppointment appointment={selectedAppointment} cancelOpen={cancelOpen} setCancelOpen={setCancelOpen} executeCancelAppointment={executeCancelAppointment} />

      {/* Dialog: Pasarela de Pago */}
      <PaymentGateway selectedAppointment={selectedAppointment} paymentOpen={paymentOpen} setPaymentOpen={setPaymentOpen} processPayment={processPayment} paymentForm={paymentData} setPaymentForm={setPaymentData} />

      {/* Dialog: Presupuesto Aprobado */}
      <ApproveBudget submitApproveBudget={submitApproveBudget} selectedAppointment={selectedAppointment} budgetApprovedOpen={budgetApprovedOpen} setBudgetApprovedOpen={setBudgetApprovedOpen} />
      {/* Dialog: Presupuesto Rechazado */}
      <RejectBudget selectedAppointment={selectedAppointment} executeCancelAppointment={executeCancelAppointment} budgetRejectedOpen={budgetRejectedOpen} setBudgetRejectedOpen={setBudgetRejectedOpen} />

      <Backdrop
        sx={{
          zIndex: 2000
        }}
        open={isLoading}
        onClick={() => setLoading(false)}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
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
