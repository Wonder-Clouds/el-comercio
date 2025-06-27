import { Assignment } from "@/models/Assignment";
import jsPDF from "jspdf";

const generatePDFTicket = (row: Assignment, filteredDetails: any[]) => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: [100, 148], // ancho 100mm
  });

  const lineHeight = 4;
  let yPosition = 10;

  const pageWidth = 100;
  const margin = 5;
  const centerX = pageWidth / 2;
  const rightX = pageWidth - margin;

  const drawSeparator = () => {
    doc.setDrawColor(180);
    doc.line(margin, yPosition, rightX, yPosition);
    yPosition += lineHeight;
  };

  // Encabezado
  doc.setFont("courier", "bold");
  doc.setFontSize(12);
  doc.text("COMPROBANTE DE DEVOLUCIÓN", centerX, yPosition, {
    align: "center",
  });

  yPosition += lineHeight * 2;

  // Información general
  doc.setFont("courier", "normal");
  doc.setFontSize(8);
  const formattedDate = new Intl.DateTimeFormat("es-PE", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date());

  doc.text(`Fecha: ${formattedDate}`, margin, yPosition);
  yPosition += lineHeight;
  doc.text(`Código: ${row.seller.number_seller}`, margin, yPosition);
  yPosition += lineHeight;
  doc.text(
    `Nombre: ${row.seller.name} ${row.seller.last_name}`,
    margin,
    yPosition
  );
  yPosition += lineHeight * 2;

  drawSeparator();

  // Título de productos
  doc.setFont("courier", "bold");
  doc.text("PRODUCTOS", margin, yPosition);
  yPosition += lineHeight;

  doc.setFont("courier", "normal");
  doc.setFontSize(8);
  doc.text("Producto", margin, yPosition);
  doc.text("Pend.", centerX, yPosition);
  doc.text("Total", rightX, yPosition, { align: "right" });
  yPosition += lineHeight;
  drawSeparator();

  let totalGeneral = 0;
  filteredDetails.forEach((d) => {
    const qty = d.quantity ?? 0;
    const returned = d.returned_amount ?? 0;
    const unitPrice = d.unit_price ?? d.product.product_price ?? 0;
    const pending = qty - returned;
    const totalToPay = pending * unitPrice;
    totalGeneral += totalToPay;

    doc.text(d.product.name, margin, yPosition);
    doc.text(pending.toString(), centerX, yPosition);
    doc.text(`S/.${totalToPay.toFixed(2)}`, rightX, yPosition, {
      align: "right",
    });
    yPosition += lineHeight;
  });

  yPosition += lineHeight;
  drawSeparator();

  // Total final
  doc.setFont("courier", "bold");
  doc.setFontSize(9);
  doc.text("TOTAL A DEVOLVER:", margin, yPosition);
  doc.text(`S/.${totalGeneral.toFixed(2)}`, rightX, yPosition, {
    align: "right",
  });
  yPosition += lineHeight * 2;

  drawSeparator();

  doc.setFont("courier", "italic");
  doc.setFontSize(9);
  doc.text("Gracias por su preferencia", centerX, yPosition, {
    align: "center",
  });

  // Autoimprimir
  doc.autoPrint();
  window.open(doc.output("bloburl"), "_blank");
};

export default generatePDFTicket;
