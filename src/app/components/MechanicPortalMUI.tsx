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
  Backdrop,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { useMechanicGateway } from "@/hooks/MechanicGateway.hook";
import { MechanicAppointment } from "@/components/mechanic-gateway/components/MechanicAppointments";
import { UploadPhotosDialog } from "@/components/mechanic-gateway/dialogs/UploadPhotosDialog";
import { RegisterService } from "@/components/mechanic-gateway/dialogs/RegisterService";

// Paleta y estilos del mock original
export const PALETA = {
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


export default function MechanicPortalMUI() {

  const {
    snack, setSnack,
    isLoading, setLoading,
    appointments,
    supplies,
    selectedAppointment, setSelectedAppointment,
    procedureData, setProcedureData,
    serviceDialogOpen, setServiceDialogOpen,
    photoDialogOpen, setPhotoDialogOpen,
    // photoStage,
    photos,
    fileInputRef,
    evidenceData, setEvidenceData,
    advanceWorkflowState,
    createProcedures,
    createEvidence,
    createAppointmentSupplies,
    // handleBudgetResponse,
    openPhotoModal,
    onChoosePhotos,
    savePhotos,
    saveService,
    // startService,
    logout
  } = useMechanicGateway();

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
                {
                  appointments.map(a => (
                    <MechanicAppointment setSelectedAppointment={setSelectedAppointment} advanceWorkflow={advanceWorkflowState} setServiceDialogOpen={setServiceDialogOpen} openPhotoModal={openPhotoModal} key={a.id} appointment={a} />
                  ))
                }
              </Box>
            </Paper>
          </Grid>

          {/* Sidebar */}
          {/* <MechanicSidebar /> */}
        </Grid>
      </Container>

      {/* Dialog: Fotos */}
      <UploadPhotosDialog appointment={selectedAppointment} createEvidence={createEvidence} evidenceData={evidenceData} setEvidenceData={setEvidenceData} photoDialogOpen={photoDialogOpen} setPhotoDialogOpen={setPhotoDialogOpen} onChoosePhotos={onChoosePhotos} savePhotos={savePhotos} fileInputRef={fileInputRef} photos={photos} />

      {/* Dialog: Registrar Servicio */}
      <RegisterService createAppointmentSupplies={createAppointmentSupplies} appointment={selectedAppointment} createProcedures={createProcedures} procedureData={procedureData} setProcedureData={setProcedureData} supplies={supplies} serviceDialogOpen={serviceDialogOpen} setServiceDialogOpen={setServiceDialogOpen} saveService={saveService} />

      <Backdrop
        sx={{
          zIndex: 1400
        }}
        open={isLoading}
        onClick={() => setLoading(false)}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Snackbar open={snack.open} autoHideDuration={4000} onClose={() => setSnack({ ...snack, open: false })}>
        <Alert severity={snack.sev} sx={{ width: "100%" }}>{snack.message}</Alert>
      </Snackbar>
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

