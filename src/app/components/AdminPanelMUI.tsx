"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Grid from "@mui/material/Grid";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Container,
  Avatar,
  Button,
  Card,
  CardContent,
  Paper,
  Chip,
  Stack,
  TextField,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  IconButton,
  Tooltip,
  useMediaQuery
} from "@mui/material";
import { styled, ThemeProvider, createTheme } from "@mui/material/styles";
import LogoutIcon from "@mui/icons-material/Logout";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import DirectionsCarFilledIcon from "@mui/icons-material/DirectionsCarFilled";
import TwoWheelerIcon from "@mui/icons-material/TwoWheeler";
import EventIcon from "@mui/icons-material/Event";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CloseIcon from "@mui/icons-material/Close";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";


// Tema base con tipografía y radio similar al mockup
const theme = createTheme({
  typography: {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
  },
  shape: { borderRadius: 12 }
});

// Contenedores y superficies con gradientes equivalentes
const HeaderBar = styled(AppBar)(({ theme }) => ({
  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  backgroundImage: "linear-gradient(135deg, #2c3e50 0%, #3498db 100%)"
}));

const WelcomeSection = styled(Paper)(({ theme }) => ({
  background: "#c1d1e696",
  padding: theme.spacing(4),
  borderRadius: 12,
  boxShadow: "0 2px 20px rgba(0,0,0,0.08)"
}));

const StatCardRoot = styled(Card)(({ theme }) => ({
  backgroundImage: "linear-gradient(360deg, #0a334b 40%, #5981beef 100%)",
  color: "#e2edf5",
  textAlign: "center",
  padding: theme.spacing(2),
  borderRadius: 12,
  boxShadow: "0 2px 20px rgba(0,0,0,0.08)",
  transition: "transform 0.2s ease",
  '&:hover': { transform: 'translateY(-2px)' }
}));

const ModuleCardRoot = styled(Card)(({ theme }) => ({
  background: "#c1d1e696",
  borderRadius: 12,
  overflow: "hidden",
  boxShadow: "0 2px 20px rgba(0,0,0,0.08)",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  cursor: "pointer",
  '&:hover': { transform: 'translateY(-5px)', boxShadow: '0 5px 30px rgba(0,0,0,0.15)'}
}));

const ModuleHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  color: '#fff',
  backgroundImage: 'linear-gradient(135deg, #2c3e50 30%, #3498db 100%)'
}));

const GradientInfoBox = styled(Paper)(({ theme }) => ({
  backgroundImage: 'linear-gradient(135deg, #e3f2fd, #bbdefb)',
  borderRadius: 12,
  padding: theme.spacing(3),
  boxShadow: 'none'
}));

// Botones con estilos exactos del mockup
const GhostBtn = styled(Button)(({ theme }) => ({
  backgroundColor: '#eee7e1',
  color: '#2c3e50',
  textTransform: 'none',
  fontSize: '0.85rem',
  padding: '8px 14px',
  borderRadius: 6,
  '&:hover': { backgroundColor: '#dad6d3', transform: 'translateY(-1px)' }
}));

const PrimaryBtn = styled(GhostBtn)(({ theme }) => ({
  backgroundColor: '#e37239',
  color: '#fff',
  '&:hover': { backgroundColor: '#c4683a' }
}));

const DangerBtn = styled(GhostBtn)(({ theme }) => ({
  backgroundColor: '#ca370b',
  color: '#fff',
  '&:hover': { backgroundColor: '#ac3315' }
}));

// Card de resultados tipo "item" (usuarios, citas, etc.)
const ListItemCard = styled(Paper)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(2),
  marginBottom: theme.spacing(1),
  backgroundColor: '#f8f9fa',
  borderRadius: 8,
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  '&:hover': { backgroundColor: '#e9ecef', transform: 'translateY(-1px)' }
}));

// Badges de estado
const Pill = styled(Chip)(({ theme }) => ({
  borderRadius: 20,
  fontWeight: 700,
  fontSize: '0.8rem'
}));

interface StatCardProps {
  value: number | string;
  label: string;
}

interface Service {
  id: string;
  name: string;
  category: string;
  price: number;
  duration: number;
  description?: string;
}

// Tipos compartidos a nivel de módulo para que todos los componentes puedan referenciarlos
type Provider = { id: string; name: string; contact: string; phone: string; email: string };
type Part = { id: string; name: string; sku: string; stock: number; minStock: number; price: number; providerId?: string };

function StatCard({ value, label }: StatCardProps) {
  return (
    <StatCardRoot>
      <CardContent>
        <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#ecdacb', mb: 1 }}>{value}</Typography>
        <Typography sx={{ color: '#e2edf5', fontSize: '0.9rem' }}>{label}</Typography>
      </CardContent>
    </StatCardRoot>
  );
}

function ModuleCard({ title, description, actions, onClickHeader }: { title: React.ReactNode | string; description?: React.ReactNode | string; actions?: React.ReactNode; onClickHeader?: React.MouseEventHandler<HTMLDivElement> }) {
  return (
    <ModuleCardRoot>
      <ModuleHeader onClick={onClickHeader}>
        <Typography sx={{ fontWeight: 'bold', fontSize: '1.3rem', mb: 0.5 }}>{title}</Typography>
        <Typography sx={{ opacity: 0.9, fontSize: '0.9rem' }}>{description}</Typography>
      </ModuleHeader>
      <Box sx={{ p: 3 }}>
        <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" sx={{ mb: 2 }}>
          {actions}
        </Stack>
        <Typography sx={{ fontSize: '0.85rem', color: '#7f8c8d' }}>
          {/* Texto libre para requisitos funcionales (RF-*) */}
        </Typography>
      </Box>
    </ModuleCardRoot>
  );
}

// ---------- Modales representativos ----------

interface CreateUserDialogProps { open: boolean; onClose: () => void; }

function CreateUserDialog({ open, onClose }: CreateUserDialogProps) {
  const [role, setRole] = React.useState("");
  const [specialty, setSpecialty] = React.useState("");

  const [form, setForm] = React.useState<Record<string, string>>({});
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [e.target.name as string]: e.target.value });

  const submit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }
    alert(`Usuario creado exitosamente:\nNombre: ${form.firstName || ''} ${form.lastName || ''}\nRol: ${role || ''}`);
    onClose();
    setRole("");
    setSpecialty("");
    setForm({});
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Crear Nuevo Usuario</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2} sx={{ mt: 0 }} component="form" onSubmit={submit}>
          <Grid size={ { xs: 12, md: 6 } }>
            <TextField label="Nombre*" name="firstName" fullWidth required onChange={handleChange} />
          </Grid>
          <Grid size={ { xs: 12, md: 6 } }>
            <TextField label="Apellido*" name="lastName" fullWidth required onChange={handleChange} />
          </Grid>

          <Grid size={ { xs: 12, md: 6 } }>
            <FormControl fullWidth required>
              <InputLabel>Tipo de Documento*</InputLabel>
              <Select label="Tipo de Documento*" name="documentType" defaultValue="">
                <MenuItem value="">Seleccionar...</MenuItem>
                <MenuItem value="CC">Cédula de Ciudadanía</MenuItem>
                <MenuItem value="CE">Cédula de Extranjería</MenuItem>
                <MenuItem value="PA">Pasaporte</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid size={ { xs: 12, md: 6 } }>
            <TextField label="Número de Documento*" name="documentNumber" fullWidth required onChange={handleChange} />
          </Grid>

          <Grid size={ { xs: 12, md: 6 } }>
            <TextField label="Correo Electrónico*" type="email" name="email" fullWidth required onChange={handleChange} />
          </Grid>
          <Grid size={ { xs: 12, md: 6 } }>
            <TextField label="Teléfono*" type="tel" name="phone" fullWidth required onChange={handleChange} />
          </Grid>

          <Grid size={ { xs: 12, md: 6 } }>
            <FormControl fullWidth required>
              <InputLabel>Rol de Usuario*</InputLabel>
              <Select label="Rol de Usuario*" value={role} onChange={(e) => setRole(e.target.value)} name="userRole">
                <MenuItem value="">Seleccionar rol...</MenuItem>
                <MenuItem value="cliente">Cliente</MenuItem>
                <MenuItem value="mecanico">Mecánico</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          {role === 'mecanico' && (
            <Grid size={ { xs: 12, md: 6 } }>
              <FormControl fullWidth required>
                <InputLabel>Especialidad (Mecánico)</InputLabel>
                <Select label="Especialidad (Mecánico)" value={specialty} onChange={(e)=>setSpecialty(e.target.value)} name="specialty">
                  <MenuItem value="">Seleccionar...</MenuItem>
                  <MenuItem value="motor">Motor</MenuItem>
                  <MenuItem value="frenos">Frenos</MenuItem>
                  <MenuItem value="suspension">Suspensión</MenuItem>
                  <MenuItem value="electrico">Sistema Eléctrico</MenuItem>
                  <MenuItem value="general">General</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          )}

          <Grid size={ { xs: 12 } }>
            <TextField label="Dirección" name="address" fullWidth onChange={handleChange} />
          </Grid>

          <Grid size={ { xs: 12, md: 6 } }>
            <TextField label="Contraseña*" name="password" type="password" required fullWidth onChange={handleChange} />
          </Grid>
          <Grid size={ { xs: 12, md: 6 } }>
            <TextField label="Confirmar Contraseña*" name="confirmPassword" type="password" required fullWidth onChange={handleChange} />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <GhostBtn onClick={onClose}>Cancelar</GhostBtn>
        <PrimaryBtn onClick={submit} startIcon={<AddIcon/>}>Crear Usuario</PrimaryBtn>
      </DialogActions>
    </Dialog>
  );
}

interface SearchUserDialogProps {
  open: boolean;
  onClose: () => void;
}

