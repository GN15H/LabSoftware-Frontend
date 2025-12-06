'use client';

import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Avatar,
  SelectChangeEvent,
} from '@mui/material';
import Grid from '@mui/material/Grid'; // Grid v2 (sin item/xs/md) -> usar size={{ }}
import CheckIcon from '@mui/icons-material/Check';
import { useRegisterPage } from '@/hooks/RegisterPage.hook';

const PALETA = {
  fondo: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  sidebar: 'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)',
  verde: '#27ae60',
  acento: '#3498db',
  acentoOscuro: '#2980b9',
  textoSuave: '#7f8c8d',
  grisBorde: '#ecf0f1',
};

export default function RegisterPage() {

  const {
    snack, setSnack,
    loading, //setLoading,
    stage,
    data,
    errors,
    goToLogin,
    handleFieldChange,
    handleSubmit,
    showTerms,
    showPrivacy
  } = useRegisterPage();


  // ----------------------- UI -----------------------
  const PasoDot = ({ estado }: { estado: 'idle' | 'active' | 'done' }) => (
    <Box
      sx={{
        width: 8, height: 8, borderRadius: '50%',
        backgroundColor:
          estado === 'done' ? PALETA.verde :
            estado === 'active' ? PALETA.acento : '#ecf0f1'
      }}
    />
  );

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: PALETA.fondo,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
        color: '#2d3436',
        fontFamily: `Segoe UI, Tahoma, Geneva, Verdana, sans-serif`,
      }}
    >
      <Paper
        elevation={8}
        sx={{
          width: '95%',
          maxWidth: 1100,
          height: { xs: 'auto', md: '95vh' },
          borderRadius: 2,
          overflow: 'hidden',
          boxShadow: '0 15px 40px rgba(0,0,0,0.15)',
        }}
      >
        <Grid container sx={{ height: '100%' }}>
          {/* Sidebar */}
          <Grid
            size={{ xs: 12, md: 5 }}
            sx={{
              background: PALETA.sidebar,
              color: '#fff',
              p: { xs: 3, md: 4 },
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              textAlign: 'center',
              gap: 2,
              order: { xs: 2, md: 1 },
            }}
          >
            <Typography sx={{ fontSize: { xs: '1.8rem', md: '2.2rem' }, fontWeight: 700 }}>
              AutoLink
            </Typography>
            <Typography sx={{ opacity: 0.9 }}>
              Tu taller mecánico de confianza ahora más cerca que nunca
            </Typography>

            <Box sx={{ textAlign: { xs: 'center', md: 'left' }, mx: 'auto' }}>
              {[
                'Agenda citas online 24/7',
                'Seguimiento en tiempo real',
                'Historial completo de servicios',
                'Facturas digitales',
                'Notificaciones automáticas',
              ].map((t) => (
                <Box key={t} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, justifyContent: { xs: 'center', md: 'flex-start' } }}>
                  <Avatar sx={{ bgcolor: PALETA.verde, width: 20, height: 20 }}>
                    <CheckIcon sx={{ fontSize: 14 }} />
                  </Avatar>
                  <Typography sx={{ fontSize: '.9rem' }}>{t}</Typography>
                </Box>
              ))}
            </Box>
          </Grid>

          {/* Área de formulario */}
          <Grid
            size={{ xs: 12, md: 7 }}
            sx={{
              p: { xs: 2, md: 3 },
              display: 'flex',
              flexDirection: 'column',
              order: { xs: 1, md: 2 },
              maxHeight: { md: '95vh' },
              overflowY: { md: 'auto' },
            }}
          >
            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <Typography sx={{ fontSize: { xs: '1.4rem', md: '1.6rem' }, fontWeight: 700, color: '#2c3e50' }}>
                Crear Cuenta
              </Typography>
              <Typography sx={{ color: PALETA.textoSuave, fontSize: '.9rem' }}>
                Completa tus datos para empezar
              </Typography>
            </Box>

            {/* Indicador de progreso */}
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: .6, mb: 2 }}>
              <PasoDot estado={stage > 0 ? 'done' : 'active'} />
              <PasoDot estado={stage > 1 ? 'done' : (stage === 1 ? 'active' : 'idle')} />
              <PasoDot estado={stage === 2 ? 'done' : 'idle'} />
            </Box>

            {/* Mensajes (Snackbar) */}
            <Snackbar
              open={snack.open}
              autoHideDuration={5000}
              onClose={() => setSnack(s => ({ ...s, open: false }))}
            >
              <Alert severity={snack.severity} sx={{ width: '100%' }}>
                {snack.message}
              </Alert>
            </Snackbar>

            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ display: 'grid', gap: 2 }}>
              {/* Nombre y apellido */}
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    label="Nombre*"
                    value={data.firstName}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleFieldChange('firstName', event.target.value)}
                    // onBlur={() => validarCampo('firstName', datos.firstName)}
                    error={errors.firstName != null}
                    helperText={errors.firstName || ' '}
                    fullWidth
                    variant="outlined"
                    sx={fieldSx()}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    label="Apellido*"
                    value={data.lastName}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleFieldChange('lastName', event.target.value)}
                    // onBlur={() => validarCampo('lastName', data.lastName)}
                    error={errors.lastName != null}
                    helperText={errors.lastName || ' '}
                    fullWidth
                    variant="outlined"
                    sx={fieldSx()}
                  />
                </Grid>
              </Grid>

              {/* Documento (3 columnas en desktop) */}
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <FormControl fullWidth sx={fieldSx()}>
                    <InputLabel>Tipo de Documento*</InputLabel>
                    <Select
                      label="Tipo de Documento*"
                      value={data.documentType}
                      onChange={(event: SelectChangeEvent) => handleFieldChange('documentType', event.target.value as string)}
                      // onBlur={() => validarCampo('documentType', data.documentType)}
                      error={!!errors.documentType}
                    >
                      <MenuItem value=""><em>Seleccionar…</em></MenuItem>
                      <MenuItem value="CC">Cédula de Ciudadanía</MenuItem>
                      <MenuItem value="CE">Cédula de Extranjería</MenuItem>
                      <MenuItem value="PA">Pasaporte</MenuItem>
                    </Select>
                    <Typography variant="caption" color="error">{errors.documentType || ' '}</Typography>
                  </FormControl>
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                  <TextField
                    label="Número de Documento*"
                    value={data.documentNumber}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleFieldChange('documentNumber', event.target.value)}
                    // onBlur={() => validarCampo('documentNumber', data.documentNumber)}
                    error={!!errors.documentNumber}
                    helperText={errors.documentNumber || 'Solo números'}
                    fullWidth
                    variant="outlined"
                    sx={fieldSx()}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                  <TextField
                    label="Fecha de Nacimiento"
                    type="date"
                    value={data.birthDate}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleFieldChange('birthDate', event.target.value)}
                    // InputLabelProps={{ shrink: true }}
                    fullWidth
                    slotProps={{ inputLabel: { shrink: true } }}
                    variant="outlined"
                    sx={fieldSx()}
                  />
                </Grid>
              </Grid>

              {/* Email (full width) */}
              <TextField
                label="Correo Electrónico*"
                value={data.email}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleFieldChange('email', event.target.value)}
                // onBlur={() => validarCampo('email', data.email)}
                error={!!errors.email}
                helperText={errors.email || 'Recibirás notificaciones importantes aquí'}
                fullWidth
                variant="outlined"
                sx={fieldSx()}
              />

              {/* Teléfono / Dirección */}
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    label="Teléfono*"
                    value={data.phone}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleFieldChange('phone', event.target.value)}
                    // onBlur={() => validarCampo('phone', data.phone)}
                    error={!!errors.phone}
                    helperText={errors.phone || 'Incluye código de área'}
                    fullWidth
                    variant="outlined"
                    sx={fieldSx()}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    label="Dirección"
                    placeholder="Calle, número, barrio"
                    value={data.address}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleFieldChange('address', event.target.value)}
                    fullWidth
                    variant="outlined"
                    sx={fieldSx()}
                  />
                </Grid>
              </Grid>

              {/* Password / Confirm */}
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    label="Contraseña*"
                    type="password"
                    value={data.password}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleFieldChange('password', event.target.value)}
                    // onBlur={() => validarCampo('password', data.password)}
                    error={!!errors.password}
                    helperText={errors.password || 'Mínimo 8 caracteres'}
                    fullWidth
                    variant="outlined"
                    sx={fieldSx()}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    label="Confirmar Contraseña*"
                    type="password"
                    value={data.confirmPassword}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleFieldChange('confirmPassword', event.target.value)}
                    // onBlur={() => validarCampo('confirmPassword', data.confirmPassword)}
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword || ' '}
                    fullWidth
                    variant="outlined"
                    sx={fieldSx()}
                  />
                </Grid>
              </Grid>

              {/* Checkboxes */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <FormControlLabel
                  control={<Checkbox checked={data.termsAccepted} onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleFieldChange('termsAccepted', event.target.checked)} />}
                  label={
                    <Typography sx={{ fontSize: '.9rem', color: '#2c3e50' }}>
                      Acepto los{' '}
                      <Button onClick={showTerms} sx={{ p: 0, minWidth: 0, textTransform: 'none', color: PALETA.acento }}>
                        Términos y Condiciones
                      </Button>{' '}
                      y la{' '}
                      <Button onClick={showPrivacy} sx={{ p: 0, minWidth: 0, textTransform: 'none', color: PALETA.acento }}>
                        Política de Privacidad
                      </Button>{' '}*
                    </Typography>
                  }
                />
                {!data.termsAccepted && (
                  <Typography variant="caption" color="error">{errors.termsAccepted}</Typography>
                )}

                <FormControlLabel
                  control={<Checkbox checked={data.marketingEmails} onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleFieldChange('marketingEmails', event.target.checked)} />}
                  label={<Typography sx={{ fontSize: '.9rem', color: '#2c3e50' }}>
                    Quiero recibir promociones y ofertas especiales por correo electrónico
                  </Typography>}
                />
              </Box>

              {/* Botón enviar */}
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                sx={{
                  background: `linear-gradient(135deg, ${PALETA.acento} 0%, ${PALETA.acentoOscuro} 100%)`,
                  color: '#fff',
                  borderRadius: 2,
                  py: 1.2,
                  fontWeight: 700,
                  fontSize: '1rem',
                  '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 8px 24px rgba(52,152,219,0.16)' },
                }}
              >
                {loading ? 'Creando cuenta...' : 'Crear Mi Cuenta'}
              </Button>

              <Box sx={{ textAlign: 'center', mt: 1 }}>
                <Divider sx={{ borderColor: PALETA.grisBorde }}>
                  <Typography component="span" sx={{ background: '#fff', px: 1, color: PALETA.textoSuave, fontSize: 14 }}>
                    o
                  </Typography>
                </Divider>
              </Box>

              <Box sx={{ textAlign: 'center', color: PALETA.textoSuave }}>
                ¿Ya tienes una cuenta?{' '}
                <Button onClick={goToLogin} sx={{ textTransform: 'none' }}>
                  <Typography sx={{ color: PALETA.acento, fontWeight: 600 }}>Inicia sesión aquí</Typography>
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}

/** Estilo de campo (bordes, focus) replicando el mockup */
function fieldSx() {
  return {
    '& .MuiOutlinedInput-root': {
      backgroundColor: '#f8f9fa',
      borderRadius: 2,
      '& fieldset': { borderColor: '#ecf0f1', borderWidth: 2 },
      '&:hover fieldset': { borderColor: '#bdc3c7' },
      '&.Mui-focused fieldset': { borderColor: '#3498db' },
    },
  } as const;
}

