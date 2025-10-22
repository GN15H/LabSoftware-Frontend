'use client';

import React, { useMemo, useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Box,
  Paper,
  Button,
  Card,
  CardContent,
  Divider,
  Chip,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Grid as GridLegacy,
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import CarRepairIcon from '@mui/icons-material/CarRepair';
import InventoryIcon from '@mui/icons-material/Inventory';
import AssessmentIcon from '@mui/icons-material/Assessment';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import TableViewIcon from '@mui/icons-material/TableView';
import DownloadIcon from '@mui/icons-material/Download';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import { useRouter } from 'next/navigation';

// Nota importante:
// Usamos GridLegacy porque tu proyecto tiene @mui/material/GridLegacy disponible.
// Mantiene props item/xs/md como en tu HTML. Luego podrás migrar a Grid v2 con calma.

const headerGradient = 'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)';
const cardGradient = 'linear-gradient(360deg, #0a334b 40%, #5981beef 100%)';
const softPanel = '#c1d1e696';

export default function AdminPanelMUI() {
  const router = useRouter();

  // --- Estados de diálogos ---
  const [dlgCreateUser, setDlgCreateUser] = useState(false);
  const [dlgSearchUser, setDlgSearchUser] = useState(false);
  const [dlgDeleteUser, setDlgDeleteUser] = useState(false);
  const [dlgConfirmDeleteUser, setDlgConfirmDeleteUser] = useState<{open: boolean; name?: string}>({open:false});

  const [dlgVehicles, setDlgVehicles] = useState(false);

  const [dlgSchedule, setDlgSchedule] = useState(false);
  const [dlgReassign, setDlgReassign] = useState(false);
  const [dlgReassignForm, setDlgReassignForm] = useState<{open:boolean; data?: any}>({open:false});
  const [dlgCancel, setDlgCancel] = useState(false);
  const [dlgConfirmCancel, setDlgConfirmCancel] = useState<{open:boolean; data?: any}>({open:false});

  const [dlgCreateService, setDlgCreateService] = useState(false);
  const [dlgServiceCatalog, setDlgServiceCatalog] = useState(false);
  const [dlgDeleteService, setDlgDeleteService] = useState(false);
  const [dlgConfirmDeleteService, setDlgConfirmDeleteService] = useState<{open:boolean; data?: any}>({open:false});

  const [dlgProviders, setDlgProviders] = useState(false);
  const [dlgRegisterProvider, setDlgRegisterProvider] = useState(false);
  const [dlgModifyProvider, setDlgModifyProvider] = useState<{open:boolean; data?: any}>({open:false});
  const [dlgConfirmDeleteProvider, setDlgConfirmDeleteProvider] = useState<{open:boolean; name?: string}>({open:false});

  const [dlgSpareparts, setDlgSpareparts] = useState(false);
  const [dlgRegisterSparepart, setDlgRegisterSparepart] = useState(false);
  const [dlgModifySparepart, setDlgModifySparepart] = useState<{open:boolean; data?: any}>({open:false});
  const [dlgConfirmDeleteSparepart, setDlgConfirmDeleteSparepart] = useState<{open:boolean; name?: string}>({open:false});

  const [dlgGenerateReport, setDlgGenerateReport] = useState<{open:boolean; type: 'citas' | 'mecanicos' | 'inventario' | 'financiero'}>({open:false, type:'citas'});

  const [snack, setSnack] = useState<{open:boolean; msg:string; sev: 'success' | 'info' | 'warning' | 'error'}>({open:false, msg:'', sev:'info'});

  // --- Simulados (numeritos de cabecera) ---
  const stats = useMemo(() => ([
    { label: 'Usuarios Totales', value: 156 },
    { label: 'Vehículos Registrados', value: 89 },
    { label: 'Citas Hoy', value: 23 },
    { label: 'Servicios Disponibles', value: 12 },
  ]), []);

  // --- Handlers rápidos ---
  const logout = () => {
    if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
      try {
        localStorage.removeItem('role');
        localStorage.removeItem('token');
        sessionStorage.clear();
      } catch {}
      router.replace('/');
    }
  };

  const confirmDeleteUser = (name: string) => setDlgConfirmDeleteUser({open:true, name});
  const executeDeleteUser = () => { setDlgConfirmDeleteUser({open:false}); setSnack({open:true, msg:'Usuario eliminado correctamente', sev:'success'}); };

  const selectAppointmentToReassign = (data: any) => setDlgReassignForm({open:true, data});
  const selectAppointmentToCancel = (data: any) => setDlgConfirmCancel({open:true, data});

  const confirmDeleteService = (data: any) => setDlgConfirmDeleteService({open:true, data});
  const executeDeleteService = () => { setDlgConfirmDeleteService({open:false}); setSnack({open:true, msg:'Servicio eliminado', sev:'success'}); };

  const openModifyProvider = (data: any) => setDlgModifyProvider({open:true, data});
  const confirmDeleteProvider = (name: string) => setDlgConfirmDeleteProvider({open:true, name});
  const executeDeleteProvider = () => { setDlgConfirmDeleteProvider({open:false}); setSnack({open:true, msg:'Proveedor eliminado', sev:'success'}); };

  const openModifySparepart = (data: any) => setDlgModifySparepart({open:true, data});
  const confirmDeleteSparepart = (name: string) => setDlgConfirmDeleteSparepart({open:true, name});
  const executeDeleteSparepart = () => { setDlgConfirmDeleteSparepart({open:false}); setSnack({open:true, msg:'Repuesto eliminado', sev:'success'}); };

  const generateReportNow = () => {
    setSnack({open:true, msg:'El reporte se descargará automáticamente (simulado).', sev:'info'});
    setDlgGenerateReport({open:false, type: dlgGenerateReport.type});
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8f9fa' }}>
      {/* Header */}
      <AppBar position="sticky" elevation={4} sx={{ background: headerGradient }}>
        <Toolbar sx={{ maxWidth: 1200, mx: 'auto', width: '100%' }}>
          <Typography variant="h6" sx={{ fontWeight: 700, flexGrow: 1 }}>AutoLink Manager</Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography>Admin</Typography>
            <Avatar sx={{ bgcolor: '#e74c3c', width: 40, height: 40 }}>A</Avatar>
            <Button startIcon={<LogoutIcon />} onClick={logout} sx={{ color: '#fff', border: '1px solid rgba(255,255,255,0.3)' }}>Salir</Button>
          </Stack>
        </Toolbar>
      </AppBar>

      <Box sx={{ maxWidth: 1200, mx: 'auto', p: { xs: 2, md: 3 } }}>
        {/* Bienvenida */}
        <Paper sx={{ p: 3, mb: 3, borderRadius: 2, background: softPanel, boxShadow: '0 2px 20px rgba(0,0,0,0.08)' }}>
          <Typography variant="h4" sx={{ color: '#2c3e50', fontWeight: 800, mb: 0.5 }}>Panel de Administración</Typography>
          <Typography sx={{ color: '#6b6e6e' }}>Gestiona todos los aspectos de tu taller mecánico desde un solo lugar</Typography>
        </Paper>

        {/* Quick Stats */}
        <GridLegacy container spacing={2} sx={{ mb: 3 }}>
          {stats.map((s) => (
            <GridLegacy item xs={12} sm={6} md={3} key={s.label}>
              <Card sx={{ background: cardGradient, color: '#e2edf5', textAlign: 'center', borderRadius: 2, ':hover': { transform: 'translateY(-2px)' }, transition: 'transform .2s' }}>
                <CardContent>
                  <Typography variant="h3" sx={{ color: '#ecdacb', fontWeight: 800 }}>{s.value}</Typography>
                  <Typography sx={{ mt: 0.5 }}>{s.label}</Typography>
                </CardContent>
              </Card>
            </GridLegacy>
          ))}
        </GridLegacy>

        {/* Módulos */}
        <GridLegacy container spacing={2}>
          {/* Gestión de Usuarios */}
          <GridLegacy item xs={12} md={6}>
            <Paper sx={{ borderRadius: 2, overflow: 'hidden', boxShadow: '0 2px 20px rgba(0,0,0,0.08)' }}>
              <Box sx={{ p: 2.5, background: headerGradient, color: '#fff' }}>
                <Typography sx={{ fontWeight: 700 }}>Gestión de Usuarios</Typography>
                <Typography sx={{ opacity: 0.9 }}>Administra clientes y mecánicos</Typography>
              </Box>
              <Box sx={{ p: 2.5 }}>
                <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 1.5 }}>
                  <Button variant="contained" startIcon={<AddIcon />} onClick={() => setDlgCreateUser(true)} sx={{ bgcolor: '#e37239', ':hover': { bgcolor: '#c4683a' } }}>Crear Usuario</Button>
                  <Button startIcon={<SearchIcon />} onClick={() => setDlgSearchUser(true)} sx={{ bgcolor: '#eee7e1', color: '#2c3e50', ':hover': { bgcolor: '#dad6d3' } }}>Consultar</Button>
                  <Button startIcon={<DeleteForeverIcon />} onClick={() => setDlgDeleteUser(true)} sx={{ bgcolor: '#ca370b', color: '#fff', ':hover': { bgcolor: '#ac3315' } }}>Eliminar</Button>
                </Stack>
                <Typography variant="body2" sx={{ color: '#7f8c8d' }}>RF-001: Permite crear, consultar y eliminar usuarios del sistema (clientes y mecánicos)</Typography>
              </Box>
            </Paper>
          </GridLegacy>

          {/* Gestión de Citas */}
          <GridLegacy item xs={12} md={6}>
            <Paper sx={{ borderRadius: 2, overflow: 'hidden', boxShadow: '0 2px 20px rgba(0,0,0,0.08)' }}>
              <Box sx={{ p: 2.5, background: headerGradient, color: '#fff' }}>
                <Typography sx={{ fontWeight: 700 }}>Gestión de Citas</Typography>
                <Typography sx={{ opacity: 0.9 }}>Agenda, cancela y reasigna citas</Typography>
              </Box>
              <Box sx={{ p: 2.5 }}>
                <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 1.5 }}>
                  <Button variant="contained" startIcon={<CalendarMonthIcon />} onClick={() => setDlgSchedule(true)} sx={{ bgcolor: '#e37239', ':hover': { bgcolor: '#c4683a' } }}>Agendar Cita</Button>
                  <Button startIcon={<EditCalendarIcon />} onClick={() => setDlgReassign(true)} sx={{ bgcolor: '#eee7e1', color: '#2c3e50', ':hover': { bgcolor: '#dad6d3' } }}>Reasignar</Button>
                  <Button startIcon={<CloseIcon />} onClick={() => setDlgCancel(true)} sx={{ bgcolor: '#ca370b', color: '#fff', ':hover': { bgcolor: '#ac3315' } }}>Cancelar</Button>
                </Stack>
                <Typography variant="body2" sx={{ color: '#7f8c8d' }}>RF-003: Agendar, cancelar y reasignar citas de los clientes</Typography>
              </Box>
            </Paper>
          </GridLegacy>

          {/* Gestión de Vehículos */}
          <GridLegacy item xs={12} md={6}>
            <Paper sx={{ borderRadius: 2, overflow: 'hidden', boxShadow: '0 2px 20px rgba(0,0,0,0.08)' }}>
              <Box sx={{ p: 2.5, background: headerGradient, color: '#fff' }}>
                <Typography sx={{ fontWeight: 700 }}>Gestión de Vehículos</Typography>
                <Typography sx={{ opacity: 0.9 }}>Consulta información de vehículos registrados</Typography>
              </Box>
              <Box sx={{ p: 2.5 }}>
                <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 1.5 }}>
                  <Button variant="contained" startIcon={<CarRepairIcon />} onClick={() => setDlgVehicles(true)} sx={{ bgcolor: '#e37239', ':hover': { bgcolor: '#c4683a' } }}>Ver Vehículos</Button>
                </Stack>
                <Typography variant="body2" sx={{ color: '#7f8c8d' }}>RF-002: Consulta información de vehículos registrados por los clientes</Typography>
              </Box>
            </Paper>
          </GridLegacy>

          {/* Catálogo de Servicios */}
          <GridLegacy item xs={12} md={6}>
            <Paper sx={{ borderRadius: 2, overflow: 'hidden', boxShadow: '0 2px 20px rgba(0,0,0,0.08)' }}>
              <Box sx={{ p: 2.5, background: headerGradient, color: '#fff' }}>
                <Typography sx={{ fontWeight: 700 }}>Catálogo de Servicios</Typography>
                <Typography sx={{ opacity: 0.9 }}>Administra los servicios disponibles</Typography>
              </Box>
              <Box sx={{ p: 2.5 }}>
                <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 1.5 }}>
                  <Button variant="contained" startIcon={<AddIcon />} onClick={() => setDlgCreateService(true)} sx={{ bgcolor: '#e37239', ':hover': { bgcolor: '#c4683a' } }}>Crear Servicio</Button>
                  <Button startIcon={<TableViewIcon />} onClick={() => setDlgServiceCatalog(true)} sx={{ bgcolor: '#eee7e1', color: '#2c3e50', ':hover': { bgcolor: '#dad6d3' } }}>Catálogo</Button>
                  <Button startIcon={<DeleteForeverIcon />} onClick={() => setDlgDeleteService(true)} sx={{ bgcolor: '#ca370b', color: '#fff', ':hover': { bgcolor: '#ac3315' } }}>Eliminar</Button>
                </Stack>
                <Typography variant="body2" sx={{ color: '#7f8c8d' }}>RF-004: Crear y eliminar servicios disponibles en el taller</Typography>
              </Box>
            </Paper>
          </GridLegacy>

          {/* Inventario */}
          <GridLegacy item xs={12} md={6}>
            <Paper sx={{ borderRadius: 2, overflow: 'hidden', boxShadow: '0 2px 20px rgba(0,0,0,0.08)' }}>
              <Box sx={{ p: 2.5, background: headerGradient, color: '#fff' }}>
                <Typography sx={{ fontWeight: 700 }}>Gestión de Inventario</Typography>
                <Typography sx={{ opacity: 0.9 }}>Administra proveedores y repuestos</Typography>
              </Box>
              <Box sx={{ p: 2.5 }}>
                <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 1.5 }}>
                  <Button variant="contained" startIcon={<AssignmentIndIcon />} onClick={() => setDlgProviders(true)} sx={{ bgcolor: '#e37239', ':hover': { bgcolor: '#c4683a' } }}>Proveedores</Button>
                  <Button variant="contained" startIcon={<InventoryIcon />} onClick={() => setDlgSpareparts(true)} sx={{ bgcolor: '#e37239', ':hover': { bgcolor: '#c4683a' } }}>Repuestos</Button>
                </Stack>
                <Typography variant="body2" sx={{ color: '#7f8c8d' }}>RF-017–RF-020: Gestión completa de proveedores, repuestos y alertas de inventario</Typography>
              </Box>
            </Paper>
          </GridLegacy>

          {/* Reportes */}
          <GridLegacy item xs={12} md={6}>
            <Paper sx={{ borderRadius: 2, overflow: 'hidden', boxShadow: '0 2px 20px rgba(0,0,0,0.08)' }}>
              <Box sx={{ p: 2.5, background: headerGradient, color: '#fff' }}>
                <Typography sx={{ fontWeight: 700 }}>Reportes Operativos</Typography>
                <Typography sx={{ opacity: 0.9 }}>Genera informes y estadísticas del taller</Typography>
              </Box>
              <Box sx={{ p: 2.5 }}>
                <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 1.5 }}>
                  <Button variant="contained" startIcon={<AssessmentIcon />} onClick={() => setDlgGenerateReport({open:true, type:'citas'})} sx={{ bgcolor: '#e37239', ':hover': { bgcolor: '#c4683a' } }}>Citas</Button>
                  <Button variant="contained" startIcon={<AssessmentIcon />} onClick={() => setDlgGenerateReport({open:true, type:'mecanicos'})} sx={{ bgcolor: '#e37239', ':hover': { bgcolor: '#c4683a' } }}>Mecánicos</Button>
                  <Button variant="contained" startIcon={<AssessmentIcon />} onClick={() => setDlgGenerateReport({open:true, type:'inventario'})} sx={{ bgcolor: '#e37239', ':hover': { bgcolor: '#c4683a' } }}>Inventario</Button>
                  <Button variant="contained" startIcon={<AssessmentIcon />} onClick={() => setDlgGenerateReport({open:true, type:'financiero'})} sx={{ bgcolor: '#e37239', ':hover': { bgcolor: '#c4683a' } }}>Financiero</Button>
                </Stack>
                <Typography variant="body2" sx={{ color: '#7f8c8d' }}>RF-026: Reportes exportables a PDF o Excel</Typography>
              </Box>
            </Paper>
          </GridLegacy>
        </GridLegacy>
      </Box>

      {/* --- DIALOGS --- */}

      {/* Crear Usuario */}
      <Dialog open={dlgCreateUser} onClose={() => setDlgCreateUser(false)} maxWidth="md" fullWidth>
        <DialogTitle>Crear Nuevo Usuario</DialogTitle>
        <DialogContent dividers>
          <GridLegacy container spacing={2} sx={{ mt: 0.5 }}>
            <GridLegacy item xs={12} md={6}><TextField label="Nombre*" fullWidth required/></GridLegacy>
            <GridLegacy item xs={12} md={6}><TextField label="Apellido*" fullWidth required/></GridLegacy>
            <GridLegacy item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Tipo de Documento*</InputLabel>
                <Select label="Tipo de Documento*" defaultValue="">
                  <MenuItem value="CC">Cédula de Ciudadanía</MenuItem>
                  <MenuItem value="CE">Cédula de Extranjería</MenuItem>
                  <MenuItem value="PA">Pasaporte</MenuItem>
                </Select>
              </FormControl>
            </GridLegacy>
            <GridLegacy item xs={12} md={6}><TextField label="Número de Documento*" fullWidth required/></GridLegacy>
            <GridLegacy item xs={12} md={6}><TextField type="email" label="Correo Electrónico*" fullWidth required/></GridLegacy>
            <GridLegacy item xs={12} md={6}><TextField label="Teléfono*" fullWidth required/></GridLegacy>
            <GridLegacy item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Rol de Usuario*</InputLabel>
                <Select label="Rol de Usuario*" defaultValue="cliente">
                  <MenuItem value="cliente">Cliente</MenuItem>
                  <MenuItem value="mecanico">Mecánico</MenuItem>
                </Select>
              </FormControl>
            </GridLegacy>
            <GridLegacy item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Especialidad (Mecánico)</InputLabel>
                <Select label="Especialidad (Mecánico)" defaultValue="">
                  <MenuItem value="">N/A</MenuItem>
                  <MenuItem value="motor">Motor</MenuItem>
                  <MenuItem value="frenos">Frenos</MenuItem>
                  <MenuItem value="suspension">Suspensión</MenuItem>
                  <MenuItem value="electrico">Eléctrico</MenuItem>
                  <MenuItem value="general">General</MenuItem>
                </Select>
              </FormControl>
            </GridLegacy>
            <GridLegacy item xs={12}><TextField label="Dirección" fullWidth/></GridLegacy>
            <GridLegacy item xs={12} md={6}><TextField type="password" label="Contraseña*" fullWidth required/></GridLegacy>
            <GridLegacy item xs={12} md={6}><TextField type="password" label="Confirmar Contraseña*" fullWidth required/></GridLegacy>
          </GridLegacy>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDlgCreateUser(false)}>Cancelar</Button>
          <Button variant="contained" sx={{ bgcolor: '#e37239', ':hover': { bgcolor: '#c4683a' } }} onClick={() => { setDlgCreateUser(false); setSnack({open:true, msg:'Usuario creado exitosamente', sev:'success'}); }}>Crear Usuario</Button>
        </DialogActions>
      </Dialog>

      {/* Consultar Usuario */}
      <Dialog open={dlgSearchUser} onClose={() => setDlgSearchUser(false)} maxWidth="md" fullWidth>
        <DialogTitle>Consultar Usuario</DialogTitle>
        <DialogContent dividers>
          <TextField fullWidth placeholder="Nombre, documento o correo..." InputProps={{ startAdornment: <SearchIcon/> }} sx={{ mb: 2 }}/>
          <Stack spacing={1.5}>
            {['Juan Pérez • CC: 12345678 • Cliente • juan@email.com', 'Carlos Rodríguez • CC: 87654321 • Mecánico • carlos@email.com', 'María García • CC: 11223344 • Cliente • maria@email.com'].map((t) => (
              <Paper key={t} sx={{ p: 1.5, display:'flex', alignItems:'center', justifyContent:'space-between', bgcolor:'#f8f9fa', border:'2px solid #ecf0f1', borderRadius:2, ':hover':{ borderColor:'#3498db', transform:'translateY(-2px)' }, transition:'all .2s' }}>
                <Typography>{t}</Typography>
                <Chip label="Activo" color="success" variant="outlined"/>
              </Paper>
            ))}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDlgSearchUser(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>

      {/* Eliminar Usuario */}
      <Dialog open={dlgDeleteUser} onClose={() => setDlgDeleteUser(false)} maxWidth="md" fullWidth>
        <DialogTitle>Eliminar Usuario</DialogTitle>
        <DialogContent dividers>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2, bgcolor:'#fff3cd', border:'1px solid #ffeaa7', p:1.5, borderRadius:1 }}>
            <WarningAmberIcon/> <Typography>Esta acción no se puede deshacer. Al eliminar un usuario se perderán todos sus datos asociados.</Typography>
          </Stack>
          <TextField fullWidth placeholder="Nombre, documento o correo..." InputProps={{ startAdornment: <SearchIcon/> }} sx={{ mb: 2 }}/>
          <Stack spacing={1.5}>
            {[['Juan Pérez','Cliente • 2 vehículos'], ['Carlos Rodríguez','Mecánico • 15 citas'], ['María García','Cliente • 1 vehículo']].map(([name,detail]) => (
              <Paper key={name} onClick={() => confirmDeleteUser(name)} sx={{ p:1.5, display:'flex', alignItems:'center', justifyContent:'space-between', bgcolor:'#f8f9fa', border:'2px solid #ecf0f1', borderRadius:2, cursor:'pointer', ':hover':{ bgcolor:'#f8d7da', borderColor:'#f5c6cb' } }}>
                <Box>
                  <Typography sx={{ fontWeight:700 }}>{name}</Typography>
                  <Typography variant="body2" sx={{ color:'#7f8c8d' }}>{detail}</Typography>
                </Box>
                <DeleteForeverIcon sx={{ color:'#e74c3c' }}/>
              </Paper>
            ))}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDlgDeleteUser(false)}>Cancelar</Button>
        </DialogActions>
      </Dialog>

      {/* Confirmar eliminación de Usuario */}
      <Dialog open={dlgConfirmDeleteUser.open} onClose={() => setDlgConfirmDeleteUser({open:false})} maxWidth="xs" fullWidth>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent dividers>
          <Typography textAlign="center">¿Eliminar definitivamente a <strong>{dlgConfirmDeleteUser.name}</strong>?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDlgConfirmDeleteUser({open:false})}>Cancelar</Button>
          <Button variant="contained" color="error" onClick={executeDeleteUser}>Eliminar Definitivamente</Button>
        </DialogActions>
      </Dialog>

      {/* Ver Vehículos */}
      <Dialog open={dlgVehicles} onClose={() => setDlgVehicles(false)} maxWidth="lg" fullWidth>
        <DialogTitle>Gestión de Vehículos</DialogTitle>
        <DialogContent dividers>
          <TextField fullWidth placeholder="Buscar por placa (Ej: ABC-123)" InputProps={{ startAdornment: <SearchIcon/> }} sx={{ mb: 2 }}/>
          <Stack spacing={2}>
            {[
              { name:'Toyota Corolla 2020', plate:'ABC-123', owner:'Juan Pérez', kms:'45,000 km', type:'Sedán', last:'15/09/2024', next:'15/12/2024', status:'Activo', icon:'🚗' },
              { name:'Honda Civic 2019', plate:'XYZ-789', owner:'María García', kms:'62,000 km', type:'Sedán', last:'30/08/2024', next:'30/11/2024', status:'Activo', icon:'🚙' },
              { name:'Yamaha FZ 2021', plate:'DEF-456', owner:'Carlos Ruiz', kms:'18,500 km', type:'Motocicleta', last:'20/09/2024', next:'20/03/2025', status:'En Servicio', icon:'🏍️' },
            ].map(v => (
              <Paper key={v.plate} sx={{ p:2, border:'2px solid #ecf0f1', borderRadius:2, display:'flex', gap:2, ':hover':{ borderColor:'#3498db', transform:'translateY(-2px)' }, transition:'all .2s' }}>
                <Box sx={{ fontSize: 36 }}>{v.icon}</Box>
                <Box sx={{ flex:1 }}>
                  <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                    <Typography sx={{ fontWeight:700, fontSize:18 }}>{v.name}</Typography>
                    <Chip label={v.plate} sx={{ bgcolor:'#2c3e50', color:'#fff', fontWeight:700 }}/>
                  </Stack>
                  <GridLegacy container spacing={1}>
                    {[
                      ['Propietario', v.owner],
                      ['Kilometraje', v.kms],
                      ['Tipo', v.type],
                      ['Estado', v.status],
                      ['Último servicio', v.last],
                      ['Próximo servicio', v.next],
                    ].map(([l, val]) => (
                      <GridLegacy item xs={12} sm={6} md={4} key={l as string}>
                        <Typography variant="caption" sx={{ color:'#7f8c8d', fontWeight:500 }}>{l}</Typography>
                        <Typography sx={{ fontWeight:600 }}>{val}</Typography>
                      </GridLegacy>
                    ))}
                  </GridLegacy>
                </Box>
              </Paper>
            ))}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDlgVehicles(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>

      {/* Agendar Cita */}
      <Dialog open={dlgSchedule} onClose={() => setDlgSchedule(false)} maxWidth="md" fullWidth>
        <DialogTitle>Agendar Nueva Cita</DialogTitle>
        <DialogContent dividers>
          <GridLegacy container spacing={2}>
            <GridLegacy item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Seleccionar Cliente*</InputLabel>
                <Select label="Seleccionar Cliente*" defaultValue="client1">
                  <MenuItem value="client1">Juan Pérez - CC 12345678</MenuItem>
                  <MenuItem value="client2">María García - CC 87654321</MenuItem>
                </Select>
              </FormControl>
            </GridLegacy>
            <GridLegacy item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Vehículo del Cliente*</InputLabel>
                <Select label="Vehículo del Cliente*" defaultValue="v1">
                  <MenuItem value="v1">Toyota Corolla (ABC-123)</MenuItem>
                  <MenuItem value="v2">Honda Civic (XYZ-789)</MenuItem>
                </Select>
              </FormControl>
            </GridLegacy>
            <GridLegacy item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Tipo de Servicio*</InputLabel>
                <Select label="Tipo de Servicio*" defaultValue="oil-change">
                  <MenuItem value="oil-change">Cambio de aceite - $80,000</MenuItem>
                  <MenuItem value="brake-service">Servicio de frenos - $250,000</MenuItem>
                </Select>
              </FormControl>
            </GridLegacy>
            <GridLegacy item xs={12} md={6}><TextField type="date" label="Fecha de la Cita*" fullWidth InputLabelProps={{ shrink: true }}/></GridLegacy>
            <GridLegacy item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Hora Preferida*</InputLabel>
                <Select label="Hora Preferida*" defaultValue="10:00">
                  {['08:00','09:00','10:00','11:00','14:00','15:00','16:00','17:00'].map(h => <MenuItem key={h} value={h}>{h}</MenuItem>)}
                </Select>
              </FormControl>
            </GridLegacy>
            <GridLegacy item xs={12} md={6}><TextField label="Duración Estimada" value="60 minutos" fullWidth InputProps={{ readOnly: true }}/></GridLegacy>
            <GridLegacy item xs={12}><TextField label="Descripción del Problema (Opcional)" fullWidth multiline rows={3}/></GridLegacy>
            <GridLegacy item xs={12}><TextField label="Notas Adicionales" fullWidth multiline rows={2}/></GridLegacy>
          </GridLegacy>

          {/* Asignación automática */}
          <Box sx={{ mt: 2, p: 2, borderRadius: 2, border: '1px solid #a5d6a7', background: 'linear-gradient(135deg, #e8f5e8, #c8e6c9)' }}>
            <Typography sx={{ color:'#2e7d32', fontWeight:700, mb:1 }}>Asignación Automática de Mecánico</Typography>
            <Paper sx={{ p:1.5, display:'flex', alignItems:'center', gap:2, border:'1px solid #4caf50', background:'rgba(255,255,255,0.8)' }}>
              <Avatar sx={{ bgcolor:'#4caf50' }}>CR</Avatar>
              <Box sx={{ flex:1 }}>
                <Typography sx={{ fontWeight:700 }}>Carlos Rodríguez</Typography>
                <Typography variant="body2" sx={{ color:'#7f8c8d' }}>Especialista en Motor y Frenos</Typography>
                <Typography variant="caption" sx={{ color:'#27ae60' }}>Disponible en el horario seleccionado</Typography>
              </Box>
              <Chip label="Sugerido" color="success"/>
            </Paper>
          </Box>

          {/* Resumen */}
          <Box sx={{ mt: 2, p:2, borderRadius:2, border:'1px solid #ffb74d', background:'linear-gradient(135deg, #fff3e0, #ffcc80)' }}>
            <Typography sx={{ color:'#ef6c00', fontWeight:700, mb:1 }}>Resumen de la Cita</Typography>
            <GridLegacy container spacing={1}>
              {[
                ['Cliente','Juan Pérez'],
                ['Vehículo','Toyota Corolla (ABC-123)'],
                ['Servicio','Cambio de aceite'],
                ['Fecha y Hora','2025-10-25 a las 10:00'],
                ['Mecánico','Carlos Rodríguez'],
                ['Duración','60 minutos'],
              ].map(([l,v]) => (
                <GridLegacy item xs={12} sm={6} key={l as string}>
                  <Stack direction="row" justifyContent="space-between"><Typography sx={{ color:'#bf360c', fontWeight:600 }}>{l}</Typography><Typography sx={{ fontWeight:700 }}>{v}</Typography></Stack>
                </GridLegacy>
              ))}
            </GridLegacy>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDlgSchedule(false)}>Cancelar</Button>
          <Button variant="contained" sx={{ bgcolor: '#e37239', ':hover': { bgcolor: '#c4683a' } }} onClick={() => { setDlgSchedule(false); setSnack({open:true, msg:'¡Cita agendada exitosamente! (simulado)', sev:'success'}); }}>Confirmar Cita</Button>
        </DialogActions>
      </Dialog>

      {/* Reasignar Cita - listado */}
      <Dialog open={dlgReassign} onClose={() => setDlgReassign(false)} maxWidth="lg" fullWidth>
        <DialogTitle>Reasignar Cita</DialogTitle>
        <DialogContent dividers>
          <TextField fullWidth placeholder="Cliente, placa, servicio..." InputProps={{ startAdornment: <SearchIcon/> }} sx={{ mb: 2 }}/>
          <Stack spacing={1.5}>
            {[
              { client:'Juan Pérez', status:'Pendiente', vehicle:'Toyota Corolla (ABC-123)', service:'Cambio de aceite', datetime:'Vie 27 Sep 2024 - 10:00 AM', mechanic:'Carlos Rodríguez' },
              { client:'María García', status:'Programada', vehicle:'Honda Civic (XYZ-789)', service:'Servicio de frenos', datetime:'Lun 30 Sep 2024 - 2:00 PM', mechanic:'Ana Fernández' },
            ].map((a, idx) => (
              <Paper key={idx} onClick={() => selectAppointmentToReassign(a)} sx={{ p:2, border:'2px solid #ecf0f1', borderRadius:2, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'space-between', ':hover':{ borderColor:'#3498db', transform:'translateY(-2px)' } }}>
                <Box>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb:1 }}>
                    <Typography sx={{ fontWeight:700, fontSize:18 }}>{a.client}</Typography>
                    <Chip label={a.status} color={a.status==='Pendiente'?'warning':'info'} size="small"/>
                  </Stack>
                  <GridLegacy container spacing={1}>
                    {[
                      ['Vehículo', a.vehicle],
                      ['Servicio', a.service],
                      ['Fecha actual', a.datetime],
                      ['Mecánico', a.mechanic],
                    ].map(([l,v]) => (
                      <GridLegacy item xs={12} sm={6} md={6} key={l as string}>
                        <Stack direction="row" spacing={1}><Typography variant="caption" sx={{ color:'#7f8c8d', minWidth:80 }}>{l}:</Typography><Typography variant="caption" sx={{ fontWeight:600 }}>{v}</Typography></Stack>
                      </GridLegacy>
                    ))}
                  </GridLegacy>
                </Box>
                <IconButton sx={{ bgcolor:'rgba(52,152,219,0.1)' }}><EditCalendarIcon color="primary"/></IconButton>
              </Paper>
            ))}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDlgReassign(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>

      {/* Reasignar Cita - formulario */}
      <Dialog open={dlgReassignForm.open} onClose={() => setDlgReassignForm({open:false})} maxWidth="sm" fullWidth>
        <DialogTitle>Modificar Fecha y Hora</DialogTitle>
        <DialogContent dividers>
          {dlgReassignForm.data && (
            <Box sx={{ mb:2, p:2, borderRadius:2, background:'linear-gradient(135deg, #e3f2fd, #bbdefb)' }}>
              <Typography sx={{ color:'#1976d2', fontWeight:700, mb:1 }}>Cita Seleccionada</Typography>
              <GridLegacy container spacing={1}>
                {[
                  ['Cliente', dlgReassignForm.data.client],
                  ['Servicio', dlgReassignForm.data.service],
                  ['Fecha actual', dlgReassignForm.data.datetime],
                  ['Mecánico', dlgReassignForm.data.mechanic],
                ].map(([l,v]) => (
                  <GridLegacy item xs={12} sm={6} key={l as string}>
                    <Typography variant="caption" sx={{ color:'#1976d2', fontWeight:600 }}>{l}</Typography>
                    <Typography sx={{ fontWeight:700 }}>{v}</Typography>
                  </GridLegacy>
                ))}
              </GridLegacy>
            </Box>
          )}
          <Stack spacing={2}>
            <TextField type="date" label="Nueva Fecha*" InputLabelProps={{ shrink: true }} fullWidth/>
            <FormControl fullWidth>
              <InputLabel>Nueva Hora*</InputLabel>
              <Select label="Nueva Hora*" defaultValue="08:00">
                {['08:00','09:00','10:00','11:00','14:00','15:00','16:00','17:00'].map(h => <MenuItem key={h} value={h}>{h}</MenuItem>)}
              </Select>
            </FormControl>
            <TextField label="Motivo de la Reasignación (Opcional)" fullWidth multiline rows={3}/>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ bgcolor:'#fff3cd', border:'1px solid #ffeaa7', p:1.5, borderRadius:1 }}>
              <WarningAmberIcon/> <Typography variant="body2">El cliente será notificado automáticamente del cambio por email.</Typography>
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDlgReassignForm({open:false})}>Cancelar</Button>
          <Button variant="contained" sx={{ bgcolor: '#e37239', ':hover': { bgcolor: '#c4683a' } }} onClick={() => { setDlgReassignForm({open:false}); setSnack({open:true, msg:'Reasignación confirmada', sev:'success'}); }}>Confirmar Reasignación</Button>
        </DialogActions>
      </Dialog>

      {/* Cancelar Cita - listado */}
      <Dialog open={dlgCancel} onClose={() => setDlgCancel(false)} maxWidth="lg" fullWidth>
        <DialogTitle>Cancelar Cita</DialogTitle>
        <DialogContent dividers>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2, bgcolor:'#f8d7da', border:'1px solid #f5c6cb', p:1.5, borderRadius:1 }}>
            <WarningAmberIcon color="error"/> <Typography>La cancelación de citas es definitiva y no se puede deshacer. El cliente será notificado automáticamente.</Typography>
          </Stack>
          <TextField fullWidth placeholder="Cliente, placa, servicio..." InputProps={{ startAdornment: <SearchIcon/> }} sx={{ mb: 2 }}/>
          <Stack spacing={1.5}>
            {[
              { client:'Juan Pérez', vehicle:'Toyota Corolla (ABC-123)', service:'Cambio de aceite', date:'Vie 27 Sep 2024 - 10:00 AM', mechanic:'Carlos Rodríguez', status:'Pendiente' },
              { client:'María García', vehicle:'Honda Civic (XYZ-789)', service:'Servicio de frenos', date:'Lun 30 Sep 2024 - 2:00 PM', mechanic:'Ana Fernández', status:'Programada' },
            ].map((a, idx) => (
              <Paper key={idx} onClick={() => selectAppointmentToCancel(a)} sx={{ p:2, border:'2px solid #ecf0f1', borderRadius:2, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'space-between', ':hover':{ bgcolor:'#f8d7da', borderColor:'#f5c6cb' } }}>
                <Box>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb:1 }}>
                    <Typography sx={{ fontWeight:700, fontSize:18 }}>{a.client}</Typography>
                    <Chip label={a.status} color={a.status==='Pendiente'?'warning':'info'} size="small"/>
                  </Stack>
                  <GridLegacy container spacing={1}>
                    {[
                      ['Vehículo', a.vehicle],
                      ['Servicio', a.service],
                      ['Fecha', a.date],
                      ['Mecánico', a.mechanic],
                    ].map(([l,v]) => (
                      <GridLegacy item xs={12} sm={6} md={6} key={l as string}>
                        <Stack direction="row" spacing={1}><Typography variant="caption" sx={{ color:'#7f8c8d', minWidth:80 }}>{l}:</Typography><Typography variant="caption" sx={{ fontWeight:600 }}>{v}</Typography></Stack>
                      </GridLegacy>
                    ))}
                  </GridLegacy>
                </Box>
                <IconButton sx={{ bgcolor:'rgba(231,76,60,0.1)' }}><CloseIcon sx={{ color:'#e74c3c' }}/></IconButton>
              </Paper>
            ))}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDlgCancel(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>

      {/* Confirmar Cancelación */}
      <Dialog open={dlgConfirmCancel.open} onClose={() => setDlgConfirmCancel({open:false})} maxWidth="sm" fullWidth>
        <DialogTitle>Confirmar Cancelación</DialogTitle>
        <DialogContent dividers>
          {dlgConfirmCancel.data && (
            <Box sx={{ mb:2, p:2, borderRadius:2, background:'linear-gradient(135deg, #f8d7da, #f5c6cb)', border:'1px solid #e74c3c' }}>
              <Typography sx={{ color:'#c0392b', fontWeight:700, mb:1 }}>Cita a Cancelar</Typography>
              <GridLegacy container spacing={1}>
                {[
                  ['Cliente', dlgConfirmCancel.data.client],
                  ['Servicio', dlgConfirmCancel.data.service],
                  ['Fecha', dlgConfirmCancel.data.date],
                  ['Mecánico', dlgConfirmCancel.data.mechanic],
                ].map(([l,v]) => (
                  <GridLegacy item xs={12} sm={6} key={l as string}>
                    <Typography variant="caption" sx={{ color:'#c0392b', fontWeight:600 }}>{l}</Typography>
                    <Typography sx={{ fontWeight:700 }}>{v}</Typography>
                  </GridLegacy>
                ))}
              </GridLegacy>
            </Box>
          )}
          <Stack spacing={2}>
            <FormControl fullWidth>
              <InputLabel>Motivo de Cancelación*</InputLabel>
              <Select label="Motivo de Cancelación*" defaultValue="client-request">
                <MenuItem value="client-request">Solicitud del cliente</MenuItem>
                <MenuItem value="mechanic-unavailable">Mecánico no disponible</MenuItem>
                <MenuItem value="vehicle-ready">Vehículo ya fue reparado</MenuItem>
                <MenuItem value="duplicate">Cita duplicada</MenuItem>
                <MenuItem value="no-show">Cliente no se presentó</MenuItem>
                <MenuItem value="other">Otro motivo</MenuItem>
              </Select>
            </FormControl>
            <TextField label="Detalles Adicionales (Opcional)" fullWidth multiline rows={3}/>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ bgcolor:'#f8d7da', border:'1px solid #f5c6cb', p:1.5, borderRadius:1 }}>
              <WarningAmberIcon color="error"/> <Typography variant="body2"><strong>Esta acción no se puede deshacer.</strong></Typography>
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDlgConfirmCancel({open:false})}>Cancelar</Button>
          <Button variant="contained" color="error" onClick={() => { setDlgConfirmCancel({open:false}); setSnack({open:true, msg:'Cita cancelada', sev:'success'}); }}>Confirmar Cancelación</Button>
        </DialogActions>
      </Dialog>

      {/* Crear Servicio */}
      <Dialog open={dlgCreateService} onClose={() => setDlgCreateService(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Crear Nuevo Servicio</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2}>
            <TextField label="Nombre del Servicio*" fullWidth/>
            <GridLegacy container spacing={2}>
              <GridLegacy item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Categoría*</InputLabel>
                  <Select label="Categoría*" defaultValue="mantenimiento">
                    {['mantenimiento','motor','frenos','suspension','electrico','transmision','carroceria','otros'].map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                  </Select>
                </FormControl>
              </GridLegacy>
              <GridLegacy item xs={12} md={6}><TextField type="number" label="Duración Estimada (minutos)*" fullWidth/></GridLegacy>
            </GridLegacy>
            <GridLegacy container spacing={2}>
              <GridLegacy item xs={12} md={6}><TextField type="number" label="Precio Base ($)*" fullWidth/></GridLegacy>
              <GridLegacy item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Tipo de Vehículo</InputLabel>
                  <Select label="Tipo de Vehículo" defaultValue="todos">
                    {['todos','carro','moto','camion'].map(v => <MenuItem key={v} value={v}>{v}</MenuItem>)}
                  </Select>
                </FormControl>
              </GridLegacy>
            </GridLegacy>
            <TextField label="Descripción del Servicio*" fullWidth multiline rows={3}/>
            <TextField label="Materiales/Repuestos Incluidos" fullWidth multiline rows={2}/>
            <GridLegacy container spacing={2}>
              <GridLegacy item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Especialidad Requerida</InputLabel>
                  <Select label="Especialidad Requerida" defaultValue="general">
                    {['general','motor','frenos','electrico','suspension','transmision'].map(v => <MenuItem key={v} value={v}>{v}</MenuItem>)}
                  </Select>
                </FormControl>
              </GridLegacy>
              <GridLegacy item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Estado del Servicio</InputLabel>
                  <Select label="Estado del Servicio" defaultValue="activo">
                    <MenuItem value="activo">Activo</MenuItem>
                    <MenuItem value="inactivo">Inactivo</MenuItem>
                  </Select>
                </FormControl>
              </GridLegacy>
            </GridLegacy>

            {/* Vista previa */}
            <Box sx={{ p:2, borderRadius:2, border:'1px solid #a5d6a7', background:'linear-gradient(135deg, #e8f5e8, #c8e6c9)' }}>
              <Typography sx={{ color:'#2e7d32', fontWeight:700, mb:1 }}>Vista Previa del Servicio</Typography>
              <Paper sx={{ p:1.5, border:'1px solid #a5d6a7', background:'rgba(255,255,255,0.8)' }}>
                <Stack direction="row" justifyContent="space-between" sx={{ mb:1, pb:1, borderBottom:'1px solid #c8e6c9' }}>
                  <Typography sx={{ fontWeight:700 }}>Cambio de aceite y filtro</Typography>
                  <Typography sx={{ fontWeight:800, color:'#27ae60' }}>$80.000</Typography>
                </Stack>
                <GridLegacy container spacing={1} sx={{ mb:1 }}>
                  {[
                    ['Categoría','Mantenimiento Preventivo'],
                    ['Duración','60 min'],
                    ['Vehículos','Todos'],
                  ].map(([l,v]) => (
                    <GridLegacy item xs={12} sm={4} key={l as string}><Typography variant="caption" sx={{ color:'#7f8c8d', fontWeight:500 }}>{l}</Typography><Typography sx={{ fontWeight:700 }}>{v}</Typography></GridLegacy>
                  ))}
                </GridLegacy>
                <Typography variant="body2" sx={{ fontStyle:'italic' }}>Cambio completo de aceite del motor con filtro nuevo. Incluye revisión de niveles de líquidos.</Typography>
              </Paper>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDlgCreateService(false)}>Cancelar</Button>
          <Button variant="contained" sx={{ bgcolor: '#e37239', ':hover': { bgcolor: '#c4683a' } }} onClick={() => { setDlgCreateService(false); setSnack({open:true, msg:'Servicio creado', sev:'success'}); }}>Crear Servicio</Button>
        </DialogActions>
      </Dialog>

      {/* Catálogo de Servicios (simple) */}
      <Dialog open={dlgServiceCatalog} onClose={() => setDlgServiceCatalog(false)} maxWidth="lg" fullWidth>
        <DialogTitle>Catálogo de Servicios</DialogTitle>
        <DialogContent dividers>
          <TextField fullWidth placeholder="Buscar servicios (nombre o categoría)" InputProps={{ startAdornment: <SearchIcon/> }} sx={{ mb: 2 }}/>
          <GridLegacy container spacing={2}>
            {[
              ['Cambio de aceite y filtro','$80.000','Mantenimiento Preventivo','60 min','Activo'],
              ['Servicio de frenos completo','$250.000','Sistema de Frenos','120 min','Activo'],
              ['Revisión técnicomecánica','$150.000','Mantenimiento Preventivo','90 min','Activo'],
            ].map(([name,price,cat,dur,status]) => (
              <GridLegacy item xs={12} md={6} key={name as string}>
                <Paper sx={{ p:2, border:'2px solid #ecf0f1', borderRadius:2, position:'relative', ':hover':{ borderColor:'#3498db', transform:'translateY(-2px)' } }}>
                  <Typography sx={{ fontWeight:700 }}>{name}</Typography>
                  <Typography sx={{ fontWeight:800, color:'#27ae60', mb:1 }}>{price}</Typography>
                  <Stack direction="row" spacing={2} sx={{ mb:1, color:'#7f8c8d' }}>
                    <Box>
                      <Typography variant="caption" sx={{ color:'#2c3e50', fontWeight:600 }}>Categoría</Typography>
                      <Typography variant="caption" display="block">{cat}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ color:'#2c3e50', fontWeight:600 }}>Duración</Typography>
                      <Typography variant="caption" display="block">{dur}</Typography>
                    </Box>
                  </Stack>
                  <Typography variant="body2" sx={{ color:'#7f8c8d' }}>Descripción breve del servicio…</Typography>
                  <Chip label={status} size="small" color={status==='Activo'?'success':'default'} sx={{ position:'absolute', top:8, right:8 }}/>
                </Paper>
              </GridLegacy>
            ))}
          </GridLegacy>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDlgServiceCatalog(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>

      {/* Eliminar Servicio - listado */}
      <Dialog open={dlgDeleteService} onClose={() => setDlgDeleteService(false)} maxWidth="lg" fullWidth>
        <DialogTitle>Eliminar Servicio</DialogTitle>
        <DialogContent dividers>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2, bgcolor:'#f8d7da', border:'1px solid #f5c6cb', p:1.5, borderRadius:1 }}>
            <WarningAmberIcon color="error"/> <Typography>La eliminación de servicios es definitiva y no se puede deshacer. Esto afectará las citas programadas.</Typography>
          </Stack>
          <TextField fullWidth placeholder="Buscar servicio" InputProps={{ startAdornment: <SearchIcon/> }} sx={{ mb: 2 }}/>
          <Stack spacing={1.5}>
            {[
              ['Cambio de aceite y filtro','$80.000','Mantenimiento Preventivo','60 min','3 citas activas'],
              ['Servicio de frenos completo','$250.000','Sistema de Frenos','120 min','2 citas activas'],
            ].map(([name, price, cat, dur, meta]) => (
              <Paper key={name as string} onClick={() => confirmDeleteService({name, price})} sx={{ p:2, border:'2px solid #ecf0f1', borderRadius:2, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'space-between', ':hover':{ bgcolor:'#f8d7da', borderColor:'#f5c6cb' } }}>
                <Box>
                  <Typography sx={{ fontWeight:700 }}>{name}</Typography>
                  <GridLegacy container spacing={1}>
                    {[
                      ['Precio', price],
                      ['Categoría', cat],
                      ['Duración', dur],
                      ['Citas programadas', meta],
                    ].map(([l,v]) => (
                      <GridLegacy item xs={12} sm={6} md={3} key={l as string}><Typography variant="caption" sx={{ color:'#7f8c8d' }}>{l}:</Typography> <Typography variant="caption" sx={{ fontWeight:600 }}>{v}</Typography></GridLegacy>
                    ))}
                  </GridLegacy>
                </Box>
                <DeleteForeverIcon sx={{ color:'#e74c3c' }}/>
              </Paper>
            ))}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDlgDeleteService(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>

      {/* Confirmar Eliminación de Servicio */}
      <Dialog open={dlgConfirmDeleteService.open} onClose={() => setDlgConfirmDeleteService({open:false, data:undefined})} maxWidth="sm" fullWidth>
        <DialogTitle>Confirmar Eliminación de Servicio</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ p:2, borderRadius:2, background:'linear-gradient(135deg, #f8d7da, #f5c6cb)', border:'1px solid #e74c3c' }}>
            <Typography sx={{ color:'#c0392b', fontWeight:700, mb:1 }}>Servicio a Eliminar</Typography>
            <GridLegacy container spacing={1}>
              <GridLegacy item xs={12} sm={6}><Typography variant="caption" sx={{ color:'#c0392b', fontWeight:600 }}>Servicio:</Typography><Typography sx={{ fontWeight:700 }}>{dlgConfirmDeleteService.data?.name || '-'}</Typography></GridLegacy>
              <GridLegacy item xs={12} sm={6}><Typography variant="caption" sx={{ color:'#c0392b', fontWeight:600 }}>Precio:</Typography><Typography sx={{ fontWeight:700 }}>{dlgConfirmDeleteService.data?.price || '-'}</Typography></GridLegacy>
              <GridLegacy item xs={12}><Typography variant="caption" sx={{ color:'#c0392b', fontWeight:600 }}>Estado:</Typography> <Chip size="small" label="Activo" color="success"/></GridLegacy>
            </GridLegacy>
          </Box>
          <GridLegacy container spacing={2} sx={{ mt:1 }}>
            <GridLegacy item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Motivo de Eliminación*</InputLabel>
                <Select label="Motivo de Eliminación*" defaultValue="obsolete">
                  {['obsolete','no-demand','equipment-unavailable','cost-ineffective','duplicate','other'].map(v => <MenuItem key={v} value={v}>{v}</MenuItem>)}
                </Select>
              </FormControl>
            </GridLegacy>
            <GridLegacy item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>¿Qué hacer con las citas?*</InputLabel>
                <Select label="¿Qué hacer con las citas?*" defaultValue="cancel">
                  <MenuItem value="cancel">Cancelar citas automáticamente</MenuItem>
                  <MenuItem value="reassign">Reasignar a servicio similar</MenuItem>
                  <MenuItem value="contact">Contactar clientes manualmente</MenuItem>
                </Select>
              </FormControl>
            </GridLegacy>
            <GridLegacy item xs={12}><TextField label="Notas Adicionales" fullWidth multiline rows={2}/></GridLegacy>
          </GridLegacy>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDlgConfirmDeleteService({open:false, data:undefined})}>Cancelar</Button>
          <Button variant="contained" color="error" onClick={executeDeleteService}>Eliminar Servicio</Button>
        </DialogActions>
      </Dialog>

      {/* Proveedores */}
      <Dialog open={dlgProviders} onClose={() => setDlgProviders(false)} maxWidth="lg" fullWidth>
        <DialogTitle>Gestión de Proveedores</DialogTitle>
        <DialogContent dividers>
          <TextField fullWidth placeholder="Nombre, NIT o contacto..." InputProps={{ startAdornment: <SearchIcon/> }} sx={{ mb: 2 }}/>
          <Stack spacing={1.5}>
            {[
              { id:1, name:'Repuestos Automotrices S.A.S', status:'Activo', nit:'900123456-7', contact:'Carlos Méndez', phone:'3001234567', email:'ventas@repuestos.com', address:'Calle 45 #23-10, Pereira', products:'Filtros, Aceites, Bujías' },
              { id:2, name:'Frenos y Suspensiones Ltda', status:'Activo', nit:'800987654-3', contact:'Ana Rodríguez', phone:'3109876543', email:'contacto@frenosysuspensiones.com', address:'Av. 30 de Agosto #15-20', products:'Pastillas, Discos, Amortiguadores' },
            ].map(p => (
              <Paper key={p.id} sx={{ p:2, border:'2px solid #ecf0f1', borderRadius:2, ':hover':{ borderColor:'#3498db', transform:'translateY(-2px)' } }}>
                <Stack direction="row" justifyContent="space-between" sx={{ mb:1, pb:1, borderBottom:'2px solid #ecf0f1' }}>
                  <Typography sx={{ fontWeight:700 }}>{p.name}</Typography>
                  <Chip label={p.status} color="success" size="small"/>
                </Stack>
                <GridLegacy container spacing={1} sx={{ mb:1 }}>
                  {[
                    ['NIT',p.nit],['Contacto',p.contact],['Teléfono',p.phone],['Email',p.email],['Dirección',p.address],['Productos',p.products]
                  ].map(([l,v]) => (
                    <GridLegacy item xs={12} sm={6} key={l as string}><Typography variant="caption" sx={{ color:'#7f8c8d', fontWeight:500 }}>{l}:</Typography> <Typography variant="caption" sx={{ fontWeight:600 }}>{v}</Typography></GridLegacy>
                  ))}
                </GridLegacy>
                <Stack direction="row" justifyContent="flex-end" spacing={1}>
                  <Button onClick={() => openModifyProvider(p)}>Modificar</Button>
                  <Button color="error" onClick={() => confirmDeleteProvider(p.name)}>Eliminar</Button>
                </Stack>
              </Paper>
            ))}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDlgProviders(false)}>Cerrar</Button>
          <Button variant="contained" sx={{ bgcolor:'#e37239', ':hover':{ bgcolor:'#c4683a' } }} onClick={() => setDlgRegisterProvider(true)}>Registrar Nuevo Proveedor</Button>
        </DialogActions>
      </Dialog>

      {/* Registrar Proveedor */}
      <Dialog open={dlgRegisterProvider} onClose={() => setDlgRegisterProvider(false)} maxWidth="md" fullWidth>
        <DialogTitle>Registrar Nuevo Proveedor</DialogTitle>
        <DialogContent dividers>
          <GridLegacy container spacing={2}>
            <GridLegacy item xs={12} md={6}><TextField label="Nombre de la Empresa*" fullWidth/></GridLegacy>
            <GridLegacy item xs={12} md={6}><TextField label="NIT*" fullWidth/></GridLegacy>
            <GridLegacy item xs={12} md={6}><TextField label="Nombre del Contacto*" fullWidth/></GridLegacy>
            <GridLegacy item xs={12} md={6}><TextField label="Teléfono*" fullWidth/></GridLegacy>
            <GridLegacy item xs={12} md={6}><TextField type="email" label="Email*" fullWidth/></GridLegacy>
            <GridLegacy item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Estado*</InputLabel>
                <Select label="Estado*" defaultValue="active">
                  <MenuItem value="active">Activo</MenuItem>
                  <MenuItem value="inactive">Inactivo</MenuItem>
                </Select>
              </FormControl>
            </GridLegacy>
            <GridLegacy item xs={12}><TextField label="Dirección*" fullWidth/></GridLegacy>
            <GridLegacy item xs={12}><TextField label="Productos que Suministra*" fullWidth multiline rows={2}/></GridLegacy>
            <GridLegacy item xs={12}><TextField label="Notas Adicionales" fullWidth multiline rows={2}/></GridLegacy>
          </GridLegacy>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDlgRegisterProvider(false)}>Cancelar</Button>
          <Button variant="contained" sx={{ bgcolor:'#e37239', ':hover':{ bgcolor:'#c4683a' } }} onClick={() => { setDlgRegisterProvider(false); setSnack({open:true, msg:'Proveedor registrado', sev:'success'}); }}>Registrar Proveedor</Button>
        </DialogActions>
      </Dialog>

      {/* Modificar Proveedor */}
      <Dialog open={dlgModifyProvider.open} onClose={() => setDlgModifyProvider({open:false})} maxWidth="md" fullWidth>
        <DialogTitle>Modificar Proveedor</DialogTitle>
        <DialogContent dividers>
          <GridLegacy container spacing={2}>
            <GridLegacy item xs={12} md={6}><TextField label="Nombre de la Empresa*" fullWidth defaultValue={dlgModifyProvider.data?.name}/></GridLegacy>
            <GridLegacy item xs={12} md={6}><TextField label="NIT*" fullWidth defaultValue={dlgModifyProvider.data?.nit}/></GridLegacy>
            <GridLegacy item xs={12} md={6}><TextField label="Nombre del Contacto*" fullWidth defaultValue={dlgModifyProvider.data?.contact}/></GridLegacy>
            <GridLegacy item xs={12} md={6}><TextField label="Teléfono*" fullWidth defaultValue={dlgModifyProvider.data?.phone}/></GridLegacy>
            <GridLegacy item xs={12} md={6}><TextField type="email" label="Email*" fullWidth defaultValue={dlgModifyProvider.data?.email}/></GridLegacy>
            <GridLegacy item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Estado*</InputLabel>
                <Select label="Estado*" defaultValue={dlgModifyProvider.data ? 'active' : 'inactive'}>
                  <MenuItem value="active">Activo</MenuItem>
                  <MenuItem value="inactive">Inactivo</MenuItem>
                </Select>
              </FormControl>
            </GridLegacy>
            <GridLegacy item xs={12}><TextField label="Dirección*" fullWidth defaultValue={dlgModifyProvider.data?.address}/></GridLegacy>
            <GridLegacy item xs={12}><TextField label="Productos que Suministra*" fullWidth multiline rows={2} defaultValue={dlgModifyProvider.data?.products}/></GridLegacy>
            <GridLegacy item xs={12}><TextField label="Notas Adicionales" fullWidth multiline rows={2}/></GridLegacy>
          </GridLegacy>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDlgModifyProvider({open:false})}>Cancelar</Button>
          <Button variant="contained" sx={{ bgcolor:'#e37239', ':hover':{ bgcolor:'#c4683a' } }} onClick={() => { setDlgModifyProvider({open:false}); setSnack({open:true, msg:'Proveedor actualizado', sev:'success'}); }}>Guardar Cambios</Button>
        </DialogActions>
      </Dialog>

      {/* Confirmar Eliminación de Proveedor */}
      <Dialog open={dlgConfirmDeleteProvider.open} onClose={() => setDlgConfirmDeleteProvider({open:false})} maxWidth="xs" fullWidth>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent dividers>
          <Typography textAlign="center">¿Eliminar proveedor <strong>{dlgConfirmDeleteProvider.name}</strong>?</Typography>
          <Typography variant="body2" sx={{ mt:1, textAlign:'center' }}>Se eliminarán también todos los registros asociados.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDlgConfirmDeleteProvider({open:false})}>Cancelar</Button>
          <Button variant="contained" color="error" onClick={executeDeleteProvider}>Eliminar Definitivamente</Button>
        </DialogActions>
      </Dialog>

      {/* Repuestos */}
      <Dialog open={dlgSpareparts} onClose={() => setDlgSpareparts(false)} maxWidth="lg" fullWidth>
        <DialogTitle>Gestión de Repuestos</DialogTitle>
        <DialogContent dividers>
          <TextField fullWidth placeholder="Nombre, código o proveedor..." InputProps={{ startAdornment: <SearchIcon/> }} sx={{ mb: 2 }}/>
          <Stack spacing={1.5}>
            {[
              { id:1, name:'Filtro de Aceite Universal', price:'$25,000', code:'FLT-001', stock:'45', min:'10', provider:'Repuestos Automotrices S.A.S', category:'Filtros', stockBadge:<Chip label="Stock Alto" color="success" size="small"/> },
              { id:2, name:'Pastillas de Freno Delanteras', price:'$120,000', code:'FRN-002', stock:'8', min:'5', provider:'Frenos y Suspensiones Ltda', category:'Frenos', stockBadge:<Chip label="Stock Medio" color="warning" size="small"/> },
              { id:3, name:'Aceite Motor 5W-30 Sintético', price:'$85,000', code:'ACT-003', stock:'3', min:'8', provider:'Distribuidora de Lubricantes', category:'Lubricantes', stockBadge:<Chip label="Stock Bajo ⚠️" color="error" size="small"/> },
            ].map(s => (
              <Paper key={s.id} sx={{ p:2, border:'2px solid #ecf0f1', borderRadius:2, ':hover':{ borderColor:'#27ae60', transform:'translateY(-2px)' } }}>
                <Stack direction="row" justifyContent="space-between" sx={{ mb:1, pb:1, borderBottom:'2px solid #ecf0f1' }}>
                  <Typography sx={{ fontWeight:700 }}>{s.name}</Typography>
                  <Typography sx={{ fontWeight:800, color:'#27ae60' }}>{s.price}</Typography>
                </Stack>
                <GridLegacy container spacing={1} sx={{ mb:1 }}>
                  {[
                    ['Código',s.code],['Stock',`${s.stock} u`],['Stock mínimo',`${s.min} u`],['Proveedor',s.provider],['Categoría',s.category],['Estado de Stock', s.stockBadge]
                  ].map(([l,v]) => (
                    <GridLegacy item xs={12} sm={6} md={4} key={l as string}>
                      <Typography variant="caption" sx={{ color:'#7f8c8d', fontWeight:500 }}>{l}:</Typography> <Typography variant="caption" sx={{ fontWeight:600 }}>{v as any}</Typography>
                    </GridLegacy>
                  ))}
                </GridLegacy>
                <Stack direction="row" justifyContent="flex-end" spacing={1}>
                  <Button onClick={() => openModifySparepart(s)}>Modificar</Button>
                  <Button color="error" onClick={() => confirmDeleteSparepart(s.name)}>Eliminar</Button>
                </Stack>
              </Paper>
            ))}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDlgSpareparts(false)}>Cerrar</Button>
          <Button variant="contained" sx={{ bgcolor:'#e37239', ':hover':{ bgcolor:'#c4683a' } }} onClick={() => setDlgRegisterSparepart(true)}>Registrar Nuevo Repuesto</Button>
        </DialogActions>
      </Dialog>

      {/* Registrar Repuesto */}
      <Dialog open={dlgRegisterSparepart} onClose={() => setDlgRegisterSparepart(false)} maxWidth="md" fullWidth>
        <DialogTitle>Registrar Nuevo Repuesto</DialogTitle>
        <DialogContent dividers>
          <GridLegacy container spacing={2}>
            <GridLegacy item xs={12} md={6}><TextField label="Nombre del Repuesto*" fullWidth/></GridLegacy>
            <GridLegacy item xs={12} md={6}><TextField label="Código*" fullWidth/></GridLegacy>
            <GridLegacy item xs={12} md={6}><TextField type="number" label="Precio Unitario*" fullWidth/></GridLegacy>
            <GridLegacy item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Categoría*</InputLabel>
                <Select label="Categoría*" defaultValue="filtros">
                  {['filtros','frenos','lubricantes','encendido','suspension','electrico','motor','otros'].map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                </Select>
              </FormControl>
            </GridLegacy>
            <GridLegacy item xs={12} md={6}><TextField type="number" label="Stock Actual*" fullWidth/></GridLegacy>
            <GridLegacy item xs={12} md={6}><TextField type="number" label="Stock Mínimo*" fullWidth/></GridLegacy>
            <GridLegacy item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Proveedor*</InputLabel>
                <Select label="Proveedor*" defaultValue={1}>
                  <MenuItem value={1}>Repuestos Automotrices S.A.S</MenuItem>
                  <MenuItem value={2}>Frenos y Suspensiones Ltda</MenuItem>
                  <MenuItem value={3}>Distribuidora de Lubricantes</MenuItem>
                </Select>
              </FormControl>
            </GridLegacy>
            <GridLegacy item xs={12}><TextField label="Descripción*" fullWidth multiline rows={3}/></GridLegacy>
            <GridLegacy item xs={12}><TextField label="Notas Adicionales" fullWidth multiline rows={2}/></GridLegacy>
          </GridLegacy>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDlgRegisterSparepart(false)}>Cancelar</Button>
          <Button variant="contained" sx={{ bgcolor:'#e37239', ':hover':{ bgcolor:'#c4683a' } }} onClick={() => { setDlgRegisterSparepart(false); setSnack({open:true, msg:'Repuesto registrado', sev:'success'}); }}>Registrar Repuesto</Button>
        </DialogActions>
      </Dialog>

      {/* Modificar Repuesto */}
      <Dialog open={dlgModifySparepart.open} onClose={() => setDlgModifySparepart({open:false})} maxWidth="md" fullWidth>
        <DialogTitle>Modificar Repuesto</DialogTitle>
        <DialogContent dividers>
          <GridLegacy container spacing={2}>
            <GridLegacy item xs={12} md={6}><TextField label="Nombre del Repuesto*" fullWidth defaultValue={dlgModifySparepart.data?.name}/></GridLegacy>
            <GridLegacy item xs={12} md={6}><TextField label="Código*" fullWidth defaultValue={dlgModifySparepart.data?.code}/></GridLegacy>
            <GridLegacy item xs={12} md={6}><TextField type="number" label="Precio Unitario*" fullWidth defaultValue={dlgModifySparepart.data?.price?.replace(/[^0-9]/g,'')}/></GridLegacy>
            <GridLegacy item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Categoría*</InputLabel>
                <Select label="Categoría*" defaultValue={dlgModifySparepart.data ? 'filtros' : ''}>
                  {['filtros','frenos','lubricantes','encendido','suspension','electrico','motor','otros'].map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                </Select>
              </FormControl>
            </GridLegacy>
            <GridLegacy item xs={12} md={6}><TextField type="number" label="Stock Actual*" fullWidth defaultValue={dlgModifySparepart.data?.stock}/></GridLegacy>
            <GridLegacy item xs={12} md={6}><TextField type="number" label="Stock Mínimo*" fullWidth defaultValue={dlgModifySparepart.data?.min}/></GridLegacy>
            <GridLegacy item xs={12}><FormControl fullWidth><InputLabel>Proveedor*</InputLabel><Select label="Proveedor*" defaultValue={1}><MenuItem value={1}>Repuestos Automotrices S.A.S</MenuItem><MenuItem value={2}>Frenos y Suspensiones Ltda</MenuItem><MenuItem value={3}>Distribuidora de Lubricantes</MenuItem></Select></FormControl></GridLegacy>
            <GridLegacy item xs={12}><TextField label="Descripción*" fullWidth multiline rows={3}/></GridLegacy>
            <GridLegacy item xs={12}><TextField label="Notas Adicionales" fullWidth multiline rows={2}/></GridLegacy>
          </GridLegacy>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDlgModifySparepart({open:false})}>Cancelar</Button>
          <Button variant="contained" sx={{ bgcolor:'#e37239', ':hover':{ bgcolor:'#c4683a' } }} onClick={() => { setDlgModifySparepart({open:false}); setSnack({open:true, msg:'Repuesto actualizado', sev:'success'}); }}>Guardar Cambios</Button>
        </DialogActions>
      </Dialog>

      {/* Confirmar Eliminación de Repuesto */}
      <Dialog open={dlgConfirmDeleteSparepart.open} onClose={() => setDlgConfirmDeleteSparepart({open:false})} maxWidth="xs" fullWidth>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent dividers>
          <Typography textAlign="center">¿Eliminar repuesto <strong>{dlgConfirmDeleteSparepart.name}</strong>?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDlgConfirmDeleteSparepart({open:false})}>Cancelar</Button>
          <Button variant="contained" color="error" onClick={executeDeleteSparepart}>Eliminar Definitivamente</Button>
        </DialogActions>
      </Dialog>

      {/* Generar Reporte */}
      <Dialog open={dlgGenerateReport.open} onClose={() => setDlgGenerateReport({open:false, type:'citas'})} maxWidth="sm" fullWidth>
        <DialogTitle>Generar Reporte</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ p:2, borderRadius:2, border:'2px solid #3498db', background:'linear-gradient(135deg, #e3f2fd, #bbdefb)', mb:2 }}>
            <Typography sx={{ color:'#1976d2', fontWeight:700, mb:1 }}>📊 Reporte de {dlgGenerateReport.type}</Typography>
            <GridLegacy container spacing={1} sx={{ background:'rgba(255,255,255,0.8)', p:1, borderRadius:1 }}>
              <GridLegacy item xs={12} sm={6}><Typography variant="caption" sx={{ color:'#1976d2', fontWeight:600 }}>Tipo de Reporte:</Typography> <Typography variant="caption" sx={{ fontWeight:700, ml:0.5 }}>{dlgGenerateReport.type}</Typography></GridLegacy>
              <GridLegacy item xs={12} sm={6}><Typography variant="caption" sx={{ color:'#1976d2', fontWeight:600 }}>Generado por:</Typography> <Typography variant="caption" sx={{ fontWeight:700, ml:0.5 }}>Admin</Typography></GridLegacy>
              <GridLegacy item xs={12} sm={6}><Typography variant="caption" sx={{ color:'#1976d2', fontWeight:600 }}>Fecha de Generación:</Typography> <Typography variant="caption" sx={{ fontWeight:700, ml:0.5 }}>{new Date().toLocaleDateString()}</Typography></GridLegacy>
              <GridLegacy item xs={12} sm={6}><Typography variant="caption" sx={{ color:'#1976d2', fontWeight:600 }}>Registros Estimados:</Typography> <Typography variant="caption" sx={{ fontWeight:700, ml:0.5 }}>—</Typography></GridLegacy>
            </GridLegacy>
          </Box>

          <Typography sx={{ mb:1 }}>📅 Rango de Fechas</Typography>
          <GridLegacy container spacing={2} sx={{ mb:2 }}>
            <GridLegacy item xs={12} md={6}><TextField type="date" label="Fecha Inicio" fullWidth InputLabelProps={{ shrink: true }}/></GridLegacy>
            <GridLegacy item xs={12} md={6}><TextField type="date" label="Fecha Fin" fullWidth InputLabelProps={{ shrink: true }}/></GridLegacy>
          </GridLegacy>

          <Typography>Selecciona el formato de descarga:</Typography>
          <Stack direction="row" spacing={1} sx={{ mt:1 }}>
            <Chip icon={<PictureAsPdfIcon/>} label="PDF" color="primary" variant="outlined"/>
            <Chip icon={<TableViewIcon/>} label="Excel" color="primary" variant="outlined"/>
          </Stack>

          <Paper sx={{ mt:2, p:2, textAlign:'center', borderRadius:2, border:'2px solid #28a745', background:'linear-gradient(135deg, #d4edda, #c3e6cb)' }}>
            <DownloadIcon sx={{ fontSize: 36, color:'#28a745' }}/>
            <Typography sx={{ color:'#155724', fontWeight:600 }}>El reporte se descargará automáticamente al confirmar</Typography>
          </Paper>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDlgGenerateReport({open:false, type:'citas'})}>Cancelar</Button>
          <Button variant="contained" startIcon={<DownloadIcon/>} sx={{ bgcolor:'#e37239', ':hover':{ bgcolor:'#c4683a' } }} onClick={generateReportNow}>Generar y Descargar</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar open={snack.open} autoHideDuration={4000} onClose={() => setSnack(s => ({...s, open:false}))}>
        <Alert severity={snack.sev} sx={{ width: '100%' }}>{snack.msg}</Alert>
      </Snackbar>
    </Box>
  );
}
