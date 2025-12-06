import {
  Dialog, DialogTitle, DialogContent,
  Grid, TextField,
  DialogActions, Box, Typography

} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import React from "react";
import { GhostBtn, ListItemCard, Pill } from "../AdminGateway.components";
import { User } from "@/domain/models/User";

interface SearchUserDialogProps {
  open: boolean;
  onClose: () => void;
  users: User[];
}

export function SearchUserDialog({ open, onClose, users }: SearchUserDialogProps) {
  const [detail, setDetail] = React.useState<{ id: string; name: string; info: string; status: string } | null>(null);

  // const users: { id: string; name: string; info: string; status: string }[] = [
  //   { id: 'user1', name: 'Juan Pérez', info: 'CC: 12345678 • Cliente • juan@email.com', status: 'Activo' },
  //   { id: 'user2', name: 'Carlos Rodríguez', info: 'CC: 87654321 • Mecánico • carlos@email.com', status: 'Activo' },
  //   { id: 'user3', name: 'María García', info: 'CC: 11223344 • Cliente • maria@email.com', status: 'Activo' }
  // ];

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Consultar Usuario</DialogTitle>
      <DialogContent dividers>
        {!detail && (
          <Box>
            <TextField fullWidth placeholder="Nombre, documento o correo..." InputProps={{ startAdornment: <SearchIcon sx={{ mr: 1 }} /> }} sx={{ mb: 2 }} />
            <Box sx={{ maxHeight: 300, overflowY: 'auto' }}>
              {users.map(u => (
                <ListItemCard key={u.id}
                //onClick={() => setDetail(u)}
                >
                  <Box>
                    <Typography sx={{ fontWeight: 'bold', color: '#2c3e50' }}>{u.name}</Typography>
                    <Typography sx={{ fontSize: '0.85rem', color: '#7f8c8d' }}>{u.email}</Typography>
                  </Box>
                  {/* <Pill label={u.status} sx={{ backgroundColor: '#d4edda', color: '#155724' }} /> */}
                </ListItemCard>
              ))}
            </Box>
          </Box>
        )}
        {detail && (
          <Box>
            <Typography variant="h6" sx={{ mb: 2 }}>Detalles del Usuario</Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}><Typography fontWeight={700}>Nombre:</Typography><Typography>{detail.name}</Typography></Grid>
              <Grid size={{ xs: 12, md: 6 }}><Typography fontWeight={700}>Documento:</Typography><Typography>{detail.info.split('•')[0]}</Typography></Grid>
              <Grid size={{ xs: 12, md: 6 }}><Typography fontWeight={700}>Email:</Typography><Typography>{detail.info.split('•')[2]}</Typography></Grid>
              <Grid size={{ xs: 12, md: 6 }}><Typography fontWeight={700}>Teléfono:</Typography><Typography>—</Typography></Grid>
              <Grid size={{ xs: 12, md: 6 }}><Typography fontWeight={700}>Rol:</Typography><Typography>{detail.info.includes('Mecánico') ? 'Mecánico' : 'Cliente'}</Typography></Grid>
              <Grid size={{ xs: 12, md: 6 }}><Typography fontWeight={700}>Fecha Registro:</Typography><Typography>—</Typography></Grid>
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