function SearchUserDialog({ open, onClose }: SearchUserDialogProps) {
  const [detail, setDetail] = React.useState<{ id: string; name: string; info: string; status: string } | null>(null);

  const users: { id: string; name: string; info: string; status: string }[] = [
    { id:'user1', name:'Juan Pérez', info:'CC: 12345678 • Cliente • juan@email.com', status:'Activo' },
    { id:'user2', name:'Carlos Rodríguez', info:'CC: 87654321 • Mecánico • carlos@email.com', status:'Activo' },
    { id:'user3', name:'María García', info:'CC: 11223344 • Cliente • maria@email.com', status:'Activo' }
  ];

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Consultar Usuario</DialogTitle>
      <DialogContent dividers>
        {!detail && (
          <Box>
            <TextField fullWidth placeholder="Nombre, documento o correo..." InputProps={{ startAdornment: <SearchIcon sx={{ mr: 1 }} /> }} sx={{ mb: 2 }} />
            <Box sx={{ maxHeight: 300, overflowY: 'auto' }}>
              {users.map(u => (
                <ListItemCard key={u.id} onClick={() => setDetail(u)}>
                  <Box>
                    <Typography sx={{ fontWeight: 'bold', color: '#2c3e50' }}>{u.name}</Typography>
                    <Typography sx={{ fontSize: '0.85rem', color: '#7f8c8d' }}>{u.info}</Typography>
                  </Box>
                  <Pill label={u.status} sx={{ backgroundColor: '#d4edda', color: '#155724' }} />
                </ListItemCard>
              ))}
            </Box>
          </Box>
        )}
        {detail && (
          <Box>
            <Typography variant="h6" sx={{ mb: 2 }}>Detalles del Usuario</Typography>
            <Grid container spacing={2}>
              <Grid size={ { xs: 12, md: 6 } }><Typography fontWeight={700}>Nombre:</Typography><Typography>{detail.name}</Typography></Grid>
              <Grid size={ { xs: 12, md: 6 } }><Typography fontWeight={700}>Documento:</Typography><Typography>{detail.info.split('•')[0]}</Typography></Grid>
              <Grid size={ { xs: 12, md: 6 } }><Typography fontWeight={700}>Email:</Typography><Typography>{detail.info.split('•')[2]}</Typography></Grid>
              <Grid size={ { xs: 12, md: 6 } }><Typography fontWeight={700}>Teléfono:</Typography><Typography>—</Typography></Grid>
              <Grid size={ { xs: 12, md: 6 } }><Typography fontWeight={700}>Rol:</Typography><Typography>{detail.info.includes('Mecánico')? 'Mecánico' : 'Cliente'}</Typography></Grid>
              <Grid size={ { xs: 12, md: 6 } }><Typography fontWeight={700}>Fecha Registro:</Typography><Typography>—</Typography></Grid>
            </Grid>
            <Box sx={{ mt: 2 }}>
              <GhostBtn onClick={() => setDetail(null)}>Volver a la lista</GhostBtn>
            </Box>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <GhostBtn onClick={onClose}>Cerrar</GhostBtn>
      </DialogActions>
    </Dialog>
  );
}

interface DeleteUserDialogProps {
  open: boolean;
  onClose: () => void;
}

function DeleteUserDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  type User = { id: string; name: string; doc: string; role: string; meta?: string };

  const [query, setQuery] = React.useState("");
  const [users, setUsers] = React.useState<User[]>([
    { id: "user1", name: "Juan Pérez", doc: "CC: 12345678", role: "Cliente",  meta: "2 vehículos" },
    { id: "user2", name: "Carlos Rodríguez", doc: "CC: 87654321", role: "Mecánico", meta: "15 citas" },
    { id: "user3", name: "María García", doc: "CC: 11223344", role: "Cliente",  meta: "1 vehículo" },
  ]);

  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [toDelete, setToDelete] = React.useState<User | null>(null);

  const filtered = users.filter((u) => {
    const q = query.toLowerCase().trim();
    if (!q) return true;
    return (
      u.name.toLowerCase().includes(q) ||
      u.doc.toLowerCase().includes(q) ||
      u.role.toLowerCase().includes(q)
    );
  });

  const askDelete = (user: User) => {
    setToDelete(user);
    setConfirmOpen(true);
  };

  const executeDelete = () => {
    if (!toDelete) return;
    setUsers((prev) => prev.filter((u) => u.id !== toDelete.id));
    setConfirmOpen(false);
    setToDelete(null);
    // TODO: aquí haces tu DELETE real a la API
  };

  return (
    <>
      {/* Diálogo principal: búsqueda + lista (sin vista previa) */}
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>Eliminar Usuario</DialogTitle>
        <DialogContent dividers>
          <Box
            sx={{
              backgroundColor: "#fff3cd",
              border: "1px solid #ffeaa7",
              color: "#856404",
              p: 2,
              borderRadius: 2,
              mb: 2,
            }}
          >
            <Typography fontWeight={700}>⚠️ Advertencia</Typography>
            <Typography fontSize=".9rem">
              Esta acción no se puede deshacer.
            </Typography>
          </Box>

          <TextField
            fullWidth
            placeholder="Nombre, documento o rol..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            InputProps={{ startAdornment: <SearchIcon sx={{ mr: 1 }} /> }}
            sx={{ mb: 2 }}
          />

          <Box sx={{ maxHeight: 300, overflowY: "auto" }}>
            {filtered.map((u) => (
              <ListItemCard
                key={u.id}
                onClick={() => askDelete(u)}
                sx={{
                  "&:hover": {
                    backgroundColor: "#f8d7da",
                    border: "1px solid #f5c6cb",
                    transform: "translateY(-1px)",
                  },
                }}
              >
                <Box>
                  <Typography sx={{ fontWeight: "bold", color: "#2c3e50" }}>
                    {u.name}
                  </Typography>
                  <Typography sx={{ fontSize: ".85rem", color: "#7f8c8d" }}>
                    {u.doc} • {u.role} {u.meta ? `• ${u.meta}` : ""}
                  </Typography>
                </Box>

                <IconButton
                  aria-label="Eliminar"
                  color="error"
                  onClick={(e) => {
                    e.stopPropagation(); // evita que el click en el ícono dispare el click del card
                    askDelete(u);
                  }}
                >
                  <DeleteOutlineIcon />
                </IconButton>
              </ListItemCard>
            ))}

            {filtered.length === 0 && (
              <Typography sx={{ color: "#7f8c8d" }}>
                No hay resultados para “{query}”.
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <GhostBtn onClick={onClose}>Cancelar</GhostBtn>
        </DialogActions>
      </Dialog>

      {/* Confirmación */}
      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent dividers>
          <Box
            sx={{
              backgroundColor: "#f8d7da",
              border: "1px solid #f5c6cb",
              borderRadius: 2,
              p: 2,
              textAlign: "center",
            }}
          >
            <Typography>¿Eliminar al usuario?</Typography>
            <Typography fontWeight={700} sx={{ my: 1 }}>
              {toDelete?.name || "-"}
            </Typography>
            <Typography>
              Esta acción <strong>NO</strong> se puede deshacer.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <GhostBtn onClick={() => setConfirmOpen(false)}>Cancelar</GhostBtn>
          <DangerBtn onClick={executeDelete} startIcon={<DeleteOutlineIcon />}>
            Eliminar Definitivamente
          </DangerBtn>
        </DialogActions>
      </Dialog>
    </>
  );
}


interface VehiclesDialogProps { open: boolean; onClose: () => void; }

function VehiclesDialog({ open, onClose }: VehiclesDialogProps) {
  const cards = [
    { icon: <DirectionsCarFilledIcon fontSize="large"/>, name: 'Toyota Corolla 2020', plate:'ABC-123', owner:'Juan Pérez', km:'45,000 km', type:'Sedán', status:'Activo', last:'15/09/2024', next:'15/12/2024' },
    { icon: <DirectionsCarFilledIcon fontSize="large"/>, name: 'Honda Civic 2019', plate:'XYZ-789', owner:'María García', km:'62,000 km', type:'Sedán', status:'Activo', last:'30/08/2024', next:'30/11/2024' },
    { icon: <TwoWheelerIcon fontSize="large"/>, name: 'Yamaha FZ 2021', plate:'DEF-456', owner:'Carlos Ruiz', km:'18,500 km', type:'Motocicleta', status:'En Servicio', last:'20/09/2024', next:'20/03/2025' }
  ];

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Gestión de Vehículos</DialogTitle>
      <DialogContent dividers>
        <TextField fullWidth placeholder="Buscar por Placa (Ej: ABC-123)" InputProps={{ startAdornment: <SearchIcon sx={{ mr: 1 }} /> }} sx={{ mb: 2 }} />
        <Box sx={{ maxHeight: 500, overflowY: 'auto' }}>
          {cards.map((c, i) => (
            <Paper key={i} sx={{ display:'flex', gap: 3, p: 3, mb: 2, border: '2px solid #ecf0f1', borderRadius: 2, backgroundColor: '#f8f9fa', transition: 'all .2s ease', '&:hover': { borderColor: '#3498db', transform: 'translateY(-2px)', boxShadow: '0 4px 15px rgba(52,152,219,.15)'}}}>
              <Box sx={{ display:'flex', alignItems:'center', justifyContent:'center', width: 80, height: 80, borderRadius: '50%', color:'#fff', backgroundImage:'linear-gradient(135deg, #3498db, #2980b9)'}}>
                {c.icon}
              </Box>
              <Box sx={{ flex: 1 }}>
                <Box sx={{ display:'flex', alignItems:'center', mb: 1 }}>
                  <Typography sx={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#2c3e50', flex: 1 }}>{c.name}</Typography>
                  <Box sx={{ backgroundImage:'linear-gradient(135deg, #2c3e50, #34495e)', color:'#fff', px: 2, py: 0.5, borderRadius: 1, fontWeight:'bold', fontSize:'1.1rem', letterSpacing: 1 }}>{c.plate}</Box>
                </Box>
                <Grid container spacing={2}>
                  <Grid size={ { xs: 12, md: 4 } }><Typography sx={{ fontSize:'.8rem', color:'#7f8c8d', fontWeight:500 }}>Propietario:</Typography><Typography sx={{ fontWeight:600 }}>{c.owner}</Typography></Grid>
                  <Grid size={ { xs: 12, md: 4 } }><Typography sx={{ fontSize:'.8rem', color:'#7f8c8d', fontWeight:500 }}>Kilometraje:</Typography><Typography sx={{ fontWeight:600 }}>{c.km}</Typography></Grid>
                  <Grid size={ { xs: 12, md: 4 } }><Typography sx={{ fontSize:'.8rem', color:'#7f8c8d', fontWeight:500 }}>Tipo:</Typography><Typography sx={{ fontWeight:600 }}>{c.type}</Typography></Grid>
                  <Grid size={ { xs: 12, md: 4 } }><Typography sx={{ fontSize:'.8rem', color:'#7f8c8d', fontWeight:500 }}>Estado:</Typography>{c.status === 'Activo' ? (<Pill label="Activo" sx={{ backgroundColor:'#d4edda', color:'#155724' }}/>) : (<Pill label="En Servicio" sx={{ backgroundColor:'#fff3cd', color:'#856404' }}/>)}</Grid>
                  <Grid size={ { xs: 12, md: 4 } }><Typography sx={{ fontSize:'.8rem', color:'#7f8c8d', fontWeight:500 }}>Último servicio:</Typography><Typography sx={{ fontWeight:600 }}>{c.last}</Typography></Grid>
                  <Grid size={ { xs: 12, md: 4 } }><Typography sx={{ fontSize:'.8rem', color:'#7f8c8d', fontWeight:500 }}>Próximo servicio:</Typography><Typography sx={{ fontWeight:600 }}>{c.next}</Typography></Grid>
                </Grid>
              </Box>
            </Paper>
          ))}
        </Box>
      </DialogContent>
      <DialogActions>
        <GhostBtn onClick={onClose}>Cerrar</GhostBtn>
      </DialogActions>
    </Dialog>
  );
}

interface ScheduleAppointmentDialogProps { open: boolean; onClose: () => void; }

function ScheduleAppointmentDialog({ open, onClose }: ScheduleAppointmentDialogProps) {
  const [client, setClient] = React.useState("");
  const [vehicle, setVehicle] = React.useState("");
  const [service, setService] = React.useState("");
  const [date, setDate] = React.useState("");
  const [time, setTime] = React.useState("");

  const serviceMeta = {
    'oil-change': { name: 'Cambio de aceite', duration: 60, mechanic: { name: 'Luis González', specialty: 'Mantenimiento General', avatar: 'LG' } },
    'brake-service': { name: 'Servicio de frenos', duration: 120, mechanic: { name: 'Carlos Rodríguez', specialty: 'Frenos/Suspensión', avatar: 'CR' } },
    'general-inspection': { name: 'Revisión general', duration: 90, mechanic: { name: 'Ana Fernández', specialty: 'Diagnóstico', avatar: 'AF' } },
    'tire-alignment': { name: 'Alineación y balanceo', duration: 45, mechanic: { name: 'José Martínez', specialty: 'Alineación', avatar: 'JM' } },
    'engine-tune': { name: 'Afinación de motor', duration: 180, mechanic: { name: 'Carlos Rodríguez', specialty: 'Motor', avatar: 'CR' } },
    'transmission': { name: 'Servicio de transmisión', duration: 240, mechanic: { name: 'Luis González', specialty: 'Transmisión', avatar: 'LG' } }
  };

  const meta = service
    ? (serviceMeta as Record<
        string,
        { name: string; duration: number; mechanic: { name: string; specialty: string; avatar: string } }
      >)[service]
    : null;

  const confirm = () => {
    if (!client || !vehicle || !service || !date || !time) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }
    alert(`¡Cita agendada exitosamente!\n\nCliente: ${client.split(' - ')[0]}\nServicio: ${meta?.name}\nFecha: ${date}\nHora: ${time}\nMecánico asignado: ${meta?.mechanic.name}`);
    onClose();
    setClient(""); setVehicle(""); setService(""); setDate(""); setTime("");
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Agendar Nueva Cita</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid size={ { xs: 12, md: 6 } }>
            <FormControl fullWidth required>
              <InputLabel>Seleccionar Cliente*</InputLabel>
              <Select label="Seleccionar Cliente*" value={client} onChange={(e)=>{setClient(e.target.value); setVehicle('');}}>
                <MenuItem value="">Seleccionar cliente...</MenuItem>
                <MenuItem value="Juan Pérez - CC 12345678">Juan Pérez - CC 12345678</MenuItem>
                <MenuItem value="María García - CC 87654321">María García - CC 87654321</MenuItem>
                <MenuItem value="Carlos Ruiz - CC 11223344">Carlos Ruiz - CC 11223344</MenuItem>
                <MenuItem value="Ana Fernández - CC 55667788">Ana Fernández - CC 55667788</MenuItem>
                <MenuItem value="Luis Martínez - CC 99887766">Luis Martínez - CC 99887766</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid size={ { xs: 12, md: 6 } }>
            <FormControl fullWidth required>
              <InputLabel>Vehículo del Cliente*</InputLabel>
              <Select label="Vehículo del Cliente*" value={vehicle} onChange={(e)=>setVehicle(e.target.value)} disabled={!client}>
                <MenuItem value="">{client? 'Seleccionar vehículo...' : 'Primero selecciona un cliente'}</MenuItem>
                {client && (
                  <>
                    <MenuItem value="Toyota Corolla 2020 (ABC-123)">Toyota Corolla 2020 (ABC-123)</MenuItem>
                    <MenuItem value="Honda Civic 2019 (XYZ-789)">Honda Civic 2019 (XYZ-789)</MenuItem>
                  </>
                )}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={ { xs: 12, md: 6 } }>
            <FormControl fullWidth required>
              <InputLabel>Tipo de Servicio*</InputLabel>
              <Select label="Tipo de Servicio*" value={service} onChange={(e)=>setService(e.target.value)}>
                <MenuItem value="">Seleccionar servicio...</MenuItem>
                <MenuItem value="oil-change">Cambio de aceite - $80,000</MenuItem>
                <MenuItem value="brake-service">Servicio de frenos - $250,000</MenuItem>
                <MenuItem value="general-inspection">Revisión general - $150,000</MenuItem>
                <MenuItem value="tire-alignment">Alineación y balanceo - $100,000</MenuItem>
                <MenuItem value="engine-tune">Afinación de motor - $350,000</MenuItem>
                <MenuItem value="transmission">Servicio de transmisión - $450,000</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid size={ { xs: 12, md: 6 } }>
            <TextField label="Fecha de la Cita*" type="date" InputLabelProps={{ shrink: true }} value={date} onChange={(e)=>setDate(e.target.value)} fullWidth required />
          </Grid>

          <Grid size={ { xs: 12, md: 6 } }>
            <FormControl fullWidth required>
              <InputLabel>Hora Preferida*</InputLabel>
              <Select label="Hora Preferida*" value={time} onChange={(e)=>setTime(e.target.value)}>
                <MenuItem value="">Seleccionar hora...</MenuItem>
                {['08:00','09:00','10:00','11:00','14:00','15:00','16:00','17:00'].map(h => <MenuItem key={h} value={h}>{h.replace(':00','') + (parseInt(h) < 12 ? ':00 AM' : parseInt(h)===12? ' M' : ' PM')}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={ { xs: 12, md: 6 } }>
            <TextField label="Duración Estimada" value={meta? `${meta.duration} minutos` : ''} placeholder="Se calculará automáticamente" fullWidth InputProps={{ readOnly: true }} />
          </Grid>

          <Grid size={ { xs: 12 } }>
            {meta && (
              <Box sx={{ mt: 1, border: '1px solid #a5d6a7', background: 'linear-gradient(135deg, #e8f5e8, #c8e6c9)', p: 2, borderRadius: 2 }}>
                <Typography sx={{ color: '#2e7d32', fontWeight: 'bold', mb: 1 }}>Asignación Automática de Mecánico</Typography>
                <Box sx={{ display:'flex', alignItems:'center', gap: 2, background:'rgba(255,255,255,0.8)', p:2, borderRadius: 1, border: '1px solid #4caf50' }}>
                  <Avatar sx={{ width: 50, height: 50, backgroundImage: 'linear-gradient(135deg, #4caf50, #388e3c)', fontWeight:'bold' }}>{meta.mechanic.avatar}</Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ fontWeight:'bold', color:'#2c3e50' }}>{meta.mechanic.name}</Typography>
                    <Typography sx={{ fontSize:'.9rem', color:'#7f8c8d' }}>Especialista en {meta.mechanic.specialty}</Typography>
                    <Typography sx={{ fontSize:'.85rem', color:'#27ae60', fontWeight:500 }}>Disponible en el horario seleccionado</Typography>
                  </Box>
                  <Chip label="Sugerido" sx={{ backgroundColor:'#4caf50', color:'#fff', borderRadius: 2 }} />
                </Box>
                <Typography sx={{ color:'#2e7d32', fontStyle:'italic', mt: 1 }}>Mecánico seleccionado por especialidad en el servicio y disponibilidad horaria.</Typography>
              </Box>
            )}
          </Grid>

          {(client && service) && (
            <Grid size={ { xs: 12 } }>
              <Box sx={{ background: 'linear-gradient(135deg, #fff3e0, #ffcc80)', border: '1px solid #ffb74d', p: 2, borderRadius: 2 }}>
                <Typography sx={{ color:'#ef6c00', fontWeight:'bold', mb: 1 }}>Resumen de la Cita</Typography>
                <Grid container spacing={2}>
                  <Grid size={ { xs: 12, md: 6 } }><Typography sx={{ color:'#bf360c', fontWeight:500 }}>Cliente:</Typography><Typography sx={{ fontWeight:'bold' }}>{client.split(' - ')[0]}</Typography></Grid>
                  <Grid size={ { xs: 12, md: 6 } }><Typography sx={{ color:'#bf360c', fontWeight:500 }}>Vehículo:</Typography><Typography sx={{ fontWeight:'bold' }}>{vehicle || '-'}</Typography></Grid>
                  <Grid size={ { xs: 12, md: 6 } }><Typography sx={{ color:'#bf360c', fontWeight:500 }}>Servicio:</Typography><Typography sx={{ fontWeight:'bold' }}>{meta?.name}</Typography></Grid>
                  <Grid size={ { xs: 12, md: 6 } }><Typography sx={{ color:'#bf360c', fontWeight:500 }}>Fecha y Hora:</Typography><Typography sx={{ fontWeight:'bold' }}>{(date && time) ? `${date} a las ${time}` : '-'}</Typography></Grid>
                  <Grid size={ { xs: 12, md: 6 } }><Typography sx={{ color:'#bf360c', fontWeight:500 }}>Mecánico:</Typography><Typography sx={{ fontWeight:'bold' }}>{meta?.mechanic.name}</Typography></Grid>
                  <Grid size={ { xs: 12, md: 6 } }><Typography sx={{ color:'#bf360c', fontWeight:500 }}>Duración:</Typography><Typography sx={{ fontWeight:'bold' }}>{meta? `${meta.duration} min` : '-'}</Typography></Grid>
                </Grid>
              </Box>
            </Grid>
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <GhostBtn onClick={onClose}>Cancelar</GhostBtn>
        <PrimaryBtn onClick={confirm} startIcon={<EventIcon/>}>Confirmar Cita</PrimaryBtn>
      </DialogActions>
    </Dialog>
  );
}

function ReassignAppointmentDialog({
  open,
  onClose,
  appointments,
  setAppointments,
}: {
  open: boolean;
  onClose: () => void;
  appointments: Array<{ id:string; client:string; vehicle:string; service:string; date:string; time:string; mechanic:string }>;
  setAppointments: React.Dispatch<React.SetStateAction<Array<{ id:string; client:string; vehicle:string; service:string; date:string; time:string; mechanic:string }>>>;
}) {
  const [query, setQuery] = React.useState("");
  const [selected, setSelected] = React.useState<string | null>(null);
  const [newDate, setNewDate] = React.useState("");
  const [newTime, setNewTime] = React.useState("");
  const [newMechanic, setNewMechanic] = React.useState("");

  const mechanics = ["Luis González", "Carlos Rodríguez", "Ana Fernández", "José Martínez"];

  React.useEffect(() => {
    if (!open) {
      setQuery("");
      setSelected(null);
      setNewDate("");
      setNewTime("");
      setNewMechanic("");
    }
  }, [open]);

  const filtered = appointments.filter(a => {
    const q = query.toLowerCase().trim();
    if (!q) return true;
    return (
      a.id.toLowerCase().includes(q) ||
      a.client.toLowerCase().includes(q) ||
      a.vehicle.toLowerCase().includes(q) ||
      a.service.toLowerCase().includes(q) ||
      a.mechanic.toLowerCase().includes(q)
    );
  });

  const selectedAppt = appointments.find(a => a.id === selected) || null;

  const save = () => {
    if (!selectedAppt) return;
    const d = newDate || selectedAppt.date;
    const t = newTime || selectedAppt.time;
    const m = newMechanic || selectedAppt.mechanic;

    setAppointments(prev => prev.map(a => a.id === selectedAppt.id ? { ...a, date: d, time: t, mechanic: m } : a));
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Reasignar Cita</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid size={{xs:12, md:6}}>
            <TextField
              fullWidth
              placeholder="Buscar por ID, cliente, servicio, mecánico..."
              value={query}
              onChange={(e)=>setQuery(e.target.value)}
              InputProps={{ startAdornment: <SearchIcon sx={{ mr: 1 }} /> }}
              sx={{ mb: 2 }}
            />
            <Box sx={{ maxHeight: 320, overflowY: 'auto' }}>
              {filtered.map(ap => (
                <ListItemCard
                  key={ap.id}
                  onClick={()=>setSelected(ap.id)}
                  sx={{
                    border: ap.id === selected ? '2px solid #3498db' : '1px solid #ecf0f1',
                    backgroundColor: ap.id === selected ? '#e8f4fd' : '#f8f9fa'
                  }}
                >
                  <Box>
                    <Typography sx={{ fontWeight:'bold', color:'#2c3e50' }}>{ap.id} • {ap.client}</Typography>
                    <Typography sx={{ fontSize:'.85rem', color:'#7f8c8d' }}>
                      {ap.service} • {ap.vehicle} • {ap.date} {ap.time} • {ap.mechanic}
                    </Typography>
                  </Box>
                  <Chip label="Seleccionar" />
                </ListItemCard>
              ))}
              {filtered.length === 0 && <Typography sx={{ color:'#7f8c8d' }}>Sin resultados.</Typography>}
            </Box>
          </Grid>

          <Grid size={{xs:12, md:6}}>
            <Paper sx={{ p:2, borderRadius:2, bgcolor:'#f8f9fa' }}>
              <Typography sx={{ fontWeight: 800, mb: 1, color:'#2c3e50' }}>Nueva Asignación</Typography>

              <Stack spacing={2}>
                <TextField
                  label="Fecha"
                  type="date"
                  value={newDate}
                  onChange={(e)=>setNewDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
                <FormControl fullWidth>
                  <InputLabel>Hora</InputLabel>
                  <Select label="Hora" value={newTime} onChange={(e)=>setNewTime(e.target.value as string)}>
                    {['08:00','09:00','10:00','11:00','14:00','15:00','16:00','17:00'].map(h => (
                      <MenuItem key={h} value={h}>{h}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel>Mecánico</InputLabel>
                  <Select label="Mecánico" value={newMechanic} onChange={(e)=>setNewMechanic(e.target.value as string)}>
                    {mechanics.map(m => <MenuItem key={m} value={m}>{m}</MenuItem>)}
                  </Select>
                </FormControl>

                {selectedAppt && (
                  <Box sx={{ mt: 1, p:2, border:'1px solid #a5d6a7', borderRadius:2, background:'linear-gradient(135deg, #e8f5e9, #e3f2fd)' }}>
                    <Typography sx={{ color:'#2e7d32', fontWeight:'bold' }}>Resumen</Typography>
                    <Typography sx={{ fontSize:'.9rem', color:'#2c3e50' }}>
                      {selectedAppt.client} — {selectedAppt.service}
                    </Typography>
                    <Typography sx={{ fontSize:'.9rem', color:'#2c3e50' }}>
                      {selectedAppt.vehicle}
                    </Typography>
                    <Typography sx={{ fontSize:'.9rem', color:'#2c3e50' }}>
                      {newDate || selectedAppt.date} {newTime || selectedAppt.time} • {newMechanic || selectedAppt.mechanic}
                    </Typography>
                  </Box>
                )}
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <GhostBtn onClick={onClose}>Cancelar</GhostBtn>
        <PrimaryBtn
          onClick={save}
          disabled={!selected}
          startIcon={<AssignmentIcon/>}
        >
          Guardar cambios
        </PrimaryBtn>
      </DialogActions>
    </Dialog>
  );
}

function CancelAppointmentDialog({
  open,
  onClose,
  appointments,
  setAppointments,
}: {
  open: boolean;
  onClose: () => void;
  appointments: Array<{ id:string; client:string; vehicle:string; service:string; date:string; time:string; mechanic:string }>;
  setAppointments: React.Dispatch<React.SetStateAction<Array<{ id:string; client:string; vehicle:string; service:string; date:string; time:string; mechanic:string }>>>;
}) {
  const [query, setQuery] = React.useState("");
  const [selected, setSelected] = React.useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = React.useState(false);

  React.useEffect(() => {
    if (!open) {
      setQuery("");
      setSelected(null);
      setConfirmOpen(false);
    }
  }, [open]);

  const filtered = appointments.filter(a => {
    const q = query.toLowerCase().trim();
    if (!q) return true;
    return (
      a.id.toLowerCase().includes(q) ||
      a.client.toLowerCase().includes(q) ||
      a.vehicle.toLowerCase().includes(q) ||
      a.service.toLowerCase().includes(q) ||
      a.mechanic.toLowerCase().includes(q)
    );
  });

  const selectedAppt = appointments.find(a => a.id === selected) || null;

  const requestCancel = () => {
    if (!selectedAppt) return;
    setConfirmOpen(true);
  };

  const executeCancel = () => {
    if (!selectedAppt) return;
    setAppointments(prev => prev.filter(a => a.id !== selectedAppt.id));
    setConfirmOpen(false);
    onClose();
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>Cancelar Cita</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ backgroundColor:'#fff3cd', border:'1px solid #ffeaa7', color:'#856404', p:2, borderRadius:2, mb:2 }}>
            <Typography fontWeight={700}>⚠️ Atención:</Typography>
            <Typography fontSize=".9rem">Esta acción no se puede deshacer.</Typography>
          </Box>

          <TextField
            fullWidth
            placeholder="Buscar por ID, cliente, servicio, mecánico..."
            value={query}
            onChange={(e)=>setQuery(e.target.value)}
            InputProps={{ startAdornment: <SearchIcon sx={{ mr: 1 }} /> }}
            sx={{ mb: 2 }}
          />

          <Box sx={{ maxHeight: 320, overflowY: 'auto' }}>
            {filtered.map(ap => (
              <ListItemCard
                key={ap.id}
                onClick={()=>setSelected(ap.id)}
                sx={{
                  border: ap.id === selected ? '2px solid #e57373' : '1px solid #ecf0f1',
                  backgroundColor: ap.id === selected ? '#fdecea' : '#f8f9fa'
                }}
              >
                <Box>
                  <Typography sx={{ fontWeight:'bold', color:'#2c3e50' }}>{ap.id} • {ap.client}</Typography>
                  <Typography sx={{ fontSize:'.85rem', color:'#7f8c8d' }}>
                    {ap.service} • {ap.vehicle} • {ap.date} {ap.time} • {ap.mechanic}
                  </Typography>
                </Box>
                <Chip label="Elegir" color="error" />
              </ListItemCard>
            ))}
            {filtered.length === 0 && <Typography sx={{ color:'#7f8c8d' }}>Sin resultados.</Typography>}
          </Box>
        </DialogContent>
        <DialogActions>
          <GhostBtn onClick={onClose}>Cerrar</GhostBtn>
          <DangerBtn onClick={requestCancel} disabled={!selected}>Cancelar cita</DangerBtn>
        </DialogActions>
      </Dialog>

      {/* Confirmación */}
      <Dialog open={confirmOpen} onClose={()=>setConfirmOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>Confirmar cancelación</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ backgroundColor:'#f8d7da', border:'1px solid #f5c6cb', borderRadius:2, p:2, textAlign:'center' }}>
            <Typography>¿Cancelar la cita seleccionada?</Typography>
            <Typography fontWeight={700} sx={{ my: 1 }}>{selectedAppt?.id || '-'}</Typography>
            <Typography fontSize=".9rem">{selectedAppt ? `${selectedAppt.client} • ${selectedAppt.service} • ${selectedAppt.date} ${selectedAppt.time}` : ''}</Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <GhostBtn onClick={()=>setConfirmOpen(false)}>Atrás</GhostBtn>
          <DangerBtn onClick={executeCancel} startIcon={<DeleteOutlineIcon/>}>Cancelar definitivamente</DangerBtn>
        </DialogActions>
      </Dialog>
    </>
  );
}

function CreateServiceDialog({
  open, onClose, onCreate
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (srv: { id:string } & Omit<Service,"id">) => void;
}) {
  const [name, setName] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [price, setPrice] = React.useState<number | "">("");
  const [duration, setDuration] = React.useState<number | "">("");
  const [description, setDescription] = React.useState("");

  React.useEffect(()=> {
    if (!open) { setName(""); setCategory(""); setPrice(""); setDuration(""); setDescription(""); }
  }, [open]);

  const submit = () => {
    if (!name || !category || price === "" || duration === "") return;
    const id = `SRV-${Math.random().toString(36).slice(2,7).toUpperCase()}`;
    onCreate({ id, name, category, price: Number(price), duration: Number(duration), description });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Crear Servicio</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid size={{ xs:12, md:6 }}>
            <TextField label="Nombre*" value={name} onChange={e=>setName(e.target.value)} fullWidth />
          </Grid>
          <Grid size={{ xs:12, md:6 }}>
            <FormControl fullWidth>
              <InputLabel>Categoría*</InputLabel>
              <Select label="Categoría*" value={category} onChange={e=>setCategory(e.target.value as string)}>
                <MenuItem value="Mantenimiento">Mantenimiento</MenuItem>
                <MenuItem value="Sistema de frenos">Sistema de frenos</MenuItem>
                <MenuItem value="Suspensión">Suspensión</MenuItem>
                <MenuItem value="Diagnóstico">Diagnóstico</MenuItem>
                <MenuItem value="Motor">Motor</MenuItem>
                <MenuItem value="Transmisión">Transmisión</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs:12, md:6 }}>
            <TextField label="Precio (COP)*" type="number" value={price}
              onChange={e=>setPrice(e.target.value === "" ? "" : Number(e.target.value))} fullWidth />
          </Grid>
          <Grid size={{ xs:12, md:6 }}>
            <TextField label="Duración (min)*" type="number" value={duration}
              onChange={e=>setDuration(e.target.value === "" ? "" : Number(e.target.value))} fullWidth />
          </Grid>
          <Grid size={{ xs:12 }}>
            <TextField label="Descripción" value={description} onChange={e=>setDescription(e.target.value)}
              fullWidth multiline minRows={3} />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <GhostBtn onClick={onClose}>Cancelar</GhostBtn>
        <PrimaryBtn onClick={submit} startIcon={<AddIcon/>} disabled={!name || !category || price==="" || duration===""}>
          Crear
        </PrimaryBtn>
      </DialogActions>
    </Dialog>
  );
}

function ServicesCatalogDialog({
  open, onClose, services, setServices
}: {
  open: boolean;
  onClose: () => void;
  services: Service[];
  setServices: React.Dispatch<React.SetStateAction<Service[]>>;
}) {
  const [query, setQuery] = React.useState("");
  const [editing, setEditing] = React.useState<Service | null>(null);

  React.useEffect(()=>{ if (!open) { setQuery(""); setEditing(null); } }, [open]);

  const filtered = services.filter(s => {
    const q = query.toLowerCase().trim();
    if (!q) return true;
    return (
      s.id.toLowerCase().includes(q) ||
      s.name.toLowerCase().includes(q) ||
      s.category.toLowerCase().includes(q)
    );
  });

  const saveEdit = () => {
    if (!editing) return;
    setServices(prev => prev.map(s => s.id === editing.id ? editing : s));
    setEditing(null);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Catálogo de Servicios</DialogTitle>
      <DialogContent dividers>
        <TextField
          fullWidth
          placeholder="Buscar por ID, nombre o categoría..."
          value={query}
          onChange={e=>setQuery(e.target.value)}
          InputProps={{ startAdornment: <SearchIcon sx={{ mr: 1 }} /> }}
          sx={{ mb: 2 }}
        />

        <Box sx={{ maxHeight: 420, overflowY: "auto" }}>
          {filtered.map(s => (
            <ListItemCard
              key={s.id}
              onClick={()=>setEditing(s)}
              sx={{ border:'1px solid #ecf0f1', backgroundColor:'#f8f9fa' }}
            >
              <Box>
                <Typography sx={{ fontWeight:'bold', color:'#2c3e50' }}>
                  {s.id} • {s.name}
                </Typography>
                <Typography sx={{ fontSize:'.85rem', color:'#7f8c8d' }}>
                  {s.category} • ${s.price.toLocaleString()} • {s.duration} min
                </Typography>
              </Box>
              <Chip label="Editar" />
            </ListItemCard>
          ))}
          {filtered.length === 0 && <Typography sx={{ color:'#7f8c8d' }}>Sin resultados.</Typography>}
        </Box>

        {/* Panel de edición rápida */}
        {editing && (
          <Box sx={{ mt: 2, p: 2, border:'1px solid #a5d6a7', borderRadius:2, background:'linear-gradient(135deg, #e8f5e9, #e3f2fd)' }}>
            <Typography sx={{ fontWeight:800, color:'#2e7d32', mb:1 }}>Editar servicio</Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs:12, md:6 }}>
                <TextField label="Nombre" value={editing.name} onChange={e=>setEditing({...editing, name:e.target.value})} fullWidth />
              </Grid>
              <Grid size={{ xs:12, md:6 }}>
                <FormControl fullWidth>
                  <InputLabel>Categoría</InputLabel>
                  <Select label="Categoría" value={editing.category} onChange={e=>setEditing({...editing, category:e.target.value as string})}>
                    <MenuItem value="Mantenimiento">Mantenimiento</MenuItem>
                    <MenuItem value="Sistema de frenos">Sistema de frenos</MenuItem>
                    <MenuItem value="Suspensión">Suspensión</MenuItem>
                    <MenuItem value="Diagnóstico">Diagnóstico</MenuItem>
                    <MenuItem value="Motor">Motor</MenuItem>
                    <MenuItem value="Transmisión">Transmisión</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs:12, md:6 }}>
                <TextField label="Precio (COP)" type="number" value={editing.price}
                  onChange={e=>setEditing({...editing, price:Number(e.target.value)})} fullWidth />
              </Grid>
              <Grid size={{ xs:12, md:6 }}>
                <TextField label="Duración (min)" type="number" value={editing.duration}
                  onChange={e=>setEditing({...editing, duration:Number(e.target.value)})} fullWidth />
              </Grid>
              <Grid size={{ xs:12 }}>
                <TextField label="Descripción" value={editing.description ?? ""}
                  onChange={e=>setEditing({...editing, description:e.target.value})} fullWidth multiline minRows={2} />
              </Grid>
            </Grid>
            <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
              <GhostBtn onClick={()=>setEditing(null)}>Cancelar</GhostBtn>
              <PrimaryBtn onClick={saveEdit} startIcon={<AssignmentIcon/>}>Guardar cambios</PrimaryBtn>
            </Stack>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <GhostBtn onClick={onClose}>Cerrar</GhostBtn>
      </DialogActions>
    </Dialog>
  );
}

