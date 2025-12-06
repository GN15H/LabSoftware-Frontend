
import { Box, Button, Stack, Typography } from "@mui/material"
import { ItemComponent } from "./ItemComponent"
import { PALETA } from "../ClientPalette"
import { Vehicle } from "@/domain/models/Vehicle";
import { SetStateAction } from "react";

interface VehiclesProps {
  vehicles: Vehicle[];
  setVehicleOpen: React.Dispatch<SetStateAction<boolean>>;
}


export const Vehicles = ({ vehicles, setVehicleOpen }: VehiclesProps) => {
  return (
    <ItemComponent title="Mis Vehículos" subtitle="Administra la información de tus vehículos">
      <Box sx={{ mb: 2 }}>
        <Button onClick={() => setVehicleOpen(true)} sx={{ bgcolor: PALETA.naranja, color: "#fff", "&:hover": { bgcolor: PALETA.naranjaHover } }}>Registrar Vehículo</Button>
      </Box>

      {
        vehicles.map((v) => (
          <Box key={v.plateNumber} sx={{ bgcolor: "#ecf4fc", border: "2px solid #ddeaf7", borderRadius: 1.5, p: 2, mb: 2, transition: "all .15s", "&:hover": { border: "3px solid #2c8ac9" } }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography sx={{ fontWeight: 800, color: PALETA.texto }}>{v.brand + ' ' + v.series}</Typography>
                {/* <Typography sx={{ color: PALETA.textoSuave, fontSize: 14 }}>Kilometraje: {v.km.toLocaleString()} km</Typography> */}
              </Box>
              <Box sx={{ bgcolor: PALETA.azul, color: "#fff", px: 1, py: 0.5, borderRadius: 1, fontWeight: 800 }}>{v.plateNumber}</Box>
            </Stack>
          </Box>

        ))
      }
    </ItemComponent >
  )
}
