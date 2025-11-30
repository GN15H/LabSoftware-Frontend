import React from "react";
import { Part, Provider } from "../AdminGateway";
import Grid from "@mui/material/Grid";
import {
  Typography,
  Box,
  Paper,
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
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { ListItemCard, GhostBtn, PrimaryBtn } from "../AdminGateway.components";
import { Supplier } from "@/domain/models/Supplier";
import { Supply } from "@/domain/models/Supply";
import { SupplyData } from "../AdminGateway.types";

interface SparepartsDialogProps {
  open: boolean; onClose: () => void;
  parts: Supply[];
  setParts: React.Dispatch<React.SetStateAction<Supply[]>>;
  suppliers: Supplier[]
  createSupply: (data: SupplyData) => void;
  updateSupply: (id: number, data: SupplyData) => void;
}

export function SparepartsDialog({
  open, onClose, parts, setParts, suppliers, createSupply, updateSupply
}: SparepartsDialogProps) {
  const [query, setQuery] = React.useState("");
  const [editing, setEditing] = React.useState<Supply | null>(null);
  const [form, setForm] = React.useState<SupplyData>({ name: "", stock: 0, minStock: 0, price: "0", supplierId: 1 });

  React.useEffect(() => { if (!open) { setQuery(""); setEditing(null); setForm({ name: "", stock: 0, minStock: 0, price: "0", supplierId: undefined }); } }, [open]);

  const filtered = parts.filter(p => {
    const q = query.toLowerCase().trim(); if (!q) return true;
    return p.name.toLowerCase().includes(q);
  });

  const startEdit = (s: Supply) => { setEditing(s); setForm({ name: s.name, stock: s.amount, minStock: s.minStock, price: s.price.toString(), supplierId: s.supplierId }); };
  const clearForm = () => { setEditing(null); setForm({ name: "", stock: 0, minStock: 0, price: "0", supplierId: undefined }); };

  // const save = () => {
  //   if (!form.name || !form.sku) return;
  //   if (editing) {
  //     setParts(prev => prev.map(x => x.id === editing.id ? form : x));
  //     clearForm();
  //   } else {
  //     const id = `SKU-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
  //     setParts(prev => [{ ...form, id }, ...prev]);
  //     clearForm();
  //   }
  // };

  // const remove = (id: string) => setParts(prev => prev.filter(p => p.id !== id));
  // const adjust = (id: string, delta: number) => setParts(prev => prev.map(p => p.id === id ? { ...p, stock: Math.max(0, p.stock + delta) } : p));
  //

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle>Gestión de Repuestos</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          {/* Lista + búsqueda */}
          <Grid size={{ xs: 12, md: 8 }}>
            <TextField
              fullWidth placeholder="Buscar por ID, nombre o SKU..."
              value={query} onChange={e => setQuery(e.target.value)}
              InputProps={{ startAdornment: <SearchIcon sx={{ mr: 1 }} /> }}
              sx={{ mb: 2 }}
            />

            <Box sx={{ maxHeight: 420, overflowY: 'auto' }}>
              {filtered.map(p => (
                <ListItemCard key={p.id} onClick={() => {
                  console.log(p);
                  startEdit(p);
                }} sx={{
                  border: '1px solid #ecf0f1', backgroundColor: p.amount <= p.minStock ? '#fff3cd' : '#f8f9fa'
                }}>
                  <Box>
                    <Typography sx={{ fontWeight: 'bold', color: '#2c3e50' }}>
                      {p.id} • {p.name}
                    </Typography>
                    <Typography sx={{ fontSize: '.85rem', color: '#7f8c8d' }}>
                      Stock: {p.amount} • Min: {p.minStock} • ${p.price.toLocaleString()}
                    </Typography>
                  </Box>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <IconButton aria-label="Eliminar" color="error" onClick={(e) => {
                      e.stopPropagation();
                      console.log("remover")
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

          {/* Form crear/editar */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper sx={{ p: 2, borderRadius: 2, bgcolor: '#f8f9fa' }}>
              <Typography sx={{ fontWeight: 800, color: '#2c3e50', mb: 1 }}>
                {editing ? "Editar repuesto" : "Nuevo repuesto"}
              </Typography>
              <Stack spacing={1.5}>
                <TextField label="Nombre*" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} fullWidth />
                <TextField label="Stock" type="number" value={form.stock} onChange={e => setForm({ ...form, stock: Number(e.target.value) })} fullWidth />
                <TextField label="Stock mínimo" type="number" value={form.minStock} onChange={e => setForm({ ...form, minStock: Number(e.target.value) })} fullWidth />
                <TextField label="Precio (COP)" type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} fullWidth />
                <FormControl fullWidth>
                  <InputLabel>Proveedor</InputLabel>
                  <Select label="Proveedor" value={form.supplierId ?? ""} onChange={e => setForm({ ...form, supplierId: e.target.value })}>
                    <MenuItem value="">— Sin proveedor —</MenuItem>
                    {suppliers.map(p => <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>)}
                  </Select>
                </FormControl>

                <Stack direction="row" spacing={1}>
                  <GhostBtn onClick={clearForm}>Limpiar</GhostBtn>
                  <PrimaryBtn onClick={() => {
                    if (editing)
                      updateSupply(editing.id, form);
                    else
                      createSupply(form);
                  }} startIcon={<AddIcon />} disabled={!form.name || !form.price || !form.supplierId}>
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
