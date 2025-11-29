import {
  Dialog, DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  IconButton,
  TextField
} from "@mui/material"
import SearchIcon from "@mui/icons-material/Search";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import React from "react";
import { DangerBtn, GhostBtn, ListItemCard } from "../AdminGateway.components";

interface DeleteUserDialogProps {
  open: boolean;
  onClose: () => void;
}

export function DeleteUserDialog({
  open,
  onClose,
}: DeleteUserDialogProps) {
  type User = { id: string; name: string; doc: string; role: string; meta?: string };

  const [query, setQuery] = React.useState("");
  const [users, setUsers] = React.useState<User[]>([
    { id: "user1", name: "Juan Pérez", doc: "CC: 12345678", role: "Cliente", meta: "2 vehículos" },
    { id: "user2", name: "Carlos Rodríguez", doc: "CC: 87654321", role: "Mecánico", meta: "15 citas" },
    { id: "user3", name: "María García", doc: "CC: 11223344", role: "Cliente", meta: "1 vehículo" },
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
