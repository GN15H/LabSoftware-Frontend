import React from "react";
import Grid from "@mui/material/Grid";
import {
  Typography,
  Box,
  Paper,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import DirectionsCarFilledIcon from "@mui/icons-material/DirectionsCarFilled";
import TwoWheelerIcon from "@mui/icons-material/TwoWheeler";
import { GhostBtn, Pill } from "../AdminGateway.components";
import { Vehicle } from "@/domain/models/Vehicle";
import { VehicleType } from "@/domain/models/types";

interface VehiclesDialogProps {
  open: boolean;
  onClose: () => void;
  vehicles: Vehicle[];
}

export function VehiclesDialog({ open, onClose, vehicles }: VehiclesDialogProps) {

  const renderVehicleIcon = (type: VehicleType) => {
    switch (type) {
      case "bike":
        return <TwoWheelerIcon />
      case "car":
        return <DirectionsCarFilledIcon fontSize="large" />
      case "bus":
        return <DirectionsCarFilledIcon fontSize="large" />
    }
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Gestión de Vehículos</DialogTitle>
      <DialogContent dividers>
        <TextField fullWidth placeholder="Buscar por Placa (Ej: ABC-123)" InputProps={{ startAdornment: <SearchIcon sx={{ mr: 1 }} /> }} sx={{ mb: 2 }} />
        <Box sx={{ maxHeight: 500, overflowY: 'auto' }}>
          {vehicles.map((c, i) => (
            <Paper key={i} sx={{ display: 'flex', gap: 3, p: 3, mb: 2, border: '2px solid #ecf0f1', borderRadius: 2, backgroundColor: '#f8f9fa', transition: 'all .2s ease', '&:hover': { borderColor: '#3498db', transform: 'translateY(-2px)', boxShadow: '0 4px 15px rgba(52,152,219,.15)' } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 80, height: 80, borderRadius: '50%', color: '#fff', backgroundImage: 'linear-gradient(135deg, #3498db, #2980b9)' }}>
                {renderVehicleIcon(c.vehicleType)}
              </Box>
              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Typography sx={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#2c3e50', flex: 1 }}>{c.brand + ' ' + c.series}</Typography>
                  <Box sx={{ backgroundImage: 'linear-gradient(135deg, #2c3e50, #34495e)', color: '#fff', px: 2, py: 0.5, borderRadius: 1, fontWeight: 'bold', fontSize: '1.1rem', letterSpacing: 1 }}>{c.plateNumber}</Box>
                </Box>
                <Grid container spacing={2}>
                  {/* <Grid size={{ xs: 12, md: 4 }}><Typography sx={{ fontSize: '.8rem', color: '#7f8c8d', fontWeight: 500 }}>Propietario:</Typography><Typography sx={{ fontWeight: 600 }}>{c.owner}</Typography></Grid> */}
                  {/* <Grid size={{ xs: 12, md: 4 }}><Typography sx={{ fontSize: '.8rem', color: '#7f8c8d', fontWeight: 500 }}>Kilometraje:</Typography><Typography sx={{ fontWeight: 600 }}>{c.km}</Typography></Grid> */}
                  <Grid size={{ xs: 12, md: 4 }}><Typography sx={{ fontSize: '.8rem', color: '#7f8c8d', fontWeight: 500 }}>Tipo:</Typography><Typography sx={{ fontWeight: 600 }}>{c.vehicleType}</Typography></Grid>
                  {/* <Grid size={{ xs: 12, md: 4 }}><Typography sx={{ fontSize: '.8rem', color: '#7f8c8d', fontWeight: 500 }}>Estado:</Typography>{c.status === 'Activo' ? (<Pill label="Activo" sx={{ backgroundColor: '#d4edda', color: '#155724' }} />) : (<Pill label="En Servicio" sx={{ backgroundColor: '#fff3cd', color: '#856404' }} />)}</Grid> */}
                  {/* <Grid size={{ xs: 12, md: 4 }}><Typography sx={{ fontSize: '.8rem', color: '#7f8c8d', fontWeight: 500 }}>Último servicio:</Typography><Typography sx={{ fontWeight: 600 }}>{c.last}</Typography></Grid> */}
                  {/* <Grid size={{ xs: 12, md: 4 }}><Typography sx={{ fontSize: '.8rem', color: '#7f8c8d', fontWeight: 500 }}>Próximo servicio:</Typography><Typography sx={{ fontWeight: 600 }}>{c.next}</Typography></Grid> */}
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
