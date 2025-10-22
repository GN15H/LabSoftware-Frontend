"use client";

import React, { useMemo, useRef, useState } from "react";
import {
  AppBar,
  Toolbar,
  Container,
  Box,
  Typography,
  Avatar,
  Button,
  Paper,
  Card,
  CardContent,
  CardActions,
  Chip,
  Stack,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  LinearProgress,
  IconButton,
} from "@mui/material";
import Grid from "@mui/material/Grid"; // Grid v2
import DirectionsCarFilledIcon from "@mui/icons-material/DirectionsCarFilled";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import CloseIcon from "@mui/icons-material/Close";
import { useRouter } from 'next/navigation';

// Paleta y estilos del mock original
const PALETA = {
  fondo: "#f8f9fa",
  headerGrad: "linear-gradient(135deg, #2c3e50 0%, #3498db 100%)",
  welcomeBg: "#c1d1e696",
  cardShadow: "0 2px 20px rgba(0,0,0,0.08)",
  azul: "#3498db",
  azulOsc: "#086ab4",
  verde: "#27ae60",
  amarilloBg: "#fff3cd",
  naranja: "#e37239",
  naranjaHover: "#c4683a",
  celeste: "#2582c0",
  celesteHover: "#1a6394",
  grisBorde: "#ecf0f1",
  textoSuave: "#7f8c8d",
  texto: "#2c3e50",
};

// Estados del flujo de OT
const STATE_NAMES: Record<number, { key: string; label: string }> = {
  1: { key: "recibido", label: "Recibido" },
  2: { key: "diagnostico", label: "Diagnóstico" },
  3: { key: "presupuesto", label: "Presupuesto" },
  4: { key: "proceso", label: "En Proceso" },
  5: { key: "listo", label: "Listo" },
  6: { key: "entregado", label: "Entregado" },
};

