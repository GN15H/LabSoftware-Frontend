import React from "react";
import Grid from "@mui/material/Grid";
import {
  Box,
  Typography,
  Chip,
  Stack,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import AssignmentIcon from "@mui/icons-material/Assignment";
import SearchIcon from "@mui/icons-material/Search";
import { GhostBtn, ListItemCard, PrimaryBtn } from "../AdminGateway.components";
import { Service } from "@/domain/models/Service";

interface ServicesCatalogDialogProps {
  open: boolean;
  onClose: () => void;
  services: Service[];
  setServices: React.Dispatch<React.SetStateAction<Service[]>>;
  updateService: (id: number, name: string, price: bigint) => void;
}

export function ServicesCatalogDialog({
  open, onClose, services, updateService
}: ServicesCatalogDialogProps) {
  const [query, setQuery] = React.useState("");
  const [editing, setEditing] = React.useState<Service | null>(null);

  React.useEffect(() => { if (!open) { setQuery(""); setEditing(null); } }, [open]);

  const filtered = services.filter(s => {
    const q = query.toLowerCase().trim();
    if (!q) return true;
    return (
      s.name.toLowerCase().includes(q)
    );
  });

  const saveEdit = () => {
    if (!editing) return;
    // setServices(prev => prev.map(s => s.id === editing.id ? editing : s));
    // setEditing(null);
    updateService(editing.id, editing.name, editing.price);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Catálogo de Servicios</DialogTitle>
      <DialogContent dividers>
        <TextField
          fullWidth
          placeholder="Buscar"
          value={query}
          onChange={e => setQuery(e.target.value)}
          InputProps={{ startAdornment: <SearchIcon sx={{ mr: 1 }} /> }}
          sx={{ mb: 2 }}
        />

        <Box sx={{ maxHeight: 420, overflowY: "auto" }}>
          {filtered.map(s => (
            <ListItemCard
              key={s.id}
              onClick={() => {
                setEditing(s)
              }}
              sx={{ border: '1px solid #ecf0f1', backgroundColor: '#f8f9fa' }}
            >
              <Box>
                <Typography sx={{ fontWeight: 'bold', color: '#2c3e50' }}>
                  {s.id} • {s.name} • {s.price.toLocaleString()}
                </Typography>
              </Box>
              <Chip label="Editar" />
            </ListItemCard>
          ))}
          {filtered.length === 0 && <Typography sx={{ color: '#7f8c8d' }}>Sin resultados.</Typography>}
        </Box>

        {/* Panel de edición rápida */}
        {editing && (
          <Box sx={{ mt: 2, p: 2, border: '1px solid #a5d6a7', borderRadius: 2, background: 'linear-gradient(135deg, #e8f5e9, #e3f2fd)' }}>
            <Typography sx={{ fontWeight: 800, color: '#2e7d32', mb: 1 }}>Editar servicio</Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField label="Nombre" value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })} fullWidth />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField label="Precio (COP)" type="number" value={editing.price}
                  onChange={e => setEditing({ ...editing, price: BigInt(e.target.value) })} fullWidth />
              </Grid>
            </Grid>
            <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
              <GhostBtn onClick={() => setEditing(null)}>Cancelar</GhostBtn>
              <PrimaryBtn onClick={() => {
                saveEdit();
              }} startIcon={<AssignmentIcon />}>Guardar cambios</PrimaryBtn>
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
