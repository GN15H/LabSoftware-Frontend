import React from "react";
import {
  Typography,
  Box,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { DangerBtn, GhostBtn, ListItemCard } from "../AdminGateway.components";
import { Service } from "@/domain/models/Service";

interface DeleteServiceDialogProps {
  open: boolean;
  onClose: () => void;
  services: Service[];
  removeService: (id: number) => void;
}

export function DeleteServiceDialog({
  open, onClose, services, removeService
}: DeleteServiceDialogProps) {
  const [query, setQuery] = React.useState("");
  const [selected, setSelected] = React.useState<Service | null>(null);
  const [confirmOpen, setConfirmOpen] = React.useState(false);

  React.useEffect(() => { if (!open) { setQuery(""); setSelected(null); setConfirmOpen(false); } }, [open]);

  const filtered = services.filter(s => {
    const q = query.toLowerCase().trim();
    if (!q) return true;
    return s.name.toLowerCase().includes(q);
  });

  const askDelete = (srv: Service) => { setSelected(srv); setConfirmOpen(true); };
  const executeDelete = () => {
    if (!selected) return;
    removeService(selected.id);
    setConfirmOpen(false);
    onClose();
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>Eliminar Servicio</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ backgroundColor: '#fff3cd', border: '1px solid #ffeaa7', color: '#856404', p: 2, borderRadius: 2, mb: 2 }}>
            <Typography fontWeight={700}>⚠️ Advertencia:</Typography>
            <Typography fontSize=".9rem">Esta acción no se puede deshacer.</Typography>
          </Box>

          <TextField
            fullWidth
            placeholder="Buscar por ID, nombre o categoría..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            InputProps={{ startAdornment: <SearchIcon sx={{ mr: 1 }} /> }}
            sx={{ mb: 2 }}
          />

          <Box sx={{ maxHeight: 360, overflowY: 'auto' }}>
            {filtered.map(s => (
              <ListItemCard key={s.id}
                onClick={() => askDelete(s)}
                sx={{ '&:hover': { backgroundColor: '#f8d7da', border: '1px solid #f5c6cb' } }}>
                <Box>
                  <Typography sx={{ fontWeight: 'bold', color: '#2c3e50' }}>{s.id} • {s.name}</Typography>
                  <Typography sx={{ fontSize: '.85rem', color: '#7f8c8d' }}>
                    {s.name} • ${s.price.toLocaleString()}
                  </Typography>
                </Box>
                <IconButton aria-label="Eliminar" color="error" onClick={(e) => { e.stopPropagation(); askDelete(s); }}>
                  <DeleteOutlineIcon />
                </IconButton>
              </ListItemCard>
            ))}
            {filtered.length === 0 && <Typography sx={{ color: '#7f8c8d' }}>Sin resultados.</Typography>}
          </Box>
        </DialogContent>
        <DialogActions>
          <GhostBtn onClick={onClose}>Cancelar</GhostBtn>
        </DialogActions>
      </Dialog>

      {/* Confirmación */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ backgroundColor: '#f8d7da', border: '1px solid #f5c6cb', borderRadius: 2, p: 2, textAlign: 'center' }}>
            <Typography>¿Eliminar el servicio?</Typography>
            <Typography fontWeight={700} sx={{ my: 1 }}>{selected?.id} — {selected?.name}</Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <GhostBtn onClick={() => setConfirmOpen(false)}>Atrás</GhostBtn>
          <DangerBtn onClick={executeDelete} startIcon={<DeleteOutlineIcon />}>Eliminar definitivamente</DangerBtn>
        </DialogActions>
      </Dialog>
    </>
  );
}
