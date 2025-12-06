import { AppBar, Box, Button, Card, Chip, createTheme, Paper, styled } from "@mui/material";

export const theme = createTheme({
  typography: {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
  },
  shape: { borderRadius: 12 }
});

// Contenedores y superficies con gradientes equivalentes
export const HeaderBar = styled(AppBar)(({ }) => ({
  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  backgroundImage: "linear-gradient(135deg, #2c3e50 0%, #3498db 100%)"
}));

export const WelcomeSection = styled(Paper)(({ theme }) => ({
  background: "#c1d1e696",
  padding: theme.spacing(4),
  borderRadius: 12,
  boxShadow: "0 2px 20px rgba(0,0,0,0.08)"
}));

export const StatCardRoot = styled(Card)(({ theme }) => ({
  backgroundImage: "linear-gradient(360deg, #0a334b 40%, #5981beef 100%)",
  color: "#e2edf5",
  textAlign: "center",
  padding: theme.spacing(2),
  borderRadius: 12,
  boxShadow: "0 2px 20px rgba(0,0,0,0.08)",
  transition: "transform 0.2s ease",
  '&:hover': { transform: 'translateY(-2px)' }
}));

export const ModuleCardRoot = styled(Card)(({ }) => ({
  background: "#c1d1e696",
  borderRadius: 12,
  overflow: "hidden",
  boxShadow: "0 2px 20px rgba(0,0,0,0.08)",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  cursor: "pointer",
  '&:hover': { transform: 'translateY(-5px)', boxShadow: '0 5px 30px rgba(0,0,0,0.15)' }
}));

export const ModuleHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  color: '#fff',
  backgroundImage: 'linear-gradient(135deg, #2c3e50 30%, #3498db 100%)'
}));

export const GradientInfoBox = styled(Paper)(({ theme }) => ({
  backgroundImage: 'linear-gradient(135deg, #e3f2fd, #bbdefb)',
  borderRadius: 12,
  padding: theme.spacing(3),
  boxShadow: 'none'
}));

// Botones con estilos exactos del mockup
export const GhostBtn = styled(Button)(({ }) => ({
  backgroundColor: '#eee7e1',
  color: '#2c3e50',
  textTransform: 'none',
  fontSize: '0.85rem',
  padding: '8px 14px',
  borderRadius: 6,
  '&:hover': { backgroundColor: '#dad6d3', transform: 'translateY(-1px)' }
}));

export const PrimaryBtn = styled(GhostBtn)(({ }) => ({
  backgroundColor: '#e37239',
  color: '#fff',
  '&:hover': { backgroundColor: '#c4683a' }
}));

export const DangerBtn = styled(GhostBtn)(({ }) => ({
  backgroundColor: '#ca370b',
  color: '#fff',
  '&:hover': { backgroundColor: '#ac3315' }
}));

// Card de resultados tipo "item" (usuarios, citas, etc.)
export const ListItemCard = styled(Paper)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(2),
  marginBottom: theme.spacing(1),
  backgroundColor: '#f8f9fa',
  borderRadius: 8,
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  '&:hover': { backgroundColor: '#e9ecef', transform: 'translateY(-1px)' }
}));

// Badges de estado
export const Pill = styled(Chip)(({ }) => ({
  borderRadius: 20,
  fontWeight: 700,
  fontSize: '0.8rem'
}));

