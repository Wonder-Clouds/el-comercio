import { Assignment } from "@/models/Assignment";
import { DetailAssignment } from "@/models/DetailAssignment";
import jsPDF from "jspdf";

const generatePDFTicket = (
  row: Assignment,
  filteredDetails: DetailAssignment[]
) => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: [100, 148],
  });

  // Configuración
  const config = {
    lineHeight: 4.5,
    pageWidth: 100,
    margin: 8,
    fontSize: {
      title: 14,
      subtitle: 10,
      normal: 9,
      total: 11,
    },
  };

  const { lineHeight, pageWidth, margin, fontSize } = config;
  const centerX = pageWidth / 2;
  const rightX = pageWidth - margin;
  let yPosition = 10;

  // Utilidades
  const drawSeparator = (thickness = 0.5) => {
    doc.setDrawColor(120);
    doc.setLineWidth(thickness);
    doc.line(margin, yPosition, rightX, yPosition);
    yPosition += lineHeight;
  };

  const drawDoubleSeparator = () => {
    doc.setDrawColor(80);
    doc.setLineWidth(0.8);
    doc.line(margin, yPosition, rightX, yPosition);
    yPosition += 1;
    doc.line(margin, yPosition, rightX, yPosition);
    yPosition += lineHeight;
  };

  const addText = (text: string, x: number, y: number, options?: any) => {
    doc.text(text, x, y, options);
  };

  const setStyle = (font: string, size: number, style = "normal") => {
    console.log(font);
    doc.setFont("courier", style);
    doc.setFontSize(size);
  };

  // Encabezado
  setStyle("courier", fontSize.title, "bold");
  addText("COMPROBANTE DE DEVOLUCIÓN", centerX, yPosition, { align: "center" });
  yPosition += lineHeight;

  setStyle("courier", fontSize.normal, "italic");
  addText("Sistema de Distribución El Comercio", centerX, yPosition, {
    align: "center",
  });
  yPosition += lineHeight * 1.5;

  drawDoubleSeparator();

  // Información del vendedor
  setStyle("courier", fontSize.subtitle, "bold");
  addText("INFORMACIÓN DEL VENDEDOR", margin, yPosition);
  yPosition += lineHeight;

  drawSeparator(0.3);

  setStyle("courier", fontSize.normal);
  const formattedDate = new Intl.DateTimeFormat("es-PE", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date());

  const sellerInfo = [
    `Código: ${row.seller.number_seller}`,
    `Fecha: ${formattedDate}`,
    `Nombre: ${row.seller.name} ${row.seller.last_name}`,
  ];

  sellerInfo.forEach((info) => {
    addText(info, margin, yPosition);
    yPosition += lineHeight;
  });

  yPosition += lineHeight;
  drawDoubleSeparator();

  // Encabezado de productos
  setStyle("courier", fontSize.subtitle, "bold");
  addText("PRODUCTOS A DEVOLVER", margin, yPosition);
  yPosition += lineHeight;

  drawSeparator(0.3);

  setStyle("courier", fontSize.normal, "bold");
  addText("Producto", margin, yPosition);
  addText("Cant.", centerX, yPosition);
  addText("Total", rightX, yPosition, { align: "right" });
  yPosition += lineHeight;
  drawSeparator();

  // Lista de productos
  let totalGeneral = 0;

  setStyle("courier", fontSize.normal);
  filteredDetails.forEach((detail, index) => {
    const qty = detail.quantity ?? 0;
    const returned = detail.returned_amount ?? 0;
    const unitPrice = detail.unit_price ?? detail.product.product_price ?? 0;
    const pending = qty - returned;
    const totalToPay = pending * unitPrice;

    totalGeneral += totalToPay;

    // Alternar color de fondo (simulado con espaciado)
    if (index % 2 === 0) {
      yPosition += 0.5;
    }

    addText(detail.product.name, margin, yPosition);
    addText(pending.toString(), centerX, yPosition);
    addText(`S/ ${totalToPay.toFixed(2)}`, rightX, yPosition, {
      align: "right",
    });
    yPosition += lineHeight;

    if (index % 2 === 0) {
      yPosition += 0.5;
    }
  });

  yPosition += lineHeight;
  drawDoubleSeparator();

  // Total final
  setStyle("courier", fontSize.total, "bold");
  addText("TOTAL A DEVOLVER:", margin, yPosition);
  addText(`S/ ${totalGeneral.toFixed(2)}`, rightX, yPosition, {
    align: "right",
  });
  yPosition += lineHeight * 1.5;

  drawDoubleSeparator();

  // Mensaje de despedida
  setStyle("courier", fontSize.normal, "italic");
  addText("¡Gracias por su confianza!", centerX, yPosition, {
    align: "center",
  });
  yPosition += lineHeight;

  setStyle("courier", fontSize.normal - 1);
  addText("Conserve este comprobante", centerX, yPosition, { align: "center" });
  yPosition += lineHeight * 2;

  // Pie de página
  setStyle("courier", fontSize.normal - 1, "italic");
  const currentTime = new Date().toLocaleTimeString("es-PE");
  addText(`Generado: ${currentTime}`, centerX, yPosition, { align: "center" });

  // Generar y abrir PDF
  doc.autoPrint();
  window.open(doc.output("bloburl"), "_blank");
};

export default generatePDFTicket;
