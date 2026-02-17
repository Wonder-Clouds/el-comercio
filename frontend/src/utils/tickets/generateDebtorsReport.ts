import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { DetailAssignment } from "@/models/DetailAssignment";

interface DebtorsProps {
  seller_id: number;
  seller_name: string;
  seller_code: string;
  seller_phone: string;
  seller_dni: string;
  seller_status: boolean;
  assignments: DetailAssignment[];
}

export const generateDebtorsReport = (debtors: DebtorsProps[]) => {
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const centerX = pageWidth / 2;
  let y = 15;

  const formattedDate = new Intl.DateTimeFormat("es-PE", {
    dateStyle: "full",
  }).format(new Date());

  const currentTime = new Date().toLocaleTimeString("es-PE");

  doc.setFont("courier", "bold");
  doc.setFontSize(16);
  doc.text("REPORTE DE DEUDORES", centerX, y, { align: "center" });

  y += 8;

  doc.setFont("courier", "italic");
  doc.setFontSize(10);
  doc.text(`Fecha: ${formattedDate}`, 15, y);
  y += 8;

  autoTable(doc, {
    startY: y,
    head: [["Nombre", "DNI", "Teléfono", "Estado", "Deuda total (S/.)"]],
    body: debtors.map((debtor) => {
      const total = debtor.assignments.reduce((acc, a) => {
        const quantity = a.quantity ?? 0;
        const returned = a.returned_amount ?? 0;
        const price = Number(a.unit_price ?? a.product.product_price ?? 0);
        const debt = (quantity - returned) * price;
        return acc + (debt > 0 ? debt : 0);
      }, 0);

      return [
        debtor.seller_name,
        debtor.seller_dni,
        debtor.seller_phone,
        debtor.seller_status ? "ACTIVO" : "INACTIVO",
        total.toFixed(2),
      ];
    }),
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
  });

  doc.setFont("courier", "italic");
  doc.setFontSize(9);

  const finalY = (doc as any).lastAutoTable.finalY;

  doc.text(`Reporte generado a las ${currentTime}`, centerX, finalY, {
    align: "center",
  });

  window.open(doc.output("bloburl"), "_blank");
};