function DeleteServiceDialog({
  open, onClose, services, setServices
}: {
  open: boolean;
  onClose: () => void;
  services: Service[];
  setServices: React.Dispatch<React.SetStateAction<Service[]>>;
}) {
  const [query, setQuery] = React.useState("");
  const [selected, setSelected] = React.useState<Service | null>(null);
  const [confirmOpen, setConfirmOpen] = React.useState(false);

  React.useEffect(()=>{ if(!open){ setQuery(""); setSelected(null); setConfirmOpen(false);} }, [open]);

  const filtered = services.filter(s => {
    const q = query.toLowerCase().trim();
    if (!q) return true;
    return s.id.toLowerCase().includes(q) || s.name.toLowerCase().includes(q) || s.category.toLowerCase().includes(q);
  });

  const askDelete = (srv: Service) => { setSelected(srv); setConfirmOpen(true); };
  const executeDelete = () => {
    if (!selected) return;
    setServices(prev => prev.filter(s => s.id !== selected.id));
    setConfirmOpen(false);
    onClose();
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>Eliminar Servicio</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ backgroundColor:'#fff3cd', border:'1px solid #ffeaa7', color:'#856404', p:2, borderRadius:2, mb:2 }}>
            <Typography fontWeight={700}>⚠️ Advertencia:</Typography>
            <Typography fontSize=".9rem">Esta acción no se puede deshacer.</Typography>
          </Box>

          <TextField
            fullWidth
            placeholder="Buscar por ID, nombre o categoría..."
            value={query}
            onChange={e=>setQuery(e.target.value)}
            InputProps={{ startAdornment: <SearchIcon sx={{ mr: 1 }} /> }}
            sx={{ mb: 2 }}
          />

          <Box sx={{ maxHeight: 360, overflowY:'auto' }}>
            {filtered.map(s => (
              <ListItemCard key={s.id}
                onClick={()=>askDelete(s)}
                sx={{ '&:hover': { backgroundColor:'#f8d7da', border:'1px solid #f5c6cb' } }}>
                <Box>
                  <Typography sx={{ fontWeight:'bold', color:'#2c3e50' }}>{s.id} • {s.name}</Typography>
                  <Typography sx={{ fontSize:'.85rem', color:'#7f8c8d' }}>
                    {s.category} • ${s.price.toLocaleString()} • {s.duration} min
                  </Typography>
                </Box>
                <IconButton aria-label="Eliminar" color="error" onClick={(e)=>{e.stopPropagation(); askDelete(s);}}>
                  <DeleteOutlineIcon />
                </IconButton>
              </ListItemCard>
            ))}
            {filtered.length === 0 && <Typography sx={{ color:'#7f8c8d' }}>Sin resultados.</Typography>}
          </Box>
        </DialogContent>
        <DialogActions>
          <GhostBtn onClick={onClose}>Cancelar</GhostBtn>
        </DialogActions>
      </Dialog>

      {/* Confirmación */}
      <Dialog open={confirmOpen} onClose={()=>setConfirmOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ backgroundColor:'#f8d7da', border:'1px solid #f5c6cb', borderRadius:2, p:2, textAlign:'center' }}>
            <Typography>¿Eliminar el servicio?</Typography>
            <Typography fontWeight={700} sx={{ my: 1 }}>{selected?.id} — {selected?.name}</Typography>
            <Typography fontSize=".9rem">{selected?.category} • ${selected ? selected.price.toLocaleString() : ""} • {selected?.duration} min</Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <GhostBtn onClick={()=>setConfirmOpen(false)}>Atrás</GhostBtn>
          <DangerBtn onClick={executeDelete} startIcon={<DeleteOutlineIcon/>}>Eliminar definitivamente</DangerBtn>
        </DialogActions>
      </Dialog>
    </>
  );
}

