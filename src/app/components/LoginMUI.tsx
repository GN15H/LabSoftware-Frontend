'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Avatar,
  TextField,
  Checkbox,
  FormControlLabel,
  Button,
  Divider,
  Snackbar,
  Alert,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import Grid from '@mui/material/Grid';
import router from 'next/router';
import { useRouter } from 'next/navigation';


export default function LoginMUI() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);
  const [snack, setSnack] = useState<{ open: boolean; severity: 'success' | 'info' | 'warning' | 'error'; message: string }>({ open: false, severity: 'info', message: '' });
  const router = useRouter();

  useEffect(() => {
    // Realtime validation behavior similar al original: blurs y input corrigen errores
    if (errors.email && email) validateField('email', email);
    if (errors.password && password) validateField('password', password);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email, password]);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface Errors {
    email?: string;
    password?: string;
}

type FieldName = 'email' | 'password';

function validateField(name: FieldName, value: string): boolean {
    let msg = '';
    if (name === 'email') {
        if (!value) msg = 'El correo electrónico es obligatorio';
        else if (!emailRegex.test(value)) msg = 'Ingresa un correo electrónico válido';
    }
    if (name === 'password') {
        if (!value) msg = 'La contraseña es obligatoria';
    }

    setErrors((prev: Errors) => ({ ...prev, [name]: msg }));
    return !msg;
}

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    const emailValid = validateField('email', email.trim().toLowerCase());
    const passwordValid = validateField('password', password);
    if (!emailValid || !passwordValid) {
      setSnack({ open: true, severity: 'error', message: 'Por favor corrige los errores en el formulario' });
      return;
    }

    setLoading(true);

    // Simula llamada a API
    setTimeout(() => {
      const validUsers: { [key: string]: { name: string; type: string } } = {
        'juan.perez@gmail.com': { name: 'Juan Pérez', type: 'cliente' },
        'maria.garcia@hotmail.com': { name: 'María García', type: 'cliente' },
        'carlos.rodriguez@autolink.com': { name: 'Carlos Rodríguez', type: 'mecanico' },
        'ana.fernandez@autolink.com': { name: 'Ana Fernández', type: 'mecanico' },
        'admin@autolink.com': { name: 'Administrador Principal', type: 'admin' },
        'admin.sistemas@autolink.com': { name: 'Admin Sistemas', type: 'admin' },
      };

      const userData = validUsers[email.trim().toLowerCase()];

      if (userData && password === '12345678') {
        setSnack({ open: true, severity: 'success', message: `¡Bienvenido ${userData.name}!` });
        setTimeout(() => {
          if (userData.type === 'admin') router.push('/admin');
          else if (userData.type === 'mecanico') router.push('/mecanico');
          else router.push('/cliente');
        }, 1200);

      } else {
        setSnack({ open: true, severity: 'error', message: 'Credenciales incorrectas. Verifica tu email y contraseña.' });
        setLoading(false);
      }
    }, 1600);
  };

  const handleForgot = () => {
    alert('Función de recuperación de contraseña. Se enviaría un email para restablecer la contraseña.');
  };

  const handleRegister = () => {
    router.push('/registro');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: `Segoe UI, Tahoma, Geneva, Verdana, sans-serif`,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        p: 2,
      }}
    >
      <Paper
        elevation={8}
        sx={{
          width: '90%',
          maxWidth: 900,
          borderRadius: 2.5,
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
        }}
      >
        <Grid container sx={{ minHeight: 500 }}>
          {/* Sidebar izquierda con gradiente oscuro */}
          <Grid
            size={{xs:12, md:6}}
            sx={{
              order: { xs: 2, md: 1 },
              background: 'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)',
              color: '#fff',
              p: { xs: 3, md: 6 },
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              textAlign: 'center',
              gap: 2,
            }}
          >
            <Typography variant="h3" component="div" sx={{ fontWeight: 700, fontSize: { xs: '2.2rem', md: '3rem' } }}>
              AutoLink
            </Typography>
            <Typography variant="subtitle1" sx={{ opacity: 0.9, fontWeight: 600 }}>
              ¡Bienvenido de vuelta!
            </Typography>
            <Typography sx={{ opacity: 0.85, lineHeight: 1.5, maxWidth: 360, mx: 'auto' }}>
              Accede a tu cuenta para gestionar tus servicios automotrices
            </Typography>

            <Box sx={{ mt: 2, mx: 'auto' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25, alignItems: 'flex-start' }}>
                {[
                  'Consulta tus citas programadas',
                  'Revisa el historial de servicios',
                  'Gestiona tu información personal',
                  'Descarga facturas digitales',
                ].map((t) => (
                  <Box key={t} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar sx={{ bgcolor: '#27ae60', width: 26, height: 26 }}>
                      <CheckIcon sx={{ fontSize: 16 }} />
                    </Avatar>
                    <Typography sx={{ textAlign: { xs: 'center', md: 'left' }, mx: 0 }}>{t}</Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Grid>

          {/* Area del formulario */}
          <Grid
            size={{xs:12, md:6}}
            sx={{
              order: { xs: 1, md: 2 },
              p: { xs: 3, md: 6 },
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ width: '100%' }}>
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#2c3e50' }}>
                  Iniciar Sesión
                </Typography>
                <Typography sx={{ color: '#7f8c8d' }}>Ingresa tus credenciales para continuar</Typography>
              </Box>

              {/* Validation message area (snackbar used instead) */}

              <Box sx={{ display: 'grid', gap: 2 }}>
                <TextField
                  label="Correo Electrónico"
                  variant="filled"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => validateField('email', email.trim().toLowerCase())}
                  error={!!errors.email}
                  helperText={errors.email || ' '}
                  fullWidth
                  InputProps={{ disableUnderline: true }}
                  sx={{
                    borderRadius: 2,
                    '& .MuiFilledInput-root': {
                      backgroundColor: '#f8f9fa',
                      border: '2px solid #ecf0f1',
                      borderRadius: 2,
                      paddingLeft: 1,
                    },
                    '& .MuiFilledInput-root:focus-within': {
                      borderColor: '#3498db',
                      backgroundColor: '#fff',
                      boxShadow: '0 0 0 6px rgba(52,152,219,0.06)',
                    },
                  }}
                />

                <TextField
                  label="Contraseña"
                  type="password"
                  variant="filled"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => validateField('password', password)}
                  error={!!errors.password}
                  helperText={errors.password || ' '}
                  fullWidth
                  InputProps={{ disableUnderline: true }}
                  sx={{
                    borderRadius: 2,
                    '& .MuiFilledInput-root': {
                      backgroundColor: '#f8f9fa',
                      border: '2px solid #ecf0f1',
                      borderRadius: 2,
                      paddingLeft: 1,
                    },
                    '& .MuiFilledInput-root:focus-within': {
                      borderColor: '#3498db',
                      backgroundColor: '#fff',
                      boxShadow: '0 0 0 6px rgba(52,152,219,0.06)',
                    },
                  }}
                />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <FormControlLabel
                    control={<Checkbox checked={remember} onChange={(e) => setRemember(e.target.checked)} />}
                    label={<Typography sx={{ fontSize: 14, color: '#2c3e50' }}>Recordarme</Typography>}
                  />

                  <Button onClick={handleForgot} sx={{ textTransform: 'none', fontWeight: 600 }}>
                    <Typography sx={{ color: '#3498db' }}>¿Olvidaste tu contraseña?</Typography>
                  </Button>
                </Box>

                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  sx={{
                    background: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)',
                    color: '#fff',
                    borderRadius: 2,
                    py: 1.5,
                    fontWeight: 700,
                    fontSize: '1.05rem',
                    boxShadow: loading ? 'none' : '0 5px 15px rgba(52,152,219,0.12)',
                    '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 8px 24px rgba(52,152,219,0.16)' },
                  }}
                >
                  {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                </Button>

                <Box sx={{ textAlign: 'center', mt: 2, position: 'relative' }}>
                  <Divider sx={{ borderColor: '#ecf0f1' }}> 
                    <Typography component="span" sx={{ background: '#fff', px: 1, color: '#7f8c8d', fontSize: 14 }}>
                      o
                    </Typography>
                  </Divider>
                </Box>

                <Box sx={{ textAlign: 'center', color: '#7f8c8d', mt: 1 }}>
                  ¿No tienes una cuenta?{' '}
                  <Button onClick={handleRegister} sx={{ textTransform: 'none' }}>
                    <Typography sx={{ color: '#3498db', fontWeight: 600 }}>Regístrate aquí</Typography>
                  </Button>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Snackbar open={snack.open} autoHideDuration={5000} onClose={() => setSnack((s) => ({ ...s, open: false }))}>
        <Alert severity={snack.severity} sx={{ width: '100%' }}>
          {snack.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
