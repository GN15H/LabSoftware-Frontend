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

export default function ClientPortalMUI() {
  // Estado general
  const [snack, setSnack] = useState<{ open: boolean; message: string; sev: "success" | "info" | "warning" | "error" }>({ open: false, message: "", sev: "info" });

  // Citas y vehículos de ejemplo (mock)
  const citas = useMemo(
    () => [
      {
        id: "CITA-001",
        fecha: "Miércoles, 25 de Septiembre - 10:00 AM",
        servicio: "Cambio de aceite",
        vehiculo: "Toyota Corolla (ABC-123)",
        mecanico: "Carlos Rodríguez",
        status: "pending" as CitaStatus,
      },
    ],
    []
  );

  const vehiculos = useMemo(
    () => [
      { placa: "ABC-123", nombre: "Toyota Corolla 2020", km: 45000 },
      { placa: "XYZ-789", nombre: "Honda Civic 2019", km: 62000 },
    ],
    []
  );

  // Dialog states
  const [vehicleOpen, setVehicleOpen] = useState(false);
  const [apptOpen, setApptOpen] = useState(false);
  const [reasignOpen, setReasignOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [budgetApprovedOpen, setBudgetApprovedOpen] = useState(false);
  const [budgetRejectedOpen, setBudgetRejectedOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  // Forms
  const [vehForm, setVehForm] = useState({ marca: "", modelo: "", anio: "", placa: "", km: "", tipo: "Carro" });
  const [apptForm, setApptForm] = useState({ vehiculo: "Toyota Corolla (ABC-123)", servicio: "Cambio de aceite", fecha: "", hora: "10:00", descripcion: "" });
  const [reasignForm, setReasignForm] = useState({ fecha: "", hora: "", motivo: "" });
  const [paymentForm, setPaymentForm] = useState({ numero: "", exp: "", cvv: "", titular: "", tipo: "" });

  // Chat
  const [chatMsgs, setChatMsgs] = useState<Array<{ who: "bot" | "user"; text: string }>>([
    { who: "bot", text: "¡Hola! Soy tu asistente virtual. ¿En qué puedo ayudarte?" },
  ]);
  const [chatInput, setChatInput] = useState("");

  // Handlers principales
  const router = useRouter();
  const logout = () => {
    try {
        localStorage.removeItem('role');
        localStorage.removeItem('token');
        sessionStorage.clear();
    } catch {}
    router.replace('/'); // vuelve al login
    };

  const submitVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    setVehicleOpen(false);
    setSnack({ open: true, sev: "success", message: "Vehículo registrado correctamente" });
  };

  const submitAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    setApptOpen(false);
    setSnack({ open: true, sev: "success", message: "Cita agendada con éxito" });
  };

  const executeCancelAppointment = () => {
    setCancelOpen(false);
    setSnack({ open: true, sev: "success", message: "Cita cancelada exitosamente" });
  };

  const submitReasign = (e: React.FormEvent) => {
    e.preventDefault();
    setReasignOpen(false);
    setSnack({ open: true, sev: "success", message: "Solicitud de reasignación enviada" });
  };

  const processPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setSnack({ open: true, sev: "info", message: "Procesando pago..." });
    setTimeout(() => {
      setPaymentOpen(false);
      setSnack({ open: true, sev: "success", message: "¡Pago procesado exitosamente!" });
    }, 1800);
  };

  const showApproveBudget = () => setBudgetApprovedOpen(true);
  const showRejectBudget = () => setBudgetRejectedOpen(true);

  const sendChat = (text?: string) => {
    const t = (text ?? chatInput).trim();
    if (!t) return;
    setChatMsgs((m) => [...m, { who: "user", text: t }]);
    setChatInput("");
    setTimeout(() => {
      // respuestas simples de demo
      const lower = t.toLowerCase();
      let resp = "Entiendo. ¿Te ayudo con precios, horarios o servicios?";
      if (lower.includes("precio")) resp = "Cambio de aceite $80,000, Frenos $250,000, Alineación $100,000";
      if (lower.includes("horario")) resp = "L-V 8:00-18:00, Sáb 8:00-16:00";
      if (lower.includes("servicio")) resp = "Aceite, Revisión, Frenos, Alineación, Diagnóstico, Afinación";
      setChatMsgs((m) => [...m, { who: "bot", text: resp }]);
    }, 700);
  };

  // Badges de estado
  const StatusBadge = ({ type }: { type: CitaStatus | "ready" }) => {
    const map: Record<string, { bg: string; color: string; label: string }> = {
      pending: { bg: "#f39c12", color: "#fff", label: "Pendiente" },
      "in-progress": { bg: "#3498db", color: "#fff", label: "En Proceso" },
      completed: { bg: "#27ae60", color: "#fff", label: "Completado" },
      cancelled: { bg: "#e74c3c", color: "#fff", label: "Cancelado" },
      ready: { bg: "#27ae60", color: "#fff", label: "Listo" },
    };
    const s = map[type];
    return (
      <Box sx={{ display: "inline-block", px: 1, py: 0.5, borderRadius: 1, fontSize: 12, fontWeight: 700, bgcolor: s.bg, color: s.color }}>
        {s.label}
      </Box>
    );
  };

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
            <Paper sx={{ borderRadius: 3, overflow: "hidden", boxShadow: PALETA.cardShadow, mb: 3 }}>
              <Box sx={{ p: 2.5, color: "#fff", background: "linear-gradient(135deg, #2c3e50 30%, #3498db 100%)" }}>
                <Typography sx={{ fontSize: 20, fontWeight: 800 }}>Gestión de Citas</Typography>
                <Typography sx={{ opacity: 0.9, fontSize: 14 }}>Agenda, modifica o cancela tus citas</Typography>
              </Box>
              <Box sx={{ p: 2.5 }}>
                <Box sx={{ mb: 2 }}>
                  <Button onClick={() => setApptOpen(true)} sx={{ bgcolor: PALETA.naranja, color: "#fff", "&:hover": { bgcolor: PALETA.naranjaHover } }}>Agendar Cita</Button>
                </Box>

                {citas.map((c) => (
                  <Box key={c.id} sx={{ borderLeft: `4px solid ${PALETA.azul}`, bgcolor: PALETA.welcomeBg, p: 2, borderRadius: "0 8px 8px 0", mb: 2 }}>
                    <Typography sx={{ fontWeight: 800, color: PALETA.texto }}>{c.fecha}</Typography>
                    <Typography sx={{ color: PALETA.textoSuave, fontSize: 14, mt: 0.5 }}>
                      <b>Servicio:</b> {c.servicio}<br />
                      <b>Vehículo:</b> {c.vehiculo}<br />
                      <b>Mecánico:</b> {c.mecanico}
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                      <StatusBadge type={c.status} />
                    </Box>
                    <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
                      <Button onClick={() => setReasignOpen(true)} sx={{ bgcolor: "#eee7e1", color: "#2c3e50", "&:hover": { bgcolor: "#dad6d3" } }}>Reasignar</Button>
                      <Button onClick={() => setCancelOpen(true)} sx={{ bgcolor: "#ca370b", color: "#fff", "&:hover": { bgcolor: "#ac3315" } }}>Cancelar</Button>
                    </Stack>
                  </Box>
                ))}
              </Box>
            </Paper>

            {/* Mis Vehículos */}
            <Paper sx={{ borderRadius: 3, overflow: "hidden", boxShadow: PALETA.cardShadow, mb: 3 }}>
              <Box sx={{ p: 2.5, color: "#fff", background: "linear-gradient(135deg, #2c3e50 30%, #3498db 100%)" }}>
                <Typography sx={{ fontSize: 20, fontWeight: 800 }}>Mis Vehículos</Typography>
                <Typography sx={{ opacity: 0.9, fontSize: 14 }}>Administra la información de tus vehículos</Typography>
              </Box>
              <Box sx={{ p: 2.5 }}>
                <Box sx={{ mb: 2 }}>
                  <Button onClick={() => setVehicleOpen(true)} sx={{ bgcolor: PALETA.naranja, color: "#fff", "&:hover": { bgcolor: PALETA.naranjaHover } }}>Registrar Vehículo</Button>
                </Box>

                {vehiculos.map((v) => (
                  <Box key={v.placa} sx={{ bgcolor: "#ecf4fc", border: "2px solid #ddeaf7", borderRadius: 1.5, p: 2, mb: 2, transition: "all .15s", "&:hover": { border: "3px solid #2c8ac9" } }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Box>
                        <Typography sx={{ fontWeight: 800, color: PALETA.texto }}>{v.nombre}</Typography>
                        <Typography sx={{ color: PALETA.textoSuave, fontSize: 14 }}>Kilometraje: {v.km.toLocaleString()} km</Typography>
                      </Box>
                      <Box sx={{ bgcolor: PALETA.azul, color: "#fff", px: 1, py: 0.5, borderRadius: 1, fontWeight: 800 }}>{v.placa}</Box>
                    </Stack>
                  </Box>
                ))}
              </Box>
            </Paper>

            {/* Historial de Servicios */}
            <Paper sx={{ borderRadius: 3, overflow: "hidden", boxShadow: PALETA.cardShadow }}>
              <Box sx={{ p: 2.5, color: "#fff", background: "linear-gradient(135deg, #2c3e50 30%, #3498db 100%)" }}>
                <Typography sx={{ fontSize: 20, fontWeight: 800 }}>Historial de Servicios</Typography>
                <Typography sx={{ opacity: 0.9, fontSize: 14 }}>Consulta tus servicios anteriores y facturas</Typography>
              </Box>
              <Box sx={{ p: 2.5 }}>
                {[{ fecha: "Lunes, 15 de Septiembre - 2:00 PM", detalle: "Revisión general + Cambio de frenos", veh: "Honda Civic (XYZ-789)", costo: "$250,000" }, { fecha: "Viernes, 30 de Agosto - 9:00 AM", detalle: "Cambio de aceite", veh: "Toyota Corolla (ABC-123)", costo: "$80,000" }].map((h, i) => (
                  <Box key={i} sx={{ borderLeft: `4px solid ${PALETA.verde}`, bgcolor: PALETA.welcomeBg, p: 2, borderRadius: "0 8px 8px 0", mb: 2 }}>
                    <Typography sx={{ fontWeight: 800, color: PALETA.texto }}>{h.fecha}</Typography>
                    <Typography sx={{ color: PALETA.textoSuave, fontSize: 14, mt: 0.5 }}>
                      <b>Servicio:</b> {h.detalle}<br />
                      <b>Vehículo:</b> {h.veh}<br />
                      <b>Costo:</b> {h.costo}
                    </Typography>
                    <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
                      <Button startIcon={<ReceiptLongIcon />} sx={{ bgcolor: "#eee7e1", color: "#2c3e50", "&:hover": { bgcolor: "#dad6d3" } }}>Ver Factura</Button>
                      <Button startIcon={<ReceiptLongIcon />} sx={{ bgcolor: "#eee7e1", color: "#2c3e50", "&:hover": { bgcolor: "#dad6d3" } }}>Descargar PDF</Button>
                    </Stack>
                  </Box>
                ))}
              </Box>
            </Paper>
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
                  <StatusBadge type="ready" />

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
      <Dialog open={chatOpen} onClose={() => setChatOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <ChatBubbleOutlineIcon />
            <b>AutoLink Assistant</b>
          </Stack>
          <Button variant="text" onClick={() => setChatOpen(false)}><CloseIcon /></Button>
        </DialogTitle>
        <DialogContent dividers sx={{ bgcolor: "#f8f9fa" }}>
          <Stack spacing={1}>
            {chatMsgs.map((m, i) => (
              <Box key={i} sx={{ display: "flex", justifyContent: m.who === "user" ? "flex-end" : "flex-start" }}>
                <Box sx={{ px: 1.5, py: 1, borderRadius: 3, maxWidth: "80%", fontSize: 14, bgcolor: m.who === "bot" ? "#e3f2fd" : PALETA.azul, color: m.who === "bot" ? "#1976d2" : "#fff" }}>
                  {m.text}
                </Box>
              </Box>
            ))}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ display: "block" }}>
          <Stack direction="row" spacing={1} sx={{ px: 2, pb: 1 }}>
            {["Precios", "Horarios", "Servicios"].map((q) => (
              <Button key={q} size="small" onClick={() => sendChat(`¿Cuáles son los ${q.toLowerCase()}?`)} sx={{ bgcolor: "#ecf0f1", color: PALETA.texto, textTransform: "none", borderRadius: 5, "&:hover": { bgcolor: PALETA.azul, color: "#fff" } }}>{q}</Button>
            ))}
          </Stack>
          <Stack direction="row" spacing={1} sx={{ px: 2, pb: 2 }}>
            <TextField fullWidth size="small" placeholder="Escribe tu pregunta..." value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && sendChat()} />
            <Button onClick={() => sendChat()} variant="contained">Enviar</Button>
          </Stack>
        </DialogActions>
      </Dialog>

      {/* Dialog: Registrar Vehículo */}
      <Dialog open={vehicleOpen} onClose={() => setVehicleOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Registrar Nuevo Vehículo</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth label="Marca" value={vehForm.marca} onChange={(e) => setVehForm({ ...vehForm, marca: e.target.value })} sx={fieldSx()} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth label="Modelo" value={vehForm.modelo} onChange={(e) => setVehForm({ ...vehForm, modelo: e.target.value })} sx={fieldSx()} />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField type="number" fullWidth label="Año" value={vehForm.anio} onChange={(e) => setVehForm({ ...vehForm, anio: e.target.value })} sx={fieldSx()} />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField fullWidth label="Placa" value={vehForm.placa} onChange={(e) => setVehForm({ ...vehForm, placa: e.target.value })} sx={fieldSx()} />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField type="number" fullWidth label="Kilometraje" value={vehForm.km} onChange={(e) => setVehForm({ ...vehForm, km: e.target.value })} sx={fieldSx()} />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <FormControl fullWidth sx={fieldSx()}>
                <InputLabel>Tipo de Vehículo</InputLabel>
                <Select label="Tipo de Vehículo" value={vehForm.tipo} onChange={(e) => setVehForm({ ...vehForm, tipo: e.target.value as string })}>
                  <MenuItem value="Carro">Carro</MenuItem>
                  <MenuItem value="Moto">Moto</MenuItem>
                  <MenuItem value="Otro">Otro</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setVehicleOpen(false)} sx={{ bgcolor: "#eee7e1", color: "rgb(80,80,80)", "&:hover": { bgcolor: "#dad6d3" } }}>Cancelar</Button>
          <Button onClick={submitVehicle as any} sx={{ bgcolor: PALETA.naranja, color: "#fff", "&:hover": { bgcolor: PALETA.naranjaHover } }}>Registrar</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog: Agendar Cita */}
      <Dialog open={apptOpen} onClose={() => setApptOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Agendar Nueva Cita</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <FormControl fullWidth sx={fieldSx()}>
                <InputLabel>Vehículo</InputLabel>
                <Select label="Vehículo" value={apptForm.vehiculo} onChange={(e) => setApptForm({ ...apptForm, vehiculo: e.target.value as string })}>
                  {vehiculos.map((v) => (
                    <MenuItem key={v.placa} value={`${v.nombre} (${v.placa})`}>{v.nombre} ({v.placa})</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <FormControl fullWidth sx={fieldSx()}>
                <InputLabel>Servicio</InputLabel>
                <Select label="Servicio" value={apptForm.servicio} onChange={(e) => setApptForm({ ...apptForm, servicio: e.target.value as string })}>
                  {["Cambio de aceite", "Revisión general", "Cambio de frenos", "Alineación"].map((s) => (
                    <MenuItem key={s} value={s}>{s}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField type="date" fullWidth label="Fecha Preferida" InputLabelProps={{ shrink: true }} value={apptForm.fecha} onChange={(e) => setApptForm({ ...apptForm, fecha: e.target.value })} sx={fieldSx()} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth sx={fieldSx()}>
                <InputLabel>Hora Preferida</InputLabel>
                <Select label="Hora Preferida" value={apptForm.hora} onChange={(e) => setApptForm({ ...apptForm, hora: e.target.value as string })}>
                  {["08:00", "10:00", "14:00", "16:00"].map((h) => (
                    <MenuItem key={h} value={h}>{h}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField fullWidth multiline minRows={3} label="Descripción del Problema (Opcional)" value={apptForm.descripcion} onChange={(e) => setApptForm({ ...apptForm, descripcion: e.target.value })} sx={fieldSx()} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setApptOpen(false)} sx={{ bgcolor: "#eee7e1", color: "rgb(80,80,80)", "&:hover": { bgcolor: "#dad6d3" } }}>Cancelar</Button>
          <Button onClick={submitAppointment as any} sx={{ bgcolor: PALETA.naranja, color: "#fff", "&:hover": { bgcolor: PALETA.naranjaHover } }}>Agendar Cita</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog: Reasignar Cita */}
      <Dialog open={reasignOpen} onClose={() => setReasignOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Reasignar Cita</DialogTitle>
        <DialogContent dividers>
          <Paper sx={{ p: 2, bgcolor: "#e3f2fd", borderRadius: 2, mb: 2 }}>
            <Typography sx={{ color: "#1976d2", fontWeight: 800, mb: 1 }}>Cita Actual:</Typography>
            <Typography sx={{ fontSize: 14, color: PALETA.texto }}>
              <b>Servicio:</b> Cambio de aceite<br />
              <b>Vehículo:</b> Toyota Corolla (ABC-123)<br />
              <b>Fecha actual:</b> Miércoles, 25 de Septiembre - 10:00 AM<br />
              <b>Mecánico:</b> Carlos Rodríguez
            </Typography>
          </Paper>

          <Grid container spacing={2} component="form" onSubmit={submitReasign}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth required type="date" label="Nueva Fecha" InputLabelProps={{ shrink: true }} value={reasignForm.fecha} onChange={(e) => setReasignForm({ ...reasignForm, fecha: e.target.value })} sx={fieldSx()} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth required sx={fieldSx()}>
                <InputLabel>Nueva Hora</InputLabel>
                <Select label="Nueva Hora" value={reasignForm.hora} onChange={(e) => setReasignForm({ ...reasignForm, hora: e.target.value as string })}>
                  {["08:00", "09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"].map((h) => (
                    <MenuItem key={h} value={h}>{h}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField fullWidth multiline minRows={3} label="Motivo del Cambio (Opcional)" value={reasignForm.motivo} onChange={(e) => setReasignForm({ ...reasignForm, motivo: e.target.value })} sx={fieldSx()} />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Paper sx={{ p: 2, bgcolor: "#fff3cd", border: "1px solid #ffeaa7", color: "#856404", fontSize: 14 }}>
                <b>Nota:</b> La reasignación está sujeta a disponibilidad. Si la fecha no está disponible, te contactaremos.
              </Paper>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReasignOpen(false)} sx={{ bgcolor: "#eee7e1", color: "rgb(80,80,80)", "&:hover": { bgcolor: "#dad6d3" } }}>Cancelar</Button>
          <Button onClick={submitReasign as any} sx={{ bgcolor: PALETA.naranja, color: "#fff", "&:hover": { bgcolor: PALETA.naranjaHover } }}>Confirmar Reasignación</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog: Confirmar Cancelación */}
      <Dialog open={cancelOpen} onClose={() => setCancelOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>Confirmar Cancelación</DialogTitle>
        <DialogContent dividers>
          <Paper sx={{ p: 2, bgcolor: "#f8d7da", border: "1px solid #f5c6cb", color: "#721c24", textAlign: "center" }}>
            <Typography>¿Estás seguro de que deseas cancelar tu cita?</Typography>
            <Box sx={{ my: 1 }}>
              <Typography><b>Servicio:</b> Cambio de aceite</Typography>
              <Typography><b>Fecha:</b> Miércoles, 25 de Septiembre - 10:00 AM</Typography>
              <Typography><b>Vehículo:</b> Toyota Corolla (ABC-123)</Typography>
            </Box>
            <Typography>Esta acción <b>NO</b> se puede deshacer.</Typography>
          </Paper>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelOpen(false)} sx={{ bgcolor: "#eee7e1", color: "rgb(80,80,80)", "&:hover": { bgcolor: "#dad6d3" } }}>No cancelar</Button>
          <Button onClick={executeCancelAppointment} sx={{ bgcolor: "#ca370b", color: "#fff", "&:hover": { bgcolor: "#ac3315" } }}>Sí, cancelar cita</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog: Pasarela de Pago */}
      <Dialog open={paymentOpen} onClose={() => setPaymentOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>💳 Pasarela de Pago Seguro</DialogTitle>
        <DialogContent dividers>
          <Paper sx={{ p: 2, bgcolor: "#e3f2fd", borderRadius: 2, mb: 2 }}>
            <Typography sx={{ color: "#1976d2", fontWeight: 800, mb: 1 }}>Resumen del Servicio:</Typography>
            <Typography sx={{ fontSize: 14, color: PALETA.texto }}>
              <b>Servicio:</b> Revisión Honda Civic<br />
              <b>Vehículo:</b> Honda Civic (XYZ-789)<br />
              <b>Fecha:</b> Miércoles, 25 de Septiembre<br />
              <b>Total a pagar:</b> <span style={{ color: "#27ae60", fontWeight: 800 }}>$450,000</span>
            </Typography>
          </Paper>

          <Grid container spacing={2} component="form" onSubmit={processPayment}>
            <Grid size={{ xs: 12 }}>
              <TextField required fullWidth label="Número de Tarjeta" placeholder="1234 5678 9012 3456" inputProps={{ maxLength: 19 }} sx={fieldSx()} />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <TextField required fullWidth label="Fecha de Expiración" placeholder="MM/AA" inputProps={{ maxLength: 5 }} sx={fieldSx()} />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <TextField required fullWidth label="CVV" placeholder="123" inputProps={{ maxLength: 3 }} sx={fieldSx()} />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField required fullWidth label="Nombre del Titular" placeholder="Nombre como aparece en la tarjeta" sx={fieldSx()} />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <FormControl fullWidth required sx={fieldSx()}>
                <InputLabel>Tipo de Tarjeta</InputLabel>
                <Select label="Tipo de Tarjeta" value={paymentForm.tipo} onChange={(e) => setPaymentForm({ ...paymentForm, tipo: e.target.value as string })}>
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
          <Button onClick={processPayment as any} sx={{ bgcolor: "#21aa43", color: "#fff", "&:hover": { bgcolor: "#138d46" } }}>Pagar $450,000</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog: Presupuesto Aprobado */}
      <Dialog open={budgetApprovedOpen} onClose={() => setBudgetApprovedOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ color: PALETA.verde }}>Presupuesto Aprobado</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ textAlign: "center", p: 2, bgcolor: "#d4edda", border: "1px solid #c3e6cb", borderRadius: 2 }}>
            <Typography sx={{ fontSize: 48, mb: 1 }}>✅</Typography>
            <Typography sx={{ fontWeight: 800, mb: 1 }}>Revisión Honda Civic</Typography>
            <Typography sx={{ color: PALETA.verde, fontWeight: 800, mb: 1 }}>$450,000</Typography>
            <Typography>Presupuesto aprobado. Se empezará con el trabajo.</Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBudgetApprovedOpen(false)} sx={{ bgcolor: "#21aa43", color: "#fff", "&:hover": { bgcolor: "#138d46" } }}>Entendido</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog: Presupuesto Rechazado */}
      <Dialog open={budgetRejectedOpen} onClose={() => setBudgetRejectedOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ color: "#e74c3c" }}>Presupuesto Rechazado</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ textAlign: "center", p: 2, bgcolor: "#f8d7da", border: "1px solid #f5c6cb", borderRadius: 2 }}>
            <Typography sx={{ fontSize: 48, mb: 1 }}>❌</Typography>
            <Typography sx={{ fontWeight: 800, mb: 1 }}>Revisión Honda Civic</Typography>
            <Typography sx={{ color: "#e74c3c", fontWeight: 800, mb: 1 }}>$450,000</Typography>
            <Typography>Presupuesto rechazado. Se cancela el servicio.</Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBudgetRejectedOpen(false)} sx={{ bgcolor: "#ca370b", color: "#fff", "&:hover": { bgcolor: "#ac3315" } }}>Entendido</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar open={snack.open} autoHideDuration={4000} onClose={() => setSnack({ ...snack, open: false })}>
        <Alert severity={snack.sev} sx={{ width: "100%" }}>{snack.message}</Alert>
      </Snackbar>
    </Box>
  );
}

function fieldSx() {
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