function ProvidersDialog({
  open, onClose, providers, setProviders
}: {
  open: boolean; onClose: () => void;
  providers: Provider[];
  setProviders: React.Dispatch<React.SetStateAction<Provider[]>>;
}) {
  const [query, setQuery] = React.useState("");
  const [form, setForm] = React.useState<Provider>({ id:"", name:"", contact:"", phone:"", email:"" });
  const [editingId, setEditingId] = React.useState<string | null>(null);

  React.useEffect(()=>{ if(!open){ setQuery(""); setForm({id:"",name:"",contact:"",phone:"",email:""}); setEditingId(null);} }, [open]);

  const filtered = providers.filter(p=>{
    const q=query.toLowerCase().trim(); if(!q) return true;
    return p.id.toLowerCase().includes(q) || p.name.toLowerCase().includes(q) || p.contact.toLowerCase().includes(q) || p.email.toLowerCase().includes(q);
  });

  const startEdit = (p:Provider)=>{ setEditingId(p.id); setForm(p); };
  const cancelEdit = ()=>{ setEditingId(null); setForm({ id:"", name:"", contact:"", phone:"", email:"" }); };

  const save = ()=> {
    if(!form.name || !form.contact) return;
    if(editingId){
      setProviders(prev => prev.map(p=>p.id===editingId ? form : p));
      cancelEdit();
    } else {
      const id = `PRV-${Math.random().toString(36).slice(2,6).toUpperCase()}`;
      setProviders(prev => [{...form, id}, ...prev]);
      cancelEdit();
    }
  };

  const remove = (id:string)=> setProviders(prev => prev.filter(p=>p.id!==id));

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Gestión de Proveedores</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          {/* Lista y búsqueda */}
          <Grid size={{ xs:12, md:7 }}>
            <TextField
              fullWidth placeholder="Buscar por ID, nombre, contacto o email..."
              value={query} onChange={e=>setQuery(e.target.value)}
              InputProps={{ startAdornment: <SearchIcon sx={{ mr: 1 }} /> }}
              sx={{ mb: 2 }}
            />
            <Box sx={{ maxHeight: 380, overflowY:'auto' }}>
              {filtered.map(p=>(
                <ListItemCard key={p.id} onClick={()=>startEdit(p)} sx={{ border:'1px solid #ecf0f1' }}>
                  <Box>
                    <Typography sx={{ fontWeight:'bold', color:'#2c3e50' }}>{p.id} • {p.name}</Typography>
                    <Typography sx={{ fontSize:'.85rem', color:'#7f8c8d' }}>{p.contact} • {p.phone} • {p.email}</Typography>
                  </Box>
                  <Stack direction="row" spacing={1}>
                    <Chip label="Editar" />
                    <IconButton aria-label="Eliminar" color="error" onClick={(e)=>{e.stopPropagation(); remove(p.id);}}>
                      <DeleteOutlineIcon/>
                    </IconButton>
                  </Stack>
                </ListItemCard>
              ))}
              {filtered.length===0 && <Typography sx={{ color:'#7f8c8d' }}>Sin resultados.</Typography>}
            </Box>
          </Grid>

          {/* Formulario crear/editar */}
          <Grid size={{ xs:12, md:5 }}>
            <Paper sx={{ p:2, borderRadius:2, bgcolor:'#f8f9fa' }}>
              <Typography sx={{ fontWeight:800, color:'#2c3e50', mb:1 }}>
                {editingId ? "Editar proveedor" : "Nuevo proveedor"}
              </Typography>
              <Stack spacing={1.5}>
                <TextField label="Nombre*" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} fullWidth />
                <TextField label="Contacto*" value={form.contact} onChange={e=>setForm({...form, contact:e.target.value})} fullWidth />
                <TextField label="Teléfono" value={form.phone} onChange={e=>setForm({...form, phone:e.target.value})} fullWidth />
                <TextField label="Email" type="email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} fullWidth />
                <Stack direction="row" spacing={1}>
                  <GhostBtn onClick={cancelEdit}>Limpiar</GhostBtn>
                  <PrimaryBtn onClick={save} startIcon={<AddIcon/>} disabled={!form.name || !form.contact}>
                    {editingId ? "Guardar cambios" : "Crear"}
                  </PrimaryBtn>
                </Stack>
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <GhostBtn onClick={onClose}>Cerrar</GhostBtn>
      </DialogActions>
    </Dialog>
  );
}

