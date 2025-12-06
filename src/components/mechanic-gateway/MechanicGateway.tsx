
export function fieldSx() {
  return {
    "& .MuiOutlinedInput-root": {
      backgroundColor: "#f8f9fa",
      borderRadius: 2,
      "& fieldset": { borderColor: "#ecf0f1", borderWidth: 2 },
      "&:hover fieldset": { borderColor: "#bdc3c7" },
      "&.Mui-focused fieldset": { borderColor: "#3498db" },
    },
  } as const;
}
// Paleta y estilos del mock original
export const PALETA = {
  fondo: "#f8f9fa",
  headerGrad: "linear-gradient(135deg, #2c3e50 0%, #3498db 100%)",
  welcomeBg: "#c1d1e696",
  cardShadow: "0 2px 20px rgba(0,0,0,0.08)",
  azul: "#3498db",
  azulOsc: "#086ab4",
  verde: "#27ae60",
  amarilloBg: "#fff3cd",
  naranja: "#e37239",
  naranjaHover: "#c4683a",
  celeste: "#2582c0",
  celesteHover: "#1a6394",
  grisBorde: "#ecf0f1",
  textoSuave: "#7f8c8d",
  texto: "#2c3e50",
};
