import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import Grid from "@mui/material/Grid"; // Grid v2
import { PALETA } from "../ClientPalette";
import { fieldSx } from "../ClientGateway";
import { SetStateAction } from "react";
import { VehicleData, VehicleItem } from "../ClientGateway.types";

interface RegisterVehicleProps {
  vehicleOpen: boolean;
  vehForm: VehicleData;
  submitVehicle: (e: React.FormEvent) => void;
  setVehicleOpen: React.Dispatch<SetStateAction<boolean>>;
  setVehForm: React.Dispatch<SetStateAction<VehicleData>>;
}

export const RegisterVehicle = ({ setVehForm, setVehicleOpen, vehicleOpen, vehForm, submitVehicle }: RegisterVehicleProps) => {
  return (
    <Dialog open={vehicleOpen} onClose={() => setVehicleOpen(false)} fullWidth maxWidth="sm">
      <DialogTitle>Registrar Nuevo Vehículo</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField fullWidth label="Marca" value={vehForm.brand} onChange={(e) => setVehForm({ ...vehForm, brand: e.target.value })} sx={fieldSx()} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField fullWidth label="Modelo" value={vehForm.model} onChange={(e) => setVehForm({ ...vehForm, model: e.target.value })} sx={fieldSx()} />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField type="number" fullWidth label="Año" value={vehForm.year} onChange={(e) => setVehForm({ ...vehForm, year: e.target.value })} sx={fieldSx()} />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField fullWidth label="Placa" value={vehForm.plate} onChange={(e) => setVehForm({ ...vehForm, plate: e.target.value })} sx={fieldSx()} />
          </Grid>
          {/* <Grid size={{ xs: 12, sm: 4 }}> */}
          {/*   <TextField type="number" fullWidth label="Kilometraje" value={vehForm.km} onChange={(e) => setVehForm({ ...vehForm, km: e.target.value })} sx={fieldSx()} /> */}
          {/* </Grid> */}
          <Grid size={{ xs: 12 }}>
            <FormControl fullWidth sx={fieldSx()}>
              <InputLabel>Tipo de Vehículo</InputLabel>
              <Select label="Tipo de Vehículo" value={vehForm.type} onChange={(e) => setVehForm({ ...vehForm, type: e.target.value as VehicleItem })}>
                <MenuItem value="Carro">Carro</MenuItem>
                <MenuItem value="Moto">Moto</MenuItem>
                <MenuItem value="Bus">Bus</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setVehicleOpen(false)} sx={{ bgcolor: "#eee7e1", color: "rgb(80,80,80)", "&:hover": { bgcolor: "#dad6d3" } }}>Cancelar</Button>
        <Button onClick={submitVehicle as any} sx={{ bgcolor: PALETA.naranja, color: "#fff", "&:hover": { bgcolor: PALETA.naranjaHover } }}>Registrar</Button>
      </DialogActions>
    </Dialog>
  );
}
