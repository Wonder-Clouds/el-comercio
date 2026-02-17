import { Assignment } from "@/models/Assignment";
import { DetailAssignment } from "@/models/DetailAssignment";
import jsPDF, { TextOptionsLight } from "jspdf";
import { TextOptions } from "./TextOptions";

const generatePDFTicket = (
  row: Assignment,
  filteredDetails: DetailAssignment[],
) => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: [80, 297],
  });

  // Configuración mejorada
  const config = {
    lineHeight: 4,
    productLineHeight: 3.5, // Altura de línea específica para productos
    pageWidth: 80,
    margin: 5,
    fontSize: {
      title: 11,
      subtitle: 8,
      normal: 7,
      small: 6,
      total: 9,
    },
    // Definir columnas para mejor distribución
    columns: {
      product: 5, // Inicio columna producto
      qty: 42, // Cantidad
      returned: 50, // Devuelto
      pending: 58, // Pendiente
      total: 75, // Total (alineado a la derecha)
    },
  };

  const {
    lineHeight,
    productLineHeight,
    pageWidth,
    margin,
    fontSize,
    columns,
  } = config;
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

  const addText = (
    text: string,
    x: number,
    y: number,
    options?: TextOptions,
  ) => {
    doc.text(text, x, y, options as TextOptionsLight);
  };

  const setStyle = (font: string, size: number, style = "normal") => {
    doc.setFont(font, style);
    doc.setFontSize(size);
  };

  // Encabezado
  setStyle("courier", fontSize.title, "bold");
  addText("COMPROBANTE", centerX, yPosition, { align: "center" });
  yPosition += lineHeight;
  addText("DE DEVOLUCIÓN", centerX, yPosition, { align: "center" });
  yPosition += lineHeight;

  setStyle("courier", fontSize.small, "italic");
  addText("Sistema de Distribución", centerX, yPosition, { align: "center" });
  yPosition += 3;
  addText("El Comercio", centerX, yPosition, { align: "center" });
  yPosition += lineHeight * 1.2;

  drawDoubleSeparator();

  // Información del vendedor
  setStyle("courier", fontSize.subtitle, "bold");
  addText("DATOS DEL VENDEDOR", margin, yPosition);
  yPosition += lineHeight - 1;

  drawSeparator(0.3);

  setStyle("courier", fontSize.small);
  const formattedDate = new Intl.DateTimeFormat("es-PE", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date());

  const sellerInfo = [
    `Cód: ${row.seller.number_seller}`,
    `Fecha: ${formattedDate}`,
    `${row.seller.name} ${row.seller.last_name}`,
  ];

  sellerInfo.forEach((info) => {
    addText(info, margin, yPosition);
    yPosition += lineHeight - 0.5;
  });

  yPosition += 1;
  drawDoubleSeparator();

  // Encabezado de productos
  setStyle("courier", fontSize.subtitle, "bold");
  addText("PRODUCTOS A DEVOLVER", margin, yPosition);
  yPosition += lineHeight - 1;

  drawSeparator(0.3);

  // Encabezados de columnas con mejor distribución
  setStyle("courier", fontSize.small, "bold");
  addText("Producto", columns.product, yPosition);
  addText("Cant", columns.qty, yPosition, { align: "center" });
  addText("Dev", columns.returned, yPosition, { align: "center" });
  addText("Pend", columns.pending, yPosition, { align: "center" });
  addText("Total", columns.total, yPosition, { align: "right" });
  yPosition += lineHeight - 1;
  drawSeparator(0.3);

  // Lista de productos con mejor manejo de espacio
  let totalGeneral = 0;

  setStyle("courier", fontSize.small);
  filteredDetails.forEach((detail, index) => {
    const qty = detail.quantity ?? 0;
    const returned = detail.returned_amount ?? 0;
    const unitPrice = detail.unit_price ?? detail.product.product_price ?? 0;
    const pending = qty - returned;
    const totalToPay = pending * unitPrice;

    totalGeneral += totalToPay;

    // Calcular ancho máximo para producto (deja espacio para números)
    const maxProductWidth = columns.qty - columns.product - 2;
    const productLines = doc.splitTextToSize(
      detail.product.name,
      maxProductWidth,
    );

    // Dibujar todas las líneas del producto
    productLines.forEach((line: string, lineIndex: number) => {
      addText(line, columns.product, yPosition);
      if (lineIndex < productLines.length - 1) {
        yPosition += productLineHeight;
      }
    });

    // Los números se alinean con la última línea del producto
    addText(qty.toString(), columns.qty, yPosition, { align: "center" });
    addText(returned.toString(), columns.returned, yPosition, {
      align: "center",
    });
    addText(pending.toString(), columns.pending, yPosition, {
      align: "center",
    });
    addText(`${totalToPay.toFixed(2)}`, columns.total, yPosition, {
      align: "right",
    });

    yPosition += lineHeight;

    // Separador sutil entre productos (cada 2)
    if (index < filteredDetails.length - 1 && index % 2 === 1) {
      doc.setDrawColor(200);
      doc.setLineWidth(0.1);
      doc.line(margin, yPosition - 0.5, rightX, yPosition - 0.5);
    }
  });

  yPosition += lineHeight * 0.5;
  drawSeparator(0.8);

  // Total final destacado
  setStyle("courier", fontSize.total, "bold");
  addText("TOTAL A PAGAR:", margin, yPosition);
  addText(`S/ ${totalGeneral.toFixed(2)}`, rightX, yPosition, {
    align: "right",
  });
  yPosition += lineHeight * 1.2;

  drawDoubleSeparator();

  // Mensaje de despedida
  setStyle("courier", fontSize.small, "italic");
  addText("¡Gracias por su confianza!", centerX, yPosition, {
    align: "center",
  });
  yPosition += lineHeight;

  setStyle("courier", fontSize.small - 1);
  addText("Conserve este comprobante", centerX, yPosition, { align: "center" });
  yPosition += lineHeight * 1.5;

  // Pie de página
  setStyle("courier", fontSize.small - 1, "italic");
  const currentTime = new Date().toLocaleTimeString("es-PE", {
    hour: "2-digit",
    minute: "2-digit",
  });
  addText(`Generado: ${currentTime}`, centerX, yPosition, { align: "center" });

  // Generar y abrir PDF
  doc.autoPrint();
  window.open(doc.output("bloburl"), "_blank");
};

export default generatePDFTicket;
