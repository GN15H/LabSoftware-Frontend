import {
  Dialog,
  Select,
  DialogTitle,
  Box,
  IconButton,
  DialogContent,
  Stack,
  TextField,
  Button,
  DialogActions,
  MenuItem,
  InputLabel,
  FormControl
} from "@mui/material"
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { SetStateAction, } from "react";
import { PALETA } from "../MechanicGateway";
import { Supply } from "@/domain/models/Supply";
import { AppointmentSupplies, ProcedureData } from "@/types/MechanicGateway.types";

interface SupplyItem {
  supplyId: number;
  amount: number;
}

interface RegisterServiceProps {
  appointment: number;
  serviceDialogOpen: boolean;
  setServiceDialogOpen: React.Dispatch<SetStateAction<boolean>>;
  saveService: (supplyItems: SupplyItem[]) => void;
  supplies: Supply[];
  procedureData: ProcedureData;
  setProcedureData: React.Dispatch<SetStateAction<ProcedureData>>;
  createProcedures: (appointmentId: number, data: ProcedureData) => void;
  createAppointmentSupplies: (appointmentId: number, supplies: AppointmentSupplies[]) => void;
}

export const RegisterService = ({ createAppointmentSupplies, appointment, supplies, serviceDialogOpen, procedureData, setProcedureData, setServiceDialogOpen }: RegisterServiceProps) => {
  // const [supplyItems, setSupplyItems] = useState<SupplyItem[]>([{ supplyId: '', quantity: 1 }]);

  const handleAddSupply = () => {
    const newArr = [...procedureData.supplies];
    newArr.push({ supply: supplies[0].id, amount: 1 });
    setProcedureData(prev => (
      { ...prev, supplies: newArr })
    );
  };

  const handleRemoveSupply = (index: number) => {
    setProcedureData(prev => ({
      ...prev,
      supplies: prev.supplies.filter((_, i) => i !== index)
    })
    );
  };

  const handleSupplyChange = (index: number, supplyId: number) => {
    const newItems = [...procedureData.supplies];
    newItems[index].supply = supplyId;
    setProcedureData(prev => ({
      ...prev,
      supplies: newItems
    })
    );
  };

  const handleQuantityChange = (index: number, quantity: number) => {
    const newItems = [...procedureData.supplies];
    newItems[index].amount = quantity;
    setProcedureData(prev => ({
      ...prev,
      supplies: newItems
    })
    );
  };

  const handleSave = () => {
    console.log(procedureData);
    // createProcedures(appointment, procedureData);
    createAppointmentSupplies(appointment, procedureData.supplies)
    // saveService(supplyItems);
    // setSupplyItems([{ supplyId: '', quantity: 1 }]);
  };

  const handleClose = () => {
    setServiceDialogOpen(false);
    setProcedureData({
      description: '',
      supplies: []
    })
  };

  return (
    <Dialog open={serviceDialogOpen} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ display: 'flex', alignItems: 'center' }}>
        Registrar Servicio Realizado
        <Box sx={{ flex: 1 }} />
        <IconButton onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2}>
          <InputLabel>Repuestos</InputLabel>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
            <Button startIcon={<AddIcon />} onClick={handleAddSupply} size="small" sx={{ color: PALETA.naranja }}>
              Agregar Repuesto
            </Button>
          </Box>

          {procedureData.supplies.map((item, index) => (
            <Box key={index} sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
              <FormControl>
                <Select label="Repuesto" variant="standard" value={item.supply} onChange={(e) => handleSupplyChange(index, e.target.value)} fullWidth={true} displayEmpty={true}>
                  <MenuItem value="" disabled>Seleccionar repuesto</MenuItem>
                  {supplies.map((s) => (
                    <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField type="number" value={item.amount} sx={{ width: '120px' }}
                onChange={(e) => handleQuantityChange(index, parseInt(e.target.value) || 1)} variant="standard" />
              <IconButton onClick={() => handleRemoveSupply(index)}  >
                <DeleteIcon />
              </IconButton>
            </Box>
          ))}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleClose}
          sx={{ bgcolor: '#eee7e1', color: 'rgb(80,80,80)', '&:hover': { bgcolor: '#dad6d3' } }}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleSave}
          sx={{ bgcolor: PALETA.naranja, color: '#fff', '&:hover': { bgcolor: PALETA.naranjaHover } }}
        >
          Guardar Servicio
        </Button>
      </DialogActions>
    </Dialog>
  );
}