function SparepartsDialog({
  open, onClose, parts, setParts, providers
}: {
  open: boolean; onClose: () => void;
  parts: Part[]; setParts: React.Dispatch<React.SetStateAction<Part[]>>;
  providers: Provider[];
}) {
  const [query, setQuery] = React.useState("");
  const [editing, setEditing] = React.useState<Part | null>(null);
  const [form, setForm] = React.useState<Part>({ id:"", name:"", sku:"", stock:0, minStock:0, price:0, providerId:undefined });

  React.useEffect(()=>{ if(!open){ setQuery(""); setEditing(null); setForm({ id:"", name:"", sku:"", stock:0, minStock:0, price:0 }); } }, [open]);

  const filtered = parts.filter(p=>{
    const q=query.toLowerCase().trim(); if(!q) return true;
    return p.id.toLowerCase().includes(q) || p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q);
  });

  const startEdit = (p:Part)=>{ setEditing(p); setForm(p); };
  const clearForm = ()=>{ setEditing(null); setForm({ id:"", name:"", sku:"", stock:0, minStock:0, price:0, providerId:undefined }); };

  const save = ()=> {
    if(!form.name || !form.sku) return;
    if(editing){
      setParts(prev => prev.map(x=>x.id===editing.id ? form : x));
      clearForm();
    } else {
      const id = `SKU-${Math.random().toString(36).slice(2,6).toUpperCase()}`;
      setParts(prev => [{...form, id}, ...prev]);
      clearForm();
    }
  };

  const remove = (id:string)=> setParts(prev => prev.filter(p=>p.id!==id));
  const adjust = (id:string, delta:number)=> setParts(prev => prev.map(p=>p.id===id ? {...p, stock: Math.max(0, p.stock + delta)} : p));

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle>Gestión de Repuestos</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          {/* Lista + búsqueda */}
          <Grid size={{ xs:12, md:8 }}>
            <TextField
              fullWidth placeholder="Buscar por ID, nombre o SKU..."
              value={query} onChange={e=>setQuery(e.target.value)}
              InputProps={{ startAdornment: <SearchIcon sx={{ mr: 1 }} /> }}
              sx={{ mb: 2 }}
            />

            <Box sx={{ maxHeight: 420, overflowY:'auto' }}>
              {filtered.map(p=>(
                <ListItemCard key={p.id} onClick={()=>startEdit(p)} sx={{
                  border:'1px solid #ecf0f1', backgroundColor: p.stock <= p.minStock ? '#fff3cd' : '#f8f9fa'
                }}>
                  <Box>
                    <Typography sx={{ fontWeight:'bold', color:'#2c3e50' }}>
                      {p.id} • {p.name} ({p.sku})
                    </Typography>
                    <Typography sx={{ fontSize:'.85rem', color:'#7f8c8d' }}>
                      Stock: {p.stock} • Min: {p.minStock} • ${p.price.toLocaleString()} {p.providerId ? `• Prov: ${providers.find(x=>x.id===p.providerId)?.name ?? "-"}` : ""}
                    </Typography>
                  </Box>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <GhostBtn onClick={(e)=>{e.stopPropagation(); adjust(p.id, +1);}}>+1</GhostBtn>
                    <GhostBtn onClick={(e)=>{e.stopPropagation(); adjust(p.id, -1);}}>-1</GhostBtn>
                    <IconButton aria-label="Eliminar" color="error" onClick={(e)=>{e.stopPropagation(); remove(p.id);}}>
                      <DeleteOutlineIcon/>
                    </IconButton>
                  </Stack>
                </ListItemCard>
              ))}
              {filtered.length===0 && <Typography sx={{ color:'#7f8c8d' }}>Sin resultados.</Typography>}
            </Box>
          </Grid>

          {/* Form crear/editar */}
          <Grid size={{ xs:12, md:4 }}>
            <Paper sx={{ p:2, borderRadius:2, bgcolor:'#f8f9fa' }}>
              <Typography sx={{ fontWeight:800, color:'#2c3e50', mb:1 }}>
                {editing ? "Editar repuesto" : "Nuevo repuesto"}
              </Typography>
              <Stack spacing={1.5}>
                <TextField label="Nombre*" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} fullWidth />
                <TextField label="SKU*" value={form.sku} onChange={e=>setForm({...form, sku:e.target.value})} fullWidth />
                <TextField label="Stock" type="number" value={form.stock} onChange={e=>setForm({...form, stock:Number(e.target.value)})} fullWidth />
                <TextField label="Stock mínimo" type="number" value={form.minStock} onChange={e=>setForm({...form, minStock:Number(e.target.value)})} fullWidth />
                <TextField label="Precio (COP)" type="number" value={form.price} onChange={e=>setForm({...form, price:Number(e.target.value)})} fullWidth />
                <FormControl fullWidth>
                  <InputLabel>Proveedor</InputLabel>
                  <Select label="Proveedor" value={form.providerId ?? ""} onChange={e=>setForm({...form, providerId: (e.target.value as string) || undefined})}>
                    <MenuItem value="">— Sin proveedor —</MenuItem>
                    {providers.map(p => <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>)}
                  </Select>
                </FormControl>

                <Stack direction="row" spacing={1}>
                  <GhostBtn onClick={clearForm}>Limpiar</GhostBtn>
                  <PrimaryBtn onClick={save} startIcon={<AddIcon/>} disabled={!form.name || !form.sku}>
                    {editing ? "Guardar cambios" : "Crear"}
                  </PrimaryBtn>
                </Stack>
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <GhostBtn onClick={onClose}>Cerrar</GhostBtn>
      </DialogActions>
    </Dialog>
  );
}

