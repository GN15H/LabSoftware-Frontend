import { Box, Button, Stack, Typography } from "@mui/material"
import { ItemComponent } from "./ItemComponent"
import { PALETA } from "../ClientPalette"
import { Appointment } from "@/domain/models/Appointment";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface AppointmentsStoryProps {
  appointments: Appointment[];
}


export const AppointmentsStory = ({ appointments }: AppointmentsStoryProps) => {

  const exportPDF = (app: Appointment, filename: string, extraFooter?: string) => {
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    doc.setFontSize(14);
    doc.text("Factura Servicio", 40, 40);

    autoTable(doc, {
      head: [["Fecha", "Servicio", "Vehículo", "Precio"]],
      body: [[app.date.toLocaleDateString(),
      (() => {
        let services = ''
        app.services.forEach(s => {
          services += `${s.name} `
        })
        return services
      })(),
      `${app.vehicle.brand} ${app.vehicle.series} ${app.vehicle.plateNumber}`,
      (() => {
        let precio: bigint = BigInt(0);
        app.services.forEach(s => { precio += s.price })
        return precio.toLocaleString();
      })()
      ]],
      startY: 60,
      styles: { fontSize: 9, cellPadding: 4 },
      headStyles: { fillColor: [41, 128, 185] },
    });

    if (extraFooter) {
      const finalY = (doc as any).lastAutoTable.finalY + 20;
      doc.setFontSize(11);
      doc.text(extraFooter, 40, finalY);
    }
    doc.save(filename.endsWith(".pdf") ? filename : `${filename}.pdf`);
  };

  return (
    <ItemComponent title="Historial de Servicios" subtitle="Consulta tus servicios anteriores y facturas">
      {appointments.filter(a => a.appointmentState == 'paid').map((h, i) => (
        <Box key={i} sx={{ borderLeft: `4px solid ${PALETA.verde}`, bgcolor: PALETA.welcomeBg, p: 2, borderRadius: "0 8px 8px 0", mb: 2 }}>
          <Typography sx={{ fontWeight: 800, color: PALETA.texto }}>{h.date.toISOString().split('T')[0]}</Typography>
          <Typography sx={{ color: PALETA.textoSuave, fontSize: 14, mt: 0.5 }}>
            <b>Servicio:</b>{h.services.map(h => h.name)}<br />
            <b>Vehículo:</b> {h.vehicle.brand + ' ' + h.vehicle.plateNumber}<br />
            <b>Costo:</b> {h.payment?.price}
          </Typography>
          <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
            {/* <Button startIcon={<ReceiptLongIcon />} sx={{ bgcolor: "#eee7e1", color: "#2c3e50", "&:hover": { bgcolor: "#dad6d3" } }}>Ver Factura</Button> */}
            <Button onClick={() => exportPDF(h, "Servicio AutoLink", "Servicio AutoLink")} startIcon={<ReceiptLongIcon />} sx={{ bgcolor: "#eee7e1", color: "#2c3e50", "&:hover": { bgcolor: "#dad6d3" } }}>Descargar PDF</Button>
          </Stack>
        </Box>
      ))}
    </ItemComponent >
  )
}
