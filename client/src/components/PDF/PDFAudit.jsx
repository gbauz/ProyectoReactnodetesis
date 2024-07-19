import jsPDF from "jspdf";

const PDFAudit = (data) => {
  const doc = new jsPDF();
  doc.text(20, 20, "Reporte de Auditoría");
  const auditoriaData = data.map((entry) => [
    entry.usuario_nombre,
    entry.ip_usuario,
    entry.fecha,
    entry.accion,
  ]);
  doc.autoTable({
    head: [
      ["Nombre de Usuario", "IP del Usuario", "Fecha", "Acción Realizada"],
    ],
    body: auditoriaData,
  });
  doc.save("reporte_auditoria.pdf");
};

export default PDFAudit;
