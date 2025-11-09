import {
  Box,
  Typography,
  Paper,
} from "@mui/material";
import { PALETA } from "../ClientPalette";

interface ItemListProps {
  title: string;
  subtitle: string;

  children?: React.ReactNode;
}

export const ItemComponent = ({ title, subtitle, children }: ItemListProps) => {
  return (

    <Paper sx={{ borderRadius: 3, overflow: "hidden", boxShadow: PALETA.cardShadow, mb: 3 }}>
      <Box sx={{ p: 2.5, color: "#fff", background: "linear-gradient(135deg, #2c3e50 30%, #3498db 100%)" }}>
        <Typography sx={{ fontSize: 20, fontWeight: 800 }}>{title}</Typography>
        <Typography sx={{ opacity: 0.9, fontSize: 14 }}>{subtitle}</Typography>
      </Box>
      <Box sx={{ p: 2.5 }}>
        {children}
      </Box>
    </Paper>
  )
}
