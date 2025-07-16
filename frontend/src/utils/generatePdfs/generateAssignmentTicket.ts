import jsPDF from "jspdf";
import { Assignment } from "@/models/Assignment";
import { DetailAssignment } from "@/models/DetailAssignment";

const generateAssignmentTicket = async (
  filteredDetails: DetailAssignment[],
  assignment: Assignment
) => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: [100, 148],
  });

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
    doc.setFont(font, style);
    doc.setFontSize(size);
  };

  // Encabezado
  setStyle("courier", fontSize.title, "bold");
  addText("COMPROBANTE DE ENTREGA", centerX, yPosition, { align: "center" });
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
    `Código: ${assignment.seller.number_seller}`,
    `Fecha: ${formattedDate}`,
    `Nombre: ${assignment.seller.name} ${assignment.seller.last_name}`,
  ];

  sellerInfo.forEach((info) => {
    addText(info, margin, yPosition);
    yPosition += lineHeight;
  });

  yPosition += lineHeight;
  drawDoubleSeparator();

  // Encabezado productos según tipo
  const productType =
    filteredDetails[0]?.product?.type_product?.type?.toUpperCase() ||
    "PRODUCTOS";
  setStyle("courier", fontSize.subtitle, "bold");
  addText(`${productType} ASIGNADOS`, margin, yPosition);
  yPosition += lineHeight;
  drawSeparator(0.3);

  setStyle("courier", fontSize.normal, "bold");
  addText("Producto", margin, yPosition);
  addText("Cant.", centerX, yPosition);
  addText("Total", rightX, yPosition, { align: "right" });
  yPosition += lineHeight;
  drawSeparator();

  // Productos
  let total = 0;

  setStyle("courier", fontSize.normal);
  filteredDetails.forEach((detail, index) => {
    const qty = detail.quantity ?? 0;
    const unitPrice = detail.product.product_price ?? 0;
    const subtotal = qty * unitPrice;
    total += subtotal;

    if (index % 2 === 0) {
      yPosition += 0.5;
    }

    addText(detail.product.name, margin, yPosition);
    addText(qty.toString(), centerX, yPosition);
    addText(`S/ ${subtotal.toFixed(2)}`, rightX, yPosition, {
      align: "right",
    });
    yPosition += lineHeight;
  });

  yPosition += lineHeight;
  drawDoubleSeparator();

  // Total
  setStyle("courier", fontSize.total, "bold");
  addText("TOTAL ASIGNADO:", margin, yPosition);
  addText(`S/ ${total.toFixed(2)}`, rightX, yPosition, {
    align: "right",
  });

  yPosition += lineHeight * 2;
  setStyle("courier", fontSize.normal - 1, "italic");
  addText("Conserve este comprobante", centerX, yPosition, {
    align: "center",
  });

  yPosition += lineHeight;
  const currentTime = new Date().toLocaleTimeString("es-PE");
  addText(`Generado: ${currentTime}`, centerX, yPosition, {
    align: "center",
  });

  doc.autoPrint();
  window.open(doc.output("bloburl"), "_blank");
};

export default generateAssignmentTicket;