function ReportsDialog({
  open,
  onClose,
  kind,
  appointments,
  services,
  parts,
  providers,
}: {
  open: boolean;
  onClose: () => void;
  kind: "citas"|"mecanicos"|"inventario"|"financiero"|null;
  appointments: Array<{ id:string; client:string; vehicle:string; service:string; date:string; time:string; mechanic:string }>;
  services: Array<{ id:string; name:string; category:string; price:number; duration:number; description?:string }>;
  parts: Array<{ id:string; name:string; sku:string; stock:number; minStock:number; price:number; providerId?:string }>;
  providers: Array<{ id:string; name:string; contact:string; phone:string; email:string }>;
}) {

  // Helpers de exportación
  const exportExcel = (rows: any[], filename: string) => {
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Reporte");
    XLSX.writeFile(wb, filename.endsWith(".xlsx") ? filename : `${filename}.xlsx`);
  };

  const exportPDF = (head: string[], body: any[][], title: string, filename: string, extraFooter?: string) => {
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    doc.setFontSize(14);
    doc.text(title, 40, 40);
    (doc as any).autoTable({
      head: [head],
      body,
      startY: 60,
      styles: { fontSize: 9, cellPadding: 4 },
      headStyles: { fillColor: [41, 128, 185] },
    });
    if (extraFooter) {
      const y = (doc as any).lastAutoTable.finalY + 20;
      doc.setFontSize(11);
      doc.text(extraFooter, 40, y);
    }
    doc.save(filename.endsWith(".pdf") ? filename : `${filename}.pdf`);
  };

  // Construcción de datos según reporte
  const getData = () => {
    switch (kind) {
      case "citas": {
        const head = ["ID", "Cliente", "Vehículo", "Servicio", "Fecha", "Hora", "Mecánico"];
        const rows = appointments.map(a => ({
          ID: a.id, Cliente: a.client, Vehículo: a.vehicle, Servicio: a.service,
          Fecha: a.date, Hora: a.time, Mecánico: a.mechanic
        }));
        const body = rows.map(r => [r.ID, r.Cliente, r.Vehículo, r.Servicio, r.Fecha, r.Hora, r.Mecánico]);
        return { head, rows, body, title: "Reporte de Citas", filename: "reporte_citas" };
      }
      case "mecanicos": {
        // Agregado por mecánico
        const agg = new Map<string, { citas:number }>();
        appointments.forEach(a => {
          const m = agg.get(a.mechanic) || { citas: 0 };
          m.citas += 1;
          agg.set(a.mechanic, m);
        });
        const head = ["Mecánico", "Citas Atendidas"];
        const rows = Array.from(agg.entries()).map(([mech, v]) => ({ Mecánico: mech, "Citas Atendidas": v.citas }));
        const body = rows.map(r => [r.Mecánico, r["Citas Atendidas"]]);
        return { head, rows, body, title: "Reporte de Mecánicos", filename: "reporte_mecanicos" };
      }
      case "inventario": {
        const head = ["ID", "Nombre", "SKU", "Stock", "Mín.", "Precio", "Proveedor"];
        const rows = parts.map(p => ({
          ID: p.id, Nombre: p.name, SKU: p.sku, Stock: p.stock, "Mín.": p.minStock,
          Precio: p.price, Proveedor: p.providerId ? (providers.find(pr=>pr.id===p.providerId)?.name ?? "-") : "-"
        }));
        const body = rows.map(r => [r.ID, r.Nombre, r.SKU, r.Stock, r["Mín."], r.Precio.toLocaleString(), r.Proveedor]);
        return { head, rows, body, title: "Reporte de Inventario", filename: "reporte_inventario" };
      }
      case "financiero": {
        // unir citas con precio del servicio por nombre
        const priceByService = new Map(services.map(s => [s.name, s.price]));
        let total = 0;
        const head = ["Cita", "Servicio", "Precio (COP)", "Fecha", "Mecánico", "Cliente"];
        const rows = appointments.map(a => {
          const precio = priceByService.get(a.service) ?? 0;
          total += precio;
          return {
            Cita: a.id, Servicio: a.service, "Precio (COP)": precio,
            Fecha: a.date, Mecánico: a.mechanic, Cliente: a.client
          };
        });
        const body = rows.map(r => [r.Cita, r.Servicio, r["Precio (COP)"].toLocaleString(), r.Fecha, r.Mecánico, r.Cliente]);
        const extra = `Total facturado (estimado): $${total.toLocaleString()}`;
        return { head, rows, body, title: "Reporte Financiero (Estimado)", filename: "reporte_financiero", extra };
      }
      default:
        return { head: [], rows: [], body: [], title: "", filename: "" };
    }
  };

  const { head, rows, body, title, filename, extra } = getData();

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Reportes Operativos</DialogTitle>
      <DialogContent dividers>
        <Typography sx={{ mb: 1, fontWeight: 700, color: "#2c3e50" }}>
          {title || "Selecciona un tipo de reporte desde el panel"}
        </Typography>
        <Typography sx={{ color: "#7f8c8d", mb: 2 }}>
          Exporta el reporte seleccionado en PDF o Excel.
        </Typography>

        {/* Resumen rápido (primeras filas) */}
        {rows && rows.length > 0 && (
          <Box sx={{ p:2, border:'1px solid #ecf0f1', borderRadius:2, background:'#f8f9fa' }}>
            <Typography sx={{ fontWeight:700, mb:1 }}>Vista previa (primeras 5 filas)</Typography>
            {rows.slice(0,5).map((r, i) => (
              <Typography key={i} sx={{ fontSize: ".9rem", color:"#2c3e50" }}>
                • {Object.values(r).join(" | ")}
              </Typography>
            ))}
            {extra && <Typography sx={{ mt:1, fontWeight:700, color:"#2c3e50" }}>{extra}</Typography>}
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <GhostBtn onClick={onClose}>Cerrar</GhostBtn>
        <PrimaryBtn
          onClick={()=> exportPDF(head as any, body as any, title || "Reporte", `${filename || "reporte"}.pdf`, extra)}
        >
          Exportar PDF
        </PrimaryBtn>
        <PrimaryBtn
          onClick={()=> exportExcel(rows as any[], `${filename || "reporte"}.xlsx`)}
        >
          Exportar Excel
        </PrimaryBtn>
      </DialogActions>
    </Dialog>
  );
}

// Dialogo genérico para "placeholder" de los demás modales
interface PlaceholderDialogProps {
  open: boolean;
  onClose: () => void;
  title: React.ReactNode;
}

function PlaceholderDialog({ open, onClose, title }: PlaceholderDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent dividers>
        <GradientInfoBox>
          <Typography variant="h6" sx={{ color: '#1976d2', mb: 1 }}>Vista previa</Typography>
          <Typography>En la versión final, aquí irá el contenido completo de este módulo con el mismo look & feel del mockup, basado en componentes MUI.</Typography>
        </GradientInfoBox>
      </DialogContent>
      <DialogActions>
        <GhostBtn onClick={onClose}>Cerrar</GhostBtn>
      </DialogActions>
    </Dialog>
  );
}

