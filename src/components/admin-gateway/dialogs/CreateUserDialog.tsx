import {
  Dialog, DialogTitle, DialogContent,
  Grid, TextField, FormControl, InputLabel, Select, MenuItem,
  DialogActions,

} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import React from "react";
import { GhostBtn, PrimaryBtn } from "../AdminGateway.components";
import { UserData } from "@/types/AdminGateway.types";

interface CreateUserDialogProps {
  open: boolean;
  onClose: () => void;
  createUser: (data: UserData) => void;
}

export function CreateUserDialog({ open, onClose, createUser }: CreateUserDialogProps) {
  // const [role, setRole] = React.useState("");
  // const [specialty, setSpecialty] = React.useState("");

  const [form, setForm] = React.useState<UserData>({
    name: "", lastName: "", dni: "", email: "", userType: 0, password: "", confirmPassword: "", birthDate: ""
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [e.target.name as string]: e.target.value });

  const submit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }
    createUser(form);
    onClose();
    // setRole("");
    // setSpecialty("");
    setForm({ name: "", lastName: "", dni: "", email: "", userType: 0, password: "", confirmPassword: "", birthDate: "" });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Crear Nuevo Usuario</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2} sx={{ mt: 0 }} component="form" onSubmit={submit}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField label="Nombre*" name="name" fullWidth required onChange={handleChange} />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField label="Apellido*" name="lastName" fullWidth required onChange={handleChange} />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField label="Número de Documento*" name="dni" fullWidth required onChange={handleChange} />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField label="Correo Electrónico*" type="email" name="email" fullWidth required onChange={handleChange} />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              label="Fecha de Nacimiento"
              type="date"
              name="birthDate"
              onChange={handleChange}
              // InputLabelProps={{ shrink: true }}
              fullWidth
              slotProps={{ inputLabel: { shrink: true } }}
              variant="outlined"
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <FormControl fullWidth required>
              <InputLabel>Rol de Usuario*</InputLabel>
              <Select label="Rol de Usuario*" value={form.userType} onChange={(e) => setForm(prev => ({ ...prev, userType: e.target.value }))} name="userType">
                <MenuItem value={0}>Seleccionar rol...</MenuItem>
                <MenuItem value={3}>Cliente</MenuItem>
                <MenuItem value={2}>Mecánico</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          {/* {role === 'mecanico' && ( */}
          {/*   <Grid size={{ xs: 12, md: 6 }}> */}
          {/*     <FormControl fullWidth required> */}
          {/*       <InputLabel>Especialidad (Mecánico)</InputLabel> */}
          {/*       <Select label="Especialidad (Mecánico)" value={specialty} onChange={(e) => setSpecialty(e.target.value)} name="specialty"> */}
          {/*         <MenuItem value="">Seleccionar...</MenuItem> */}
          {/*         <MenuItem value="motor">Motor</MenuItem> */}
          {/*         <MenuItem value="frenos">Frenos</MenuItem> */}
          {/*         <MenuItem value="suspension">Suspensión</MenuItem> */}
          {/*         <MenuItem value="electrico">Sistema Eléctrico</MenuItem> */}
          {/*         <MenuItem value="general">General</MenuItem> */}
          {/*       </Select> */}
          {/*     </FormControl> */}
          {/*   </Grid> */}
          {/* )} */}

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField label="Contraseña*" name="password" type="password" required fullWidth onChange={handleChange} />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField label="Confirmar Contraseña*" name="confirmPassword" type="password" required fullWidth onChange={handleChange} />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <GhostBtn onClick={onClose}>Cancelar</GhostBtn>
        <PrimaryBtn onClick={submit} startIcon={<AddIcon />}>Crear Usuario</PrimaryBtn>
      </DialogActions>
    </Dialog>
  );
}
