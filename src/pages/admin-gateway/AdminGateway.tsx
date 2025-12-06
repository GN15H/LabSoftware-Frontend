"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Grid from "@mui/material/Grid";
import {
  Toolbar,
  Typography,
  Box,
  Container,
  Avatar,
  Button,
  CardContent,
  Stack,
  useMediaQuery,
  CircularProgress,
  Backdrop,
  Snackbar,
  Alert
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import LogoutIcon from "@mui/icons-material/Logout";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import DirectionsCarFilledIcon from "@mui/icons-material/DirectionsCarFilled";
import EventIcon from "@mui/icons-material/Event";
import "jspdf-autotable";
// import "@/components/admin-gateway/dialogs/"
import { CreateUserDialog } from "@/components/admin-gateway/dialogs/CreateUserDialog";
import { SearchUserDialog } from "@/components/admin-gateway/dialogs/SearchUserDialog";
import { DeleteUserDialog } from "@/components/admin-gateway/dialogs/DeleteUserDialog";
import { VehiclesDialog } from "@/components/admin-gateway/dialogs/VehiclesDialog";
import { ScheduleAppointmentDialog } from "@/components/admin-gateway/dialogs/ScheduleAppointmentDialog";
import { ReassignAppointmentDialog } from "@/components/admin-gateway/dialogs/ReassignAppointmentDialog";
import { CancelAppointmentDialog } from "@/components/admin-gateway/dialogs/CancelAppointmentDialog";
import { CreateServiceDialog } from "@/components/admin-gateway/dialogs/CreateServiceDialog";
import { ServicesCatalogDialog } from "@/components/admin-gateway/dialogs/ServicesCatalogDialog";
import { DeleteServiceDialog } from "@/components/admin-gateway/dialogs/DeleteServiceDialog";
import { ProvidersDialog } from "@/components/admin-gateway/dialogs/ProvidersDialog";
import { SparepartsDialog } from "@/components/admin-gateway/dialogs/SparepartsDialog";
import { ReportsDialog } from "@/components/admin-gateway/dialogs/ReportsDialog"
import { DangerBtn, GhostBtn, HeaderBar, ModuleCardRoot, ModuleHeader, PrimaryBtn, StatCardRoot, WelcomeSection } from "@/components/admin-gateway/AdminGateway.components";
import { useAdminGateway } from "@/hooks/AdminGateway.hook";


// Tema base con tipografía y radio similar al mockup
const theme = createTheme({
  typography: {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
  },
  shape: { borderRadius: 12 }
});

// Contenedores y superficies con gradientes equivalentes

interface StatCardProps {
  value: number | string;
  label: string;
}

export interface Service {
  id: string;
  name: string;
  category: string;
  price: number;
  duration: number;
  description?: string;
}

// Tipos compartidos a nivel de módulo para que todos los componentes puedan referenciarlos
export type Provider = { id: string; name: string; contact: string; phone: string; email: string };
export type Part = { id: string; name: string; sku: string; stock: number; minStock: number; price: number; providerId?: string };

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


export default function AdminGateway() {

  const {
    snack, setSnack,
    isLoading, setLoading,
    services, setServices,
    supplies, setSupplies,
    suppliers, setSuppliers,
    users, //setUsers,
    vehicles, //setVehicles,
    createService, updateService, removeService,
    createSupply, updateSupply, removeSupply,
    createSupplier, updateSupplier, removeSupplier,
    createAppointment, updateAppointment, cancelAppointment,
    createUser, removeUser,
    appointments, //setAppointments
  } = useAdminGateway();

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

  const [reportKind, setReportKind] = React.useState<"citas" | "mecanicos" | "inventario" | "financiero" | null>(null);

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
              <Button onClick={logout} startIcon={<LogoutIcon />} sx={{
                background: 'rgba(255,255,255,0.2)', color: '#fff', textTransform: 'none',
                '&:hover': { background: 'rgba(255,255,255,0.3)' }
              }}>Salir</Button>
            </Stack>
          </Toolbar>
        </HeaderBar>

        <Container maxWidth="lg" sx={{ py: 4 }}>
          {/* Welcome */}
          <WelcomeSection>
            <Typography variant={downSm ? 'h5' : 'h4'} sx={{ color: '#2c3e50', fontWeight: 'bold', mb: .5 }}>Panel de Administración</Typography>
            <Typography sx={{ color: '#6b6e6e', fontSize: '1.1rem' }}>Gestiona todos los aspectos de tu taller mecánico desde un solo lugar</Typography>
          </WelcomeSection>

          {/* Quick stats */}
          <Grid container spacing={3} sx={{ my: 1 }}>
            <Grid size={{ xs: 12, md: 3 }}><StatCard value={156} label="Usuarios Totales" /></Grid>
            <Grid size={{ xs: 12, md: 3 }}><StatCard value={89} label="Vehículos Registrados" /></Grid>
            <Grid size={{ xs: 12, md: 3 }}><StatCard value={23} label="Citas Hoy" /></Grid>
            <Grid size={{ xs: 12, md: 3 }}><StatCard value={12} label="Servicios Disponibles" /></Grid>
          </Grid>

          {/* Admin modules */}
          <Grid container spacing={3} sx={{ mt: 1 }}>
            {/* Gestión de Usuarios */}
            <Grid size={{ xs: 12, md: 6 }}>
              <ModuleCard
                title="Gestión de Usuarios"
                description="Administra clientes y mecánicos"
                actions={[
                  <PrimaryBtn key="cu" startIcon={<AddIcon />} onClick={() => setOpenCreateUser(true)}>Crear Usuario</PrimaryBtn>,
                  <GhostBtn key="co" startIcon={<SearchIcon />} onClick={() => setOpenSearchUser(true)}>Consultar</GhostBtn>,
                  <DangerBtn key="el" startIcon={<DeleteOutlineIcon />} onClick={() => setOpenDeleteUser(true)}>Eliminar</DangerBtn>
                ]}
              />
            </Grid>

            {/* Gestión de Citas */}
            <Grid size={{ xs: 12, md: 6 }}>
              <ModuleCard
                title="Gestión de Citas"
                description="Agenda, cancela y reasigna citas"
                actions={[
                  <PrimaryBtn key="ag" startIcon={<EventIcon />} onClick={() => setOpenSchedule(true)}>Agendar Cita</PrimaryBtn>,
                  <GhostBtn key="re" onClick={() => setOpenReassign(true)}>Reasignar</GhostBtn>,
                  <DangerBtn key="ca" onClick={() => setOpenCancel(true)}>Cancelar</DangerBtn>
                ]}
              />
            </Grid>

            {/* Gestión de Vehículos */}
            <Grid size={{ xs: 12, md: 6 }}>
              <ModuleCard
                title="Gestión de Vehículos"
                description="Consulta información de vehículos registrados"
                actions={[
                  <PrimaryBtn key="vv" startIcon={<DirectionsCarFilledIcon />} onClick={() => setOpenVehicles(true)}>Ver Vehículos</PrimaryBtn>
                ]}
              />
            </Grid>

            {/* Catálogo de Servicios */}
            <Grid size={{ xs: 12, md: 6 }}>
              <ModuleCard
                title="Catálogo de Servicios"
                description="Administra los servicios disponibles"
                actions={[
                  <PrimaryBtn key="cs" onClick={() => setOpenCreateService(true)}>Crear Servicio</PrimaryBtn>,
                  <GhostBtn key="ct" onClick={() => setOpenCatalog(true)}>Catálogo</GhostBtn>,
                  <DangerBtn key="ds" onClick={() => setOpenDeleteService(true)}>Eliminar</DangerBtn>
                ]}
              />
            </Grid>

            {/* Gestión de Inventario */}
            <Grid size={{ xs: 12, md: 6 }}>
              <ModuleCard
                title="Gestión de Inventario"
                description="Administra proveedores y repuestos"
                actions={[
                  <PrimaryBtn key="pr" onClick={() => setOpenProviders(true)}>Proveedores</PrimaryBtn>,
                  <PrimaryBtn key="rp" onClick={() => setOpenSpareparts(true)}>Repuestos</PrimaryBtn>
                ]}
              />
            </Grid>

            {/* Reportes Operativos */}
            <Grid size={{ xs: 12, md: 6 }}>
              <ModuleCard
                title="Reportes Operativos"
                description="Genera informes y estadísticas del taller"
                actions={[
                  <PrimaryBtn key="rc" onClick={() => { setReportKind("citas"); setOpenReports(true); }}>Citas</PrimaryBtn>,
                  <PrimaryBtn key="rm" onClick={() => { setReportKind("mecanicos"); setOpenReports(true); }}>Mecánicos</PrimaryBtn>,
                  <PrimaryBtn key="ri" onClick={() => { setReportKind("inventario"); setOpenReports(true); }}>Inventario</PrimaryBtn>,
                  <PrimaryBtn key="rf" onClick={() => { setReportKind("financiero"); setOpenReports(true); }}>Financiero</PrimaryBtn>
                ]}
              />
            </Grid>
          </Grid>
        </Container>

        {/* Modales implementados */}
        <CreateUserDialog createUser={createUser} open={openCreateUser} onClose={() => setOpenCreateUser(false)} />
        <SearchUserDialog users={users} open={openSearchUser} onClose={() => setOpenSearchUser(false)} />
        <VehiclesDialog vehicles={vehicles} open={openVehicles} onClose={() => setOpenVehicles(false)} />
        <ScheduleAppointmentDialog users={users} services={services} vehicles={vehicles} createAppointment={createAppointment} open={openSchedule} onClose={() => setOpenSchedule(false)} />
        <ReassignAppointmentDialog rescheduleAppointment={updateAppointment} open={openReassign} onClose={() => setOpenReassign(false)} appointments={appointments} />
        <CancelAppointmentDialog open={openCancel} onClose={() => setOpenCancel(false)} appointments={appointments} cancelAppointment={cancelAppointment} />
        <DeleteUserDialog users={users} removeUser={removeUser} open={openDeleteUser} onClose={() => setOpenDeleteUser(false)} />
        <CreateServiceDialog open={openCreateService} onClose={() => setOpenCreateService(false)} onCreate={createService} />
        <ServicesCatalogDialog updateService={updateService} open={openCatalog} onClose={() => setOpenCatalog(false)} services={services} setServices={setServices} />
        <DeleteServiceDialog open={openDeleteService} onClose={() => setOpenDeleteService(false)} services={services} removeService={removeService} />
        <ProvidersDialog removeSupplier={removeSupplier} updateSupplier={updateSupplier}
          createSupplier={createSupplier} open={openProviders} onClose={() => setOpenProviders(false)} providers={suppliers} setProviders={setSuppliers} />
        <SparepartsDialog open={openSpareparts} onClose={() => setOpenSpareparts(false)}
          parts={supplies} setParts={setSupplies} suppliers={suppliers} createSupply={createSupply} updateSupply={updateSupply} removeSupply={removeSupply} />
        <ReportsDialog open={openReports} onClose={() => setOpenReports(false)} kind={reportKind} appointments={appointments} services={services} supplies={supplies} suppliers={suppliers} />
      </Box>
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
    </ThemeProvider>

  );
}
