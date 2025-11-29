import {
  Typography,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { GhostBtn, PrimaryBtn } from "../AdminGateway.components";

export function ReportsDialog({
  open,
  onClose,
  kind,
  appointments,
  services,
  parts,
  providers,
}: {
  open: boolean;
  onClose: () => void;
  kind: "citas" | "mecanicos" | "inventario" | "financiero" | null;
  appointments: Array<{ id: string; client: string; vehicle: string; service: string; date: string; time: string; mechanic: string }>;
  services: Array<{ id: string; name: string; category: string; price: number; duration: number; description?: string }>;
  parts: Array<{ id: string; name: string; sku: string; stock: number; minStock: number; price: number; providerId?: string }>;
  providers: Array<{ id: string; name: string; contact: string; phone: string; email: string }>;
}) {

  // Helpers de exportación
  const exportExcel = (rows: any[], filename: string) => {
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Reporte");
    XLSX.writeFile(wb, filename.endsWith(".xlsx") ? filename : `${filename}.xlsx`);
  };

  const exportPDF = (head: string[], body: any[][], title: string, filename: string, extraFooter?: string) => {
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    doc.setFontSize(14);
    doc.text(title, 40, 40);
    (doc as any).autoTable({
      head: [head],
      body,
      startY: 60,
      styles: { fontSize: 9, cellPadding: 4 },
      headStyles: { fillColor: [41, 128, 185] },
    });
    if (extraFooter) {
      const y = (doc as any).lastAutoTable.finalY + 20;
      doc.setFontSize(11);
      doc.text(extraFooter, 40, y);
    }
    doc.save(filename.endsWith(".pdf") ? filename : `${filename}.pdf`);
  };

  // Construcción de datos según reporte
  const getData = () => {
    switch (kind) {
      case "citas": {
        const head = ["ID", "Cliente", "Vehículo", "Servicio", "Fecha", "Hora", "Mecánico"];
        const rows = appointments.map(a => ({
          ID: a.id, Cliente: a.client, Vehículo: a.vehicle, Servicio: a.service,
          Fecha: a.date, Hora: a.time, Mecánico: a.mechanic
        }));
        const body = rows.map(r => [r.ID, r.Cliente, r.Vehículo, r.Servicio, r.Fecha, r.Hora, r.Mecánico]);
        return { head, rows, body, title: "Reporte de Citas", filename: "reporte_citas" };
      }
      case "mecanicos": {
        // Agregado por mecánico
        const agg = new Map<string, { citas: number }>();
        appointments.forEach(a => {
          const m = agg.get(a.mechanic) || { citas: 0 };
          m.citas += 1;
          agg.set(a.mechanic, m);
        });
        const head = ["Mecánico", "Citas Atendidas"];
        const rows = Array.from(agg.entries()).map(([mech, v]) => ({ Mecánico: mech, "Citas Atendidas": v.citas }));
        const body = rows.map(r => [r.Mecánico, r["Citas Atendidas"]]);
        return { head, rows, body, title: "Reporte de Mecánicos", filename: "reporte_mecanicos" };
      }
      case "inventario": {
        const head = ["ID", "Nombre", "SKU", "Stock", "Mín.", "Precio", "Proveedor"];
        const rows = parts.map(p => ({
          ID: p.id, Nombre: p.name, SKU: p.sku, Stock: p.stock, "Mín.": p.minStock,
          Precio: p.price, Proveedor: p.providerId ? (providers.find(pr => pr.id === p.providerId)?.name ?? "-") : "-"
        }));
        const body = rows.map(r => [r.ID, r.Nombre, r.SKU, r.Stock, r["Mín."], r.Precio.toLocaleString(), r.Proveedor]);
        return { head, rows, body, title: "Reporte de Inventario", filename: "reporte_inventario" };
      }
      case "financiero": {
        // unir citas con precio del servicio por nombre
        const priceByService = new Map(services.map(s => [s.name, s.price]));
        let total = 0;
        const head = ["Cita", "Servicio", "Precio (COP)", "Fecha", "Mecánico", "Cliente"];
        const rows = appointments.map(a => {
          const precio = priceByService.get(a.service) ?? 0;
          total += precio;
          return {
            Cita: a.id, Servicio: a.service, "Precio (COP)": precio,
            Fecha: a.date, Mecánico: a.mechanic, Cliente: a.client
          };
        });
        const body = rows.map(r => [r.Cita, r.Servicio, r["Precio (COP)"].toLocaleString(), r.Fecha, r.Mecánico, r.Cliente]);
        const extra = `Total facturado (estimado): $${total.toLocaleString()}`;
        return { head, rows, body, title: "Reporte Financiero (Estimado)", filename: "reporte_financiero", extra };
      }
      default:
        return { head: [], rows: [], body: [], title: "", filename: "" };
    }
  };

  const { head, rows, body, title, filename, extra } = getData();

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Reportes Operativos</DialogTitle>
      <DialogContent dividers>
        <Typography sx={{ mb: 1, fontWeight: 700, color: "#2c3e50" }}>
          {title || "Selecciona un tipo de reporte desde el panel"}
        </Typography>
        <Typography sx={{ color: "#7f8c8d", mb: 2 }}>
          Exporta el reporte seleccionado en PDF o Excel.
        </Typography>

        {/* Resumen rápido (primeras filas) */}
        {rows && rows.length > 0 && (
          <Box sx={{ p: 2, border: '1px solid #ecf0f1', borderRadius: 2, background: '#f8f9fa' }}>
            <Typography sx={{ fontWeight: 700, mb: 1 }}>Vista previa (primeras 5 filas)</Typography>
            {rows.slice(0, 5).map((r, i) => (
              <Typography key={i} sx={{ fontSize: ".9rem", color: "#2c3e50" }}>
                • {Object.values(r).join(" | ")}
              </Typography>
            ))}
            {extra && <Typography sx={{ mt: 1, fontWeight: 700, color: "#2c3e50" }}>{extra}</Typography>}
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <GhostBtn onClick={onClose}>Cerrar</GhostBtn>
        <PrimaryBtn
          onClick={() => exportPDF(head as any, body as any, title || "Reporte", `${filename || "reporte"}.pdf`, extra)}
        >
          Exportar PDF
        </PrimaryBtn>
        <PrimaryBtn
          onClick={() => exportExcel(rows as any[], `${filename || "reporte"}.xlsx`)}
        >
          Exportar Excel
        </PrimaryBtn>
      </DialogActions>
    </Dialog>
  );
}
