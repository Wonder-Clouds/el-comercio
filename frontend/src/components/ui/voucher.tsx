// components/VoucherAssignment.tsx
import React from "react";
import { Assignment } from "@/models/Assignment"; // Asegúrate de importar desde donde lo tengas

type Props = {
  assignment: Assignment;
};

const VoucherAssignment = React.forwardRef<HTMLDivElement, Props>(({ assignment }, ref) => {
  const total = assignment.detail_assignments?.reduce(
    (acc, d) => acc + d.quantity * d.unit_price,
    0
  ) ?? 0;

  return (
    <div ref={ref} className="p-4 text-sm font-mono w-[300px]">
      <h2 className="text-center font-bold mb-2">VOUCHER DE ASIGNACIÓN</h2>
      <div className="mb-2">
        <p><strong>Vendedor:</strong> {assignment.seller.name}</p>
        <p><strong>Fecha:</strong> {new Date(assignment.date_assignment).toLocaleDateString()}</p>
      </div>
      <table className="w-full text-xs">
        <thead>
          <tr>
            <th className="text-left">Producto</th>
            <th className="text-right">Cant</th>
            <th className="text-right">P.U</th>
            <th className="text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          {assignment.detail_assignments?.map((item) => (
            <tr key={item.id}>
              <td>{item.product.name}</td>
              <td className="text-right">{item.quantity}</td>
              <td className="text-right">S/ {item.unit_price.toFixed(2)}</td>
              <td className="text-right">
                S/ {(item.quantity * item.unit_price).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <hr className="my-2" />
      <p className="text-right font-bold">TOTAL: S/ {total.toFixed(2)}</p>
      <p className="text-center mt-4">¡Gracias por su compra!</p>
    </div>
  );
});

export default VoucherAssignment;
