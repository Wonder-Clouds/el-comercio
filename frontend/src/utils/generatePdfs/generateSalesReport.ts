import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Assignment } from "@/models/Assignment";
import { Types } from "@/models/TypeProduct";

// Agrupa por producto/periódico
const groupByProduct = (assignments: Assignment[], type: Types) => {
  const map = new Map<
    number,
    {
      name: string;
      quantity: number;
      returned: number;
      unit_price: number;
    }
  >();

  assignments.forEach((assignment) => {
    assignment.detail_assignments?.forEach((detail) => {
      const product = detail.product;
      if (
        typeof product.type_product === "number" ||
        product.type_product?.type !== type
      )
        return;

      const existing = map.get(product.id);
      const soldQty = detail.quantity ?? 0;
      const returnedQty = detail.returned_amount ?? 0;
      const unitPrice = Number(
        detail.unit_price ?? detail.product.product_price ?? 0
      );

      if (existing) {
        existing.quantity += soldQty;
        existing.returned += returnedQty;
      } else {
        map.set(product.id, {
          name: product.name,
          quantity: soldQty,
          returned: returnedQty,
          unit_price: unitPrice,
        });
      }
    });
  });

  return Array.from(map.values()).map((item) => {
    const sold = item.quantity - item.returned;
    const total = sold * item.unit_price;
    return {
      name: item.name,
      quantity: item.quantity,
      returned: item.returned,
      sold,
      unit_price: item.unit_price,
      total,
    };
  });
};

const generateSalesReport = (assignments: Assignment[]) => {
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const centerX = pageWidth / 2;
  let y = 15;

  const setTitle = (title: string) => {
    doc.setFont("courier", "bold");
    doc.setFontSize(16);
    doc.text(title, centerX, y, { align: "center" });
    y += 8;
  };

  const printTable = (
    title: string,
    data: ReturnType<typeof groupByProduct>
  ) => {
    doc.setFont("courier", "bold");
    doc.setFontSize(12);
    doc.text(title, 15, y);
    y += 4;

    autoTable(doc, {
      head: [
        [
          "Nombre",
          "Pauta",
          "Devueltos",
          "Vendidos",
          "Precio Unitario (S/.)",
          "Total a pagar (S/.)",
        ],
      ],
      body: data.map((item) => [
        item.name,
        item.quantity.toString(),
        item.returned.toString(),
        item.sold.toString(),
        Number(item.unit_price).toFixed(2),
        Number(item.total).toFixed(2),
      ]),
      startY: y,
      styles: {
        font: "courier",
        fontSize: 9,
      },
      headStyles: {
        fillColor: [40, 40, 90],
        textColor: [255, 255, 255],
      },
      margin: { left: 15, right: 15 },
      theme: "striped",
      didDrawPage: (data) => {
        if (data.cursor) {
          y = data.cursor.y + 10;
        }
      },
    });

    const totalGeneral = data.reduce((acc, curr) => acc + curr.total, 0);
    doc.setFont("courier", "bold");
    doc.setFontSize(11);
    doc.text(`Total general: S/ ${totalGeneral.toFixed(2)}`, 15, y);
    y += 10;
  };

  // 🧾 Título principal
  setTitle("LIQUIDACIÓN");

  const formattedDate = new Intl.DateTimeFormat("es-PE", {
    dateStyle: "full",
  }).format(new Date());

  doc.setFont("courier", "italic");
  doc.setFontSize(10);
  doc.text(`Fecha: ${formattedDate}`, 15, y);
  y += 10;

  // 🛒 PRODUCTOS
  const productsData = groupByProduct(assignments, Types.PRODUCT);
  if (productsData.length > 0) {
    printTable("PRODUCTOS", productsData);
  }

  // 📰 Dividir PERIÓDICOS en "OJO" y los demás
  const allNewspapers = groupByProduct(assignments, Types.NEWSPAPER);
  const ojoData = allNewspapers.filter((p) =>
    p.name.toUpperCase().includes("OJO")
  );
  const otherNewspapers = allNewspapers.filter(
    (p) => !p.name.toUpperCase().includes("OJO")
  );

  if (otherNewspapers.length > 0) {
    printTable("PERIÓDICOS", otherNewspapers);
  }

  if (ojoData.length > 0) {
    printTable("PERIÓDICOS - OJO", ojoData);
  }

  const currentTime = new Date().toLocaleTimeString("es-PE");
  doc.setFont("courier", "italic");
  doc.setFontSize(9);
  doc.text(`Reporte generado a las ${currentTime}`, centerX, y + 10, {
    align: "center",
  });

  window.open(doc.output("bloburl"), "_blank");
};

export default generateSalesReport;
