import React from "react";
import { Provider } from "../AdminGateway";
import {
  Typography,
  Grid,
  Paper,
  IconButton,
  Stack,
  Box,
  Chip,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import SearchIcon from "@mui/icons-material/Search";
import { GhostBtn, ListItemCard, PrimaryBtn } from "../AdminGateway.components";
import { Supplier } from "@/domain/models/Supplier";
import { SupplierData } from "../AdminGateway.types";

interface ProvidersDialogProps {
  open: boolean; onClose: () => void;
  providers: Supplier[];
  setProviders: React.Dispatch<React.SetStateAction<Supplier[]>>;
  createSupplier: (data: SupplierData) => void;
  updateSupplier: (id: number, data: SupplierData) => void;
}

export function ProvidersDialog({
  open, onClose, providers, setProviders, createSupplier, updateSupplier
}: ProvidersDialogProps) {
  const [query, setQuery] = React.useState("");
  const [form, setForm] = React.useState<SupplierData>({ name: "", phone: "", email: "" });
  const [selectedSupplier, setSelectedSupplier] = React.useState<Supplier | null>(null);

  React.useEffect(() => { if (!open) { setQuery(""); setForm({ name: "", phone: "", email: "" }); setSelectedSupplier(null); } }, [open]);

  const filtered = providers.filter(p => {
    const q = query.toLowerCase().trim(); if (!q) return true;
    return p.name.toLowerCase().includes(q) || p.phone.toLowerCase().includes(q) || p.email.toLowerCase().includes(q);
  });

  const startEdit = (s: Supplier) => { setSelectedSupplier(s); setForm({ name: s.name, phone: s.phone, email: s.email }); };
  const cancelEdit = () => { setSelectedSupplier(null); setForm({ name: "", phone: "", email: "" }); };

  // const save = () => {
  //   if (!form.name || !form.contact) return;
  //   if (editingId) {
  //     setProviders(prev => prev.map(p => p.id === editingId ? form : p));
  //     cancelEdit();
  //   } else {
  //     const id = `PRV-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
  //     setProviders(prev => [{ ...form, id }, ...prev]);
  //     cancelEdit();
  //   }
  // };

  // const remove = (id: string) => setProviders(prev => prev.filter(p => p.id !== id));

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Gestión de Proveedores</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          {/* Lista y búsqueda */}
          <Grid size={{ xs: 12, md: 7 }}>
            <TextField
              fullWidth placeholder="Buscar por ID, nombre, contacto o email..."
              value={query} onChange={e => setQuery(e.target.value)}
              InputProps={{ startAdornment: <SearchIcon sx={{ mr: 1 }} /> }}
              sx={{ mb: 2 }}
            />
            <Box sx={{ maxHeight: 380, overflowY: 'auto' }}>
              {filtered.map(p => (
                <ListItemCard key={p.id} onClick={() => {
                  // console.log('editar');
                  startEdit(p)
                }} sx={{ border: '1px solid #ecf0f1' }}>
                  <Box>
                    <Typography sx={{ fontWeight: 'bold', color: '#2c3e50' }}>{p.id} • {p.name}</Typography>
                    <Typography sx={{ fontSize: '.85rem', color: '#7f8c8d' }}>{p.phone} • {p.email}</Typography>
                  </Box>
                  <Stack direction="row" spacing={1}>
                    <Chip label="Editar" />
                    <IconButton aria-label="Eliminar" color="error" onClick={(e) => {
                      e.stopPropagation();
                      console.log("remover item");
                      // remove(p.id);
                    }}>
                      <DeleteOutlineIcon />
                    </IconButton>
                  </Stack>
                </ListItemCard>
              ))}
              {filtered.length === 0 && <Typography sx={{ color: '#7f8c8d' }}>Sin resultados.</Typography>}
            </Box>
          </Grid>

          {/* Formulario crear/editar */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Paper sx={{ p: 2, borderRadius: 2, bgcolor: '#f8f9fa' }}>
              <Typography sx={{ fontWeight: 800, color: '#2c3e50', mb: 1 }}>
                {selectedSupplier ? "Editar proveedor" : "Nuevo proveedor"}
              </Typography>
              <Stack spacing={1.5}>
                <TextField label="Nombre*" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} fullWidth />
                <TextField label="Teléfono" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} fullWidth />
                <TextField label="Email" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} fullWidth />
                <Stack direction="row" spacing={1}>
                  <GhostBtn onClick={cancelEdit}>Limpiar</GhostBtn>
                  <PrimaryBtn onClick={() => {
                    if (selectedSupplier)
                      updateSupplier(selectedSupplier.id, form);
                    else
                      createSupplier(form);
                  }} startIcon={<AddIcon />} disabled={!form.name || !form.email || !form.phone}>
                    {selectedSupplier ? "Guardar cambios" : "Crear"}
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
