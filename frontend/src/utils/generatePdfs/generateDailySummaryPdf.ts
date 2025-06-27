import jsPDF from "jspdf";
import { Assignment } from "@/models/Assignment";
import { ProductType } from "@/models/Product";

const generateDailySummaryPDF = (
  assignments: Assignment[],
  productType: ProductType
) => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const config = {
    lineHeight: 8,
    margin: 15,
    fontSize: {
      title: 16,
      subtitle: 12,
      normal: 10,
      total: 12,
    },
  };

  let yPosition = config.margin;
  const pageWidth = doc.internal.pageSize.getWidth();
  const centerX = pageWidth / 2;
  const rightX = pageWidth - config.margin;

  const setStyle = (font: string, size: number, style = "normal") => {
    console.log(font);
    doc.setFont("courier", style);
    doc.setFontSize(size);
  };

  // const drawSeparator = (thickness = 0.4) => {
  //   doc.setDrawColor(120);
  //   doc.setLineWidth(thickness);
  //   doc.line(config.margin, yPosition, rightX, yPosition);
  //   yPosition += 2;
  // };

  const drawDoubleSeparator = () => {
    doc.setDrawColor(60);
    doc.setLineWidth(1);
    doc.line(config.margin, yPosition, rightX, yPosition);
    yPosition += 2;
    doc.line(config.margin, yPosition, rightX, yPosition);
    yPosition += 5; // espacio extra después de la doble línea
  };

  const addText = (text: string, x: number, y: number, options?: any) => {
    doc.text(text, x, y, options);
  };

  // Encabezado
  setStyle("courier", config.fontSize.title, "bold");
  addText("REPORTE DIARIO DE DEVOLUCIONES", centerX, yPosition, {
    align: "center",
  });
  yPosition += config.lineHeight;

  const formattedDate = new Intl.DateTimeFormat("es-PE", {
    dateStyle: "full",
  }).format(new Date());

  setStyle("courier", config.fontSize.normal, "italic");
  addText(`Fecha: ${formattedDate}`, config.margin, yPosition);
  yPosition += config.lineHeight;

  drawDoubleSeparator();

  let totalGeneral = 0;

  assignments.forEach((assignment, i) => {
    const filteredDetails =
      assignment.detail_assignments?.filter(
        (detail) => detail.product.type === productType
      ) || [];

    if (filteredDetails.length === 0) return;

    const fullName = `${assignment.seller.name} ${assignment.seller.last_name}`;
    const code = assignment.seller.number_seller;

    // Nombre del vendedor
    setStyle("courier", config.fontSize.subtitle, "bold");
    addText(
      `Vendedor ${i + 1}: ${fullName} (Código: ${code})`,
      config.margin,
      yPosition
    );
    yPosition += config.lineHeight;

    // Cabecera de productos
    yPosition += 2;
    setStyle("courier", config.fontSize.normal, "bold");
    addText("Producto", config.margin, yPosition);
    addText("Cant.", centerX - 10, yPosition);
    addText("Total", rightX, yPosition, { align: "right" });
    yPosition += config.lineHeight - 2;

    let totalSeller = 0;

    filteredDetails.forEach((detail) => {
      const quantity = detail.quantity ?? 0;
      const returned = detail.returned_amount ?? 0;
      const unitPrice = parseFloat(
        detail.unit_price?.toString() ||
          detail.product.product_price?.toString() ||
          "0"
      );
      const toPay = (quantity - returned) * unitPrice;

      totalSeller += toPay;

      // Producto
      setStyle("courier", config.fontSize.normal);
      addText(detail.product.name, config.margin, yPosition);
      addText(`${quantity - returned}`, centerX - 10, yPosition);
      addText(`S/ ${toPay.toFixed(2)}`, rightX, yPosition, { align: "right" });

      yPosition += config.lineHeight;

      if (yPosition > 275) {
        doc.addPage();
        yPosition = config.margin;
      }
    });

    // Total por vendedor
    setStyle("courier", config.fontSize.total, "bold");
    addText("Total vendedor:", config.margin, yPosition);
    addText(`S/ ${totalSeller.toFixed(2)}`, rightX, yPosition, {
      align: "right",
    });
    yPosition += config.lineHeight;

    drawDoubleSeparator(); // espacio suficiente después

    totalGeneral += totalSeller;

    if (yPosition > 275) {
      doc.addPage();
      yPosition = config.margin;
    }
  });

  // Total general
  setStyle("courier", config.fontSize.total, "bold");
  addText("TOTAL GENERAL:", config.margin, yPosition);
  addText(`S/ ${totalGeneral.toFixed(2)}`, rightX, yPosition, {
    align: "right",
  });
  yPosition += config.lineHeight;

  drawDoubleSeparator();

  const currentTime = new Date().toLocaleTimeString("es-PE");
  setStyle("courier", config.fontSize.normal - 1, "italic");
  addText(`Reporte generado a las ${currentTime}`, centerX, yPosition + 5, {
    align: "center",
  });

  window.open(doc.output("bloburl"), "_blank");
};

export default generateDailySummaryPDF;
