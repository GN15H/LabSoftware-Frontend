import { Dialog, DialogTitle, Box, IconButton, Button, DialogContent, DialogActions, Typography, Paper, Grid } from "@mui/material"
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import CloseIcon from "@mui/icons-material/Close";
import { PALETA } from "../MechanicGateway";
import { RefObject, SetStateAction } from "react";

interface UploadPhotosDialogProps {
  photoDialogOpen: boolean;
  setPhotoDialogOpen: React.Dispatch<SetStateAction<boolean>>;
  onChoosePhotos: (e: React.ChangeEvent<HTMLInputElement>) => void;
  savePhotos: () => void;
  fileInputRef: RefObject<HTMLInputElement | null>;
  photos: Array<{ name: string; url?: string }>;
}

export const UploadPhotosDialog = ({ photos, savePhotos, photoDialogOpen, setPhotoDialogOpen, onChoosePhotos, fileInputRef }: UploadPhotosDialogProps) => {
  return (

    <Dialog open={photoDialogOpen} onClose={() => setPhotoDialogOpen(false)} fullWidth maxWidth="md">
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <PhotoCameraIcon /> Documentación Fotográfica
        <Box sx={{ flex: 1 }} />
        <IconButton onClick={() => setPhotoDialogOpen(false)}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Typography sx={{ color: PALETA.textoSuave, mb: 2 }}>
          {(() => {
            const map: Record<string, string> = {
              recibido: 'Documenta el estado del vehículo al momento de recibido',
              diagnostico: 'Evidencia del proceso de diagnóstico y problemas encontrados',
              presupuesto: 'Documentación visual para justificar el presupuesto',
              proceso: 'Documenta el trabajo en progreso y procedimientos realizados',
              listo: 'Evidencia del trabajo completado y estado final',
              entregado: 'Documentación del vehículo al momento de la entrega',
            };
            return map['recibido'] ?? 'Toma las fotografías necesarias para este paso';
          })()}
        </Typography>

        <Paper variant="outlined" sx={{ p: 3, textAlign: 'center', borderStyle: 'dashed', borderColor: PALETA.grisBorde, '&:hover': { borderColor: PALETA.azul, bgcolor: '#f8f9fa' } }}>
          <PhotoCameraIcon sx={{ fontSize: 48, color: '#bdc3c7', mb: 1 }} />
          <Typography sx={{ color: PALETA.textoSuave }}>
            Haz clic para seleccionar fotos o arrástralas aquí
          </Typography>
          <Button onClick={() => fileInputRef.current?.click()} sx={{ mt: 1 }} variant="contained">
            Seleccionar fotos
          </Button>
          <input ref={fileInputRef} type="file" accept="image/*" multiple hidden onChange={onChoosePhotos} />
        </Paper>

        {/* Grid de fotos */}
        <Grid container spacing={2} sx={{ mt: 2 }}>
          {photos.map((p, i) => (
            <Grid key={`${p.name}-${i}`} size={{ xs: 6, sm: 4, md: 3 }}>
              <Box sx={{ position: 'relative', aspectRatio: '1 / 1', borderRadius: 1, overflow: 'hidden', cursor: 'pointer', bgcolor: 'linear-gradient(135deg, #ecf0f1, #bdc3c7)' }}>
                <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(45deg, #3498db, #2980b9)', color: '#fff', fontSize: 32 }}>📷</Box>
                <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, bgcolor: 'rgba(0,0,0,.7)', color: '#fff', fontSize: 12, textAlign: 'center', p: 0.5 }}>
                  {p.name}
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setPhotoDialogOpen(false)} sx={{ bgcolor: '#eee7e1', color: 'rgb(80,80,80)', '&:hover': { bgcolor: '#dad6d3' } }}>Cerrar</Button>
        <Button onClick={savePhotos} sx={{ bgcolor: PALETA.naranja, color: '#fff', '&:hover': { bgcolor: PALETA.naranjaHover } }}>Guardar Fotos</Button>
      </DialogActions>
    </Dialog>
  );
}
