'use client';

import React, { useEffect, useMemo, useState } from 'react';
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
} from '@mui/material';
import Grid from '@mui/material/Grid'; // Grid v2 (sin item/xs/md) -> usar size={{ }}
import CheckIcon from '@mui/icons-material/Check';
import { useRouter } from 'next/navigation';

type Severidad = 'success' | 'info' | 'warning' | 'error';

type Errores = Partial<Record<
  'firstName' | 'lastName' | 'documentType' | 'documentNumber' | 'birthDate' |
  'email' | 'phone' | 'address' | 'password' | 'confirmPassword' | 'termsAccepted',
  string
>>;

const PALETA = {
  fondo: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  sidebar: 'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)',
  verde: '#27ae60',
  acento: '#3498db',
  acentoOscuro: '#2980b9',
  textoSuave: '#7f8c8d',
  grisBorde: '#ecf0f1',
};

export default function RegistroClienteMUI() {
  // ----------------------- estado del formulario -----------------------
  const [datos, setDatos] = useState({
    firstName: '',
    lastName: '',
    documentType: '',
    documentNumber: '',
    birthDate: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: '',
    termsAccepted: false,
    marketingEmails: false,
  });

  const [errores, setErrores] = useState<Errores>({});
  const [snack, setSnack] = useState<{ open: boolean; severity: Severidad; message: string }>({
    open: false, severity: 'info', message: ''
  });
  const [cargando, setCargando] = useState(false);
  const [paso, setPaso] = useState(0); // 0 activo, luego 1, luego 2 (completado)

  const emailRegex = useMemo(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/, []);
  const phoneDigits = (v: string) => v.replace(/\D/g, '');
  const router = useRouter();

  function validarCampo(nombre: keyof typeof datos, valor: string | boolean): boolean {
    let msg = '';

    switch (nombre) {
      case 'firstName':
      case 'lastName':
        if (!valor) msg = 'Este campo es obligatorio';
        else if ((valor as string).length < 2) msg = 'Debe tener al menos 2 caracteres';
        break;

      case 'documentType':
        if (!valor) msg = 'Selecciona un tipo de documento';
        break;

      case 'documentNumber':
        if (!valor) msg = 'Este campo es obligatorio';
        else if (!/^\d{6,12}$/.test(String(valor))) msg = 'Debe contener entre 6 y 12 números';
        break;

      case 'email':
        if (!valor) msg = 'Este campo es obligatorio';
        else if (!emailRegex.test(String(valor))) msg = 'Ingresa un correo electrónico válido';
        break;

      case 'phone': {
        const d = phoneDigits(String(valor));
        if (!d) msg = 'Este campo es obligatorio';
        else if (!/^\d{7,10}$/.test(d)) msg = 'Ingresa un número válido (7-10 dígitos)';
        break;
      }

      case 'password':
        if (!valor) msg = 'Este campo es obligatorio';
        else if (String(valor).length < 8) msg = 'La contraseña debe tener al menos 8 caracteres';
        break;

      case 'confirmPassword':
        if (!valor) msg = 'Confirma tu contraseña';
        else if (String(valor) !== datos.password) msg = 'Las contraseñas no coinciden';
        break;

      case 'termsAccepted':
        if (!valor) msg = 'Debes aceptar los términos y condiciones para continuar';
        break;
    }

    setErrores(prev => ({ ...prev, [nombre]: msg || undefined }));
    return !msg;
  }

  // Revalidación suave cuando el usuario corrige
  useEffect(() => {
    (['firstName','lastName','documentType','documentNumber','email','phone','password','confirmPassword'] as const)
      .forEach((k) => { if (errores[k]) validarCampo(k, datos[k]); });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [datos.firstName, datos.lastName, datos.documentType, datos.documentNumber, datos.email, datos.phone, datos.password, datos.confirmPassword]);

  // ----------------------- handlers -----------------------
  const onChangeTexto = (k: keyof typeof datos) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setDatos(d => ({ ...d, [k]: e.target.value }));
  };

  const onChangeSelect = (k: keyof typeof datos) => (e: any) => {
    setDatos(d => ({ ...d, [k]: e.target.value }));
  };

  const onChangeCheck = (k: keyof typeof datos) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setDatos(d => ({ ...d, [k]: e.target.checked }));
    if (k === 'termsAccepted') validarCampo('termsAccepted', e.target.checked);
  };

  function mostrarMensaje(m: string, sev: Severidad = 'error') {
    setSnack({ open: true, severity: sev, message: m });
  }

  function actualizarProgreso(n: 0 | 1 | 2) {
    setPaso(n);
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // validar todos los obligatorios + términos
    const camposOblig = [
      'firstName','lastName','documentType','documentNumber',
      'email','phone','password','confirmPassword'
    ] as const;

    let ok = true;
    for (const k of camposOblig) {
      if (!validarCampo(k, datos[k])) ok = false;
    }
    if (!validarCampo('termsAccepted', datos.termsAccepted)) ok = false;

    if (!ok) {
      mostrarMensaje('Por favor corrige los errores señalados en el formulario', 'error');
      return;
    }

    setCargando(true);
    // Simula API
    setTimeout(() => {
      mostrarMensaje('¡Cuenta creada exitosamente! Bienvenido a AutoLink Manager', 'success');
      actualizarProgreso(2);

      setTimeout(() => {
        alert('Registro completado. Redirigiendo al portal del cliente...');
        setCargando(false);
      }, 2000);
    }, 2000);
  };

  const abrirTerminos = () => alert('Aquí se mostrarían los términos y condiciones completos');
  const abrirPrivacidad = () => alert('Aquí se mostraría la política de privacidad completa');
  const irLogin = () => router.push('/');

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
              <PasoDot estado={paso > 0 ? 'done' : 'active'} />
              <PasoDot estado={paso > 1 ? 'done' : (paso === 1 ? 'active' : 'idle')} />
              <PasoDot estado={paso === 2 ? 'done' : 'idle'} />
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
                    value={datos.firstName}
                    onChange={onChangeTexto('firstName')}
                    onBlur={() => validarCampo('firstName', datos.firstName)}
                    error={!!errores.firstName}
                    helperText={errores.firstName || ' '}
                    fullWidth
                    variant="outlined"
                    sx={fieldSx()}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    label="Apellido*"
                    value={datos.lastName}
                    onChange={onChangeTexto('lastName')}
                    onBlur={() => validarCampo('lastName', datos.lastName)}
                    error={!!errores.lastName}
                    helperText={errores.lastName || ' '}
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
                      value={datos.documentType}
                      onChange={onChangeSelect('documentType')}
                      onBlur={() => validarCampo('documentType', datos.documentType)}
                      error={!!errores.documentType}
                    >
                      <MenuItem value=""><em>Seleccionar…</em></MenuItem>
                      <MenuItem value="CC">Cédula de Ciudadanía</MenuItem>
                      <MenuItem value="CE">Cédula de Extranjería</MenuItem>
                      <MenuItem value="PA">Pasaporte</MenuItem>
                    </Select>
                    <Typography variant="caption" color="error">{errores.documentType || ' '}</Typography>
                  </FormControl>
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                  <TextField
                    label="Número de Documento*"
                    value={datos.documentNumber}
                    onChange={onChangeTexto('documentNumber')}
                    onBlur={() => validarCampo('documentNumber', datos.documentNumber)}
                    error={!!errores.documentNumber}
                    helperText={errores.documentNumber || 'Solo números'}
                    fullWidth
                    variant="outlined"
                    sx={fieldSx()}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                  <TextField
                    label="Fecha de Nacimiento"
                    type="date"
                    value={datos.birthDate}
                    onChange={onChangeTexto('birthDate')}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    variant="outlined"
                    sx={fieldSx()}
                  />
                </Grid>
              </Grid>

              {/* Email (full width) */}
              <TextField
                label="Correo Electrónico*"
                value={datos.email}
                onChange={onChangeTexto('email')}
                onBlur={() => validarCampo('email', datos.email)}
                error={!!errores.email}
                helperText={errores.email || 'Recibirás notificaciones importantes aquí'}
                fullWidth
                variant="outlined"
                sx={fieldSx()}
              />

              {/* Teléfono / Dirección */}
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    label="Teléfono*"
                    value={datos.phone}
                    onChange={onChangeTexto('phone')}
                    onBlur={() => validarCampo('phone', datos.phone)}
                    error={!!errores.phone}
                    helperText={errores.phone || 'Incluye código de área'}
                    fullWidth
                    variant="outlined"
                    sx={fieldSx()}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    label="Dirección"
                    placeholder="Calle, número, barrio"
                    value={datos.address}
                    onChange={onChangeTexto('address')}
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
                    value={datos.password}
                    onChange={onChangeTexto('password')}
                    onBlur={() => validarCampo('password', datos.password)}
                    error={!!errores.password}
                    helperText={errores.password || 'Mínimo 8 caracteres'}
                    fullWidth
                    variant="outlined"
                    sx={fieldSx()}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    label="Confirmar Contraseña*"
                    type="password"
                    value={datos.confirmPassword}
                    onChange={onChangeTexto('confirmPassword')}
                    onBlur={() => validarCampo('confirmPassword', datos.confirmPassword)}
                    error={!!errores.confirmPassword}
                    helperText={errores.confirmPassword || ' '}
                    fullWidth
                    variant="outlined"
                    sx={fieldSx()}
                  />
                </Grid>
              </Grid>

              {/* Checkboxes */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <FormControlLabel
                  control={<Checkbox checked={datos.termsAccepted} onChange={onChangeCheck('termsAccepted')} />}
                  label={
                    <Typography sx={{ fontSize: '.9rem', color: '#2c3e50' }}>
                      Acepto los{' '}
                      <Button onClick={abrirTerminos} sx={{ p: 0, minWidth: 0, textTransform: 'none', color: PALETA.acento }}>
                        Términos y Condiciones
                      </Button>{' '}
                      y la{' '}
                      <Button onClick={abrirPrivacidad} sx={{ p: 0, minWidth: 0, textTransform: 'none', color: PALETA.acento }}>
                        Política de Privacidad
                      </Button>{' '}*
                    </Typography>
                  }
                />
                {!!errores.termsAccepted && (
                  <Typography variant="caption" color="error">{errores.termsAccepted}</Typography>
                )}

                <FormControlLabel
                  control={<Checkbox checked={datos.marketingEmails} onChange={onChangeCheck('marketingEmails')} />}
                  label={<Typography sx={{ fontSize: '.9rem', color: '#2c3e50' }}>
                    Quiero recibir promociones y ofertas especiales por correo electrónico
                  </Typography>}
                />
              </Box>

              {/* Botón enviar */}
              <Button
                type="submit"
                variant="contained"
                disabled={cargando}
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
                {cargando ? 'Creando cuenta...' : 'Crear Mi Cuenta'}
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
                <Button onClick={irLogin} sx={{ textTransform: 'none' }}>
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