export default function AdminPanelMUI() {
  const downSm = useMediaQuery('(max-width:768px)');
  const router = useRouter();

  // Estado de modales
  const [openCreateUser, setOpenCreateUser] = React.useState(false);
  const [openSearchUser, setOpenSearchUser] = React.useState(false);
  const [openDeleteUser, setOpenDeleteUser] = React.useState(false);
  const [openVehicles, setOpenVehicles] = React.useState(false);
  const [openSchedule, setOpenSchedule] = React.useState(false);
  const [openReassign, setOpenReassign] = React.useState(false);
  const [openCancel, setOpenCancel] = React.useState(false);
  const [openCreateService, setOpenCreateService] = React.useState(false);
  const [openCatalog, setOpenCatalog] = React.useState(false);
  const [openDeleteService, setOpenDeleteService] = React.useState(false);
  const [openProviders, setOpenProviders] = React.useState(false);
  const [openSpareparts, setOpenSpareparts] = React.useState(false);
  const [openReports, setOpenReports] = React.useState(false);
  // Estado compartido de citas (mock para demo)
  const [appointments, setAppointments] = React.useState([
    { id: "CITA-001", client: "Juan Pérez", vehicle: "Toyota Corolla 2020 (ABC-123)", service: "Cambio de aceite", date: "2025-10-27", time: "09:00", mechanic: "Luis González" },
    { id: "CITA-002", client: "María García", vehicle: "Honda Civic 2019 (XYZ-789)", service: "Servicio de frenos", date: "2025-10-27", time: "10:00", mechanic: "Carlos Rodríguez" },
    { id: "CITA-003", client: "Carlos Ruiz", vehicle: "Yamaha FZ 2021 (DEF-456)", service: "Revisión general", date: "2025-10-28", time: "14:00", mechanic: "Ana Fernández" },
  ]);

  // Estado compartido de servicios (mock para demo)
  const [services, setServices] = React.useState<Service[]>([
    { id: "SRV-001", name: "Cambio de aceite", category: "Mantenimiento", price: 80000, duration: 60, description: "Aceite + filtro" },
  ]);

  const [providers, setProviders] = React.useState<Provider[]>([
    { id:"PRV-001", name:"AutoParts Colombia", contact:"Laura Gómez", phone:"300 111 2233", email:"ventas@autoparts.co" },
    { id:"PRV-002", name:"Frenos & Más",      contact:"Jorge Díaz",  phone:"301 555 8899", email:"contacto@frenosymas.com" },
  ]);

  const [parts, setParts] = React.useState<Part[]>([
    { id:"SKU-1001", name:"Pastillas de freno Delanteras", sku:"PF-DEL-001", stock:18, minStock:6,  price:95000,  providerId:"PRV-002" },
    { id:"SKU-2002", name:"Aceite 10W40 4L",               sku:"ACE-10W40",  stock:32, minStock:10, price:78000,  providerId:"PRV-001" },
    { id:"SKU-3003", name:"Filtro de aire",                 sku:"FIL-AIR-01", stock:7,  minStock:8,  price:42000,  providerId:"PRV-001" },
  ]);

  const [reportKind, setReportKind] = React.useState<"citas"|"mecanicos"|"inventario"|"financiero"|null>(null);

  const logout = () => {
    if (window.confirm('¿Estás seguro de que deseas cerrar sesión?')) {
      localStorage.removeItem('token'); // opcional si usas auth
      router.push('/'); // 👈 redirige al login
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ minHeight: '100vh', backgroundColor: '#f8f9fa', color: '#2d3436' }}>
        <HeaderBar position="sticky">
          <Toolbar sx={{ maxWidth: 1200, width: '100%', mx: 'auto', px: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', flex: 1 }}>AutoLink Manager</Typography>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography>Admin</Typography>
              <Avatar sx={{ width: 40, height: 40, backgroundColor: '#e74c3c', fontWeight: 'bold' }}>A</Avatar>
              <Button onClick={logout} startIcon={<LogoutIcon/>} sx={{
                background: 'rgba(255,255,255,0.2)', color: '#fff', textTransform:'none',
                '&:hover': { background: 'rgba(255,255,255,0.3)' }
              }}>Salir</Button>
            </Stack>
          </Toolbar>
        </HeaderBar>

        <Container maxWidth="lg" sx={{ py: 4 }}>
          {/* Welcome */}
          <WelcomeSection>
            <Typography variant={downSm? 'h5':'h4'} sx={{ color:'#2c3e50', fontWeight:'bold', mb: .5 }}>Panel de Administración</Typography>
            <Typography sx={{ color:'#6b6e6e', fontSize:'1.1rem' }}>Gestiona todos los aspectos de tu taller mecánico desde un solo lugar</Typography>
          </WelcomeSection>

          {/* Quick stats */}
          <Grid container spacing={3} sx={{ my: 1 }}>
            <Grid size={ { xs: 12, md: 3 } }><StatCard value={156} label="Usuarios Totales" /></Grid>
            <Grid size={ { xs: 12, md: 3 } }><StatCard value={89} label="Vehículos Registrados" /></Grid>
            <Grid size={ { xs: 12, md: 3 } }><StatCard value={23} label="Citas Hoy" /></Grid>
            <Grid size={ { xs: 12, md: 3 } }><StatCard value={12} label="Servicios Disponibles" /></Grid>
          </Grid>

          {/* Admin modules */}
          <Grid container spacing={3} sx={{ mt: 1 }}>
            {/* Gestión de Usuarios */}
            <Grid size={ { xs: 12, md: 6 } }>
              <ModuleCard
                title="Gestión de Usuarios"
                description="Administra clientes y mecánicos"
                actions={[
                  <PrimaryBtn key="cu" startIcon={<AddIcon/>} onClick={()=>setOpenCreateUser(true)}>Crear Usuario</PrimaryBtn>,
                  <GhostBtn key="co" startIcon={<SearchIcon/>} onClick={()=>setOpenSearchUser(true)}>Consultar</GhostBtn>,
                  <DangerBtn key="el" startIcon={<DeleteOutlineIcon/>} onClick={()=>setOpenDeleteUser(true)}>Eliminar</DangerBtn>
                ]}
              />
            </Grid>

            {/* Gestión de Citas */}
            <Grid size={ { xs: 12, md: 6 } }>
              <ModuleCard
                title="Gestión de Citas"
                description="Agenda, cancela y reasigna citas"
                actions={[
                  <PrimaryBtn key="ag" startIcon={<EventIcon/>} onClick={()=>setOpenSchedule(true)}>Agendar Cita</PrimaryBtn>,
                  <GhostBtn key="re" onClick={()=>setOpenReassign(true)}>Reasignar</GhostBtn>,
                  <DangerBtn key="ca" onClick={()=>setOpenCancel(true)}>Cancelar</DangerBtn>
                ]}
              />
            </Grid>

            {/* Gestión de Vehículos */}
            <Grid size={ { xs: 12, md: 6 } }>
              <ModuleCard
                title="Gestión de Vehículos"
                description="Consulta información de vehículos registrados"
                actions={[
                  <PrimaryBtn key="vv" startIcon={<DirectionsCarFilledIcon/>} onClick={()=>setOpenVehicles(true)}>Ver Vehículos</PrimaryBtn>
                ]}
              />
            </Grid>

            {/* Catálogo de Servicios */}
            <Grid size={ { xs: 12, md: 6 } }>
              <ModuleCard
                title="Catálogo de Servicios"
                description="Administra los servicios disponibles"
                actions={[
                  <PrimaryBtn key="cs" onClick={()=>setOpenCreateService(true)}>Crear Servicio</PrimaryBtn>,
                  <GhostBtn key="ct" onClick={()=>setOpenCatalog(true)}>Catálogo</GhostBtn>,
                  <DangerBtn key="ds" onClick={()=>setOpenDeleteService(true)}>Eliminar</DangerBtn>
                ]}
              />
            </Grid>

            {/* Gestión de Inventario */}
            <Grid size={ { xs: 12, md: 6 } }>
              <ModuleCard
                title="Gestión de Inventario"
                description="Administra proveedores y repuestos"
                actions={[
                  <PrimaryBtn key="pr" onClick={()=>setOpenProviders(true)}>Proveedores</PrimaryBtn>,
                  <PrimaryBtn key="rp" onClick={()=>setOpenSpareparts(true)}>Repuestos</PrimaryBtn>
                ]}
              />
            </Grid>

            {/* Reportes Operativos */}
            <Grid size={ { xs: 12, md: 6 } }>
              <ModuleCard
                title="Reportes Operativos"
                description="Genera informes y estadísticas del taller"
                actions={[
                  <PrimaryBtn key="rc" onClick={()=>{ setReportKind("citas"); setOpenReports(true); }}>Citas</PrimaryBtn>,
                  <PrimaryBtn key="rm" onClick={()=>{ setReportKind("mecanicos"); setOpenReports(true); }}>Mecánicos</PrimaryBtn>,
                  <PrimaryBtn key="ri" onClick={()=>{ setReportKind("inventario"); setOpenReports(true); }}>Inventario</PrimaryBtn>,
                  <PrimaryBtn key="rf" onClick={()=>{ setReportKind("financiero"); setOpenReports(true); }}>Financiero</PrimaryBtn>
                ]}
              />
            </Grid>
          </Grid>
        </Container>

        {/* Modales implementados */}
        <CreateUserDialog open={openCreateUser} onClose={()=>setOpenCreateUser(false)} />
        <SearchUserDialog open={openSearchUser} onClose={()=>setOpenSearchUser(false)} />
        <VehiclesDialog open={openVehicles} onClose={()=>setOpenVehicles(false)} />
        <ScheduleAppointmentDialog open={openSchedule} onClose={()=>setOpenSchedule(false)} />
        <DeleteUserDialog open={openDeleteUser} onClose={()=>setOpenDeleteUser(false)} />
        <ReassignAppointmentDialog open={openReassign} onClose={()=>setOpenReassign(false)} appointments={appointments} setAppointments={setAppointments} />
        <CancelAppointmentDialog open={openCancel} onClose={()=>setOpenCancel(false)} appointments={appointments} setAppointments={setAppointments} />
        <CreateServiceDialog open={openCreateService} onClose={()=>setOpenCreateService(false)} onCreate={(srv)=>setServices(prev=>[srv, ...prev])} />
        <ServicesCatalogDialog open={openCatalog} onClose={()=>setOpenCatalog(false)} services={services} setServices={setServices} />
        <DeleteServiceDialog open={openDeleteService} onClose={()=>setOpenDeleteService(false)} services={services} setServices={setServices} />
        <ProvidersDialog open={openProviders} onClose={()=>setOpenProviders(false)} providers={providers} setProviders={setProviders} />
        <SparepartsDialog open={openSpareparts} onClose={()=>setOpenSpareparts(false)} parts={parts} setParts={setParts} providers={providers} />
        <ReportsDialog open={openReports} onClose={()=>setOpenReports(false)} kind={reportKind} appointments={appointments} services={services} parts={parts} providers={providers} />
      </Box>
    </ThemeProvider>
  );
}
