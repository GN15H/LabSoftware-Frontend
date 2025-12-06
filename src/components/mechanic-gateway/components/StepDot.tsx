import { Box, Typography } from "@mui/material";
import { PALETA } from "../MechanicGateway";
import { AppointmentStateType, getProgressFromAppointmentState } from "@/domain/models/types";

interface StepDotProps {
  apptState: AppointmentStateType;
  state: AppointmentStateType;
}

export const StepDot = ({ state, apptState }: StepDotProps) => {
  const isCurrent = state === apptState;
  const isCompleted = getProgressFromAppointmentState(apptState) > getProgressFromAppointmentState(state);
  // const isRejected = budgetRejected && idx === 3;

  let bg = "#ecf0f1", color = "#7f8c8d";
  // if (isRejected) { bg = "#e74c3c"; color = "#fff"; text = "✗"; }
  if (isCurrent) { bg = PALETA.azul; color = "#fff"; }
  else if (isCompleted) { bg = PALETA.verde; color = "#fff";; }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, minWidth: 80 }}>
      <Box sx={{
        width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 14, fontWeight: 700, mb: 0.5, bgcolor: bg, color,
        boxShadow: isCurrent ? `0 0 0 0 ${PALETA.azul}` : 'none',
        animation: isCurrent ? 'pulse 2s infinite' : 'none',
      }}>
        {1 + (getProgressFromAppointmentState(state) / 25)}
      </Box>
      <Typography sx={{ fontSize: 12, color: PALETA.texto }}>{state}</Typography>
    </Box>
  );
};
