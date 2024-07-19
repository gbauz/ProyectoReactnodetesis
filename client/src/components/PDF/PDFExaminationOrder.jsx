import jsPDF from "jspdf";
import "jspdf-autotable";
import base64Image from "../../views/Login/image/GB-LAB1.png";

const PDFExaminationOrder = (data) => {
  const doc = new jsPDF();
  let y = 20; // Posición Y inicial

  // Colores
  const colorPrimary = [0, 0, 128]; // Azul
  const colorSecondary = [255, 0, 0]; // Rojo
  const colorText = [0, 0, 0]; // Negro

  // Agregar imagen
  doc.addImage(base64Image, "PNG", 10, 10, 60, 15);
  y += 20;

  // Encabezado
  doc.setFontSize(12);
  doc.setTextColor(...colorPrimary);
  doc.text("LABORATORIO CLÍNICO GB-Lab", 80, y);
  y += 8;
  doc.text("MUCHO LOTE 1 ETAPA 3 Mz: 2344 V: 1 Av. Manuel Gómez Lince, Guayaquil, Ecuador", 80, y);
  y += 8;
  doc.text("(04) 505-2852", 80, y);
  y += 8;
  doc.text("E-mail: laboratorio.gblab@gmail.com", 80, y);
  y += 20;

  // Información del paciente
  doc.setTextColor(...colorText);
  doc.text(`Paciente: ${data.paciente}`, 14, y);
  doc.text(`Edad: ${data.edad}`, 120, y);
  y += 8;
  doc.text(`Fecha: ${data.fecha.split("T")[0]}`, 14, y);
  doc.text(`Teléfono: ${data.celular}`, 120, y);
  y += 8;
  doc.text(`Médico: ${data.nombre_apellido}`, 14, y);
  doc.text(`Especialidad: ${data.especialidad}`, 120, y);
  y += 20;

  // Análisis
  doc.setTextColor(...colorSecondary);
  doc.text("Análisis", 14, y);
  y += 8;
  data.analisis.forEach((analisis) => {
    doc.setTextColor(...colorText);
    doc.text(`${analisis.analisis}`, 14, y);
    y += 8;
    analisis.examen.forEach((examen) => {
      doc.text(`- ${examen.examen}`, 20, y);
      y += 8;
    });
    y += 4; // Espacio adicional entre análisis
  });

  doc.save(`Orden_de_examen_${data.paciente_cedula}.pdf`);
};

export default PDFExaminationOrder;