export default function MechanicPortalMUI() {
  // ---- Estado principal ----
  const [workflowState, setWorkflowState] = useState(1); // 1..6
  const [waitingBudget, setWaitingBudget] = useState(false);
  const [budgetRejected, setBudgetRejected] = useState(false);

  const [serviceDialogOpen, setServiceDialogOpen] = useState(false);
  const [photoDialogOpen, setPhotoDialogOpen] = useState(false);
  const [photoStage, setPhotoStage] = useState<string>(STATE_NAMES[1].key);
  const [photos, setPhotos] = useState<Array<{ name: string; url?: string }>>([]);
  const router = useRouter();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // ---- Citas simuladas ----
  const todayAppointments = useMemo(
    () => [
      {
        id: "A-001",
        time: "10:00 AM - 11:15 AM",
        status: "in-progress" as const,
        client: "Juan Pérez",
        vehicle: "Toyota Corolla (ABC-123)",
        service: "Cambio de aceite",
        duration: "75 minutos",
        active: true,
      },
      {
        id: "A-002",
        time: "2:00 PM - 4:00 PM",
        status: "pending" as const,
        client: "María García",
        vehicle: "Honda Civic (XYZ-789)",
        service: "Servicio de frenos",
        duration: "120 minutos",
        active: false,
      },
      {
        id: "A-003",
        time: "Mañana 9:00 AM",
        status: "pending" as const,
        client: "Carlos Ruiz",
        vehicle: "Nissan Sentra (DEF-456)",
        service: "Revisión general",
        duration: "90 minutos",
        active: false,
      },
    ],
    []
  );

  const progress = budgetRejected
    ? 50
    : Math.round((workflowState / 6) * 100);

  // ---- Handlers del workflow ----
  const advanceWorkflowState = () => {
    if (budgetRejected) {
      alert("No se puede avanzar. El presupuesto fue rechazado por el cliente.");
      return;
    }
    if (waitingBudget) {
      alert("Esperando respuesta del cliente al presupuesto.");
      return;
    }
    if (workflowState >= 6) {
      alert("La orden de trabajo ya está completada.");
      return;
    }

    // Al llegar a presupuesto (3) se detiene y muestra controles
    if (workflowState === 3) {
      setWaitingBudget(true);
      alert("Presupuesto enviado al cliente.\nEsperando aprobación...");
      return;
    }

    const next = workflowState + 1;
    setWorkflowState(next);
    alert(`Estado avanzado correctamente.\nNuevo estado: ${STATE_NAMES[next].label}`);
  };

  const handleBudgetResponse = (approved: boolean) => {
    setWaitingBudget(false);
    if (approved) {
      setWorkflowState(4); // pasa a En Proceso
      alert("¡Presupuesto aprobado por el cliente! Puedes continuar con el trabajo.");
    } else {
      setBudgetRejected(true);
      alert("Presupuesto rechazado por el cliente. La OT no puede continuar.");
    }
  };

  // ---- Fotos ----
  const openPhotoModal = (stageKey: string) => {
    setPhotoStage(stageKey);
    setPhotoDialogOpen(true);
  };

  const onChoosePhotos = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const added = Array.from(files).map((f) => ({ name: f.name }));
    setPhotos((prev) => [...prev, ...added]);
    alert(`${files.length} foto(s) seleccionada(s): ${Array.from(files)
      .map((f) => f.name)
      .join(", ")}\nEtapa: ${photoStage}`);
  };

  const savePhotos = () => {
    alert(
      `Fotografías guardadas correctamente.\nEtapa: ${photoStage}\nLas fotos han sido asociadas al historial del vehículo.`
    );
    setPhotoDialogOpen(false);
  };

  // ---- Servicio ----
  const saveService = () => {
    if ((workflowState !== 5 && workflowState !== 6) || budgetRejected) {
      alert(
        'Solo puedes registrar servicios cuando el estado sea "Listo" o "Entregado" y el presupuesto haya sido aprobado.'
      );
      return;
    }
    alert("Información del servicio registrada correctamente.");
    setServiceDialogOpen(false);
  };

  const startService = (id: string) => {
    if (confirm("¿Deseas iniciar este servicio?")) {
      alert(`Servicio ${id} iniciado correctamente.`);
    }
  };

  const logout = () => {
    if (confirm("¿Estás seguro de que deseas cerrar sesión?")) {
      alert("Cerrando sesión...");
    }
    router.replace('/');
  };

  // ---- UI helpers ----
  const StatusBadge = ({ status }: { status: "pending" | "in-progress" | "completed" }) => {
    const map: Record<string, { bg: string; color: string; label: string }> = {
      pending: { bg: "#fff3cd", color: "#856404", label: "Pendiente" },
      "in-progress": { bg: "#cce5ff", color: "#0056b3", label: "En Proceso" },
      completed: { bg: "#d4edda", color: "#155724", label: "Completada" },
    };
    const s = map[status];
    return (
      <Box sx={{ px: 1.5, py: 0.5, borderRadius: 20, fontSize: 12, fontWeight: 700, bgcolor: s.bg, color: s.color }}>
        {s.label}
      </Box>
    );
  };

  const StepDot = ({ idx }: { idx: number }) => {
    const isCurrent = idx === workflowState && !budgetRejected && !waitingBudget;
    const isCompleted = idx < workflowState && !budgetRejected;
    const isRejected = budgetRejected && idx === 3;

    let bg = "#ecf0f1", color = "#7f8c8d", text = String(idx), pulse = false;
    if (isRejected) { bg = "#e74c3c"; color = "#fff"; text = "✗"; }
    else if (isCurrent) { bg = PALETA.azul; color = "#fff"; }
    else if (isCompleted) { bg = PALETA.verde; color = "#fff"; text = "✓"; }

    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, minWidth: 80 }}>
        <Box sx={{
          width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 14, fontWeight: 700, mb: 0.5, bgcolor: bg, color,
          boxShadow: isCurrent ? `0 0 0 0 ${PALETA.azul}` : 'none',
          animation: isCurrent ? 'pulse 2s infinite' : 'none',
        }}>
          {text}
        </Box>
        <Typography sx={{ fontSize: 12, color: PALETA.texto }}>{STATE_NAMES[idx].label}</Typography>
      </Box>
    );
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: PALETA.fondo, color: '#2d3436' }}>
      {/* Header */}
      <AppBar position="sticky" sx={{ background: PALETA.headerGrad, boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        <Toolbar sx={{ maxWidth: 1200, mx: 'auto', width: '100%' }}>
          <Typography sx={{ fontSize: 28, fontWeight: 700, flex: 1 }}>AutoLink Manager</Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography>Carlos Rodríguez</Typography>
            <Avatar sx={{ bgcolor: '#e67e22', width: 40, height: 40, fontWeight: 700 }}>CR</Avatar>
            <Button onClick={logout} sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: '#fff', textTransform: 'none', '&:hover': { bgcolor: 'rgba(255,255,255,0.28)' } }}>
              Salir
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>

      <Container sx={{ py: 3, maxWidth: 1200 }}>
        {/* Welcome */}
        <Paper sx={{ p: 3, mb: 3, borderRadius: 3, boxShadow: PALETA.cardShadow, bgcolor: PALETA.welcomeBg }}>
          <Typography sx={{ fontSize: 28, fontWeight: 800, color: '#2c3e50', mb: 0.5 }}>Portal del Mecánico</Typography>
          <Typography sx={{ color: '#6b6e6e', fontSize: 16 }}>Gestiona tus citas asignadas y documenta el proceso de reparación</Typography>
        </Paper>

        <Grid container spacing={3}>
          {/* Content area */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Paper sx={{ borderRadius: 3, overflow: 'hidden', boxShadow: PALETA.cardShadow }}>
              <Box sx={{ p: 2.5, color: '#fff', background: 'linear-gradient(135deg, #2c3e50 30%, #3498db 100%)' }}>
                <Typography sx={{ fontSize: 20, fontWeight: 800 }}>Mis Citas Asignadas</Typography>
                <Typography sx={{ opacity: 0.9, fontSize: 14 }}>Citas programadas para hoy y próximos días</Typography>
              </Box>

              <Box sx={{ p: 2.5 }}>
                {/* Cita activa */}
                <Box sx={{
                  bgcolor: PALETA.welcomeBg,
                  border: `2px solid ${PALETA.grisBorde}`,
                  borderRadius: 2.5,
                  p: 2,
                  mb: 2.5,
                  transition: 'all .2s',
                  cursor: 'pointer',
                  '&:hover': { borderColor: PALETA.azul, transform: 'translateY(-2px)', boxShadow: '0 4px 20px rgba(52,152,219,.15)' },
                }}>
                  <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={1} mb={1.5}>
                    <Typography sx={{ fontSize: 18, fontWeight: 800, color: '#2c3e50' }}>10:00 AM - 11:15 AM</Typography>
                    <StatusBadge status="in-progress" />
                  </Stack>

                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography sx={{ fontSize: 12, color: PALETA.textoSuave }}>Cliente</Typography>
                      <Typography sx={{ fontWeight: 600, color: PALETA.texto }}>Juan Pérez</Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography sx={{ fontSize: 12, color: PALETA.textoSuave }}>Vehículo</Typography>
                      <Typography sx={{ fontWeight: 600, color: PALETA.texto }}>Toyota Corolla (ABC-123)</Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography sx={{ fontSize: 12, color: PALETA.textoSuave }}>Servicio</Typography>
                      <Typography sx={{ fontWeight: 600, color: PALETA.texto }}>Cambio de aceite</Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography sx={{ fontSize: 12, color: PALETA.textoSuave }}>Duración Estimada</Typography>
                      <Typography sx={{ fontWeight: 600, color: PALETA.texto }}>75 minutos</Typography>
                    </Grid>
                  </Grid>

                  {/* Workflow tracker */}
                  <Box sx={{ mt: 2 }}>
                    <Typography sx={{ fontWeight: 800, color: PALETA.azul, mb: 1 }}>Estado de la Orden de Trabajo</Typography>
                    <Stack direction={{ xs: 'column', md: 'row' }} alignItems="center" justifyContent="space-between" spacing={1}>
                      <StepDot idx={1} />
                      <Box sx={{ flex: 1, height: 2, bgcolor: workflowState > 1 && !budgetRejected ? PALETA.verde : PALETA.grisBorde, display: { xs: 'none', md: 'block' } }} />
                      <StepDot idx={2} />
                      <Box sx={{ flex: 1, height: 2, bgcolor: workflowState > 2 && !budgetRejected ? PALETA.verde : PALETA.grisBorde, display: { xs: 'none', md: 'block' } }} />
                      <StepDot idx={3} />
                      <Box sx={{ flex: 1, height: 2, bgcolor: workflowState > 3 && !budgetRejected ? PALETA.verde : PALETA.grisBorde, display: { xs: 'none', md: 'block' } }} />
                      <StepDot idx={4} />
                      <Box sx={{ flex: 1, height: 2, bgcolor: workflowState > 4 && !budgetRejected ? PALETA.verde : PALETA.grisBorde, display: { xs: 'none', md: 'block' } }} />
                      <StepDot idx={5} />
                      <Box sx={{ flex: 1, height: 2, bgcolor: workflowState > 5 && !budgetRejected ? PALETA.verde : PALETA.grisBorde, display: { xs: 'none', md: 'block' } }} />
                      <StepDot idx={6} />
                    </Stack>

                    {/* Barra de progreso */}
                    <Box sx={{ mt: 2 }}>
                      <LinearProgress variant="determinate" value={progress} sx={{ height: 10, borderRadius: 5, bgcolor: PALETA.grisBorde }} />
                      <Typography sx={{ mt: 0.5, fontSize: 14, fontWeight: 600, color: PALETA.texto }}>
                        Estado: {budgetRejected ? `${STATE_NAMES[workflowState].label} - RECHAZADO` : `${STATE_NAMES[workflowState].label}`} ({workflowState}/6)
                      </Typography>
                    </Box>

                    {/* Controles Presupuesto */}
                    {waitingBudget && !budgetRejected && (
                      <Box sx={{ mt: 2, textAlign: 'center' }}>
                        <Box sx={{ bgcolor: PALETA.amarilloBg, p: 2, borderRadius: 2, mb: 1, color: '#856404' }}>
                          <b>Esperando respuesta del cliente al presupuesto</b>
                          <Typography sx={{ fontSize: 14, mt: 0.5 }}>
                            El cliente debe aprobar o rechazar el presupuesto para continuar
                          </Typography>
                        </Box>
                        <Stack direction="row" spacing={1} justifyContent="center">
                          <Button onClick={() => handleBudgetResponse(true)} sx={{ bgcolor: PALETA.naranja, color: '#fff', '&:hover': { bgcolor: PALETA.naranjaHover } }}>Cliente Aprobó</Button>
                          <Button onClick={() => handleBudgetResponse(false)} sx={{ bgcolor: '#e74c3c', color: '#fff', '&:hover': { bgcolor: '#c0392b' } }}>Cliente Rechazó</Button>
                        </Stack>
                      </Box>
                    )}
                  </Box>

                  {/* Acciones de la cita */}
                  <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 2 }}>
                    <Button onClick={advanceWorkflowState} disabled={budgetRejected || waitingBudget || workflowState >= 6}
                      sx={{ bgcolor: PALETA.naranja, color: '#fff', '&:hover': { bgcolor: PALETA.naranjaHover } }}>
                      Avanzar Estado
                    </Button>
                    <Button onClick={() => openPhotoModal(STATE_NAMES[workflowState].key)} sx={{ bgcolor: PALETA.celeste, color: '#fff', '&:hover': { bgcolor: PALETA.celesteHover } }} startIcon={<PhotoCameraIcon />}>
                      Subir Fotos
                    </Button>
                    <Button onClick={() => setServiceDialogOpen(true)} disabled={(workflowState !== 5 && workflowState !== 6) || budgetRejected}
                      sx={{ bgcolor: '#eee7e1', color: 'rgb(80,80,80)', '&:hover': { bgcolor: '#dad6d3' } }}>
                      Registrar Servicio
                    </Button>
                  </Stack>
                </Box>

                {/* Próximas citas */}
                {todayAppointments.slice(1).map((a) => (
                  <Box key={a.id} sx={{
                    bgcolor: PALETA.welcomeBg,
                    border: `2px solid ${PALETA.grisBorde}`,
                    borderRadius: 2.5,
                    p: 2,
                    mb: 2.5,
                  }}>
                    <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={1} mb={1.5}>
                      <Typography sx={{ fontSize: 18, fontWeight: 800 }}>{a.time}</Typography>
                      <StatusBadge status={a.status} />
                    </Stack>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography sx={{ fontSize: 12, color: PALETA.textoSuave }}>Cliente</Typography>
                        <Typography sx={{ fontWeight: 600 }}>{a.client}</Typography>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography sx={{ fontSize: 12, color: PALETA.textoSuave }}>Vehículo</Typography>
                        <Typography sx={{ fontWeight: 600 }}>{a.vehicle}</Typography>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography sx={{ fontSize: 12, color: PALETA.textoSuave }}>Servicio</Typography>
                        <Typography sx={{ fontWeight: 600 }}>{a.service}</Typography>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography sx={{ fontSize: 12, color: PALETA.textoSuave }}>Duración Estimada</Typography>
                        <Typography sx={{ fontWeight: 600 }}>{a.duration}</Typography>
                      </Grid>
                    </Grid>
                    <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 2 }}>
                      <Button onClick={() => startService(a.id)} sx={{ bgcolor: PALETA.naranja, color: '#fff', '&:hover': { bgcolor: PALETA.naranjaHover } }}>Iniciar Servicio</Button>
                      <Button sx={{ bgcolor: '#eee7e1', color: 'rgb(80,80,80)', '&:hover': { bgcolor: '#dad6d3' } }}>Ver Detalles</Button>
                    </Stack>
                  </Box>
                ))}
              </Box>
            </Paper>
          </Grid>

          {/* Sidebar */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Stack spacing={3}>
              <Paper sx={{ p: 2, borderRadius: 3, boxShadow: PALETA.cardShadow, background: 'linear-gradient(135deg, #e3f2fd, #bbdefb)', border: `2px solid ${PALETA.azul}` }}>
                <Typography sx={{ fontSize: 18, fontWeight: 800, color: PALETA.texto }}>Estado Actual</Typography>
                <Box sx={{ textAlign: 'center', p: 2 }}>
                  <Typography sx={{ fontSize: 18, fontWeight: 800, color: PALETA.verde, mb: 0.5 }}>Trabajando en:</Typography>
                  <Typography sx={{ color: PALETA.texto }}>Toyota Corolla</Typography>
                  <Typography sx={{ fontSize: 14, color: PALETA.textoSuave }}>Cambio de aceite</Typography>
                  <Box sx={{ mt: 1, p: 1, bgcolor: PALETA.amarilloBg, borderRadius: 1 }}>
                    <Typography><b>Tiempo transcurrido:</b> 45 min</Typography>
                  </Box>
                </Box>
              </Paper>

              <Paper sx={{ p: 2, borderRadius: 3, boxShadow: PALETA.cardShadow }}>
                <Typography sx={{ fontSize: 18, fontWeight: 800, color: PALETA.texto }}>Resumen del Día</Typography>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid size={{ xs: 6 }}>
                    <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 2, background: '#e3f2fd' }}>
                      <Typography sx={{ fontSize: 24, fontWeight: 800, color: '#1976d2' }}>3</Typography>
                      <Typography sx={{ fontSize: 14, color: PALETA.textoSuave }}>Citas Hoy</Typography>
                    </Paper>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 2, background: '#e8f5e8' }}>
                      <Typography sx={{ fontSize: 24, fontWeight: 800, color: '#2e7d32' }}>1</Typography>
                      <Typography sx={{ fontSize: 14, color: PALETA.textoSuave }}>Completadas</Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </Paper>
            </Stack>
          </Grid>
        </Grid>
      </Container>

      {/* Dialog: Fotos */}
      <Dialog open={photoDialogOpen} onClose={() => setPhotoDialogOpen(false)} fullWidth maxWidth="md">
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PhotoCameraIcon /> Documentación Fotográfica
          <Box sx={{ flex: 1 }} />
          <IconButton onClick={() => setPhotoDialogOpen(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Typography sx={{ color: PALETA.textoSuave, mb: 2 }}>
            {(() => {
              const map: Record<string, string> = {
                recibido: 'Documenta el estado del vehículo al momento de recibido',
                diagnostico: 'Evidencia del proceso de diagnóstico y problemas encontrados',
                presupuesto: 'Documentación visual para justificar el presupuesto',
                proceso: 'Documenta el trabajo en progreso y procedimientos realizados',
                listo: 'Evidencia del trabajo completado y estado final',
                entregado: 'Documentación del vehículo al momento de la entrega',
              };
              return map[photoStage] ?? 'Toma las fotografías necesarias para este paso';
            })()}
          </Typography>

          <Paper variant="outlined" sx={{ p: 3, textAlign: 'center', borderStyle: 'dashed', borderColor: PALETA.grisBorde, '&:hover': { borderColor: PALETA.azul, bgcolor: '#f8f9fa' } }}>
            <PhotoCameraIcon sx={{ fontSize: 48, color: '#bdc3c7', mb: 1 }} />
            <Typography sx={{ color: PALETA.textoSuave }}>
              Haz clic para seleccionar fotos o arrástralas aquí
            </Typography>
            <Button onClick={() => fileInputRef.current?.click()} sx={{ mt: 1 }} variant="contained">
              Seleccionar fotos
            </Button>
            <input ref={fileInputRef} type="file" accept="image/*" multiple hidden onChange={onChoosePhotos} />
          </Paper>

          {/* Grid de fotos */}
          <Grid container spacing={2} sx={{ mt: 2 }}>
            {photos.map((p, i) => (
              <Grid key={`${p.name}-${i}`} size={{ xs: 6, sm: 4, md: 3 }}>
                <Box sx={{ position: 'relative', aspectRatio: '1 / 1', borderRadius: 1, overflow: 'hidden', cursor: 'pointer', bgcolor: 'linear-gradient(135deg, #ecf0f1, #bdc3c7)' }}>
                  <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(45deg, #3498db, #2980b9)', color: '#fff', fontSize: 32 }}>📷</Box>
                  <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, bgcolor: 'rgba(0,0,0,.7)', color: '#fff', fontSize: 12, textAlign: 'center', p: 0.5 }}>
                    {p.name}
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPhotoDialogOpen(false)} sx={{ bgcolor: '#eee7e1', color: 'rgb(80,80,80)', '&:hover': { bgcolor: '#dad6d3' } }}>Cerrar</Button>
          <Button onClick={savePhotos} sx={{ bgcolor: PALETA.naranja, color: '#fff', '&:hover': { bgcolor: PALETA.naranjaHover } }}>Guardar Fotos</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog: Registrar Servicio */}
      <Dialog open={serviceDialogOpen} onClose={() => setServiceDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ display: 'flex', alignItems: 'center' }}>
          Registrar Servicio Realizado
          <Box sx={{ flex: 1 }} />
          <IconButton onClick={() => setServiceDialogOpen(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2}>
            <TextField label="Descripción del Trabajo" placeholder="Describe detalladamente el trabajo realizado..." multiline minRows={3} fullWidth sx={fieldSx()} />
            <TextField label="Repuestos Utilizados" placeholder="Lista los repuestos y materiales utilizados..." multiline minRows={3} fullWidth sx={fieldSx()} />
            <TextField label="Observaciones" placeholder="Observaciones adicionales o recomendaciones..." multiline minRows={3} fullWidth sx={fieldSx()} />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setServiceDialogOpen(false)} sx={{ bgcolor: '#eee7e1', color: 'rgb(80,80,80)', '&:hover': { bgcolor: '#dad6d3' } }}>Cancelar</Button>
          <Button onClick={saveService} sx={{ bgcolor: PALETA.naranja, color: '#fff', '&:hover': { bgcolor: PALETA.naranjaHover } }}>Guardar Servicio</Button>
        </DialogActions>
      </Dialog>

      {/* Keyframes for pulse */}
      <style jsx global>{`
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(52, 152, 219, 0.7); }
          70% { box-shadow: 0 0 0 10px rgba(52, 152, 219, 0); }
          100% { box-shadow: 0 0 0 0 rgba(52, 152, 219, 0); }
        }
      `}</style>
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
