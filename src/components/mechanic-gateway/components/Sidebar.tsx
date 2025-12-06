import { Grid, Stack, Paper, Typography, Box } from "@mui/material"
import { PALETA } from "../MechanicGateway";

export const MechanicSidebar = () => {
  return (

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
  );
}
