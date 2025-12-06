import React from "react";
import Grid from "@mui/material/Grid";
import {
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
// import { Service } from "../AdminGateway";
import { GhostBtn, PrimaryBtn } from "../AdminGateway.components";

export function CreateServiceDialog({
  open, onClose, onCreate
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (name: string, price: bigint) => void;
}) {
  const [name, setName] = React.useState("");
  const [price, setPrice] = React.useState<number | "">("");

  React.useEffect(() => {
    if (!open) { setName(""); setPrice(""); }
  }, [open]);

  const submit = () => {
    if (!name || price === "") return;
    // const id = `SRV-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
    onCreate(name, BigInt(price));
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Crear Servicio</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField label="Nombre*" value={name} onChange={e => setName(e.target.value)} fullWidth />
          </Grid>
          {/* <Grid size={{ xs: 12, md: 6 }}> */}
          {/*   <FormControl fullWidth> */}
          {/*     <InputLabel>Categoría*</InputLabel> */}
          {/*     <Select label="Categoría*" value={category} onChange={e => setCategory(e.target.value as string)}> */}
          {/*       <MenuItem value="Mantenimiento">Mantenimiento</MenuItem> */}
          {/*       <MenuItem value="Sistema de frenos">Sistema de frenos</MenuItem> */}
          {/*       <MenuItem value="Suspensión">Suspensión</MenuItem> */}
          {/*       <MenuItem value="Diagnóstico">Diagnóstico</MenuItem> */}
          {/*       <MenuItem value="Motor">Motor</MenuItem> */}
          {/*       <MenuItem value="Transmisión">Transmisión</MenuItem> */}
          {/*     </Select> */}
          {/*   </FormControl> */}
          {/* </Grid> */}
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField label="Precio (COP)*" type="number" value={price}
              onChange={e => setPrice(e.target.value === "" ? "" : Number(e.target.value))} fullWidth />
          </Grid>
          {/* <Grid size={{ xs: 12, md: 6 }}> */}
          {/*   <TextField label="Duración (min)*" type="number" value={duration} */}
          {/*     onChange={e => setDuration(e.target.value === "" ? "" : Number(e.target.value))} fullWidth /> */}
          {/* </Grid> */}
          {/* <Grid size={{ xs: 12 }}> */}
          {/*   <TextField label="Descripción" value={description} onChange={e => setDescription(e.target.value)} */}
          {/*     fullWidth multiline minRows={3} /> */}
          {/* </Grid> */}
        </Grid>
      </DialogContent>
      <DialogActions>
        <GhostBtn onClick={onClose}>Cancelar</GhostBtn>
        <PrimaryBtn onClick={submit} startIcon={<AddIcon />} disabled={!name || price === ""}>
          Crear
        </PrimaryBtn>
      </DialogActions>
    </Dialog>
  );
}
