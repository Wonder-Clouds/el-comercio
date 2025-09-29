import jsPDF from "jspdf";
import { Cash } from "@/models/Cash";
import { Yape } from "@/models/Yape";

const generateCashReportPdf = (
  cashComercio: Cash,
  cashOjo: Cash,
  yape: Yape[]
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

  const setStyle = (size: number, style = "normal") => {
    doc.setFont("courier", style);
    doc.setFontSize(size);
  };

  const drawDoubleSeparator = () => {
    doc.setDrawColor(60);
    doc.setLineWidth(1);
    doc.line(config.margin, yPosition, rightX, yPosition);
    yPosition += 2;
    doc.line(config.margin, yPosition, rightX, yPosition);
    yPosition += 5;
  };

  const addText = (text: string, x: number, y: number, options?: any) => {
    doc.text(text, x, y, options);
  };

  // ================
  // TABLA DE CASH
  // ================
  const renderCashTable = (title: string, cash: Cash) => {
    if (!cash) return;

    const denominations: { label: string; value: number; count: number }[] = [
      { label: "S/ 200", value: 200, count: cash.two_hundred ?? 0 },
      { label: "S/ 100", value: 100, count: cash.one_hundred ?? 0 },
      { label: "S/ 50", value: 50, count: cash.fifty ?? 0 },
      { label: "S/ 20", value: 20, count: cash.twenty ?? 0 },
      { label: "S/ 10", value: 10, count: cash.ten ?? 0 },
      { label: "S/ 5", value: 5, count: cash.five ?? 0 },
      { label: "S/ 2", value: 2, count: cash.two ?? 0 },
      { label: "S/ 1", value: 1, count: cash.one ?? 0 },
      { label: "S/ 0.50", value: 0.5, count: cash.fifty_cents ?? 0 },
      { label: "S/ 0.20", value: 0.2, count: cash.twenty_cents ?? 0 },
      { label: "S/ 0.10", value: 0.1, count: cash.ten_cents ?? 0 },
    ];

    // Título
    setStyle(config.fontSize.subtitle, "bold");
    addText(title, config.margin, yPosition);
    yPosition += config.lineHeight;

    // Cabecera
    setStyle(config.fontSize.normal, "bold");
    addText("Denominación", config.margin, yPosition);
    addText("Cantidad", centerX, yPosition, { align: "center" });
    addText("Subtotal", rightX, yPosition, { align: "right" });
    yPosition += config.lineHeight;

    // Filas
    let total = 0;
    denominations.forEach((d) => {
      if (d.count > 0) {
        const subtotal = d.value * d.count;
        setStyle(config.fontSize.normal);
        addText(d.label, config.margin, yPosition);
        addText(`${d.count}`, centerX, yPosition, { align: "center" });
        addText(`S/ ${subtotal.toFixed(2)}`, rightX, yPosition, {
          align: "right",
        });
        yPosition += config.lineHeight;

        total += subtotal;

        if (yPosition > 275) {
          doc.addPage();
          yPosition = config.margin;
        }
      }
    });

    // Total
    setStyle(config.fontSize.total, "bold");
    addText("Total:", config.margin, yPosition);
    addText(`S/ ${total.toFixed(2)}`, rightX, yPosition, { align: "right" });
    yPosition += config.lineHeight;

    drawDoubleSeparator();
  };

  // ================
  // TABLA DE YAPE
  // ================
  const renderYapeTable = (title: string, data: Yape[]) => {
    if (!data.length) return;

    // Título
    setStyle(config.fontSize.subtitle, "bold");
    addText(title, config.margin, yPosition);
    yPosition += config.lineHeight;

    // Cabecera
    setStyle(config.fontSize.normal, "bold");
    addText("Fecha", config.margin, yPosition);
    addText("Nombre", centerX - 20, yPosition);
    addText("Monto", rightX, yPosition, { align: "right" });
    yPosition += config.lineHeight;

    // Filas
    let total = 0;
    data.forEach((yp) => {
      setStyle(config.fontSize.normal);
      const amount = Number(yp.amount ?? 0);
      addText(
        new Date(yp.date_yape).toLocaleDateString("es-PE"),
        config.margin,
        yPosition
      );
      addText(yp.name, centerX - 20, yPosition);
      addText(`S/ ${amount.toFixed(2)}`, rightX, yPosition, { align: "right" });
      yPosition += config.lineHeight;

      total += amount;

      if (yPosition > 275) {
        doc.addPage();
        yPosition = config.margin;
      }
    });

    // Total
    setStyle(config.fontSize.total, "bold");
    addText("Total:", config.margin, yPosition);
    addText(`S/ ${total.toFixed(2)}`, rightX, yPosition, { align: "right" });
    yPosition += config.lineHeight;

    drawDoubleSeparator();
  };

  // =========================
  // ENCABEZADO DEL REPORTE
  // =========================
  setStyle(config.fontSize.title, "bold");
  addText("REPORTE DE CAJA", centerX, yPosition, { align: "center" });
  yPosition += config.lineHeight;

  const formattedDate = new Intl.DateTimeFormat("es-PE", {
    dateStyle: "full",
  }).format(new Date());

  setStyle(config.fontSize.normal, "italic");
  addText(`Fecha: ${formattedDate}`, config.margin, yPosition);
  yPosition += config.lineHeight;

  drawDoubleSeparator();

  // =========================
  // TABLAS
  // =========================
  renderCashTable("CAJA COMERCIO", cashComercio);
  renderCashTable("CAJA OJO", cashOjo);
  renderYapeTable("YAPE", yape);

  // =========================
  // FOOTER
  // =========================
  const currentTime = new Date().toLocaleTimeString("es-PE");
  setStyle(config.fontSize.normal - 1, "italic");
  addText(`Reporte generado a las ${currentTime}`, centerX, yPosition + 5, {
    align: "center",
  });

  window.open(doc.output("bloburl"), "_blank");
};

export default generateCashReportPdf;
